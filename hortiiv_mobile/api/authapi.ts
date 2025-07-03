import { apiFetch, setAuthToken, clearAuthToken } from "./index";

interface LoginData {
  contact_number: string;
  password: string;
}

// Login user and store token
export async function login(data: LoginData): Promise<void> {
  const response = await apiFetch("user/login/", {
    method: "POST",
    body: JSON.stringify(data),
    tokenRequired: false,
  });

  if (response.token) {
    await setAuthToken(response.token);
  } else {
    throw new Error("No token returned");
  }
}

// Logout user by clearing token
export async function logout(): Promise<void> {
  await clearAuthToken();
}
