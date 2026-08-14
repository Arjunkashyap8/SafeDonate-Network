import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/LoginChoice.module.css';

const LoginChoice: React.FC = () => {
  return (
    <div className={styles.loginChoice}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.card}>
          <div className={styles.logo}>
            <span>SafeDonate Network</span>
          </div>
          
          <div className={styles.choiceContainer}>
            <motion.div 
              className={`${styles.choiceCard} ${styles.orphanageCard}`}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.illustration}>
                <Building size={48} />
              </div>
              <h3>Login as an Orphanage</h3>
              <Link 
                to="/login/orphanage" 
                className={`${styles.btn} ${styles.btnPrimary}`}
                aria-label="Login as Orphanage"
              >
                Log in
              </Link>
            </motion.div>
            
            <motion.div 
              className={`${styles.choiceCard} ${styles.donorCard}`}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.illustration}>
                <Heart size={48} />
              </div>
              <h3>Login as a Donor</h3>
              <Link 
                to="/login/donor" 
                className={`${styles.btn} ${styles.btnPrimary}`}
                aria-label="Login as Donor"
              >
                Log in
              </Link>
            </motion.div>
          </div>
          
          <div className={styles.footer}>
            <span>SafeDonate Network</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginChoice;