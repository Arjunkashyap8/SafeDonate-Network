import { supabase } from './supabase';

const API_BASE_URL = `http://172.16.20.43:8000/api`;

export interface RegisterData {
  email: string;
  password: string;
  role: 'donor' | 'orphanage';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'donor' | 'orphanage';
  isVerified: boolean;
}

class AuthService {
  private sessionToken: string | null = null;
  private currentUser: AuthUser | null = null;

  constructor() {
    // Load session from localStorage on initialization
    this.loadSession();
  }

  private loadSession() {
    const token = localStorage.getItem('sessionToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      this.sessionToken = token;
      // this.currentUser = JSON.parse(user);
    }
  }

  private saveSession(token: string, user: AuthUser) {
    this.sessionToken = token;
    this.currentUser = user;
    localStorage.setItem('sessionToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearSession() {
    this.sessionToken = null;
    this.currentUser = null;
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
  }

// --- replace the register method in src/utils/auth.ts with the following --- 
async register(data: RegisterData): Promise<{ success: boolean; message: string; accountId?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log("-------->",JSON.stringify(result))
      return { success: false, message: JSON.stringify(result) || 'Registration failed' };
    }

    // persist registered account id for onboarding flow BEFORE returning
    if (result.accountId) {
      try {
        localStorage.setItem('registeredAccountId', result.accountId);
      } catch (e) {
        console.warn('Could not persist registeredAccountId to localStorage', e);
      }
    }

    return { 
      success: true, 
      message: result.message,
      accountId: result.accountId 
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}


  async verifyEmail(data: VerifyEmailData): Promise<{ success: boolean; message: string; role?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, message: JSON.stringify(result) };
      }

      return { 
        success: true, 
        message: result.message,
        role: result.role 
      };
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  async login(
  data: LoginData
): Promise<{ success: boolean; message: string; user?: AuthUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.detail || "Login failed" };
    }

    // Extract tokens
    const accessToken = result.access || null;
    const refreshToken = result.refresh || null;
    const role = result.role || null;

    if (!accessToken || !refreshToken || !role) {
      return { success: false, message: "Invalid login response" };
    }

    // Save tokens
    localStorage.setItem("sessionToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Build the real user object
    const user: AuthUser = {
      id: "unknown",       // If needed, fetch in a /me/ call later
      email: data.email,
      role: role,          // ⭐ Now coming from backend
      isVerified: true     // adjust if needed
    };

    // Save user in storage
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Update state
    this.sessionToken = accessToken;
    this.currentUser = user;

    return {
      success: true,
      message: "Login successful",
      user: user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}



  logout() {
    this.clearSession();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getSessionToken(): string | null {
    return this.sessionToken;
  }

  isAuthenticated(): boolean {
    return this.sessionToken !== null && this.currentUser !== null;
  }
}

export const authService = new AuthService();