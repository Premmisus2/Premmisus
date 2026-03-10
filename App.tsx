import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Methodology } from './components/Methodology';
import { Comparison } from './components/Comparison';
import { Metrics } from './components/Metrics';
import { CaseStudies } from './components/CaseStudies';
import { Testimonials } from './components/Testimonials';
import { Qualifier } from './components/Qualifier';
import { Footer } from './components/Footer';
import { Cursor } from './components/Cursor';

function App() {
  return (
    <main className="bg-background text-text-primary selection:bg-accent selection:text-black relative min-h-screen grid-overlay">
       <Cursor />
       <div className="relative z-10">
        <Navbar />

        <Hero />

        <Methodology />

        <Comparison />

        <Metrics />

        <CaseStudies />

        <Testimonials />

        <Qualifier />

        <Footer />
       </div>
    </main>
  );
}

export default App;
