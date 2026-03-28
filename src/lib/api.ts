const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TIMEOUT_MS = 8000;

function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}, signal?: AbortSignal) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getCookie("auth-token");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Merge external signal with timeout signal
    const combinedSignal = signal ?? controller.signal;

    try {
        const response = await fetch(url, {
            ...options,
            signal: combinedSignal,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });

        if (response.status === 401) {
            // Token expired — clear and redirect to login
            if (typeof document !== 'undefined') {
                document.cookie = 'auth-token=; path=/; max-age=0';
                window.location.href = '/login?returnUrl=' + encodeURIComponent(window.location.pathname);
            }
            throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed (${response.status})`);
        }

        return response.json();
    } finally {
        clearTimeout(timeout);
    }
}
