import React, { useCallback, useRef, useState } from 'react';
import useMobileCardAccent from './hooks/useMobileCardAccent';
import Navbar from './components/Navbar';
import Geometric3DCanvas from './components/Geometric3DCanvas';
import HeroSection from './components/HeroSection';
import ApproachSection from './components/ApproachSection';
import ServicesGrid from './components/ServicesGrid';
import PortfolioShowcase from './components/PortfolioShowcase';
import DifferentialsSection from './components/DifferentialsSection';
import WorkflowSection from './components/WorkflowSection';
import LeadModal from './components/LeadModal';
import Footer from './components/Footer';
import ContactFloating from './components/ContactFloating';

export default function App() {
  const mainRef = useRef(null);
  useMobileCardAccent(mainRef);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadInterest, setLeadInterest] = useState('');
  const openContact = useCallback((interest = '') => {
    setLeadInterest(typeof interest === 'string' ? interest : '');
    setModalOpen(true);
  }, []);
  const closeContact = useCallback(() => setModalOpen(false), []);

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 selection:bg-neutral-800 selection:text-white overflow-x-hidden font-sans">
      <Geometric3DCanvas />

      <Navbar onOpenModal={openContact} />

      <main ref={mainRef} className="relative z-10">
        <HeroSection onOpenModal={openContact} />
        <ServicesGrid onOpenModal={openContact} />
        <ApproachSection onOpenModal={openContact} />
        <PortfolioShowcase onOpenModal={openContact} />
        <DifferentialsSection />
        <WorkflowSection onOpenModal={openContact} />
      </main>

      <Footer onOpenModal={openContact} />

      <LeadModal isOpen={modalOpen} onClose={closeContact} initialInterest={leadInterest} />

      <ContactFloating onOpenModal={openContact} />
    </div>
  );
}
