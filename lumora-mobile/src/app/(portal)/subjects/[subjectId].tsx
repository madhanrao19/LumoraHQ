// Ported from lumora-academy's app/[lang]/(portal)/subjects/[subjectId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { apiFetch } from '@/lib/api';
import type { ApiCollection, Topic } from '@/lib/types';

export default function SubjectTopicsScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ApiCollection<Topic>>(`/api/v1/topics?subject_id=${subjectId}`, {
      auth: false,
    })
      .then((res) => setTopics(res.data))
      .catch(() => setError('Could not load topics.'));
  }, [subjectId]);

  if (error) return <Text style={portalStyles.error}>{error}</Text>;
  if (!topics) return <Text style={[portalStyles.muted, portalStyles.container]}>Loading topics…</Text>;

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Link href="/subjects" style={portalStyles.back}>
        ← Subjects
      </Link>
      <Text style={portalStyles.heading}>Topics</Text>
      {topics.length === 0 && <Text style={portalStyles.muted}>No topics in this subject yet.</Text>}
      {topics.map((topic) => (
        <Link key={topic.id} href={`/topics/${topic.id}`} style={portalStyles.card}>
          {topic.name}
        </Link>
      ))}
    </ScrollView>
  );
}
