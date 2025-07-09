// services/productApi.ts
import { API_BASE_URL, getAuthToken } from "./index";

export async function uploadProduct(data: {
  name: string;
  stock: string;
  price: string;
  description: string;
  imageUri: string;
}): Promise<any> {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("stock", data.stock);
  formData.append("price", data.price);
  formData.append("description", data.description);
  formData.append("image", {
    uri: data.imageUri,
    name: "product.jpg",
    type: "image/jpeg",
  } as any);

  const response = await fetch(`${API_BASE_URL}/product/create/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  });

  const rawText = await response.text();
  console.log("🧾 Raw server response:", rawText);

  if (!response.ok) {
    throw new Error(`Upload failed. Status: ${response.status}`);
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Server did not return valid JSON.");
  }
}
export async function getMyProducts(): Promise<any[]> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/product/list/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch products: ${text}`);
  }

  return await response.json();
}
