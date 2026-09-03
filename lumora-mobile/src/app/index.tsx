import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

// Ported from lumora-academy's app/[lang]/page.tsx: a plain landing page with
// links, not auth-gated (the portal group below handles that).
export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Lumora Academy
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Student and parent portal.
        </ThemedText>
        <ThemedView style={styles.links}>
          <Link href="/login">
            <ThemedText type="linkPrimary">Log in</ThemedText>
          </Link>
          <Link href="/register">
            <ThemedText type="linkPrimary">Register</ThemedText>
          </Link>
          <Link href="/subjects">
            <ThemedText type="linkPrimary">Browse subjects</ThemedText>
          </Link>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
});
