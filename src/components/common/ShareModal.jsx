import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Download, Upload } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ShareModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [importedData, setImportedData] = useState(null);
  const [shareLink, setShareLink] = useState('');

  const getAllData = () => {
    const data = {
      expenses: localStorage.getItem('expenses'),
      loans: localStorage.getItem('loans'),
      totalIncome: localStorage.getItem('totalIncome'),
      theme: localStorage.getItem('theme'),
      monthlySalary : localStorage.getItem('monthlySalary'),
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(data);
  };

  const handleExport = () => {
    const data = getAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-planner-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyShare = () => {
    const data = getAllData();
    const encodedData = btoa(data);
    const shareUrl = `${window.location.origin}?data=${encodedData}`;
    navigator.clipboard.writeText(shareUrl);
    setShareLink('Link copied to clipboard!');
    setTimeout(() => setShareLink(''), 2000);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setImportedData(data);
        } catch (error) {
          console.error('Error parsing imported data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImport = () => {
    if (importedData) {
      Object.entries(importedData).forEach(([key, value]) => {
        if (value && key !== 'timestamp') {
          localStorage.setItem(key, value);
        }
      });
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center md:p-4 p-1"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full md:p-6 p-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Share Your Data</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="font-medium mb-2">Export Your Data</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleExport}
                className={`flex items-center space-x-2 px-4 py-2  rounded-lg bg-gradient-to-r ${theme.primary} text-white`}
              >
                <Download className="w-4 h-4" />
                <span className='text-nowrap text-sm'>Download JSON</span>
              </button>
              <button
                onClick={handleCopyShare}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${theme.border}`}
              >
                <Copy className="w-4 h-4" />
                <span>Copy Share Link</span>
              </button>
            </div>
            {shareLink && (
              <p className="text-green-600 mt-2 text-sm">{shareLink}</p>
            )}
          </div>

          {/* Import Section */}
          <div>
            <h3 className="font-medium mb-2">Import Data</h3>
            <div className="space-y-4">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {importedData && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Data from: {new Date(importedData.timestamp).toLocaleString()}
                  </p>
                  <button
                    onClick={handleConfirmImport}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Confirm Import</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;
