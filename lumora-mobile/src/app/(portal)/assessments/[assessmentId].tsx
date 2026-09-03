// Ported from lumora-academy's app/[lang]/(portal)/assessments/[assessmentId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { Zinc } from '@/constants/colors';
import { portalStyles } from '@/constants/portal-styles';
import { ApiError, apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { ApiCollection, ApiResource, Assessment, AssessmentAttempt } from '@/lib/types';

export default function AssessmentScreen() {
  const { assessmentId } = useLocalSearchParams<{ assessmentId: string }>();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [result, setResult] = useState<AssessmentAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<ApiResource<Assessment>>(`/api/v1/assessments/${assessmentId}`, { auth: false })
      .then((res) => setAssessment(res.data))
      .catch(() => setError('Could not load this assessment.'));
  }, [assessmentId]);

  useEffect(() => {
    if (user?.role !== 'student') return;
    apiFetch<ApiCollection<AssessmentAttempt>>(`/api/v1/assessments/${assessmentId}/attempts`)
      .then((res) => setAttempts(res.data))
      .catch(() => {
        // Past attempts are a nice-to-have below the fold — a failure here
        // shouldn't block viewing/taking the assessment itself.
      });
  }, [assessmentId, user, result]);

  function setResponse(questionId: number, value: string) {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiFetch<ApiResource<AssessmentAttempt>>(
        `/api/v1/assessments/${assessmentId}/attempts`,
        { method: 'POST', body: { responses } },
      );
      setResult(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit this attempt.');
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !assessment) return <Text style={portalStyles.error}>{error}</Text>;
  if (!assessment) return <Text style={[portalStyles.muted, portalStyles.container]}>Loading…</Text>;

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Link href={`/topics/${assessment.topic_id}`} style={portalStyles.back}>
        ← Back to topic
      </Link>

      <Text style={portalStyles.heading}>{assessment.title}</Text>

      {result ? (
        <View style={portalStyles.card}>
          <Text style={portalStyles.subheading}>Score: {result.score}%</Text>
        </View>
      ) : (
        <View style={portalStyles.container}>
          {assessment.questions.map((question) => (
            <View key={question.id} style={portalStyles.card}>
              {question.options ? (
                <>
                  <Text style={styles.prompt}>{question.prompt}</Text>
                  <View style={styles.options}>
                    {Object.entries(question.options).map(([key, label]) => {
                      const selected = responses[question.id] === key;
                      return (
                        <Pressable
                          key={key}
                          onPress={() => setResponse(question.id, key)}
                          style={[styles.option, selected && styles.optionSelected]}
                        >
                          <Text>{label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              ) : (
                <FormField
                  label={question.prompt}
                  value={responses[question.id] ?? ''}
                  onChangeText={(text) => setResponse(question.id, text)}
                />
              )}
            </View>
          ))}

          {error && <Text style={portalStyles.error}>{error}</Text>}

          {user?.role === 'student' ? (
            <Pressable
              style={[portalStyles.button, submitting && portalStyles.buttonDisabled]}
              onPress={submit}
              disabled={submitting}
            >
              <Text style={portalStyles.buttonText}>{submitting ? 'Submitting…' : 'Submit'}</Text>
            </Pressable>
          ) : (
            <Text style={portalStyles.muted}>Only students can take assessments.</Text>
          )}
        </View>
      )}

      {user?.role === 'student' && attempts.length > 0 && (
        <View style={portalStyles.container}>
          <Text style={portalStyles.subheading}>Past attempts</Text>
          {attempts.map((attempt) => (
            <View key={attempt.id} style={portalStyles.card}>
              <Text>
                Score: {attempt.score}%
                {attempt.completed_at && ` — ${new Date(attempt.completed_at).toLocaleString()}`}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  prompt: { fontWeight: '600', marginBottom: 8 },
  options: { gap: 8 },
  option: {
    borderWidth: 1,
    borderColor: Zinc[200],
    borderRadius: 6,
    padding: 10,
  },
  optionSelected: { borderColor: Zinc[900], backgroundColor: Zinc[100] },
});
