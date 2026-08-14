// src/components/Header.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import LogoutModal from './LogoutModal';
import styles from '../styles/Header.module.css';
// import logo from '../assets/logooo.jpg';

interface HeaderProps {
  userType?: 'donor' | 'orphanage' | null;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userType, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [localUserType, setLocalUserType] = useState<'donor' | 'orphanage' | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Watch localStorage for userType
  useEffect(() => {
    const readStoredType = () => {
      try {
        const stored = localStorage.getItem('userType');
        if (stored === 'donor' || stored === 'orphanage') {
          setLocalUserType(stored);
        } else {
          setLocalUserType(null);
        }
      } catch {
        setLocalUserType(null);
      }
    };

    readStoredType();
    window.addEventListener('storage', readStoredType);

    return () => {
      window.removeEventListener('storage', readStoredType);
    };
  }, []);

  // Decide effective userType: prefer prop if given, else localStorage
  const effectiveUserType = useMemo(() => {
    return userType ?? localUserType;
  }, [userType, localUserType]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    try {
      localStorage.removeItem('userType');
    } catch (e) {
      console.warn('Error clearing userType', e);
    }
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const renderAuthLinks = () => {
    if (effectiveUserType === 'donor') {
      return (
        <>
          <Link
            to="/donor/dashboard"
            className={`${styles.navLink} ${isActive('/donor/dashboard') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/donor/profile-complete"
            className={`${styles.navLink} ${isActive('/donor/profile-complete') ? styles.active : ''}`}
          >
            Profile
          </Link>
          <Link
            to="/orphanages"
            className={`${styles.navLink} ${isActive('/orphanages') ? styles.active : ''}`}
          >
            Orphanages
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={styles.logoutBtn}
          >
            <LogOut size={16} />
            Log out
          </button>
        </>
      );
    }

    if (effectiveUserType === 'orphanage') {
      return (
        <>
          <Link
            to="/orphanage/dashboard"
            className={`${styles.navLink} ${isActive('/orphanage/dashboard') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/orphanage/profile-complete"
            className={`${styles.navLink} ${isActive('/orphanage/profile-complete') ? styles.active : ''}`}
          >
            Profile
          </Link>
          <Link
            to="/orphanage/requests"
            className={`${styles.navLink} ${isActive('/orphanage/requests') ? styles.active : ''}`}
          >
            Requests
          </Link>
          {/* Orphanage-only links */}
          <Link
            to="/learn"
            className={`${styles.navLink} ${isActive('/learn') ? styles.active : ''}`}
          >
            Learn
          </Link>

           <Link
            to="/LearnQuiz"
            className={`${styles.navLink} ${isActive('/LearnQuiz') ? styles.active : ''}`}
          >
            
          </Link>
          <Link
            to="/learn/dashboard"
            className={`${styles.navLink} ${isActive('/learn/dashboard') ? styles.active : ''}`}
          >
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={styles.logoutBtn}
          >
            <LogOut size={16} />
            Log out
          </button>
        </>
      );
    }

    // Public / not logged in
    return (
      <>
        <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
          Home
        </Link>
        <Link to="/#about" className={styles.navLink}>About</Link>
        <Link to="/#contact" className={styles.navLink}>Contact</Link>
        <Link to="/register" className={styles.navLink}>Register</Link>
        <Link to="/login" className={`${styles.navLink} ${styles.loginBtn}`}>Log In</Link>
      </>
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          {/*
          <div className={styles.logo}>
            <Link to="/" aria-label="SafeDonate Home">
              <img src={logo} alt="Orphan Care Network Logo" className={styles.logoImg} />
            </Link>
          </div> */}

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {renderAuthLinks()}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={styles.mobileNav}>
            {renderAuthLinks()}
          </nav>
        )}
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;
