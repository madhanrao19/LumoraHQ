// Ported from lumora-academy's app/[lang]/(portal)/lessons/[lessonId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { ApiError, apiFetch, apiFetchCached } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { ApiResource, Lesson, LessonProgress } from '@/lib/types';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    apiFetchCached<ApiResource<Lesson>>(`/api/v1/lessons/${lessonId}`, `lesson-${lessonId}`)
      .then((res) => {
        setLesson(res.data.data);
        setStale(res.stale);
      })
      .catch(() => setError('Could not load this lesson.'));
  }, [lessonId]);

  async function markComplete() {
    setMarking(true);
    try {
      const res = await apiFetch<ApiResource<LessonProgress>>(
        `/api/v1/lessons/${lessonId}/progress`,
        { method: 'POST' },
      );
      setCompletedAt(res.data.completed_at);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not mark complete.');
    } finally {
      setMarking(false);
    }
  }

  if (error) return <Text style={portalStyles.error}>{error}</Text>;
  if (!lesson) return <Text style={[portalStyles.muted, portalStyles.container]}>Loading…</Text>;

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Link href={`/topics/${lesson.topic_id}`} style={portalStyles.back}>
        ← Back to topic
      </Link>
      {stale && (
        <Text style={portalStyles.muted}>You&apos;re offline — showing saved content.</Text>
      )}
      <Text style={portalStyles.heading}>{lesson.title}</Text>
      <Text>{lesson.body}</Text>
      {user?.role === 'student' && (
        <View>
          <Pressable
            style={[portalStyles.button, (marking || !!completedAt) && portalStyles.buttonDisabled]}
            onPress={markComplete}
            disabled={marking || !!completedAt}
          >
            <Text style={portalStyles.buttonText}>
              {completedAt ? 'Completed' : marking ? 'Marking…' : 'Mark complete'}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
