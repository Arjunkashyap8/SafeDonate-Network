import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Gift, BookOpen, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import styles from '../styles/LandingPage.module.css';

const LandingPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.landingPage}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className={styles.heroTitle}>
              Hope <span className={styles.highlight}>begins here</span>
            </h1>
            <p className={styles.heroText}>
              Welcome to SafeDonate Network.  
              You can be the reason a child smiles today.  
              Join our mission to bring hope and happiness to children in need.
            </p>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/register" className={styles.ctaBtn}>
                💖 Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className={styles.mission}>
        <div className={styles.container}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             Our Mission 
          </motion.h2>

          <motion.p 
            className={styles.missionText}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            To connect caring donors with
             orphanages in need, creating a
             bridge of hope that transforms lives
            and builds stronger communities 
            for our children.
          </motion.p>

          <div className={styles.missionImages}>
            <motion.div 
              className={styles.imageCard}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="image.jpg"
                alt="Children learning together"
                loading="lazy"
              />
            </motion.div>
            <motion.div 
              className={styles.imageCard}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="image1.jpg"
                alt="Happy children playing"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Donate Section */}
      <section id="donate" className={styles.howToDonate}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How to Donate?</h2>
          <div className={styles.donationSteps}>
            <motion.div 
              className={styles.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className={styles.stepIcon}>
                <Users size={32} />
                <span className={styles.stepNumber}>1</span>
              </div>
              <h3>Register as Donor</h3>
            </motion.div>

            <div className={styles.heartbeat}>
              <svg viewBox="0 0 200 50" className={styles.heartbeatLine}>
                <path d="M0,25 L50,25 L60,5 L70,45 L80,15 L90,35 L100,25 L200,25" 
                      stroke="var(--primary-maroon)" strokeWidth="2" fill="none" />
              </svg>
              <Heart size={24} fill="var(--primary-maroon)" color="var(--primary-maroon)" className={styles.heartIcon} />
            </div>

            <motion.div 
              className={styles.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className={styles.stepIcon}>
                <BookOpen size={32} />
                <span className={styles.stepNumber}>2</span>
              </div>
              <h3>View orphanage requirements</h3>
            </motion.div>

            <div className={styles.heartbeat}>
              <svg viewBox="0 0 200 50" className={styles.heartbeatLine}>
                <path d="M0,25 L50,25 L60,5 L70,45 L80,15 L90,35 L100,25 L200,25" 
                      stroke="var(--primary-maroon)" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <motion.div 
              className={styles.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className={styles.stepIcon}>
                <Gift size={32} />
                <span className={styles.stepNumber}>3</span>
              </div>
              <h3>Donate what you want</h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className={styles.about}>
        <div className={styles.container}>
          <motion.div 
            className={styles.aboutCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className={styles.sectionTitle}>About Us</h2>
            <p>
              SafeDonate Network is a dedicated platform that bridges the gap between 
              generous donors and orphanages in need. We believe that every child deserves 
              love, care, and opportunity to thrive.
            </p>
            <p>
              Through our platform, we facilitate meaningful connections that transform 
              lives, ensuring that resources reach the children who need them most while 
              making the donation process transparent and impactful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>SafeDonate Network</h3>
              <p>SafeDonate Network is a Non-Profit Organization.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact Us</h4>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Mail size={16} />
                  <span>adminforquaries@gmail.com</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={16} />
                  <span>+91 9113676054</span>
                </div>
              </div>
            </div>
            <div className={styles.footerSection}>
              <h4>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a href="https://www.facebook.com/share/1ELHJY3XaP/" aria-label="Facebook"><Facebook size={20} /></a>
                <a href="https://www.instagram.com/orphan_cn?igsh=ZGtybWQ1ZzYzbXE4" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="https://x.com/orphan_cn?t=usWdg3W6zXSk_TSXJ3UWEw&s=08" aria-label="Twitter"><Twitter size={20} /></a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 SafeDonate Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
