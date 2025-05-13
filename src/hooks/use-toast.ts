
// This is a custom hook for toast notifications

import * as React from "react";
import { useState, useEffect, useCallback } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionType = {
  altText?: string;
  onClick: () => void;
  children: React.ReactNode;
};

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    const toasts: ToastProps[] = [];
    
    // Create a simplified version that doesn't rely on context
    // This allows us to use toast outside of the provider
    return {
      toasts,
      toast: (props: Omit<ToastProps, "id">) => {
        console.log("Toast triggered:", props);
        // Implementation can be improved later
      },
      dismiss: (id: string) => {
        console.log("Toast dismissed:", id);
        // Implementation can be improved later
      }
    };
  }

  return context;
}

// Export a standalone toast function for easier usage
export const toast = (props: Omit<ToastProps, "id">) => {
  const { toast: addToast } = useToast();
  addToast(props);
};
