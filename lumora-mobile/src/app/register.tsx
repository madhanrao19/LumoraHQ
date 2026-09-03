// Ported from lumora-academy's app/[lang]/register/page.tsx.
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { portalStyles } from '@/constants/portal-styles';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setErrors({});
    setSubmitting(true);
    try {
      await register(name, email, password, passwordConfirmation);
      router.replace('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.errors ?? { name: [err.message] });
      } else {
        setErrors({ name: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={portalStyles.container}>
      <Text style={portalStyles.heading}>Register (Parent account)</Text>
      <FormField
        testID="name"
        label="Name"
        value={name}
        onChangeText={setName}
        errors={errors.name}
      />
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
        <Text style={portalStyles.buttonText}>
          {submitting ? 'Creating account…' : 'Register'}
        </Text>
      </Pressable>
      <Text style={portalStyles.muted}>
        Already have an account?{' '}
        <Link href="/login" style={portalStyles.link}>
          Log in
        </Link>
      </Text>
    </View>
  );
}
