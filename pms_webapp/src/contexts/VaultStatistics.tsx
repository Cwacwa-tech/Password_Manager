// src/components/VaultStatistics.tsx

import React, { useState, useEffect } from 'react';
import { VaultEntry } from '../services/vaultService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface VaultStatisticsProps {
  entries: VaultEntry[];
}

interface PasswordStrength {
  label: string;
  count: number;
  color: string;
}

const VaultStatistics: React.FC<VaultStatisticsProps> = ({ entries }) => {
  const [passwordStrengths, setPasswordStrengths] = useState<PasswordStrength[]>([]);
  const [averagePasswordLength, setAveragePasswordLength] = useState<number>(0);
  const [reusedPasswords, setReusedPasswords] = useState<number>(0);
  const [oldPasswords, setOldPasswords] = useState<number>(0);

  useEffect(() => {
    if (entries.length > 0) {
      analyzePasswords(entries);
    }
  }, [entries]);

  const analyzePasswords = (passwordEntries: VaultEntry[]) => {
    // Check password strength
    const strengths: { [key: string]: number } = {
      'Strong': 0,
      'Medium': 0,
      'Weak': 0
    };

    // Check for reused passwords
    const uniquePasswords = new Set<string>();
    const passwordsCount: { [key: string]: number } = {};
    
    // Calculate average length
    let totalLength = 0;
    
    // Count old passwords (older than 90 days)
    let oldPasswordsCount = 0;
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    passwordEntries.forEach(entry => {
      // Add to length calculation
      totalLength += entry.password.length;
      
      // Check if password is reused
      if (!passwordsCount[entry.password]) {
        passwordsCount[entry.password] = 0;
        uniquePasswords.add(entry.password);
      }
      passwordsCount[entry.password]++;
      
      // Check if password is old
      if (entry.last_modified) {
        const modifiedDate = new Date(entry.last_modified);
        if (modifiedDate < ninetyDaysAgo) {
          oldPasswordsCount++;
        }
      }
      
      // Check password strength
      const strength = checkPasswordStrength(entry.password);
      strengths[strength]++;
    });
    
    // Count reused passwords
    let reusedCount = 0;
    Object.values(passwordsCount).forEach(count => {
      if (count > 1) {
        reusedCount += count;
      }
    });
    
    // Create chart data
    const strengthData = [
      { label: 'Strong', count: strengths['Strong'], color: '#4CAF50' },
      { label: 'Medium', count: strengths['Medium'], color: '#FFC107' },
      { label: 'Weak', count: strengths['Weak'], color: '#F44336' }
    ];
    
    setPasswordStrengths(strengthData);
    setAveragePasswordLength(totalLength / passwordEntries.length);
    setReusedPasswords(reusedCount);
    setOldPasswords(oldPasswordsCount);
  };
  
  const checkPasswordStrength = (password: string): string => {
    // Simple password strength checker
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const varietyCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (password.length >= 12 && varietyCount >= 3) {
      return 'Strong';
    } else if (password.length >= 8 && varietyCount >= 2) {
      return 'Medium';
    } else {
      return 'Weak';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Password Vault Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Password Health</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Length</p>
                <p className="text-xl font-bold">{averagePasswordLength.toFixed(1)} chars</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Passwords</p>
                <p className="text-xl font-bold">{entries.length}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Reused Passwords</p>
                <p className={`text-xl font-bold ${reusedPasswords > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                  {reusedPasswords}
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Old Passwords (90+ days)</p>
                <p className={`text-xl font-bold ${oldPasswords > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                  {oldPasswords}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Password Strength</h3>
          <div className="h-64">
            {passwordStrengths.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passwordStrengths}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="label"
                  >
                    {passwordStrengths.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} passwords`, `${name}`]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No password data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultStatistics;