import React from "react";

export default function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        padding: 40,
        borderRadius: 0,
        width: 400,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        color: "#000"
      }}>
        <h2 style={{ margin: "0 0 16px 0", color: "#000", fontSize: "20px" }}>Confirm</h2>
        <p style={{ margin: "0 0 24px 0", color: "#333", fontSize: "16px" }}>{message}</p>
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button 
            onClick={onConfirm}
            style={{ 
              padding: "12px 24px",
              fontSize: "15px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Yes
          </button>
          <button 
            onClick={onCancel}
            style={{ 
              padding: "12px 24px",
              fontSize: "15px",
              background: "#e0e0e0",
              color: "#333",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
