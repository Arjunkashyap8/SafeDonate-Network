import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/DonationPage.module.css";

interface Requirement {
  id: number;
  item_name: string;
  description: string;
  quantity_needed: number;
  quantity_received: number;
  orphanage: number;
}

const DonationPage: React.FC = () => {
  const { orphanageId } = useParams();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("sessionToken");

  // 🔹 Fetch requirements
  useEffect(() => {

    fetch(`http://172.16.20.43:8000/api/requirement/orphanage/${orphanageId}`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          (req: Requirement) => req.orphanage === Number(orphanageId)
        );
        setRequirements(filtered);
      })
      .catch(err => console.error(err));
  }, [orphanageId]);

  // 🔹 Submit donation
  const handleDonate = async () => {
    if (!selectedRequirement) {
      alert("Please select a requirement");
      return;
    }

    setLoading(true);

    const req = requirements.find(r => r.id === selectedRequirement);

    try {
      const res = await fetch("http://172.16.20.43:8000/api/donation/create/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orphanage: orphanageId,
          item_name: req?.item_name,
          quantity: quantity,
          description: req?.description
        })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        alert("Donation failed");
        return;
      }

      navigate("/donation/success");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.donationPage}>
      <Header userType="donor" />

      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Donate Items</h1>

          {/* Requirement selection */}
          <div className={styles.section}>
            <h3>Select Requirement</h3>
            <select
              className={styles.input}
              value={selectedRequirement ?? ""}
              onChange={(e) => setSelectedRequirement(Number(e.target.value))}
            >
              <option value="">-- Select --</option>
              {requirements.map(req => (
                <option key={req.id} value={req.id}>
                  {req.item_name} (Needed: {req.quantity_needed - req.quantity_received})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className={styles.section}>
            <h3>Quantity</h3>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.input}
            />
          </div>

          <button
            onClick={handleDonate}
            disabled={loading}
            className={`${styles.btn} ${styles.btnDonate}`}
          >
            {loading ? "Processing..." : "DONATE"}
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>SafeDonate Network</span>
      </footer>
    </div>
  );
};

export default DonationPage;
