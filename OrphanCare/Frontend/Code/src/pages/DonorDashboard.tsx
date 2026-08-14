import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Edit, Heart, Calendar, User, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import styles from '../styles/DonorDashboard.module.css';
import axios from "axios";

const DonorDashboard: React.FC = () => {

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

  const [profile, setProfile] = useState<any>(null);
const [donations, setDonations] = useState<any[]>([]);
const [orphanages, setOrphanages] = useState<any[]>([]);



  const navigate = useNavigate()
  const handleEditProfile = () => {
    // Navigate to profile edit
  };

  const handleDonate = (orphanageId: string) => {
    // Navigate to donation page
  };

  const handleLogout = () => {
    // Logout functionality
  };

  useEffect(() => {
  const token = localStorage.getItem("sessionToken");
  console.log("token from stored",token)
  if (!token) {
    alert("Session expired! Please login");
    navigate("/login");
    return;
  }

  Promise.all([
    api.get("/donor/me"),
    api.get("/donation/my-donations/"),
    api.get("/orphanage/list"),
  ])
    .then(([profileRes, donationRes, orphanageRes]) => {
      setProfile(profileRes.data);
      setDonations(donationRes.data);

      // nearby orphanages (frontend limit)
      const nearby = orphanageRes.data.filter(
        (o: any) => o.pincode === profileRes.data.pincode
      );
      setOrphanages(nearby.slice(0, 2));
    })
    .catch(() => {
      alert("Failed to load dashboard");
    });
}, []);


  const pendingDonations = donations.filter(
  (d) => d.status === "pending"
);

  return (
    <div className={styles.donorDashboard}>
      <Header userType="donor" /><br></br>
      <h2>Welcome back, <span className={styles.spann}>{profile?.full_name}</span> 👋</h2>
      <p>We’re glad to see you again! Here’s your profile overview.</p>
      
      {/* Hero Section */}


      <div className={styles.container}>
        {/* Profile Section */}
        <section className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileInfo}>
              <div className={styles.profileAvatar}>
                <User size={40} />
              </div>
              <div className={styles.profileDetails}>
                <h2>{profile?.full_name} </h2>
                <div className={styles.profileMeta}>
                  <div className={styles.metaItem}>
                    <MapPin size={16} />
                    <span>{profile?.city}, {profile?.state}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Phone size={16} />
                    <span>+91 {profile?.contact_number}</span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/donor/profile-complete" className={`${styles.btn} ${styles.btnEdit}`}>
              <Edit size={16} />
              Edit Your Profile
            </Link>
          </div>
        </section><hr className={styles.hrrr}></hr>
        
        {/* Your Donations */}
        <section className={styles.donations}>
          <h2 className={styles.sectionTitle}>Your Donations</h2><br></br>
          <div className={styles.donationsScroll}>
            {donations.map((d) => (
    <div key={d.id} className={styles.donationCard}>
      <h4>{d.orphanage_name}</h4>
      <p>{d.item_name} — {d.quantity}</p>
      <div className={styles.donationMeta}>
        <Calendar size={14} />
        <span>{new Date(d.donation_date).toDateString()}</span>
      </div>
      <span className={styles.pendingStatus}>{d.status}</span>
    </div>
  ))}
            
            <div className={styles.donationCard}>
              <div className={styles.donationStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>10</span>
                  <span className={styles.statLabel}>Books</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>₹5000</span>
                  <span className={styles.statLabel}>Fund</span>
                </div>
              </div>
              <h4>Hope Children Home</h4>
              <div className={styles.donationMeta}>
                <Calendar size={14} />
                <span>10 Dec 2024</span>
              </div>
            </div>
          </div>

          
          
          
        </section><br></br><hr className={styles.hrrr}></hr>
        

        {/* Orphanages Near Me */}
        <section className={styles.orphanages}>
          <h2 className={styles.sectionTitle}>Orphanages near me</h2><br></br>
          <div className={styles.orphanagesGrid}>
            {orphanages.map((o) => (
    <div key={o.id} className={styles.orphanageCard}>
      <h4>{o.orphanage_name}</h4>
      <p className={styles.orphanageDesc}>{o.description}</p>

      <div className={styles.orphanageContact}>
        <div className={styles.contactItem}>
          <MapPin size={14} />
          <span>{o.address}</span>
        </div>
        <div className={styles.contactItem}>
          <Phone size={14} />
          <span>{o.phone_number}</span>
        </div>
      </div>

      <Link
        to={`/orphanage/${o.id}`}
        className={`${styles.btn} ${styles.btnDonate}`}
      >
        Donate Now <ChevronRight size={14} />
      </Link>
    </div>
  ))}

          </div>
          <Link to="/orphanages" className={styles.viewmore}>
          <button className={styles.btnViewMore}>
            👀 View More
            </button>

          </Link>
        </section><br></br><hr className={styles.hrrr}></hr>
       

        {/* Pending Donations */}
        <section className={styles.pendingDonations}>
          <h2 className={styles.sectionTitle}>Pending Donations</h2>
          <div className={styles.pendingList}>
            {pendingDonations.map((d) => (
    <div key={d.id} className={styles.pendingCard}>
      <div className={styles.pendingInfo}>
        <h4>{d.orphanage_name}</h4>
        <span className={styles.pendingStatus}>Pending</span>
        <p className={styles.requestedItem}>
          {d.item_name}
        </p>
      </div>
    </div>
  ))}
          </div>
          <p className={styles.pendingMessage}>
            ⚠️ Your donation is still pending – please complete it as soon as possible
          </p>
        </section>

        {/* About Us Section */}
        <section className={styles.about}>
          <div className={styles.aboutCard}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <p>
              SafeDonate Network is a dedicated platform that bridges the gap between 
              generous donors and orphanages in need. We believe that every child deserves 
              love, care, and opportunity to thrive.
            </p>
          </div>
        </section>
      </div><br></br>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <span>SafeDonate Network © 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DonorDashboard;