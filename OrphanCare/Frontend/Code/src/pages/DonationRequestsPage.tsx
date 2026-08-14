import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp, User, Mail, Phone, Plus } from 'lucide-react';
import Header from '../components/Header';
import styles from '../styles/DonationRequestsPage.module.css';
import { 
  getMyDonationRequests, 
  approveDonation, 
  rejectDonation ,
  updateDonationStatus
} from "../utils/donation_service";

interface DonationRequest {
  id: string;
  donor_name: string;
  category: string;
  status: 'pending' | 'accepted';
  phone: string;
  email: string;
  items: string[];
}

const DonationRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'completed'>('requests');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch API data on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await getMyDonationRequests();

    console.log("--------------------->",res)
    if (res.success && Array.isArray(res.data)) {
      setRequests(res.data);
    }
    setLoading(false);
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const completedRequests = requests.filter(r => r.status === "accepted");

  console.log("all",requests,"pending->",pendingRequests,"completed->",completedRequests)

const handleApprove = async (id: string,donor:number,orphanage:number,item_name:string) => {
  const res = await updateDonationStatus(id,donor,orphanage,item_name, "accepted");

  if (res.success) {
    fetchRequests();
  } else {
    alert("Failed to approve request");
  }
};

const handleReject = async (id: string,donor:number,orphanage:number,item_name:string) => {
  const res = await updateDonationStatus(id,donor,orphanage,item_name, "cancelled");

  if (res.success) {
    fetchRequests();
  } else {
    alert("Failed to reject request");
  }
};

  const toggleExpand = (id: string) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const renderRequests = (list: DonationRequest[]) => {
  console.log("--------------->", list);
  console.log("orph",list[0].orphanage)

  return list?.map((request) => (
    <div key={request.id} className={styles.requestCard}>
      
      <div
        className={styles.requestHeader}
        onClick={() => toggleExpand(request.id)}
      >
        <div className={styles.requestInfo}>
          <div className={styles.donorAvatar}>
            <User size={24} />
          </div>

          <div className={styles.requestDetails}>
            <h4>{request.donor_name}</h4>

            <span className={styles.categoryBadge}>
              {request.item_name}
            </span>
          </div>
        </div>

        <div className={styles.requestActions}>
          {request.status === "pending" ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(request.id,request.donor_name,request.orphanage,request.item_name);
                }}
                className={`${styles.actionBtn} ${styles.approveBtn}`}
              >
                <Check size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(request.id,request.donor_name,request.orphanage,request.item_name);
                }}
                className={`${styles.actionBtn} ${styles.rejectBtn}`}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button className={`${styles.actionBtn} ${styles.completedBtn}`}>
              <Check size={16} />
            </button>
          )}

          <button className={styles.expandBtn}>
            {expandedRequest === request.id ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
      </div>

      {expandedRequest === request.id && (
        <div className={styles.requestExpanded}>
          {/* Donor Details */}
          <div className={styles.donorDetails}>
            <h5>Donor Details</h5>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Phone size={14} />
                <span>{request.donor_phone ?? "N/A"}</span>
              </div>

              <div className={styles.contactItem}>
                <Mail size={14} />
                <span>{request.donor_email ?? "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className={styles.donationDetails}>
            <h5>Donation Details</h5>

            <ul className={styles.itemsList}>
              <li>
                {request.item_name} — <strong>{request.quantity}</strong>
              </li>
            </ul>

            {request.description && (
              <p className={styles.description}>{request.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  ));
};


  return (
    <div className={styles.donationRequestsPage}>
      <Header userType="orphanage" />

      {/* Banner */}
      <section className={styles.banner}>
        <img
          src="https://images.unsplash.com/photo-1524069290683-0457abfe42c3"
          alt="Orphanage banner"
          className={styles.bannerImage}
        />
      </section>

      <div className={styles.container}>
        <section className={styles.requestsSection}>
          <h1>Donation Requests</h1>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              onClick={() => setActiveTab("requests")}
              className={`${styles.tab} ${activeTab === "requests" ? styles.activeTab : ""}`}
            >
              Requests
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`${styles.tab} ${activeTab === "completed" ? styles.activeTab : ""}`}
            >
              Completed
            </button>
          </div>

          {/* Content */}
          <div className={styles.requestsList}>
            {loading ? (
              <p>Loading...</p>
            ) : activeTab === "requests" ? (
              pendingRequests.length ? (
                renderRequests(pendingRequests)
              ) : (
                <div className={styles.emptyState}>
                  <p>No pending requests at the moment.</p>
                </div>
              )
            ) : completedRequests.length ? (
              renderRequests(completedRequests)
            ) : (
              <div className={styles.emptyState}>
                <p>No completed requests yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ✅ Floating Add Button */}
      <button
        className={styles.floatingAddButton}
        onClick={() => window.location.href = "/add-requirement"}
      >
        <Plus size={28} />
      </button>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>SafeDonate Network</span>
        </div>
      </footer>
    </div>
  );
};

export default DonationRequestsPage;
