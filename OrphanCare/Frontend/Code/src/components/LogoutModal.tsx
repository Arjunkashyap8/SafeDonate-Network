import React from 'react';
import { LogOut } from 'lucide-react';
import styles from '../styles/Modal.module.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Logout</h2>
        </div>
        
        <div className={styles.modalIllustration}>
          <LogOut size={48} color="var(--primary-maroon)" />
        </div>
        
        <div className={styles.modalMessage}>
          <p>Are you sure you want to logout?</p>
        </div>
        
        <div className={styles.modalButtons}>
          <button 
            onClick={onClose}
            className={`${styles.btn} ${styles.btnCancel}`}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`${styles.btn} ${styles.btnConfirm}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;