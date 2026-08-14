import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, Users, User } from "lucide-react";
import Header from "../components/Header";
import styles from "../styles/OrphanageProfile.module.css";

const OrphanageProfile: React.FC = () => {
  const { id } = useParams();
  const [orphanage, setOrphanage] = React.useState<any>(null);
const [requirements, setRequirements] = React.useState<any[]>([]);
const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
  const fetchData = async () => {
    try {
      const [profileRes, reqRes] = await Promise.all([
        fetch(`http://172.16.20.43:8000/api/orphanage/${id}/`),
        fetch(`http://172.16.20.43:8000/api/requirement/orphanage/${id}/`)
      ]);

      const profileData = await profileRes.json();
      const reqData = await reqRes.json();

      setOrphanage(profileData);
      setRequirements(reqData);
    } catch (err) {
      console.error("Failed to load orphanage data", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);



  return (
    <div className={styles.orphanageProfile}>
      <Header userType="donor" />

      {/* Banner Section */}
      <section className={styles.banner}>
        
        <img
            src={orphanage?.banner_image || "https://thumbs.dreamstime.com/b/indian-children-13778293.jpg"}
            className={styles.bannerImage}/>

        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>  🌟 {orphanage?.orphanage_name} 🌟</h1>
          <p className={styles.bannerSubtitle}>
            Together, let’s spread love, care, and opportunities 💖
          </p>
        </div>
      </section>

      <div className={styles.container}>
        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoContent}>
              <h1>{orphanage?.orphanage_name}</h1>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <MapPin size={20} />
                  <span> {orphanage?.address}, {orphanage?.city} {orphanage?.pincode}</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={20} />
                  <span>+91 9876543210</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={20} />
                  <span>{orphanage?.email}</span>
                </div>
              </div>
            </div>

            <Link
              to={`/donation/${id}`}
              className={`${styles.btn} ${styles.btnDonate}`}
            >
              ❤️ Donate Now
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={32} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statNumber}> {orphanage?.students_count}</span>
                <span className={styles.statLabel}>Students</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <User size={32} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statNumber}> {orphanage?.boys_count}</span>
                <span className={styles.statLabel}>Male</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <User size={32} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statNumber}>  {orphanage?.girls_count}</span>
                <span className={styles.statLabel}>Female</span>
              </div>
            </div>
          </div>
        </section>

        {/* Needs Section */}
        <section className={styles.needsSection}>
          <div className={styles.needsContent}>
            <h2>✨ Orphanage Needs ✨</h2>

            <div className={styles.needsGrid}>
  {requirements?.map((req) => (
    <div key={req.id} className={styles.needItem}>
      <h4>{req.item_name}</h4>
      <p>{req.description}</p>
      <small>
        Needed: {req.quantity_needed}
      </small>
    </div>
  ))}
</div>


            <div className={styles.otherNeeds}>
              <h3>💡 Other Needs</h3>
              <div className={styles.otherNeedsContent}>
                <p>
                  We also need support for medical expenses, clothing, sports
                  equipment, and infrastructure development. Special requirements
                  include physiotherapy equipment and technology for children with
                  special needs.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.needsIllustration}>
            <img
              src="https://thumbs.dreamstime.com/b/indian-children-13778293.jpg"
              alt="Children learning"
            />
          </div>
        </section>

        {/* Donate Button */}
        <section className={styles.donateSection}>
          <Link
            to={`/donation/${id}`}
            className={`${styles.btn} ${styles.btnDonateLarge}`}
          >
             DONATE NOW
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>🌍 SafeDonate Network © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default OrphanageProfile;
