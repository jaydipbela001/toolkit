import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import AgeCalculator from './pages/AgeCalculator';
import EmiCalculator from './pages/EmiCalculator';
import TimezoneConverter from './pages/TimezoneConverter';
import PasswordGenerator from './pages/PasswordGenerator';
import JsonFormatter from './pages/JsonFormatter';
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
          <Route path="/" element={<Home />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/timezone-converter" element={<TimezoneConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
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
