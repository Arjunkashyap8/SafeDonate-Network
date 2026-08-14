// src/pages/AddRequirement.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/AddRequirement.module.css";
import { requirementService } from "../utils/donation_service";

const AddRequirement: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kgs");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "others");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !quantity) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    const payload = {
      item_name: name,
      category: selectedCategory,
      description: description || `${quantity} ${unit} needed`,
      quantity_needed: quantity,
      posted_date: new Date().toISOString(),
      deadline: null
    };

    const res = await requirementService.createRequirement(payload);

    setLoading(false);

    if (res.ok) {
      alert("Requirement added successfully!");
      navigate("/orphanage/dashboard");
    } else {
      alert("Failed to add requirement.");
      console.error(res.data || res.error);
    }
  };

  return (
    <div className={styles.addRequirement}>
      <h2>Add Requirement</h2>
      <div className={styles.formCard}>
        
        {/* Name */}
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            placeholder="e.g., Rice"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Quantity */}
        <div className={styles.formGroup}>
          <label>Quantity:</label>
          <div className={styles.quantityRow}>
            <input
              type="number"
              value={quantity}
              placeholder="10"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kgs">kgs</option>
              <option value="litres">litres</option>
              <option value="pcs">pcs</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label>Description (optional):</label>
          <textarea
            value={description}
            placeholder="Extra notes..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="education">Stationaries</option>
            <option value="clothing">Bedding</option>
            <option value="food">Food</option>
            <option value="others">Others</option>
            <option value="medical">General</option>
          </select>
        </div>

        {/* Buttons */}
        <div className={styles.buttonRow}>
          <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRequirement;
