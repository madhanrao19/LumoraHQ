// Ported from lumora-academy's app/[lang]/(portal)/students/page.tsx.
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { portalStyles } from '@/constants/portal-styles';
import { ApiError, apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { ApiCollection, ApiResource, User } from '@/lib/types';

export default function StudentsScreen() {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function loadStudents() {
    apiFetch<ApiCollection<User>>('/api/v1/students')
      .then((res) => setStudents(res.data))
      .catch(() => setError('Could not load students.'));
  }

  useEffect(loadStudents, []);

  async function handleSubmit() {
    setFormErrors({});
    setSubmitting(true);
    try {
      await apiFetch<ApiResource<User>>('/api/v1/students', {
        method: 'POST',
        body: { name, email, password, password_confirmation: passwordConfirmation },
      });
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      loadStudents();
    } catch (err) {
      setFormErrors(
        err instanceof ApiError && err.errors ? err.errors : { name: ['Could not create student.'] },
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (user && user.role !== 'parent') {
    return <Text style={[portalStyles.muted, portalStyles.container]}>Only Parent accounts have students.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={portalStyles.container}>
      <View style={portalStyles.container}>
        <Text style={portalStyles.heading}>My students</Text>
        {error && <Text style={portalStyles.error}>{error}</Text>}
        {!students && !error && <Text style={portalStyles.muted}>Loading…</Text>}
        {students && students.length === 0 && <Text style={portalStyles.muted}>No students linked yet.</Text>}
        {students?.map((student) => (
          <Link key={student.id} href={`/students/${student.id}`} style={portalStyles.card}>
            {student.name} ({student.email})
          </Link>
        ))}
      </View>

      <View style={portalStyles.container}>
        <Text style={portalStyles.subheading}>Add a student</Text>
        <FormField
          testID="name"
          label="Name"
          value={name}
          onChangeText={setName}
          errors={formErrors.name}
        />
        <FormField
          testID="email"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          errors={formErrors.email}
        />
        <FormField
          testID="password"
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          errors={formErrors.password}
        />
        <FormField
          testID="password_confirmation"
          label="Confirm password"
          secureTextEntry
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
        <Pressable
          style={[portalStyles.button, submitting && portalStyles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={portalStyles.buttonText}>{submitting ? 'Adding…' : 'Add student'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
