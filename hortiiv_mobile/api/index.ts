import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.8.106:8000/api"; // Change this to your backend URL

export async function getAuthToken(): Promise<string | null> {
  return await AsyncStorage.getItem("authToken");
}

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem("authToken", token);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem("authToken");
}

interface RequestOptions extends RequestInit {
  tokenRequired?: boolean;
}

export async function apiFetch(
  endpoint: string,
  options: RequestOptions = {}
): Promise<any> {
  const { tokenRequired = true, headers, ...restOptions } = options;

  const token = tokenRequired ? await getAuthToken() : null;

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...headers,
    },
    ...restOptions,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "API request failed");
  }

  return await response.json();
}
