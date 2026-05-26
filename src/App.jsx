import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AgeCalculator from './pages/AgeCalculator';
import EmiCalculator from './pages/EmiCalculator';
import TimezoneConverter from './pages/TimezoneConverter';
import PasswordGenerator from './pages/PasswordGenerator';
import JsonFormatter from './pages/JsonFormatter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import './styles/global.css';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<JsonFormatter />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/timezone-converter" element={<TimezoneConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
