import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "../utils/auth";
import styles from "../styles/RegisterForm.module.css";
import image from "../Assets/image3.jpg"

interface RegisterFormProps {
  role: "orphanage" | "donor";
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        role,
      });

      if (result.success) {
        // fallback: persist accountId here as well (in case)
        if (result.accountId) {
          try {
            localStorage.setItem("registeredAccountId", result.accountId);
          } catch (e) {
            console.warn(
              "Could not persist registeredAccountId in RegisterForm",
              e
            );
          }
        }

        navigate("/verify-email", {
          state: {
            email: formData.email,
            role,
            message: result.message,
          },
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
 alert(
    error ||
    "Registration failed. Please try again."
  );    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    alert("Google authentication would be implemented here");
  };

  return (
    <div className={styles.registerForm}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.card}>
          <div className={styles.formSection}>
            <div className={styles.logo}>
              <span>SafeDonate Network</span>
            </div>

            <div className={styles.formContent}>
              <h1>
                Register as {role === "Orphanage" ? "an" : "a"} {role}
              </h1>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Create Password</label>
                  <div className={styles.passwordField}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.passwordField}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <small className={styles.helperText}>
                    Must be at least 8 characters.
                  </small>
                </div>

                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.fullWidth}`}
                  disabled={isLoading}
                >
                  {isLoading ? <span className="spinner"></span> : "Register"}
                </button>

                {/* <button
                  type="button"
                  className={`${styles.btn} ${styles.btnGoogle} ${styles.fullWidth}`}
                  onClick={handleGoogleAuth}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Register with Google
                </button> */}
              </form>

              <p className={styles.loginLink}>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>

          <div className={styles.illustrationSection}>
            <img
              src={image}
              alt={`${role} registration illustration`}
              className={styles.illustration}
            />
          </div>

          <div className={styles.footer}>
            <span>SafeDonate Network</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
