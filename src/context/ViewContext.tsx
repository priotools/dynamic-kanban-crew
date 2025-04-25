
import React, { createContext, useContext, useState } from 'react';

export type ViewMode = 'kanban' | 'departments' | 'users' | 'profile';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  selectedDepartmentId: string | null;
  setSelectedDepartmentId: (id: string | null) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  return (
    <ViewContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      selectedUserId, 
      setSelectedUserId, 
      selectedDepartmentId, 
      setSelectedDepartmentId 
    }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};
