// Ported from lumora-academy's app/[lang]/(portal)/topics/[topicId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { apiFetch } from '@/lib/api';
import type { ApiCollection, Assessment, Lesson } from '@/lib/types';

export default function TopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiCollection<Lesson>>(`/api/v1/topics/${topicId}/lessons`, { auth: false }),
      apiFetch<ApiCollection<Assessment>>(`/api/v1/topics/${topicId}/assessments`, {
        auth: false,
      }),
    ])
      .then(([lessonsRes, assessmentsRes]) => {
        setLessons(lessonsRes.data);
        setAssessments(assessmentsRes.data);
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
        {/* Browsing only — taking an assessment is a separate, later slice. */}
        {assessments.map((assessment) => (
          <View key={assessment.id} style={portalStyles.card}>
            <Text>{assessment.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
