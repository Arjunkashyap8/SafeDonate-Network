// src/pages/OrphanegeProfileComplete.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { profileService } from '../utils/profile';
import styles from '../styles/OrphanegeProfileComplete.module.css';
import { authService } from '../utils/auth';

const OrphanegeProfileComplete: React.FC = () => {
  const [formData, setFormData] = useState({
    orphanageName: '',
    established: '',
    contactNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    registrationNumber: '',
    male: '',
    female: '',
    bankName: '',
    accountType: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: ''
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "proof") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      setError(null);
      const preview = URL.createObjectURL(file);

      if (type === "profile") {
        // Clean up previous preview
        if (profilePreview) {
          URL.revokeObjectURL(profilePreview);
        }
        setProfileImage(file);
        setProfilePreview(preview);
      } else {
        // Clean up previous preview
        if (proofPreview) {
          URL.revokeObjectURL(proofPreview);
        }
        setProofImage(file);
        setProofPreview(preview);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.orphanageName || !formData.address || !formData.contactNumber || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Pincode validation (6 digits) - if provided
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    if (!formData.male || !formData.female) {
      setError('Please enter the number of male and female orphans');
      return;
    }
    
    console.log(formData.female,"<------------------------")
    const maleCount = parseInt(formData.male);
    const femaleCount = parseInt(formData.female);

    console.log("before",formData.male,"after",maleCount)

    if (isNaN(maleCount) || isNaN(femaleCount) || maleCount < 0 || femaleCount < 0) {
      setError('Please enter valid numbers for orphan counts');
      return;
    }

    if (!formData.established) {
      setError("Please select the established date");
      return;
}


    setIsLoading(true);

    try {
      // Prepare the profile data according to API requirements
      const profileData = {
        orphanage_name: formData.orphanageName,
        address: formData.address,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        phone_number: formData.contactNumber,
        email: formData.email,
        total_orphans: maleCount + femaleCount,
        boys_count: maleCount,
        girls_count: femaleCount,
        students_count: maleCount + femaleCount, 
        description: `Orphanage established in ${formData.established || 'N/A'}. Registration Number: ${formData.registrationNumber || 'N/A'}`,
        established_on: formData.established ? new Date(formData.established).toISOString().split("T")[0]: new Date(),
        registration_number: formData.registrationNumber || undefined,
        banner_image: profileImage || undefined,
        registration_proof: proofImage || undefined,
        // Bank details
        bank_name: formData.bankName || undefined,
        account_type: formData.accountType || undefined,
        account_holder_name: formData.accountHolderName || undefined,
        account_number: formData.accountNumber || undefined,
        ifsc_code: formData.ifscCode || undefined,
      };

      const result = await profileService.createOrphanageProfile(profileData);

      if (result.success) {
        // Clean up blob URLs
        if (profilePreview) URL.revokeObjectURL(profilePreview);
        if (proofPreview) URL.revokeObjectURL(proofPreview);
        
        // Navigate to dashboard
        navigate('/orphanage/dashboard');
      } else {
        setError(result.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
const [accessToken, setAccessToken] = React.useState<string | null>(null);

React.useEffect(() => {

  console.log("profile page with toke ",accessToken)
  // 1️⃣ Check login status
  if (!authService.isAuthenticated()) {
    console.warn("User not authenticated → redirecting to login...");
    window.location.href = "/login";
    return;
  }

  // 2️⃣ Load token for later use in form submission
  const token = authService.getSessionToken();
  setAccessToken(token);

  // 3️⃣ Load orphanage profile (if exists)
  const loadProfile = async () => {
    try {
      const result = await profileService.getOrphanageProfile();

      if (result.success && result.data) {
        const p = result.data;

        // 4️⃣ Prefill form fields
        setFormData((prev) => ({
          ...prev,
          orphanageName: p.orphanage_name || "",
          address: p.address || "",
          city: p.city || "",
          state: p.state || "",
          pincode: p.pincode || "",
          contactNumber: p.phone_number || "",
          email: p.email || "",
          male: p.boys_count?.toString() || "",
          female: p.girls_count?.toString() || "",
          established: p.established_on || "",
          registrationNumber: p.registration_no || "",
          bankName: p.bank_name || "",
          accountType: p.account_type || "",
          accountHolderName: p.account_holder_name || "",
          accountNumber: p.account_number || "",
          ifscCode: p.ifsc_code || "",
        }));

        // 5️⃣ Setup previews if images exist
        if (p.banner_image_url) {
          setProfilePreview(p.banner_image_url);
        }
        if (p.registration_proof_url) {
          setProofPreview(p.registration_proof_url);
        }
      }
    } catch (err) {
      console.error("Failed to load orphanage profile:", err);
    }
  };

  loadProfile();

  // 6️⃣ Cleanup previews
  return () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
  };
}, []);

  return (
    <div className={styles.profileComplete}>
      <Header userType="orphanage" />
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.projectText}>OUR PROJECT</div>
            <h1>Complete your profile</h1>
            
            <div className={styles.avatarContainer}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile Preview" className={styles.avatarPreview} />
              ) : (
                <Building size={50} />
              )}
            </div>
            
            <label className={styles.uploadBtn}>
              <Upload size={16} /> Upload Profile Image
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={(e) => handleImageUpload(e, "profile")} 
              />
            </label>
            
            {error && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                marginTop: '12px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Details */}
            <div className={styles.section}>
              <h2><span className={styles.sectionNumber}>1</span> Basic Details</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="orphanageName">Orphanage Name *</label>
                  <input
                    type="text"
                    id="orphanageName"
                    name="orphanageName"
                    value={formData.orphanageName}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter orphanage name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="established">Established Date</label>
                  <input
                    type="date"
                    id="established"
                    name="established"
                    value={formData.established}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contactNumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter 10-digit phone number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="address">Street Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Enter street address"
                  rows={3}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter 6-digit pincode"
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Orphanage Details */}
            <div className={styles.section}>
              <h2><span className={styles.sectionNumber}>2</span> Orphanage Details</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="registrationNumber">Orphanage Registration Number</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="ex: 1A2D 2C8D 30XX"
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="male">Male Orphans *</label>
                  <input
                    type="number"
                    id="male"
                    name="male"
                    value={formData.male}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter the number of Male Orphans"
                    min="0"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="female">Female Orphans *</label>
                  <input
                    type="number"
                    id="female"
                    name="female"
                    value={formData.female}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Enter the number of Female Orphans"
                    min="0"
                  />
                </div>
              </div>

              {/* Registration Proof Upload */}
              <div className={styles.formGroup}>
                <label>Upload Registration Proof</label>
                <label className={styles.uploadBtn}>
                  <Upload size={16} /> Upload Proof
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={(e) => handleImageUpload(e, "proof")} 
                  />
                </label>
                {proofPreview && (
                  <img src={proofPreview} alt="Proof Preview" className={styles.proofPreview} />
                )}
              </div>
            </div>

            {/* Bank Details */}
            <div className={styles.section}>
              <h2><span className={styles.sectionNumber}>3</span> Bank Details (Optional)</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="bankName">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter bank name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="accountType">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Select account type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="accountHolderName">Account Holder Name</label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter account holder name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="accountNumber">Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter account number"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="ifscCode">IFSC Code</label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`${styles.btn} ${styles.btnConfirm}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner"></span> : 'Confirm & Create Profile'}
            </button>
          </form>
          
          <div className={styles.footer}>
            <span>SafeDonate Network</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrphanegeProfileComplete;