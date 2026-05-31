export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function adminFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AdminApiError(
      typeof data.error === "string" ? data.error : "Error en la solicitud",
      response.status,
    );
  }

  return data as T;
}

export async function adminUpload(
  file: File,
  folder: string,
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  return adminFetch<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
}
