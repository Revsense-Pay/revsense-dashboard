'use client';

import { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
  const [onboarding, setOnboarding] = useState({
    step: 1,
    completed: false,

    client: {
      name: '',
      industry: '',
      country: '',
      email: '',
    },

    pricing: {
      platformFee: 2000,
      transactionFee: 0.01,
    },

    paystack: {
      connected: false,
    },
  });

  const updateOnboarding = updates => {
    setOnboarding(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const updateClient = client =>
    setOnboarding(prev => ({
      ...prev,
      client: { ...prev.client, ...client },
    }));

  const updatePricing = pricing =>
    setOnboarding(prev => ({
      ...prev,
      pricing: { ...prev.pricing, ...pricing },
    }));

  const updatePaystack = paystack =>
    setOnboarding(prev => ({
      ...prev,
      paystack: { ...prev.paystack, ...paystack },
    }));

  return (
    <OnboardingContext.Provider
      value={{
        onboarding,
        updateOnboarding,
        updateClient,
        updatePricing,
        updatePaystack,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used inside OnboardingProvider');
  }
  return ctx;
};