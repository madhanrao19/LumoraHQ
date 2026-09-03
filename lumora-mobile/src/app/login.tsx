// Ported from lumora-academy's app/[lang]/login/page.tsx.
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { portalStyles } from '@/constants/portal-styles';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setErrors({});
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? { email: [err.message] });
      } else {
        setErrors({ email: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={portalStyles.container}>
      <Text style={portalStyles.heading}>Log in</Text>
      <FormField
        testID="email"
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        errors={errors.email}
      />
      <FormField
        testID="password"
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        errors={errors.password}
      />
      <Pressable
        testID="submit"
        style={[portalStyles.button, submitting && portalStyles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={portalStyles.buttonText}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Text>
      </Pressable>
      <Text style={portalStyles.muted}>
        No account?{' '}
        <Link href="/register" style={portalStyles.link}>
          Register as a parent
        </Link>
      </Text>
    </View>
  );
}
