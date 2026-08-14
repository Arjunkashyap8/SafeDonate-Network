import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../utils/auth';
import styles from '../styles/EmailVerification.module.css';

const EmailVerification: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '','']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || 'user@example.com';
  const role = location.state?.role || 'Donor';
  const message = location.state?.message || '';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      alert('Please enter the complete 5-digit code');
      return;
    }
    
    setIsLoading(true);
    
    authService.verifyEmail({
      email : email,
      code : verificationCode
    }).then(result => {
      if (result.success) {
        console.log("role--->",role)
        if (role === 'donor') {
          navigate('/donor/profile-complete');
        } else {
          navigate('/orphanage/profile-complete');
        }
      } else {
        alert(result.message);
        setIsLoading(false);
      }
    }).catch(error => {
      alert('Verification failed. Please try again.');
      setIsLoading(false);
    });
  };

  const handleResend = () => {
    // In a real app, you would call a resend API
    alert('Verification code resent! Check your email.');
  };

  return (
    <div className={styles.emailVerification}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.card}>
          <div className={styles.iconContainer}>
            <Mail size={48} color="var(--primary-maroon)" />
          </div>
          
          <h1>Verify your email</h1>
          <p className={styles.subtitle}>
            Please enter the 5 digit code sent to <strong>{email}</strong>
          </p>
          {message && (
            <p className={styles.message}>
              {message}
            </p>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.codeInputs}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={styles.codeInput}
                  maxLength={1}
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className={`${styles.btn} ${styles.btnConfirm}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner"></span> : 'Confirm'}
            </button>
          </form>
          
          <p className={styles.resendText}>
            Don't Receive Code? 
            <button 
              onClick={handleResend} 
              className={styles.resendLink}
            >
              Resend Code
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;