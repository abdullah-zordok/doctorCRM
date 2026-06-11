import { clearStoredToken, getStoredToken } from "@/lib/storage";
import type { ApiFailure, ApiSuccess, AuthUser, PaginatedData, PatientSummary } from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: ApiFailure;

  constructor(status: number, details: ApiFailure) {
    super(details.message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const token = options.token ?? getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const payload = (await response.json().catch(() => ({
    success: false,
    message: "Unexpected server response"
  }))) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !payload.success) {
    if (response.status === 401) {
      clearStoredToken();
    }
    throw new ApiError(response.status, payload as ApiFailure);
  }

  return payload.data;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  user: AuthUser;
};

export const api = {
  login(payload: LoginPayload) {
    return request<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      token: null
    });
  },
  me() {
    return request<AuthUser>("/auth/me");
  },
  logout() {
    return request<Record<string, never>>("/auth/logout", {
      method: "POST"
    });
  },
  searchPatients(search: string) {
    const params = new URLSearchParams({
      search,
      page: "1",
      pageSize: "6",
      isActive: "true"
    });

    return request<PaginatedData<PatientSummary>>(`/patients?${params.toString()}`);
  }
};
