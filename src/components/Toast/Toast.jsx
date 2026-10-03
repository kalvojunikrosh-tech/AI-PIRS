import React from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = "var(--color-info)";
        if (toast.type === "success") {
          Icon = CheckCircle2;
          iconColor = "var(--color-success)";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "var(--color-danger)";
        }

        return (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
