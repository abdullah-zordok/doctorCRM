export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Array<Record<string, unknown>>;
};

export type PaginatedData<T> = {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type Role = "DOCTOR" | "SECRETARY";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
};

export type PatientSummary = {
  id: string;
  name: string;
  phone: string;
  clinicId: string;
  notes?: string | null;
  isActive: boolean;
};
