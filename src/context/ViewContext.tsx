
import { createContext, useContext, useState } from "react";

type ViewMode = "kanban" | "departments" | "users";

type ViewContextType = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedDepartmentId: string | null;
  setSelectedDepartmentId: (id: string | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  return (
    <ViewContext.Provider
      value={{
        viewMode,
        setViewMode,
        selectedDepartmentId,
        setSelectedDepartmentId,
        selectedUserId,
        setSelectedUserId,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}
