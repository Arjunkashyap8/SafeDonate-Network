// src/pages/OrphanageDashboard.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  User,
  Edit,
  Plus,
  ShoppingCart,
  Bed,
  Utensils,
  BookOpen,
  PenTool,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import styles from "../styles/OrphanageDashboard.module.css";
import { profileService } from "../utils/profile";
import { authService } from "../utils/auth";

interface Requirement {
  category: string;
  name: string;
  quantity: string;
  unit: string;
}

const OrphanageDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});


  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 STORE PROFILE DATA
  const [profile, setProfile] = useState<any>(null);

  // ------------------------------
  // 🔥 FETCH ORPHANAGE PROFILE
  // ------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await profileService.getOrphanageProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        console.error("Failed to fetch profile");
        // authService.logout()
        navigate('/orphanage/profile-complete')
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // 🟢 Capture new requirement when returning from AddRequirement page
  useEffect(() => {
  const fetchRequirements = async () => {
    try {
      const token = localStorage.getItem("sessionToken");

      const res = await fetch("http://172.16.20.43:8000/api/requirement/mine/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Fetched Requirements:", data);

      if (res.ok && Array.isArray(data)) {
        setRequirements(data); // store full API response
      } else {
        console.error("Failed to fetch requirements");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  fetchRequirements();
}, []);



const toggleCollapse = (category: string) => {
  setCollapsed(prev => ({
    ...prev,
    [category]: !prev[category]
  }));
};


  const renderRequirements = (category: string) => {
  return requirements
    .filter((r) => r.category?.toLowerCase() === category.toLowerCase())
    .map((r) => (
      <motion.div
        key={r.id}
        className={styles.requirementCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.reqName}>{r.item_name}</div>

        <div className={styles.reqQty}>
          Needed: <b>{r.quantity_needed}</b>{" "}
          {r.quantity_received > 0 && (
            <> | Received: <b>{r.quantity_received}</b></>
          )}
        </div>

        {r.description && (
          <div className={styles.reqDesc}>{r.description}</div>
        )}
      </motion.div>
    ));
};

  // -----------------------------------------
  // 🛑 SHOW LOADING STATE UNTIL API RETURNS
  // -----------------------------------------
  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // -----------------------------------------
  // ❗ No profile found
  // -----------------------------------------
  // if (!profile) {
  //   return (
  //     <div className={styles.errorScreen}>
  //       <p>Could not load profile data</p>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.orphanageDashboard}>
      <Header userType="orphanage" />

      {/* Profile Section */}
      <section className={styles.profileSection}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`${styles.welcomeText} ${styles.typingEffect}`}>
            Welcome back,{" "}
            <span className={styles.highlight}>{profile?.orphanage_name}</span>{" "}
            <span className={styles.wave}>👋</span>
          </h2>

          <p className={`${styles.subtitle} ${styles.fadeIn}`}>
            We’re glad to see you again! Here’s your profile overview.
          </p>

          {/* MAIN PROFILE CARD */}
          <motion.div
            className={styles.profileCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className={styles.profileIcon}>
              <User size={48} color="var(--primary-maroon)" />
            </div>

            <div className={styles.profileInfo}>
              <h3>{profile?.orphanage_name}</h3>

              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>
                  {profile?.address}
                  {profile?.city ? `, ${profile?.city}` : ""}
                  {profile?.state ? `, ${profile?.state}` : ""}
                  {profile?.pincode ? ` - ${profile?.pincode}` : ""}
                </span>
              </div>

              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>{profile?.phone_number}</span>
              </div>
            </div>

            <Link
              to="/orphanage/profile-complete"
              className={`${styles.btn} ${styles.btnEdit}`}
            >
              <Edit size={16} />
              Edit Your Profile
            </Link>
          </motion.div>

          {/* 📊 STATS SECTION */}
          <div className={styles.statsSection}>
            {[
              { number: profile?.students_count || 0, label: "Students" },
              { number: profile?.boys_count || 0, label: "Male" },
              { number: profile?.girls_count || 0, label: "Female" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className={styles.statCard}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <hr className={styles.hrrr} />

      {/* Orphanage Needs Section */}
      {/* Orphanage Needs Section */}
      {/* Orphanage Needs Section */}
<section className={styles.needsSection}>
  <div className={styles.container}>
    <h2 className={styles.sectionTitle}>Orphanage Needs</h2>

    {[
      { title: "Groceries", key: "groceries" },
      { title: "Bedding", key: "bedding" },
      { title: "Food", key: "food" },
      { title: "Stationaries", key: "stationaries" },
      { title: "Books", key: "books" },
      { title: "Educational - Others", key: "educational-others" },
      { title: "others", key: "others" },
    ].map((cat, idx) => (
      <div key={idx} className={styles.needGroup}>
        
        {/* CATEGORY HEADER */}
        <div
          className={styles.categoryHeader}
          onClick={() => toggleCollapse(cat.key)}
        >
          <h3>{cat.title}</h3>
          <span className={styles.collapseIcon}>
            {collapsed[cat.key] ? "➕" : "➖"}
          </span>
        </div>

        {/* COLLAPSIBLE BODY */}
        <motion.div
          initial={false}
          animate={{ height: collapsed[cat.key] ? 0 : "auto", opacity: collapsed[cat.key] ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className={styles.collapseBody}
        >
          <div className={styles.requirementsList}>
            {renderRequirements(cat.key)}
          </div>

          {/* ADD BUTTON */}
          <button
            className={styles.categoryAddButton}
            onClick={() => navigate(`/add-requirement/${cat.key}`)}
          >
            <Plus size={16} /> Add {cat.title}
          </button>
        </motion.div>

        <hr className={styles.categoryDivider} />
      </div>
    ))}
  </div>
</section>


      <footer className={styles.footer}>
        <p>SafeDonate Network © 2025</p>
      </footer>
    </div>
  );
};

export default OrphanageDashboard;
