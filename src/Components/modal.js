import React, { useEffect, useRef } from "react";
import "./modal.css";

export default function CenteredModal({ isOpen, onClose, message }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose && onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onBackdropClick}>
      <div className="modal" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h3 className="modal-title">{message}</h3>
      </div>
    </div>
  );
}