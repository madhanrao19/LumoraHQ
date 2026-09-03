// Ported from lumora-academy's app/[lang]/(portal)/students/[studentId]/page.tsx.
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { portalStyles } from '@/constants/portal-styles';
import { apiFetch } from '@/lib/api';
import type {
  AiGatewayLog,
  ApiCollection,
  AssessmentAttempt,
  LessonProgress,
  TutorMessage,
} from '@/lib/types';

// Filament's admin resource (AiGatewayLogInfolist) shows full output only in
// a detail view and omits it from the list; this is a lighter equivalent for
// a first version — truncate inline, no separate detail route.
const AUDIT_OUTPUT_PREVIEW_LENGTH = 200;

function truncateOutput(output: string): string {
  return output.length > AUDIT_OUTPUT_PREVIEW_LENGTH
    ? `${output.slice(0, AUDIT_OUTPUT_PREVIEW_LENGTH)}… [truncated]`
    : output;
}

export default function StudentDetailScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [progress, setProgress] = useState<LessonProgress[] | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[] | null>(null);
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[] | null>(null);
  const [auditLogs, setAuditLogs] = useState<AiGatewayLog[] | null>(null);
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

  useEffect(() => {
    apiFetch<ApiCollection<TutorMessage>>(`/api/v1/students/${studentId}/tutor-messages`)
      .then((res) => setTutorMessages([...res.data].reverse())) // newest-first -> chronological
      .catch(() => {
        // A 403 here (unlinked student) or any other failure just means this
        // read-only section stays empty — it shouldn't block the progress/
        // attempts sections above, which have their own access check.
      });
  }, [studentId]);

  useEffect(() => {
    apiFetch<ApiCollection<AiGatewayLog>>(`/api/v1/students/${studentId}/audit-logs`)
      .then((res) => setAuditLogs(res.data)) // already newest-first from the API
      .catch(() => {
        // A 403 here (Student token, or an unlinked Parent) is expected and
        // must never surface as a distinct error — UserPolicy::viewAuditLog
        // deliberately excludes Students from this, even for their own ID
        // (ADR-0021). Same silent-empty precedent as Tutor conversation above.
      });
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

      <View style={portalStyles.container}>
        <Text style={portalStyles.subheading}>Tutor conversation</Text>
        {tutorMessages === null && <Text style={portalStyles.muted}>Loading…</Text>}
        {tutorMessages && tutorMessages.length === 0 && (
          <Text style={portalStyles.muted}>No Tutor conversation yet.</Text>
        )}
        {tutorMessages?.map((message) => (
          <View key={message.id} style={portalStyles.card}>
            <Text style={{ fontWeight: '600' }}>{message.question}</Text>
            <Text>
              {message.answer}
              {message.outcome !== 'pass' &&
                `  [${message.outcome === 'escalate' ? 'flagged for review' : message.outcome}]`}
            </Text>
          </View>
        ))}
      </View>

      <View style={portalStyles.container}>
        <Text style={portalStyles.subheading}>Audit log</Text>
        {auditLogs === null && <Text style={portalStyles.muted}>Loading…</Text>}
        {auditLogs && auditLogs.length === 0 && (
          <Text style={portalStyles.muted}>No AI Gateway activity yet.</Text>
        )}
        {auditLogs?.map((log) => (
          <View key={log.id} style={portalStyles.card}>
            <Text style={{ fontWeight: '600' }}>
              {log.prompt_key} — {log.tier} / {log.provider}
              {log.model ? ` / ${log.model}` : ''} — {log.status}
            </Text>
            <Text style={portalStyles.muted}>{new Date(log.created_at).toLocaleString()}</Text>
            <Text>{truncateOutput(log.output)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
