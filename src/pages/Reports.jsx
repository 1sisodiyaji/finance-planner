import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Helmet } from 'react-helmet';
import {
  BanknotesIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { SummaryCard, LoanCard } from '../components/Reports';

const Reports = () => {
  const { theme } = useTheme();
  const [loans, setLoans] = useState([]);
  const [loanAnalytics, setLoanAnalytics] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const monthlySalary = 21200;

  useEffect(() => {
    const storedLoans = localStorage.getItem('loans');
    if (storedLoans) {
      const parsedLoans = JSON.parse(storedLoans);
      setLoans(parsedLoans);
      generateLoanAnalytics(parsedLoans);
      setHealthScore(calculateHealthScore(parsedLoans));
    }
  }, []);

  const generateLoanAnalytics = (loanData) => {
    const analytics = loanData.map(loan => {
      const totalAmount = parseFloat(loan.amount);
      const monthlyPayment = totalAmount / loan.tenure;
      const startDate = new Date(loan.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + loan.tenure);

      const schedule = Array.from({ length: loan.tenure }, (_, index) => {
        const month = new Date(startDate);
        month.setMonth(month.getMonth() + index);
        const remainingAmount = totalAmount - (monthlyPayment * index);
        const percentage = ((monthlyPayment * index) / totalAmount) * 100;

        return {
          month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          payment: monthlyPayment,
          remainingAmount: Math.max(0, remainingAmount),
          percentage: Math.min(100, percentage)
        };
      });

      return {
        ...loan,
        totalAmount,
        monthlyPayment,
        startDate,
        endDate,
        schedule
      };
    });

    setLoanAnalytics(analytics);
  };

  const calculateHealthScore = (loanData) => {
    if (!loanData.length) return 0;
    const totalMonthlyPayments = loanData.reduce((sum, loan) => {
      return sum + (parseFloat(loan.amount) / loan.tenure);
    }, 0);
    const debtToIncomeRatio = (totalMonthlyPayments / monthlySalary) * 100;
    return Math.max(0, 100 - debtToIncomeRatio);
  };

  // Calculate total statistics
  const totalAmount = loanAnalytics.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalMonthlyPayments = loanAnalytics.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const debtToIncomeRatio = ((totalMonthlyPayments / monthlySalary) * 100).toFixed(1);

  return (
    <>
      <Helmet>
        <title>Financial Reports | Finance Planner</title>
        <meta name="description" content="Generate and analyze detailed financial reports, visualize spending patterns, and get insights into your financial health." />
        <meta name="keywords" content="financial reports, spending analysis, financial insights, expense reports, loan reports" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Financial Reports | Finance Planner" />
        <meta property="og:description" content="Generate and analyze detailed financial reports, visualize spending patterns, and get insights into your financial health." />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Financial Reports | Finance Planner" />
        <meta property="twitter:description" content="Generate and analyze detailed financial reports, visualize spending patterns, and get insights into your financial health." />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
      </Helmet>
      <div className="max-w-7xl mx-auto md:px-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="md:text-3xl font-bold text-gray-900">Loan Reports</h1>
          <p className="md:text-lg text-gray-600">Detailed analysis of your loans</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Loan Amount"
            value={`₹${totalAmount.toLocaleString()}`}
            icon={BanknotesIcon}
            color="blue"
          />
          <SummaryCard
            title="Monthly Payments"
            value={`₹${totalMonthlyPayments.toLocaleString()}`}
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
          {loanAnalytics.map(loan => (
            <LoanCard key={loan.id} loan={loan} analytics={loan} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Reports;