import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ScannerAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- CSS Injection ---
    const style = document.createElement('style');
    style.innerHTML = `
      .scanner-container-wrapper {
        position: relative;
        width: 100%;
        height: 350px;
        overflow: hidden;
        background: transparent;
        font-family: "Arial", sans-serif;
        border-radius: 0.5rem;
      }
      
      .scanner-controls {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        gap: 10px;
        z-index: 100;
      }
      
      .scanner-control-btn {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        font-size: 12px;
      }
      
      .scanner-control-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
      
      .scanner-speed-indicator {
        position: absolute;
        top: 20px;
        right: 20px;
        color: white;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.3);
        padding: 8px 16px;
        border-radius: 20px;
        backdrop-filter: blur(5px);
        z-index: 100;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .scanner-inner-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .card-stream {
        position: absolute;
        width: 100%;
        height: 180px;
        display: flex;
        align-items: center;
        overflow: visible;
      }
      
      .card-line {
        display: flex;
        align-items: center;
        gap: 60px;
        white-space: nowrap;
        cursor: grab;
        user-select: none;
        will-change: transform;
      }
      
      .card-line:active, .card-line.dragging {
        cursor: grabbing;
      }
      
      .card-wrapper {
        position: relative;
        width: 300px;
        height: 180px;
        flex-shrink: 0;
      }
      
      .card {
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
        height: 180px;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .card-normal {
        background: transparent;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0;
        color: white;
        z-index: 2;
        position: relative;
        overflow: hidden;
        clip-path: inset(0 0 0 var(--clip-right, 0%));
      }
      
      .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
        transition: all 0.3s ease;
        filter: brightness(1.1) contrast(1.1);
      }
      
      .card-ascii {
        background: transparent;
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
        height: 180px;
        border-radius: 12px;
        overflow: hidden;
        clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0);
      }
      
      .ascii-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: rgba(220, 210, 255, 0.6);
        font-family: "Courier New", monospace;
        font-size: 8px;
        line-height: 10px;
        overflow: hidden;
        white-space: pre;
        animation: glitch 0.1s infinite linear alternate-reverse;
        margin: 0;
        padding: 0;
        text-align: left;
        vertical-align: top;
        box-sizing: border-box;
        -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.2) 100%);
        mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.2) 100%);
      }
      
      @keyframes glitch {
        0% { opacity: 1; }
        15% { opacity: 0.9; }
        16% { opacity: 1; }
        49% { opacity: 0.8; }
        50% { opacity: 1; }
        99% { opacity: 0.9; }
        100% { opacity: 1; }
      }
      
      .scan-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.4), transparent);
        animation: scanEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 5;
      }
      
      @keyframes scanEffect {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      
      #particleCanvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      
      #scannerCanvas {
        position: absolute;
        top: 0;
        left: -3px;
        width: 100%;
        height: 100%;
        z-index: 15;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // --- JS Logic ---
    const container = containerRef.current;
    const cardStreamEl = container.querySelector('#cardStream') as HTMLElement;
    const cardLineEl = container.querySelector('#cardLine') as HTMLElement;
    const speedIndicatorEl = container.querySelector('#speedValue') as HTMLElement;
    const particleCanvas = container.querySelector('#particleCanvas') as HTMLCanvasElement;
    const scannerCanvas = container.querySelector('#scannerCanvas') as HTMLCanvasElement;

    let cardStream: any;
    let particleSystem: any;
    let particleScanner: any;

    // CardStreamController
    class CardStreamController {
      container: HTMLElement;
      cardLine: HTMLElement;
      speedIndicator: HTMLElement;
      position: number;
      velocity: number;
      direction: number;
      isAnimating: boolean;
      isDragging: boolean;
      lastTime: number;
      lastMouseX: number;
      mouseVelocity: number;
      friction: number;
      minVelocity: number;
      containerWidth: number;
      cardLineWidth: number;
      animationId: number | null = null;
      updateInterval: number | null = null;
      clipInterval: number | null = null;

      constructor() {
        this.container = cardStreamEl;
        this.cardLine = cardLineEl;
        this.speedIndicator = speedIndicatorEl;

        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.lastTime = performance.now();
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 30;

        this.containerWidth = 0;
        this.cardLineWidth = 0;

        this.init();
      }

      init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
        this.startPeriodicUpdates();
      }

      calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        const cardWidth = 300;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
      }

      setupEventListeners() {
        this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", this.onDrag);
        document.addEventListener("mouseup", this.endDrag);

        this.cardLine.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]), { passive: false });
        document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]), { passive: false });
        document.addEventListener("touchend", this.endDrag);

        this.cardLine.addEventListener("wheel", (e) => this.onWheel(e));
        this.cardLine.addEventListener("selectstart", (e) => e.preventDefault());
        this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());

        window.addEventListener("resize", () => this.calculateDimensions());
      }

      startDrag = (e: any) => {
        e.preventDefault();
        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;

        const transform = window.getComputedStyle(this.cardLine).transform;
        if (transform !== "none") {
          const matrix = new DOMMatrix(transform);
          this.position = matrix.m41;
        }

        this.cardLine.style.animation = "none";
        this.cardLine.classList.add("dragging");
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      }

      onDrag = (e: any) => {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      endDrag = () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.cardLine.classList.remove("dragging");

        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
          this.velocity = Math.abs(this.mouseVelocity);
          this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
          this.velocity = 120;
        }

        this.isAnimating = true;
        this.updateSpeedIndicator();
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }

      animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isAnimating && !this.isDragging) {
          if (this.velocity > this.minVelocity) {
            this.velocity *= this.friction;
          } else {
            this.velocity = Math.max(this.minVelocity, this.velocity);
          }

          this.position += this.velocity * this.direction * deltaTime;
          this.updateCardPosition();
          this.updateSpeedIndicator();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
      }

      updateCardPosition() {
        const containerWidth = this.containerWidth;
        const cardLineWidth = this.cardLineWidth;

        if (this.position < -cardLineWidth) {
          this.position = containerWidth;
        } else if (this.position > containerWidth) {
          this.position = -cardLineWidth;
        }

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      updateSpeedIndicator() {
        if (this.speedIndicator) {
          this.speedIndicator.textContent = Math.round(this.velocity).toString();
        }
      }

      toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        const btn = document.getElementById("pauseBtn");
        if (btn) btn.textContent = this.isAnimating ? "⏸️ Pause" : "▶️ Play";
      }

      resetPosition() {
        this.position = this.containerWidth;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.cardLine.classList.remove("dragging");
        this.updateSpeedIndicator();
        const btn = document.getElementById("pauseBtn");
        if (btn) btn.textContent = "⏸️ Pause";
      }

      changeDirection() {
        this.direction *= -1;
        this.updateSpeedIndicator();
      }

      onWheel(e: any) {
        e.preventDefault();
        const scrollSpeed = 20;
        const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;
        this.position += delta;
        this.updateCardPosition();
        this.updateCardClipping();
      }

      generateCode(width: number, height: number) {
        const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const pick = (arr: any[]) => arr[randInt(0, arr.length - 1)];

        const library = [
          "// compiled preview • scanner demo",
          "const SCAN_WIDTH = 8;",
          "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
          "class Particle { constructor(x, y) { this.x = x; this.y = y; } }",
          "const scanner = { x: Math.floor(window.innerWidth / 2), width: SCAN_WIDTH };",
          "function tick(t) { const dt = 0.016; }",
          "const state = { intensity: 1.2 };"
        ];

        let flow = library.join(" ");
        const totalChars = width * height;
        while (flow.length < totalChars + width) {
          flow += " " + pick(library);
        }

        let out = "";
        let offset = 0;
        for (let row = 0; row < height; row++) {
          let line = flow.slice(offset, offset + width);
          if (line.length < width) line = line + " ".repeat(width - line.length);
          out += line + (row < height - 1 ? "\n" : "");
          offset += width;
        }
        return out;
      }

      calculateCodeDimensions(cardWidth: number, cardHeight: number) {
        const fontSize = 8;
        const lineHeight = 10;
        const charWidth = 5;
        const width = Math.floor(cardWidth / charWidth);
        const height = Math.floor(cardHeight / lineHeight);
        return { width, height, fontSize, lineHeight };
      }

      createCardWrapper(index: number) {
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";

        const normalCard = document.createElement("div");
        normalCard.className = "card card-normal";

        const cardImages = [
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
        ];

        const cardImage = document.createElement("img");
        cardImage.className = "card-image";
        cardImage.src = cardImages[index % cardImages.length];
        cardImage.alt = "Card";
        
        // Add fallback if image fails
        cardImage.onerror = () => {
          cardImage.src = "https://picsum.photos/seed/" + index + "/300/180?blur=2";
        };

        normalCard.appendChild(cardImage);

        const asciiCard = document.createElement("div");
        asciiCard.className = "card card-ascii";

        const asciiContent = document.createElement("div");
        asciiContent.className = "ascii-content";

        const { width, height, fontSize, lineHeight } = this.calculateCodeDimensions(300, 180);
        asciiContent.style.fontSize = fontSize + "px";
        asciiContent.style.lineHeight = lineHeight + "px";
        asciiContent.textContent = this.generateCode(width, height);

        asciiCard.appendChild(asciiContent);
        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);

        return wrapper;
      }

      updateCardClipping() {
        const containerRect = this.container.getBoundingClientRect();
        const scannerX = containerRect.left + containerRect.width / 2;
        const scannerWidth = 8;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;
        let anyScanningActive = false;

        this.container.querySelectorAll(".card-wrapper").forEach((wrapper: any) => {
          const rect = wrapper.getBoundingClientRect();
          const cardLeft = rect.left;
          const cardRight = rect.right;
          const cardWidth = rect.width;

          const normalCard = wrapper.querySelector(".card-normal");
          const asciiCard = wrapper.querySelector(".card-ascii");

          if (cardLeft < scannerRight && cardRight > scannerLeft) {
            anyScanningActive = true;
            const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
            const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

            const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
            const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

            normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
            asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);

            if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
              wrapper.setAttribute("data-scanned", "true");
              const scanEffect = document.createElement("div");
              scanEffect.className = "scan-effect";
              wrapper.appendChild(scanEffect);
              setTimeout(() => {
                if (scanEffect.parentNode) {
                  scanEffect.parentNode.removeChild(scanEffect);
                }
              }, 600);
            }
          } else {
            if (cardRight < scannerLeft) {
              normalCard.style.setProperty("--clip-right", "100%");
              asciiCard.style.setProperty("--clip-left", "100%");
            } else if (cardLeft > scannerRight) {
              normalCard.style.setProperty("--clip-right", "0%");
              asciiCard.style.setProperty("--clip-left", "0%");
            }
            wrapper.removeAttribute("data-scanned");
          }
        });

        if (particleScanner) {
          particleScanner.setScanningActive(anyScanningActive);
        }
      }

      updateAsciiContent() {
        this.container.querySelectorAll(".ascii-content").forEach((content: any) => {
          if (Math.random() < 0.15) {
            const { width, height } = this.calculateCodeDimensions(300, 180);
            content.textContent = this.generateCode(width, height);
          }
        });
      }

      populateCardLine() {
        this.cardLine.innerHTML = "";
        const cardsCount = 15;
        for (let i = 0; i < cardsCount; i++) {
          const cardWrapper = this.createCardWrapper(i);
          this.cardLine.appendChild(cardWrapper);
        }
      }

      startPeriodicUpdates() {
        this.updateInterval = window.setInterval(() => {
          this.updateAsciiContent();
        }, 200);

        const updateClipping = () => {
          this.updateCardClipping();
          this.clipInterval = requestAnimationFrame(updateClipping);
        };
        updateClipping();
      }

      destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.clipInterval) cancelAnimationFrame(this.clipInterval);
        document.removeEventListener("mousemove", this.onDrag);
        document.removeEventListener("mouseup", this.endDrag);
        document.removeEventListener("touchmove", this.onDrag as any);
        document.removeEventListener("touchend", this.endDrag);
      }
    }

    // ParticleSystem (THREE.js)
    class ParticleSystem {
      scene: THREE.Scene;
      camera: THREE.OrthographicCamera;
      renderer: THREE.WebGLRenderer;
      particles: THREE.Points | null = null;
      particleCount = 400;
      canvas: HTMLCanvasElement;
      velocities: Float32Array = new Float32Array();
      alphas: Float32Array = new Float32Array();
      animationId: number | null = null;
      containerWidth: number;
      containerHeight: number;

      constructor(canvas: HTMLCanvasElement, containerWidth: number, containerHeight: number) {
        this.canvas = canvas;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-containerWidth / 2, containerWidth / 2, containerHeight / 2, -containerHeight / 2, 1, 1000);
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.setClearColor(0x000000, 0);

        this.createParticles();
        this.animate();
      }

      createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount);

        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d")!;
        const half = canvas.width / 2;
        const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0.025, "#fff");
        gradient.addColorStop(0.1, `hsl(217, 61%, 33%)`);
        gradient.addColorStop(0.25, `hsl(217, 64%, 6%)`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(half, half, half, 0, Math.PI * 2);
        ctx.fill();
        const texture = new THREE.CanvasTexture(canvas);

        for (let i = 0; i < this.particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * this.containerWidth * 2;
          positions[i * 3 + 1] = (Math.random() - 0.5) * this.containerHeight;
          positions[i * 3 + 2] = 0;
          colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
          sizes[i] = (Math.random() * 140 + 60) / 8;
          velocities[i] = Math.random() * 60 + 30;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        this.velocities = velocities;

        const alphas = new Float32Array(this.particleCount);
        for (let i = 0; i < this.particleCount; i++) alphas[i] = (Math.random() * 8 + 2) / 10;
        geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
        this.alphas = alphas;

        const material = new THREE.ShaderMaterial({
          uniforms: { pointTexture: { value: texture }, size: { value: 15.0 } },
          vertexShader: `
            attribute float alpha; varying float vAlpha; varying vec3 vColor; uniform float size;
            void main() { vAlpha = alpha; vColor = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size; gl_Position = projectionMatrix * mvPosition; }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture; varying float vAlpha; varying vec3 vColor;
            void main() { gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord); }
          `,
          transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
      }

      animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        if (this.particles) {
          const positions = this.particles.geometry.attributes.position.array as Float32Array;
          const alphas = this.particles.geometry.attributes.alpha.array as Float32Array;
          const time = Date.now() * 0.001;

          for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] += this.velocities[i] * 0.016;
            if (positions[i * 3] > this.containerWidth / 2 + 100) {
              positions[i * 3] = -this.containerWidth / 2 - 100;
              positions[i * 3 + 1] = (Math.random() - 0.5) * this.containerHeight;
            }
            positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

            const twinkle = Math.floor(Math.random() * 10);
            if (twinkle === 1 && alphas[i] > 0) alphas[i] -= 0.05;
            else if (twinkle === 2 && alphas[i] < 1) alphas[i] += 0.05;
            alphas[i] = Math.max(0, Math.min(1, alphas[i]));
          }
          this.particles.geometry.attributes.position.needsUpdate = true;
          this.particles.geometry.attributes.alpha.needsUpdate = true;
        }
        this.renderer.render(this.scene, this.camera);
      }

      resize(width: number, height: number) {
        this.containerWidth = width;
        this.containerHeight = height;
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }

      destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
        if (this.particles) {
          this.scene.remove(this.particles);
          this.particles.geometry.dispose();
          (this.particles.material as THREE.Material).dispose();
        }
      }
    }

    // ParticleScanner (Canvas 2D)
    class ParticleScanner {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      animationId: number | null = null;
      w: number;
      h: number;
      particles: any[] = [];
      count = 0;
      maxParticles = 800;
      intensity = 0.8;
      lightBarX: number;
      lightBarWidth = 3;
      fadeZone = 60;
      scanTargetIntensity = 1.8;
      scanTargetParticles = 2500;
      scanTargetFadeZone = 35;
      scanningActive = false;
      baseIntensity = 0.8;
      baseMaxParticles = 800;
      baseFadeZone = 60;
      currentIntensity = 0.8;
      currentMaxParticles = 800;
      currentFadeZone = 60;
      transitionSpeed = 0.05;
      gradientCanvas!: HTMLCanvasElement;
      gradientCtx!: CanvasRenderingContext2D;
      currentGlowIntensity = 1;

      constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.w = width;
        this.h = height;
        this.lightBarX = this.w / 2;

        this.setupCanvas();
        this.createGradientCache();
        this.initParticles();
        this.animate();
      }

      setupCanvas() {
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.width = this.w + "px";
        this.canvas.style.height = this.h + "px";
        this.ctx.clearRect(0, 0, this.w, this.h);
      }

      createGradientCache() {
        this.gradientCanvas = document.createElement("canvas");
        this.gradientCtx = this.gradientCanvas.getContext("2d")!;
        this.gradientCanvas.width = 16;
        this.gradientCanvas.height = 16;
        const half = 8;
        const gradient = this.gradientCtx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(196, 181, 253, 0.8)");
        gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.4)");
        gradient.addColorStop(1, "transparent");
        this.gradientCtx.fillStyle = gradient;
        this.gradientCtx.beginPath();
        this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
        this.gradientCtx.fill();
      }

      randomFloat(min: number, max: number) { return Math.random() * (max - min) + min; }

      createParticle() {
        const intensityRatio = this.intensity / this.baseIntensity;
        const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
        const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

        return {
          x: this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
          y: this.randomFloat(0, this.h),
          vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
          vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,
          radius: this.randomFloat(0.4, 1) * sizeMultiplier,
          alpha: this.randomFloat(0.6, 1),
          decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
          originalAlpha: 0, life: 1.0, time: 0, startX: 0,
          twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
          twinkleAmount: this.randomFloat(0.1, 0.25),
        };
      }

      initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
          const p = this.createParticle();
          p.originalAlpha = p.alpha; p.startX = p.x;
          this.count++; this.particles[this.count] = p;
        }
      }

      updateParticle(p: any) {
        p.x += p.vx; p.y += p.vy; p.time++;
        p.alpha = p.originalAlpha * p.life + Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
        p.life -= p.decay;
        if (p.x > this.w + 10 || p.life <= 0) this.resetParticle(p);
      }

      resetParticle(p: any) {
        p.x = this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
        p.y = this.randomFloat(0, this.h);
        p.vx = this.randomFloat(0.2, 1.0); p.vy = this.randomFloat(-0.15, 0.15);
        p.alpha = this.randomFloat(0.6, 1); p.originalAlpha = p.alpha;
        p.life = 1.0; p.time = 0; p.startX = p.x;
      }

      drawParticle(p: any) {
        if (p.life <= 0) return;
        let fadeAlpha = 1;
        if (p.y < this.fadeZone) fadeAlpha = p.y / this.fadeZone;
        else if (p.y > this.h - this.fadeZone) fadeAlpha = (this.h - p.y) / this.fadeZone;
        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));
        this.ctx.globalAlpha = p.alpha * fadeAlpha;
        this.ctx.drawImage(this.gradientCanvas, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      }

      drawLightBar() {
        const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
        verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        verticalGradient.addColorStop(this.fadeZone / this.h, "rgba(255, 255, 255, 1)");
        verticalGradient.addColorStop(1 - this.fadeZone / this.h, "rgba(255, 255, 255, 1)");
        verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalCompositeOperation = "lighter";
        const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
        this.currentGlowIntensity += (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;
        const glowIntensity = this.currentGlowIntensity;
        const lineWidth = this.lightBarWidth;

        const coreGradient = this.ctx.createLinearGradient(this.lightBarX - lineWidth / 2, 0, this.lightBarX + lineWidth / 2, 0);
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
        coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalAlpha = 1; this.ctx.fillStyle = coreGradient;
        this.ctx.beginPath(); this.ctx.roundRect(this.lightBarX - lineWidth / 2, 0, lineWidth, this.h, 15); this.ctx.fill();

        const glow1Gradient = this.ctx.createLinearGradient(this.lightBarX - lineWidth * 2, 0, this.lightBarX + lineWidth * 2, 0);
        glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow1Gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.8 * glowIntensity})`);
        glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
        this.ctx.globalAlpha = this.scanningActive ? 1.0 : 0.8; this.ctx.fillStyle = glow1Gradient;
        this.ctx.beginPath(); this.ctx.roundRect(this.lightBarX - lineWidth * 2, 0, lineWidth * 4, this.h, 25); this.ctx.fill();

        this.ctx.globalCompositeOperation = "destination-in";
        this.ctx.globalAlpha = 1; this.ctx.fillStyle = verticalGradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
      }

      render() {
        const targetIntensity = this.scanningActive ? this.scanTargetIntensity : this.baseIntensity;
        const targetMaxParticles = this.scanningActive ? this.scanTargetParticles : this.baseMaxParticles;
        const targetFadeZone = this.scanningActive ? this.scanTargetFadeZone : this.baseFadeZone;

        this.currentIntensity += (targetIntensity - this.currentIntensity) * this.transitionSpeed;
        this.currentMaxParticles += (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
        this.currentFadeZone += (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

        this.intensity = this.currentIntensity;
        this.maxParticles = Math.floor(this.currentMaxParticles);
        this.fadeZone = this.currentFadeZone;

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.drawLightBar();

        this.ctx.globalCompositeOperation = "lighter";
        for (let i = 1; i <= this.count; i++) {
          if (this.particles[i]) {
            this.updateParticle(this.particles[i]);
            this.drawParticle(this.particles[i]);
          }
        }

        if (Math.random() < this.intensity && this.count < this.maxParticles) {
          const p = this.createParticle(); p.originalAlpha = p.alpha; p.startX = p.x;
          this.count++; this.particles[this.count] = p;
        }

        if (this.count > this.maxParticles + 200) {
          const excessCount = Math.min(15, this.count - this.maxParticles);
          for (let i = 0; i < excessCount; i++) delete this.particles[this.count - i];
          this.count -= excessCount;
        }
      }

      animate() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
      }

      setScanningActive(active: boolean) { this.scanningActive = active; }

      resize(width: number, height: number) {
        this.w = width;
        this.h = height;
        this.lightBarX = width / 2;
        this.setupCanvas();
      }

      destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.particles = []; this.count = 0;
      }
    }

    // Initialize
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    cardStream = new CardStreamController();
    particleSystem = new ParticleSystem(particleCanvas, width, height);
    particleScanner = new ParticleScanner(scannerCanvas, width, height);

    // Attach to window for controls
    (window as any).toggleScannerAnimation = () => cardStream.toggleAnimation();
    (window as any).resetScannerPosition = () => cardStream.resetPosition();
    (window as any).changeScannerDirection = () => cardStream.changeDirection();

    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      particleSystem.resize(newWidth, newHeight);
      particleScanner.resize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cardStream.destroy();
      particleSystem.destroy();
      particleScanner.destroy();
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="scanner-container-wrapper" ref={containerRef}>
      <div className="scanner-controls">
        <button className="scanner-control-btn" id="pauseBtn" onClick={() => (window as any).toggleScannerAnimation()}>⏸️ Pause</button>
        <button className="scanner-control-btn" onClick={() => (window as any).resetScannerPosition()}>🔄 Reset</button>
        <button className="scanner-control-btn" onClick={() => (window as any).changeScannerDirection()}>↔️ Direction</button>
      </div>

      <div className="scanner-speed-indicator">
        Speed: <span id="speedValue">120</span> px/s
      </div>

      <div className="scanner-inner-container">
        <canvas id="particleCanvas"></canvas>
        <canvas id="scannerCanvas"></canvas>

        <div className="card-stream" id="cardStream">
          <div className="card-line" id="cardLine"></div>
        </div>
      </div>
    </div>
  );
};
