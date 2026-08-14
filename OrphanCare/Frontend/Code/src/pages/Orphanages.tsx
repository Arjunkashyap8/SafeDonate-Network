import React, { useEffect, useState } from "react";
import { MapPin, Phone, ChevronRight, Map } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../styles/Orphanages.module.css";
import Header from "../components/Header";

interface Orphanage {
  id: number;
  orphanage_name: string;
  description: string;
  city: string;
  state: string;
  pincode?: string;
  phone_number?: string;
}

const Orphanages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "nearby">("all");

  const USER_PINCODE = 560082;

const getPincodeDistance = (p1?: string) => {
  if (!p1) return Infinity;
  return Math.abs(Number(p1) - USER_PINCODE);
};

const displayedOrphanages =
  activeTab === "nearby"
    ? [...orphanages]
        .filter(o => o.pincode)
        .sort(
          (a, b) =>
            getPincodeDistance(a.pincode) -
            getPincodeDistance(b.pincode)
        )
        .slice(0, 10)
    : orphanages;
  
  const filteredOrphanages = displayedOrphanages.filter((o) =>
    o.orphanage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.state.toLowerCase().includes(searchTerm.toLowerCase())
  );



  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        const response = await fetch("http://172.16.20.43:8000/api/orphanage/list/");
        const data = await response.json();
        setOrphanages(data);
      } catch (error) {
        console.error("Failed to fetch orphanages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrphanages();
  }, []);

  

  return (
    <div className={styles.orphanagesPage}>
      <Header userType="donor" />

      <div className={styles.container}>
        <h2 className={styles.title}>Orphanages Near You</h2>
        <p className={styles.subtitle}>
          Explore orphanages around your area and contribute to their needs.
        </p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
  <button
    onClick={() => setActiveTab("all")}
    className={activeTab === "all" ? styles.btnDonate : styles.btnMap}
  >
    All Orphanages
  </button>

  <button
    onClick={() => setActiveTab("nearby")}
    className={activeTab === "nearby" ? styles.btnDonate : styles.btnMap}
  >
    Nearby
  </button>
</div>


        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search orphanages by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />

        <div className={styles.grid}>
          {loading ? (
            <p>Loading orphanages...</p>
          ) : filteredOrphanages.length > 0 ? (
            filteredOrphanages.map((orphanage) => (
              <div key={orphanage.id} className={styles.card}>
                <h3>{orphanage.orphanage_name}</h3>
                <p>{orphanage.description}</p>

                <div className={styles.contact}>
                  <div className={styles.contactItem}>
                    <MapPin size={14} />
                    <span>{orphanage.city}, {orphanage.state}</span>
                  </div>

                  {orphanage.phone_number && (
                    <div className={styles.contactItem}>
                      <Phone size={14} />
                      <span>{orphanage.phone_number}</span>
                    </div>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  <Link
                    to={`/orphanage/${orphanage.id}`}
                    className={styles.btnDonate}
                  >
                    Donate Now <ChevronRight size={16} />
                  </Link>

                  <a
                    href={`https://www.google.com/maps?q=${orphanage.city}+${orphanage.state}+${orphanage.pincode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnMap}
                  >
                    View on Map <Map size={16} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No orphanages found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <span>🌟 SafeDonate Network © {new Date().getFullYear()} 🌟</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Orphanages;
