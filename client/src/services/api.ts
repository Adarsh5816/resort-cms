const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('resort_cms_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('resort_cms_token', token);
}

export function clearStoredToken() {
  localStorage.removeItem('resort_cms_token');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    targetResortId?: string;
  } = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.targetResortId) {
    headers['X-Target-Resort-ID'] = options.targetResortId;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return data as T;
}

export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = getStoredToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
}
