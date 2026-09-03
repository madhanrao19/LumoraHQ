// Ported from lumora-academy's app/[lang]/(portal)/students/[studentId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { apiFetch } from '@/lib/api';
import type { ApiCollection, AssessmentAttempt, LessonProgress } from '@/lib/types';

export default function StudentDetailScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [progress, setProgress] = useState<LessonProgress[] | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiCollection<LessonProgress>>(`/api/v1/students/${studentId}/progress`),
      apiFetch<ApiCollection<AssessmentAttempt>>(`/api/v1/students/${studentId}/attempts`),
    ])
      .then(([progressRes, attemptsRes]) => {
        setProgress(progressRes.data);
        setAttempts(attemptsRes.data);
      })
      .catch(() => setError("Could not load this student's data."));
  }, [studentId]);

  if (error) return <Text style={portalStyles.error}>{error}</Text>;
  if (!progress || !attempts) {
    return <Text style={[portalStyles.muted, portalStyles.container]}>Loading…</Text>;
  }

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Link href="/students" style={portalStyles.back}>
        ← My students
      </Link>

      <View style={portalStyles.container}>
        <Text style={portalStyles.heading}>Lesson progress</Text>
        {progress.length === 0 && <Text style={portalStyles.muted}>No lessons completed yet.</Text>}
        {progress.map((p) => (
          <View key={p.id} style={portalStyles.card}>
            <Text>
              Lesson #{p.lesson_id} —{' '}
              {p.completed_at ? `completed ${new Date(p.completed_at).toLocaleString()}` : 'in progress'}
            </Text>
          </View>
        ))}
      </View>

      <View style={portalStyles.container}>
        <Text style={portalStyles.subheading}>Assessment attempts</Text>
        {attempts.length === 0 && <Text style={portalStyles.muted}>No assessment attempts yet.</Text>}
        {attempts.map((a) => (
          <View key={a.id} style={portalStyles.card}>
            <Text>
              Assessment #{a.assessment_id} — score: {a.score ?? 'not yet scored'}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
