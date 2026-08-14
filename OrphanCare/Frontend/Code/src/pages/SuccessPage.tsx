import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/SuccessPage.module.css';

const SuccessPage: React.FC = () => {
  return (
    <div className={styles.successPage}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.card}>
          <div className={styles.illustration}>
            <div className={styles.envelopeIcon}>
              <Mail size={48} />
            </div>
            <div className={styles.checkIcon}>
              <CheckCircle size={32} color="var(--success-color)" />
            </div>
          </div>
          
          <div className={styles.content}>
            <h1>
              Your request has been raised <span className={styles.success}>successfully!</span>
            </h1>
            <p>You'll be receiving a call from orphanage soon!</p>
          </div>
          
          <Link to="/donor/dashboard" className={`${styles.btn} ${styles.btnPrimary}`}>
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;