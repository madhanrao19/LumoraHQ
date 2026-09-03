// Ported from lumora-academy's app/[lang]/(portal)/tutor/page.tsx.
// Safety rule (see TutorMessage in @/lib/types): `message.answer` is always
// rendered verbatim, exactly as returned — the backend has already
// substituted the safe fallback text for any non-Pass outcome before it
// reaches this response. `outcome` is display-only (a small badge below),
// never a signal to alter what text is shown.
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { Amber } from '@/constants/colors';
import { portalStyles } from '@/constants/portal-styles';
import { ApiError, apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { ApiCollection, ApiResource, TutorMessage } from '@/lib/types';

const QUESTION_MAX_LENGTH = 2000;

function OutcomeBadge({ outcome }: { outcome: TutorMessage['outcome'] }) {
  if (outcome === 'pass') return null;
  const label = outcome === 'escalate' ? 'flagged for review' : outcome;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export default function TutorScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TutorMessage[] | null>(null);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.role !== 'student') return;
    apiFetch<ApiCollection<TutorMessage>>(`/api/v1/students/${user.id}/tutor-messages`)
      .then((res) => setMessages([...res.data].reverse())) // newest-first -> chronological
      .catch(() => setError('Could not load your Tutor conversation.'));
  }, [user]);

  async function submit() {
    if (!question.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await apiFetch<ApiResource<TutorMessage>>('/api/v1/tutor/ask', {
        method: 'POST',
        body: { question },
      });
      setMessages((prev) => [...(prev ?? []), res.data]);
      setQuestion('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send that question.');
    } finally {
      setSending(false);
    }
  }

  if (user && user.role !== 'student') {
    return <Text style={[portalStyles.muted, portalStyles.container]}>Only Student accounts can use the Tutor.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <Text style={portalStyles.heading}>Tutor</Text>

      <View style={portalStyles.card}>
        {!messages && !error && <Text style={portalStyles.muted}>Loading…</Text>}
        {messages && messages.length === 0 && (
          <Text style={portalStyles.muted}>Ask the Tutor a question about your lessons to get started.</Text>
        )}
        {messages?.map((message) => (
          <View key={message.id} style={styles.turn}>
            <Text style={styles.question}>{message.question}</Text>
            <View style={styles.answerRow}>
              <Text style={styles.answer}>{message.answer}</Text>
              <OutcomeBadge outcome={message.outcome} />
            </View>
          </View>
        ))}
      </View>

      {error && <Text style={portalStyles.error}>{error}</Text>}

      <View style={styles.composer}>
        <View style={styles.input}>
          <FormField
            testID="tutor-question"
            label="Ask a question"
            value={question}
            onChangeText={setQuestion}
            maxLength={QUESTION_MAX_LENGTH}
            placeholder="Ask a question…"
          />
        </View>
        <Pressable
          testID="tutor-send"
          onPress={submit}
          disabled={sending || !question.trim()}
          style={[portalStyles.button, (sending || !question.trim()) && portalStyles.buttonDisabled]}
        >
          <Text style={portalStyles.buttonText}>{sending ? 'Sending…' : 'Send'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  turn: { gap: 4, marginBottom: 8 },
  question: { alignSelf: 'flex-end', fontWeight: '600' },
  answerRow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 },
  answer: { flexShrink: 1 },
  badge: {
    backgroundColor: Amber[100],
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: Amber[800], fontSize: 12 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1 },
});
