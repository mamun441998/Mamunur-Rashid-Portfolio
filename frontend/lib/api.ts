const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export async function fetcher<T>(endpoint: string): Promise<T> {
  // Ensure endpoint starts with a single slash '/'
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching so dynamic backend updates show instantly
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error(`Fetch failed for URL: ${url} with Status: ${res.status}`);
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`API Fetch Error on [${url}]:`, error);
    throw error;
  }
}