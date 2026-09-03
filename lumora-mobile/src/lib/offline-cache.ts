// Read-only content cache for offline viewing (ADR-0026: "lessons and
// assessments already fetched remain viewable/usable without connectivity").
// AsyncStorage rather than expo-secure-store: this holds curriculum content
// (potentially large, not sensitive), not a credential — SecureStore is
// sized and intended for small secrets like the auth token, not bulk cache.
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "lumora_cache_";

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // A corrupt cache entry or storage failure just means no cached
    // fallback is available — never let a cache read crash the screen.
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Best-effort — offline caching is a nicety on top of the real
    // network fetch, never a reason to fail an otherwise-successful one.
  }
}
