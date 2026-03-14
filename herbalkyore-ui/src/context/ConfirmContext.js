import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    visible: false,
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({
        visible: true,
        message,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, visible: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, visible: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {confirmState.visible && (
        <div className="confirm-overlay" onClick={confirmState.onCancel}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <p className="confirm-message">{confirmState.message}</p>
            <div className="confirm-actions">
              <button className="confirm-btn-cancel" onClick={confirmState.onCancel}>Cancel</button>
              <button className="confirm-btn-ok" onClick={confirmState.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
