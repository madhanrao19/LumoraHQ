// Ported from lumora-academy's app/[lang]/(portal)/layout.tsx: an
// authenticated shell (nav + logout) that redirects to /login when there's
// no session.
// ponytail: expo-router's <Redirect> is the native equivalent of the web
// version's client useEffect + router.replace guard — no need to replicate
// that pattern once the framework hands it to us directly. Same caveat as
// the web version: this is a v1 client-side check, not a real access
// boundary — the robust follow-up is a server-verified session.
import { Link, Redirect, Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Zinc } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

export default function PortalLayout() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    if (!loading) return <Redirect href="/login" />;
    return (
      <View style={styles.loading}>
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={['top']} style={styles.nav}>
        <View style={styles.navLinks}>
          <Link href="/subjects" style={styles.brand}>
            Lumora Academy
          </Link>
          <Link href="/subjects" style={styles.navLink}>
            Subjects
          </Link>
          {user.role === 'parent' && (
            <Link href="/students" style={styles.navLink}>
              My students
            </Link>
          )}
          {user.role === 'student' && (
            <Link href="/tutor" style={styles.navLink}>
              Tutor
            </Link>
          )}
        </View>
        <View style={styles.navRight}>
          <Text style={styles.muted}>
            {user.name} ({user.role})
          </Text>
          <Pressable
            style={styles.logoutButton}
            onPress={() => logout().then(() => router.replace('/login'))}
          >
            <Text>Log out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: Zinc[500] },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Zinc[200],
    flexWrap: 'wrap',
    gap: 8,
  },
  navLinks: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  navRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  brand: { fontWeight: '600' },
  navLink: { textDecorationLine: 'underline' },
  logoutButton: {
    borderWidth: 1,
    borderColor: Zinc[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
