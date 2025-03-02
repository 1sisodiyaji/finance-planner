const LOAN_STORAGE_KEY = 'finance_planner_loans';

export const getLoanData = () => {
  try {
    const storedData = localStorage.getItem(LOAN_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveLoanData = (loans) => {
  try {
    localStorage.setItem(LOAN_STORAGE_KEY, JSON.stringify(loans));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
