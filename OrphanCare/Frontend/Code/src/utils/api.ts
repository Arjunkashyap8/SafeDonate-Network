// src/utils/api.ts
// Base API configuration for your Django backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://172.16.20.43:8000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 🔹 Always load fresh token from localStorage
  private getToken(): string | null {
    return localStorage.getItem("sessionToken"); // unified token key
  }

  // 🔹 Standard headers
  private getHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // 🔹 Multipart headers (NO content-type)
  private getMultipartHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // 🔹 Generic API request handler
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = this.getToken();

      const headers = {
        ...(options.headers || {}),
        ...(options.method === "POST" &&
        options.body instanceof FormData
          ? this.getMultipartHeaders()
          : this.getHeaders()),
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Request failed",
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      console.error("API request error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  }

  // 🔹 Upload file with FormData
  async uploadFile(endpoint: string, formData: FormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getMultipartHeaders(),
        body: formData, // browser sets multipart boundary automatically
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || "Upload failed" };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("File upload error:", error);
      return { success: false, error: "Network error" };
    }
  }

  // GET
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT
  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
