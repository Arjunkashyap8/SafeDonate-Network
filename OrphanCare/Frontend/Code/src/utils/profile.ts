// src/utils/profile.ts
import { apiClient } from './api';
import { authService } from './auth';

export interface DonorProfileData {
  full_name: string;
  address: string;
  phone_number: string;
}

export interface OrphanageProfileData {
  orphanage_name: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone_number: string;
  email: string;
  total_orphans: number;
  boys_count: number;
  girls_count: number;
  students_count: number;
  description: string;
  established_on?: string;
  registration_number?: string;
  banner_image?: File;
  registration_proof?: File;
  // Bank details
  bank_name?: string;
  account_type?: string;
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
}

export interface RequirementData {
  title: string;
  description: string;
  quantity: number;
  category: string;
  image?: File;
}

export interface DonationData {
  requirement: number;
  donation_message: string;
}

class ProfileService {
  // ===== DONOR PROFILE =====
  async createDonorProfile(profileData: DonorProfileData): Promise<{ 
    success: boolean; 
    message: string;
    profile?: any;
  }> {
    const response = await apiClient.post('/donor/profile/', profileData);

    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || 'Profile created successfully',
        profile: response.data.profile,
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to create profile',
    };
  }

  async getDonorProfile(): Promise<{ 
    success: boolean; 
    data?: any;
    message?: string;
  }> {
    const response = await apiClient.get('/donor/profile/');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to fetch profile',
    };
  }

  // ===== ORPHANAGE PROFILE =====
  async createOrphanageProfile(profileData: OrphanageProfileData): Promise<{ 
    success: boolean; 
    message: string;
    profile?: any;
  }> {
    const formData = new FormData();

    const token = localStorage.getItem("sessionToken");
    console.log("token",token)
    
    // Required fields
    formData.append('orphanage_name', profileData.orphanage_name);
    formData.append('address', profileData.address);
    formData.append('phone_number', profileData.phone_number);
    formData.append('email', profileData.email);
    formData.append('total_orphans', profileData.total_orphans.toString());
    formData.append('boys_count', profileData.boys_count.toString());
    formData.append('girls_count', profileData.girls_count.toString());
    formData.append('students_count', profileData.students_count.toString());
    formData.append('description', profileData.description);
    
    // Optional location fields
    if (profileData.city) {
      formData.append('city', profileData.city);
    }
    if (profileData.state) {
      formData.append('state', profileData.state);
    }
    if (profileData.pincode) {
      formData.append('pincode', profileData.pincode);
    }
    
    // Other optional fields
    if (profileData.established_on) {
      formData.append('established_on', profileData.established_on);
    }
    if (profileData.registration_number) {
      formData.append('registration_no', profileData.registration_number);
    }
    
    // Bank details
    if (profileData.bank_name) {
      formData.append('bank_name', profileData.bank_name);
    }
    if (profileData.account_type) {
      formData.append('account_type', profileData.account_type);
    }
    if (profileData.account_holder_name) {
      formData.append('account_holder_name', profileData.account_holder_name);
    }
    if (profileData.account_number) {
      formData.append('account_number', profileData.account_number);
    }
    if (profileData.ifsc_code) {
      formData.append('ifsc_code', profileData.ifsc_code);
    }
    
    // Files
    if (profileData.banner_image) {
      formData.append('banner_image', profileData.banner_image);
    }
    if (profileData.registration_proof) {
      formData.append('registration_proof', profileData.registration_proof);
    }

    const response = await apiClient.uploadFile('/orphanage/create/', formData);

    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || 'Profile created successfully',
        profile: response.data.profile,
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to create profile',
    };
  }

  async updateOrphanageProfile(
    profileId: number, 
    profileData: OrphanageProfileData
  ): Promise<{ 
    success: boolean; 
    message: string;
    profile?: any;
  }> {
    const formData = new FormData();
    
    // Required fields
    formData.append('orphanage_name', profileData.orphanage_name);
    formData.append('address', profileData.address);
    formData.append('phone_number', profileData.phone_number);
    formData.append('email', profileData.email);
    formData.append('no_of_orphans', profileData.no_of_orphans.toString());
    formData.append('boy_count', profileData.boy_count.toString());
    formData.append('girl_count', profileData.girl_count.toString());
    formData.append('student_count', profileData.student_count.toString());
    formData.append('description', profileData.description);
    
    // Optional location fields
    if (profileData.city) {
      formData.append('city', profileData.city);
    }
    if (profileData.state) {
      formData.append('state', profileData.state);
    }
    if (profileData.pincode) {
      formData.append('pincode', profileData.pincode);
    }
    
    // Other optional fields
    if (profileData.established_date) {
      formData.append('established_date', profileData.established_date);
    }
    if (profileData.registration_number) {
      formData.append('registration_number', profileData.registration_number);
    }
    
    // Bank details
    if (profileData.bank_name) {
      formData.append('bank_name', profileData.bank_name);
    }
    if (profileData.account_type) {
      formData.append('account_type', profileData.account_type);
    }
    if (profileData.account_holder_name) {
      formData.append('account_holder_name', profileData.account_holder_name);
    }
    if (profileData.account_number) {
      formData.append('account_number', profileData.account_number);
    }
    if (profileData.ifsc_code) {
      formData.append('ifsc_code', profileData.ifsc_code);
    }
    
    // Files
    if (profileData.banner_image) {
      formData.append('banner_image', profileData.banner_image);
    }
    if (profileData.registration_proof) {
      formData.append('registration_proof', profileData.registration_proof);
    }

    const response = await apiClient.uploadFile(
      `/orphanage/profile/${profileId}/`, 
      formData
    );

    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully',
        profile: response.data.profile,
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to update profile',
    };
  }

async getOrphanageProfile(): Promise<{ 
  success: boolean; 
  data?: any;
  message?: string;
}> {
  const endpoint = `/orphanage/me`;

  // apiClient.get() already handles sending the Bearer token from localStorage
  const response = await apiClient.get(endpoint);

  if (response.success && response.data) {
    return {
      success: true,
      data: response.data,
    };
  }

  return {
    success: false,
    message: response.error || 'Failed to fetch profile',
  };
}


  // ===== REQUIREMENTS =====
  async addRequirement(requirementData: RequirementData): Promise<{ 
    success: boolean; 
    message: string;
    requirement_id?: number;
  }> {
    const formData = new FormData();
    
    formData.append('title', requirementData.title);
    formData.append('description', requirementData.description);
    formData.append('quantity', requirementData.quantity.toString());
    formData.append('category', requirementData.category);
    
    if (requirementData.image) {
      formData.append('image', requirementData.image);
    }

    const response = await apiClient.uploadFile('/orphanage/requirements/', formData);

    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || 'Requirement added successfully',
        requirement_id: response.data.requirement_id,
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to add requirement',
    };
  }

  async getRequirements(): Promise<{ 
    success: boolean; 
    data?: any[];
    message?: string;
  }> {
    const response = await apiClient.get('/donor/requirements/');

    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data],
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to fetch requirements',
    };
  }

  // ===== DONATIONS =====
  async createDonation(donationData: DonationData): Promise<{ 
    success: boolean; 
    message: string;
    status?: string;
  }> {
    const response = await apiClient.post('/donor/donations/', donationData);

    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || 'Donation recorded successfully',
        status: response.data.status,
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to create donation',
    };
  }

  async updateDonationStatus(
    donationId: number, 
    status: 'completed' | 'pending'
  ): Promise<{ 
    success: boolean; 
    message: string;
  }> {
    const response = await apiClient.put(
      `/orphanage/donations/${donationId}/`, 
      { status }
    );

    if (response.success && response.data) {
      return {
        success: true,
        message: response.data.message || 'Donation status updated',
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to update donation status',
    };
  }

  async getDonations(): Promise<{ 
    success: boolean; 
    data?: any[];
    message?: string;
  }> {
    const response = await apiClient.get('/donor/donations/');

    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data],
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to fetch donations',
    };
  }

  async getOrphanageDonations(): Promise<{ 
    success: boolean; 
    data?: any[];
    message?: string;
  }> {
    const response = await apiClient.get('/orphanage/donations/');

    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : [response.data],
      };
    }

    return {
      success: false,
      message: response.error || 'Failed to fetch donations',
    };
  }
}

export const profileService = new ProfileService();