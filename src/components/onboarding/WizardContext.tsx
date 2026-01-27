'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface WizardData {
  // Step 1
  age?: number;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  diabetesType?: 'type1' | 'type2' | 'prediabetes' | 'gestational';
  glucoseTargets?: {
    low: number;
    high: number;
    unit: 'mg/dL' | 'mmol/L';
  };

  // Step 2
  device?: 'dexcom' | 'libre' | 'eversense' | 'manual';

  // Step 3
  permissions?: {
    notifications: boolean;
    healthData: boolean;
    location: boolean;
  };
}

interface WizardContextType {
  wizardData: WizardData;
  updateWizardData: (data: Partial<WizardData>) => void;
  resetWizard: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [wizardData, setWizardData] = useState<WizardData>({
    weightUnit: 'lbs',
    glucoseTargets: {
      low: 70,
      high: 180,
      unit: 'mg/dL',
    },
  });
  const [currentStep, setCurrentStep] = useState(1);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const resetWizard = () => {
    setWizardData({
      weightUnit: 'lbs',
      glucoseTargets: {
        low: 70,
        high: 180,
        unit: 'mg/dL',
      },
    });
    setCurrentStep(1);
  };

  return (
    <WizardContext.Provider value={{
      wizardData,
      updateWizardData,
      resetWizard,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}
