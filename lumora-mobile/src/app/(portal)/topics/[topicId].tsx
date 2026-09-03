// Ported from lumora-academy's app/[lang]/(portal)/topics/[topicId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { apiFetchCached } from '@/lib/api';
import type { ApiCollection, Assessment, Lesson } from '@/lib/types';

export default function TopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetchCached<ApiCollection<Lesson>>(`/api/v1/topics/${topicId}/lessons`, `lessons-${topicId}`),
      apiFetchCached<ApiCollection<Assessment>>(
        `/api/v1/topics/${topicId}/assessments`,
        `assessments-${topicId}`,
      ),
    ])
      .then(([lessonsRes, assessmentsRes]) => {
        setLessons(lessonsRes.data.data);
        setAssessments(assessmentsRes.data.data);
        setStale(lessonsRes.stale || assessmentsRes.stale);
      })
      .catch(() => setError("Could not load this topic's content."));
  }, [topicId]);

  if (error) return <Text style={portalStyles.error}>{error}</Text>;
  if (!lessons || !assessments) {
    return <Text style={[portalStyles.muted, portalStyles.container]}>Loading…</Text>;
  }

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Link href="/subjects" style={portalStyles.back}>
        ← Subjects
      </Link>
      {stale && (
        <Text style={portalStyles.muted}>You&apos;re offline — showing saved content.</Text>
      )}

      <View style={portalStyles.container}>
        <Text style={portalStyles.heading}>Lessons</Text>
        {lessons.length === 0 && <Text style={portalStyles.muted}>No published lessons yet.</Text>}
        {lessons.map((lesson) => (
          <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={portalStyles.card}>
            {lesson.title}
          </Link>
        ))}
      </View>

      <View style={portalStyles.container}>
        <Text style={portalStyles.subheading}>Assessments</Text>
        {assessments.length === 0 && (
          <Text style={portalStyles.muted}>No published assessments yet.</Text>
        )}
        {assessments.map((assessment) => (
          <Link key={assessment.id} href={`/assessments/${assessment.id}`} style={portalStyles.card}>
            {assessment.title}
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
