import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/RegistrationChoice.module.css';

const RegistrationChoice: React.FC = () => {
  return (
    <div className={styles.registrationChoice}>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.illustration}>
                <Building size={48} />
              </div>
              <h3>Register as an Orphanage</h3>
              <Link to="/register/orphanage" className={`${styles.btn} ${styles.btnPrimary}`}>
                Register
              </Link>
            </motion.div>
            
            <motion.div 
              className={`${styles.choiceCard} ${styles.donorCard}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.illustration}>
                <Heart size={48} />
              </div>
              <h3>Register as a Donor</h3>
              <Link to="/register/donor" className={`${styles.btn} ${styles.btnPrimary}`}>
                Register
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

export default RegistrationChoice;