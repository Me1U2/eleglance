import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoanApplication } from '../types/loan';

interface LoanContextType {
  loanApplications: LoanApplication[];
  addLoanApplication: (application: LoanApplication) => void;
  updateLoanStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  getApplicationById: (id: string) => LoanApplication | undefined;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);

  const addLoanApplication = (application: LoanApplication) => {
    setLoanApplications(prev => [...prev, application]);
  };

  const updateLoanStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoanApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const getApplicationById = (id: string) => {
    return loanApplications.find(app => app.id === id);
  };

  return (
    <LoanContext.Provider value={{
      loanApplications,
      addLoanApplication,
      updateLoanStatus,
      getApplicationById,
    }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoanContext = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoanContext must be used within a LoanProvider');
  }
  return context;
};

export default LoanContext;
