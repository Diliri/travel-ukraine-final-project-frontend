export interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// NEXT_PUBLIC_MOCK_PROFILE=true у .env.local — запити «на місці», без бекенду (для перевірки верстки/логіки)
export const MOCK = process.env.NEXT_PUBLIC_MOCK_PROFILE === "true";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockUser: ProfileUser = {
  _id: "mock-user",
  name: "Олена Мандрівниця",
  email: "olena@example.com",
};
export const getMockUser = () => mockUser;

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: "include" });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? "Щось пішло не так");
  return data as T;
}

export async function updateProfile(body: { name: string; email: string }): Promise<ProfileUser> {
  if (MOCK) {
    await wait(700);
    if (body.email === "taken@test.com") throw new Error("Цей email вже використовується");
    mockUser = { ...mockUser, ...body };
    return mockUser;
  }
  return request<ProfileUser>("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function uploadAvatar(file: File): Promise<ProfileUser> {
  if (MOCK) {
    await wait(900);
    mockUser = { ...mockUser, avatarUrl: URL.createObjectURL(file) };
    return mockUser;
  }
  const formData = new FormData();
  formData.append("avatar", file);
  return request<ProfileUser>("/api/users/avatar", { method: "PATCH", body: formData });
}

export async function updatePassword(body: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  if (MOCK) {
    await wait(700);
    if (body.currentPassword === "wrong") throw new Error("Поточний пароль невірний");
    return { message: "Password updated" };
  }
  return request<{ message: string }>("/api/users/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
