import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import LoanPlanner from './pages/LoanPlanner';
import ExpenseTracker from './pages/ExpenseTracker';
import Reports from './pages/Reports';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './Layout';
import Preloader from './components/Preloader';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AnimatePresence mode="wait">
           {isLoading ? (
          <Preloader onLoadingComplete={() => setIsLoading(false)} />
        ) : (
        <Routes>
              <Route path="/" element={<Layout component={<Dashboard />} />} />
              <Route path="/loans" element={<Layout component={<LoanPlanner />} />} />
              <Route path="/expenses" element={<Layout component={<ExpenseTracker />} />} />
              <Route path="/reports" element={<Layout component={<Reports />} />} />
            </Routes>
        )}
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;