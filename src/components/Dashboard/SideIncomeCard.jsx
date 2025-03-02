import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const SideIncomeCard = ({ onUpdate }) => {
  const [sideIncomes, setSideIncomes] = useState(() => {
    const stored = localStorage.getItem('sideIncomes');
    return stored ? JSON.parse(stored) : [];
  });
  const [newIncome, setNewIncome] = useState({ source: '', amount: '' });

  const handleAddIncome = () => {
    if (newIncome.source && newIncome.amount) {
      const updatedIncomes = [...sideIncomes, {
        id: Date.now(),
        ...newIncome,
        amount: parseFloat(newIncome.amount)
      }];
      setSideIncomes(updatedIncomes);
      localStorage.setItem('sideIncomes', JSON.stringify(updatedIncomes));
      setNewIncome({ source: '', amount: '' });
      onUpdate(updatedIncomes);
    }
  };

  const handleRemoveIncome = (id) => {
    const updatedIncomes = sideIncomes.filter(income => income.id !== id);
    setSideIncomes(updatedIncomes);
    localStorage.setItem('sideIncomes', JSON.stringify(updatedIncomes));
    onUpdate(updatedIncomes);
  };

  const totalSideIncome = sideIncomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Side Income</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600">Source</label>
          <input
            type="text"
            value={newIncome.source}
            onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Freelancing, Part-time, etc."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Monthly Amount (₹)</label>
          <input
            type="number"
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Amount"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAddIncome}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Income
          </button>
        </div>
      </div>

      {sideIncomes.length > 0 && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">Total Side Income</p>
            <p className="text-2xl font-bold text-green-600">₹{totalSideIncome.toLocaleString()}</p>
          </div>
          
          <div className="space-y-2">
            {sideIncomes.map(income => (
              <div key={income.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="font-medium">{income.source}</p>
                  <p className="text-sm text-gray-600">₹{income.amount.toLocaleString()}/month</p>
                </div>
                <button
                  onClick={() => handleRemoveIncome(income.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideIncomeCard;
