import { apiClient } from "../utils/api";

export const updateDonationStatus = async (
  id: string,
  donor,
  orphanage,
  item_name,
  status: "accepted" | "cancelled"
) => {
  try {
    const token = localStorage.getItem("sessionToken");

    const res = await fetch(`http://172.16.20.43:8000/api/donation/${id}/update-status/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        donor: donor,
        orphanage: orphanage,
        item_name: item_name,
        status: status
      })
    });

    const data = await res.json();
    console.log("status update->>>",data)
    return {
      success: res.ok,
      data
    };
  } catch (error) {
    console.error("Status update error:", error);
    return { success: false };
  }
};


export const getMyDonationRequests = async () => {
    try{

    
    const token = localStorage.getItem("sessionToken");
    const res = await fetch("http://172.16.20.43:8000/api/donation/received/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await res.json()
       return {
      success: res.ok,
      data,
    };
  } catch (err) {
    console.error("Error fetching donation requests", err);
    return { success: false, data: [] };
  }
};

export const approveDonation = async (id: string) => {
  return await apiClient.post(`/donation/${id}/approve/`);
};

export const rejectDonation = async (id: string) => {
  return await apiClient.post(`/donation/${id}/reject/`);
};


export const requirementService = {
  async createRequirement(payload: any) {
    try {
      const token = localStorage.getItem("sessionToken");

      const res = await fetch("http://172.16.20.43:8000/api/requirement/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      return { ok: res.ok, data };
    } catch (err) {
      console.error("Create requirement error:", err);
      return { ok: false, error: err };
    }
  }
};
