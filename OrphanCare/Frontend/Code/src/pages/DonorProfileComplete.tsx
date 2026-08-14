import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import styles from "../styles/ProfileComplete.module.css";
import axios from "axios";

const DonorProfileComplete: React.FC = () => {
  const api = axios.create({
    baseURL: "http://172.16.20.43:8000/api",
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email:"",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    api
      .get("/donor/me")
      .then((res) => {
        const data = res.data;

        setFormData({
          fullName: data.full_name || "",
          email: data.email || "",
          contactNumber: data.contact_number || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });

        setIsProfileLocked(true);
      })
      .catch(() => {
        setIsProfileLocked(false);
      });
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileLocked) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.post("/donor/create/", {
        full_name: formData.fullName,
        contact_number: formData.contactNumber,
        email:formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      navigate("/donor/dashboard");
    } catch (err: any) {
      setError("Failed to create profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  /* ---------------- UI ---------------- */
  return (
    <div className={styles.profileComplete}>
      <Header userType="donor" />

      {/* Decorative background elements */}
      <div className={styles.bgDecoration}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      <motion.div
        className={styles.container}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className={styles.card} variants={itemVariants}>
          {/* Header with icon */}
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1>Complete Your Profile</h1>
            <p className={styles.subtitle}>
              {isProfileLocked
                ? "Your profile information is displayed below"
                : "Fill in your details to get started"}
            </p>
          </div>

          {isProfileLocked && (
            <motion.div
              className={styles.lockNotice}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Profile is locked and cannot be edited</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              className={styles.errorAlert}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <motion.div className={styles.formGroup} variants={itemVariants}>
              <label>
                <span className={styles.labelIcon}>👤</span>
                Full Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isProfileLocked}
                placeholder="Enter your full name"
                className={styles.input}
                required
              />
            </motion.div>

            <motion.div className={styles.formGroup} variants={itemVariants}>
              <label>
                <span className={styles.labelIcon}>🏠</span>
                email
              </label>
              <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isProfileLocked}
                  placeholder="Email"
                  className={styles.input}
                  required
                />
            </motion.div>

            <motion.div className={styles.formGroup} variants={itemVariants}>
              <label>
                <span className={styles.labelIcon}>📱</span>
                Contact Number
              </label>
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={isProfileLocked}
                placeholder="+91 XXXXX XXXXX"
                className={styles.input}
                required
              />
            </motion.div>

            <motion.div className={styles.formGroup} variants={itemVariants}>
              <label>
                <span className={styles.labelIcon}>🏠</span>
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isProfileLocked}
                placeholder="Enter your complete address"
                className={`${styles.input} ${styles.textarea}`}
                required
              />
            </motion.div>

            <motion.div className={styles.formRow} variants={itemVariants}>
              <div className={styles.formGroup}>
                <label>
                  <span className={styles.labelIcon}>🏙️</span>
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isProfileLocked}
                  placeholder="City"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <span className={styles.labelIcon}>📍</span>
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isProfileLocked}
                  placeholder="State"
                  className={styles.input}
                  required
                />
              </div>
            </motion.div>

            <motion.div className={styles.formGroup} variants={itemVariants}>
              <label>
                <span className={styles.labelIcon}>📮</span>
                Pincode
              </label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                disabled={isProfileLocked}
                placeholder="6-digit pincode"
                className={styles.input}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              className={styles.btnConfirm}
              disabled={isLoading || isProfileLocked}
              variants={itemVariants}
              whileHover={{ scale: isProfileLocked ? 1 : 1.02 }}
              whileTap={{ scale: isProfileLocked ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : isProfileLocked ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Profile Completed
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Profile
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DonorProfileComplete;