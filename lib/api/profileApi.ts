export interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount?: number;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: "include" });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message ?? "Щось пішло не так. Спробуйте ще раз", res.status);
  }
  return data as T;
}

export const fetchCurrentUser = () =>
  request<ProfileUser>("/api/users/me", { method: "GET", cache: "no-store" });

export const updateProfile = (body: { name: string; email: string }) =>
  request<ProfileUser>("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return request<ProfileUser>("/api/users/avatar", { method: "PATCH", body: formData });
};

export const updatePassword = (body: { currentPassword: string; newPassword: string }) =>
  request<{ message: string }>("/api/users/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
