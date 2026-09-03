// Ported from lumora-academy's app/[lang]/(portal)/subjects/page.tsx.
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { apiFetchCached } from '@/lib/api';
import type { ApiCollection, Subject } from '@/lib/types';

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetchCached<ApiCollection<Subject>>('/api/v1/subjects', 'subjects')
      .then((res) => {
        setSubjects(res.data.data);
        setStale(res.stale);
      })
      .catch(() => setError('Could not load subjects.'));
  }, []);

  if (error) return <Text style={portalStyles.error}>{error}</Text>;
  if (!subjects) return <Text style={[portalStyles.muted, portalStyles.container]}>Loading subjects…</Text>;

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Text style={portalStyles.heading}>Subjects</Text>
      {stale && (
        <Text style={portalStyles.muted}>You&apos;re offline — showing saved content.</Text>
      )}
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/subjects/${subject.id}`} style={portalStyles.card}>
          {subject.name}
        </Link>
      ))}
    </ScrollView>
  );
}
