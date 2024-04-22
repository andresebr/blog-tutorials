const API_ENDPOINT = "/api/contact";

export default async function handleSendEmail(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{ data?: unknown; message?: string; error?: string }> {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
