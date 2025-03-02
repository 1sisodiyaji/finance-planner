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
import { ChartPieIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Reports = () => {
  const { theme } = useTheme();
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
        // Parse base values
        const amount = parseFloat(loan.amount);
        const minimumPayment = parseFloat(loan.minimumPayment);
        const totalAmount = amount; // No interest for flexible loans

        // Use minimum payment as monthly payment
        const monthlyPayment = minimumPayment;

        // Calculate estimated months to repay
        const estimatedMonths = Math.ceil(amount / minimumPayment);

        // Generate payment schedule based on minimum payments and flexible schedules
        const startDate = new Date(loan.startDate || Date.now());
        const schedule = [];
        let remainingAmount = amount;
        let totalPaid = 0;

        for (let i = 0; i < estimatedMonths && remainingAmount > 0; i++) {
          const month = new Date(startDate);
          month.setMonth(month.getMonth() + i);

          // Check if this month has a flexible payment scheduled
          let currentPayment = minimumPayment;
          if (loan.flexibleSchedule && Array.isArray(loan.flexibleSchedule)) {
            const flexiblePayment = loan.flexibleSchedule.find(s => {
              const monthIndex = i + 1; // Convert to 1-based index
              return monthIndex >= s.startMonth && monthIndex <= s.endMonth;
            });
            if (flexiblePayment) {
              currentPayment = parseFloat(flexiblePayment.monthlyPayment) || minimumPayment;
            }
          }

          // Calculate remaining amount after this payment
          const actualPayment = Math.min(currentPayment, remainingAmount);
          totalPaid += actualPayment;
          remainingAmount = Math.max(0, remainingAmount - actualPayment);

          schedule.push({
            month: month.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
            payment: actualPayment,
            remainingAmount: remainingAmount,
            percentage: (totalPaid / amount) * 100
          });

          // Break if loan is fully paid
          if (remainingAmount === 0) break;
        }

        return {
          ...loan,
          monthlyPayment: minimumPayment,
          totalAmount: amount,
          estimatedMonths,
          schedule,
          remainingAmount: remainingAmount,
          totalPaid: totalPaid,
          percentagePaid: (totalPaid / amount) * 100
        };
      });

      setLoanAnalytics(analytics);

      // Calculate health score based on total monthly payments vs income
      const totalMonthlyPayments = analytics.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
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

  const handleSaveSchedule = (loanId, newSchedule) => {
    try {
      // Get current loans from localStorage
      const storedLoans = localStorage.getItem('loans');
      const currentLoans = storedLoans ? JSON.parse(storedLoans) : [];

      // Find and update the specific loan
      const updatedLoans = currentLoans.map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            flexibleSchedule: newSchedule
          };
        }
        return loan;
      });

      // Save back to localStorage
      localStorage.setItem('loans', JSON.stringify(updatedLoans));

      // Update state
      setLoans(updatedLoans);
      calculateLoanAnalytics(updatedLoans, totalIncome);
    } catch (error) {
      console.error('Error saving schedule:', error);
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

      <div className="max-w-7xl mx-auto md:px-4 md:py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center space-x-4"
        >
          <div className={`p-3 rounded-full bg-gradient-to-r ${theme.primary} bg-opacity-10`}>
            <ChartPieIcon className={`w-8 h-8 text-white`} />
          </div>
          <div>
            <h1 className="md:text-3xl font-bold text-gray-900">Loan Analytics</h1>
            <p className="md:text-lg text-gray-600">Track your loans and payment schedules</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          <SummaryCard
            title="Total Loan Amount"
            value={formatCurrency(totalAmount)}
            icon={BanknotesIcon}
            color="bg-blue-100"
          />
          <SummaryCard
            title="Monthly Payments"
            value={formatCurrency(totalMonthlyPayments)}
            icon={ChartBarIcon}
            color="bg-green-100"
          />
          <SummaryCard
            title="Debt-to-Income"
            value={`${debtToIncomeRatio}%`}
            icon={ArrowTrendingDownIcon}
            color="bg-yellow-100"
          />
          <SummaryCard
            title="Financial Health"
            value={`${healthScore.toFixed(1)}%`}
            icon={DocumentChartBarIcon}
            color="bg-indigo-100"
          />
        </div>

        <div className="space-y-8 ">
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
                  <FlexiblePaymentSchedule
                    loan={loan}
                    onSave={(newSchedule) => handleSaveSchedule(loan.id, newSchedule)}
                  />
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