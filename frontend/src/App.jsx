import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import LoanPlanner from './components/LoanPlanner';
import ExpenseTracker from './components/ExpenseTracker';
import Reports from './components/Reports';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './Layout';

function App() {
  const [loans, setLoans] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);

  const addLoan = (loan) => {
    setLoans([...loans, loan]);
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const updateIncome = (amount) => {
    setIncome(amount);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Layout component={<Dashboard loans={loans} expenses={expenses} income={income} updateIncome={updateIncome} />} />} />
              <Route path="/loans" element={<Layout component={<LoanPlanner loans={loans} addLoan={addLoan} income={income} />} />} />
              <Route path="/expenses" element={<Layout component={<ExpenseTracker expenses={expenses} addExpense={addExpense} />} />} />
              <Route path="/reports" element={<Layout component={<Reports loans={loans} expenses={expenses} income={income} />} />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;