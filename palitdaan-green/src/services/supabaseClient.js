// Supabase Lightweight REST Client & Configuration
// Zero-dependency implementation so it runs seamlessly on Termux and offline tablets,
// while remaining fully compatible with your Supabase cloud backend when configured.

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};

export const isSupabaseConfigured = Boolean(
  supabaseConfig.url &&
  supabaseConfig.anonKey &&
  supabaseConfig.url !== 'https://your-project.supabase.co'
);

/**
 * Universal Supabase query helper using browser-native fetch.
 * Works out-of-the-box without requiring heavy external node_modules.
 */
export async function supabaseRestQuery(endpoint, options = {}) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const url = `${supabaseConfig.url}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': supabaseConfig.anonKey,
    'Authorization': `Bearer ${supabaseConfig.anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation',
    ...options.headers
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Supabase error (${res.status}): ${errText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Supabase query failed:', err);
    throw err;
  }
}
