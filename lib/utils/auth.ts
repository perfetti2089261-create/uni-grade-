export async function getAuthToken(): Promise<string | null> {
  // Prova a ottenere il token dalla sessione corrente
  const authHeader = (typeof window !== 'undefined') 
    ? localStorage.getItem('supabase.auth.token')
    : null;
  
  return authHeader;
}

export async function fetchWithAuth(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  try {
    // Dinamico import di supabase solo se in browser
    if (typeof window !== 'undefined') {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No session found. Please log in.');
      }

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return fetch(url, options);
  } catch (error) {
    console.error('fetchWithAuth error:', error);
    throw error;
  }
}
