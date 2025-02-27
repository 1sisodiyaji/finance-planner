import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import LoanPlanner from './components/LoanPlanner';
import ExpenseTracker from './components/ExpenseTracker';
import Reports from './components/Reports';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './Layout';

function App() {

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Layout component={<Dashboard />} />} />
              <Route path="/loans" element={<Layout component={<LoanPlanner />} />} />
              <Route path="/expenses" element={<Layout component={<ExpenseTracker />} />} />
              <Route path="/reports" element={<Layout component={<Reports />} />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;