import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Methodology } from './components/Methodology';
import { Services } from './components/Services';
import { Comparison } from './components/Comparison';
import { Metrics } from './components/Metrics';
import { FAQ } from './components/FAQ';
import { Testimonials } from './components/Testimonials';
import { Qualifier } from './components/Qualifier';
import { Footer } from './components/Footer';
import { Cursor } from './components/Cursor';
import { Chatbot } from './components/Chatbot';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  return (
    <main className="bg-background text-text-primary selection:bg-accent selection:text-black relative min-h-screen grid-overlay">
      <Cursor />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Methodology />
        <Services />
        <Comparison />
        <Metrics />
        <FAQ />
        <Testimonials />
        <Qualifier />
        <Footer />
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Chatbot />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
