import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [selectedPhones, setSelectedPhones] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexus_compare', JSON.stringify(selectedPhones));
    } catch {}
  }, [selectedPhones]);

  const toggleCompare = (phone) => {
    setSelectedPhones((prev) => {
      const exists = prev.some((p) => p.id === phone.id);
      if (exists) {
        return prev.filter((p) => p.id !== phone.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 phones simultaneously.');
        return prev;
      }
      return [...prev, phone];
    });
  };

  const removeFromCompare = (phoneId) => {
    setSelectedPhones((prev) => prev.filter((p) => p.id !== phoneId));
  };

  const clearCompare = () => setSelectedPhones([]);

  const isComparing = (phoneId) => selectedPhones.some((p) => p.id === phoneId);

  return (
    <CompareContext.Provider
      value={{
        selectedPhones,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
};
