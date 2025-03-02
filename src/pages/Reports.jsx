import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  BanknotesIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { SummaryCard, LoanCard, FlexiblePaymentSchedule } from '../components/Reports';

const Reports = () => {
  const [loans, setLoans] = useState([]);
  const [loanAnalytics, setLoanAnalytics] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateLoanAnalytics = (loanData, income) => {
    if (!loanData || !loanData.length) {
      setLoanAnalytics([]);
      setHealthScore(100);
      return;
    }

    try {
      const analytics = loanData.map(loan => {
        // Ensure all values are properly parsed as numbers
        const amount = parseFloat(loan.amount) || 0;
        const interestRate = (parseFloat(loan.interestRate) || 0) / 100 / 12; // Monthly interest rate
        const tenure = parseInt(loan.tenure) || 1;
        const loanTerm = tenure * 12; // Convert years to months

        // Calculate monthly payment using EMI formula
        let monthlyPayment = 0;
        let totalAmount = 0;

        if (interestRate > 0) {
          monthlyPayment = (amount * interestRate * Math.pow(1 + interestRate, loanTerm)) / 
                          (Math.pow(1 + interestRate, loanTerm) - 1);
          totalAmount = monthlyPayment * loanTerm;
        } else {
          // If interest rate is 0, simple division
          monthlyPayment = amount / loanTerm;
          totalAmount = amount;
        }

        // Generate payment schedule
        const startDate = new Date(loan.startDate || Date.now());
        const schedule = Array.from({ length: loanTerm }, (_, index) => {
          const month = new Date(startDate);
          month.setMonth(month.getMonth() + index);
          
          const totalPaid = monthlyPayment * (index + 1);
          const remainingAmount = Math.max(0, totalAmount - totalPaid);
          const percentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

          return {
            month: month.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
            payment: monthlyPayment,
            remainingAmount,
            percentage: Math.min(100, percentage)
          };
        });

        return {
          ...loan,
          monthlyPayment,
          totalAmount,
          loanTerm,
          schedule
        };
      });

      setLoanAnalytics(analytics);

      // Calculate health score based on debt-to-income ratio
      const totalMonthlyPayments = analytics.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);
      const monthlyIncome = parseFloat(income) || 0;
      const debtToIncomeRatio = monthlyIncome > 0 ? (totalMonthlyPayments / monthlyIncome) * 100 : 100;
      const calculatedScore = Math.max(0, 100 - debtToIncomeRatio);
      setHealthScore(calculatedScore);
    } catch (error) {
      console.error('Error calculating loan analytics:', error);
      setLoanAnalytics([]);
      setHealthScore(0);
    }
  };

  useEffect(() => {
    const loadData = () => {
      try {
        const storedLoans = localStorage.getItem('loans');
        const storedIncome = localStorage.getItem('totalIncome');

        const parsedLoans = storedLoans ? JSON.parse(storedLoans) : [];
        const parsedIncome = storedIncome ? parseFloat(storedIncome) : 0;

        console.log('Loaded data:', { parsedLoans, parsedIncome });
        
        setLoans(parsedLoans);
        setTotalIncome(parsedIncome);
        calculateLoanAnalytics(parsedLoans, parsedIncome);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Add event listener for storage changes
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Calculate totals from loanAnalytics to ensure we use the properly calculated values
  const totalAmount = loanAnalytics.reduce((sum, loan) => sum + (loan.totalAmount || 0), 0);
  const totalMonthlyPayments = loanAnalytics.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);
  const debtToIncomeRatio = totalIncome > 0 ? ((totalMonthlyPayments / totalIncome) * 100).toFixed(1) : '0.0';

   
  return (
    <>
      <Helmet>
        <title>Loan Reports | Finance Planner</title>
        <meta name="description" content="View detailed loan analytics and payment schedules" />
        <meta name="keywords" content="loan reports, loan analytics, payment schedules, financial health" />
        <meta property="og:title" content="Loan Reports | Finance Planner" />
        <meta property="og:description" content="View detailed loan analytics and payment schedules" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Loan Analytics</h1>
          <p className="text-lg text-gray-600">Track your loans and payment schedules</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Loan Amount"
            value={formatCurrency(totalAmount)}
            icon={BanknotesIcon}
            color="blue"
          />
          <SummaryCard
            title="Monthly Payments"
            value={formatCurrency(totalMonthlyPayments)}
            icon={ChartBarIcon}
            color="green"
          />
          <SummaryCard
            title="Debt-to-Income"
            value={`${debtToIncomeRatio}%`}
            icon={ArrowTrendingDownIcon}
            color="yellow"
          />
          <SummaryCard
            title="Financial Health"
            value={`${healthScore.toFixed(1)}%`}
            icon={DocumentChartBarIcon}
            color="indigo"
          />
        </div>

        <div className="space-y-8">
          {loanAnalytics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm"
            >
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new loan.</p>
            </motion.div>
          ) : (
            loanAnalytics.map(loan => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <LoanCard loan={loan}>
                  <FlexiblePaymentSchedule loan={loan} />
                </LoanCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;