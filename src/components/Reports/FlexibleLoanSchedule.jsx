import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react'

const FlexiblePaymentSchedule = ({ loan, onSave }) => {
    const [schedules, setSchedules] = useState(loan.flexibleSchedule || []);
    const [newSchedule, setNewSchedule] = useState({
      startMonth: 1,
      endMonth: '',
      monthlyPayment: ''
    });
  
    const handleAddSchedule = () => {
      if (newSchedule.startMonth && newSchedule.endMonth && newSchedule.monthlyPayment) {
        const updatedSchedules = [...schedules, {
          ...newSchedule,
          startMonth: parseInt(newSchedule.startMonth),
          endMonth: parseInt(newSchedule.endMonth),
          monthlyPayment: parseFloat(newSchedule.monthlyPayment)
        }].sort((a, b) => a.startMonth - b.startMonth);
  
        setSchedules(updatedSchedules);
        setNewSchedule({ startMonth: Math.max(...updatedSchedules.map(s => s.endMonth)) + 1 || 1, endMonth: '', monthlyPayment: '' });
        onSave(updatedSchedules);
      }
    };
  
    const handleRemoveSchedule = (index) => {
      const updatedSchedules = schedules.filter((_, i) => i !== index);
      setSchedules(updatedSchedules);
      onSave(updatedSchedules);
    };
  
    const calculateTotalMonths = () => {
      if (schedules.length === 0) return 0;
      return Math.max(...schedules.map(s => s.endMonth));
    };
  
    const calculateTotalPayment = () => {
      return schedules.reduce((total, schedule) => {
        const months = schedule.endMonth - schedule.startMonth + 1;
        return total + (months * schedule.monthlyPayment);
      }, 0);
    };
  
    return (
      <div className="bg-white rounded-lg p-4 space-y-4">
        <h3 className="font-semibold">Flexible Payment Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600">Start Month</label>
            <input
              type="number"
              min="1"
              value={newSchedule.startMonth}
              onChange={(e) => setNewSchedule({ ...newSchedule, startMonth: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">End Month</label>
            <input
              type="number"
              min={newSchedule.startMonth}
              value={newSchedule.endMonth}
              onChange={(e) => setNewSchedule({ ...newSchedule, endMonth: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Monthly Payment (₹)</label>
            <input
              type="number"
              min="0"
              value={newSchedule.monthlyPayment}
              onChange={(e) => setNewSchedule({ ...newSchedule, monthlyPayment: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleAddSchedule}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Schedule
          </button>
        </div>
  
        {schedules.length > 0 && (
          <div className="mt-4">
            <div className="space-y-2">
              {schedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex space-x-4">
                    <span>Months {schedule.startMonth}-{schedule.endMonth}:</span>
                    <span className="font-medium">₹{schedule.monthlyPayment.toLocaleString()}/month</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSchedule(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Total Duration:</span>
                <span className="ml-2 font-medium">{calculateTotalMonths()} months</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Total Payment:</span>
                <span className="ml-2 font-medium">₹{calculateTotalPayment().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default FlexiblePaymentSchedule