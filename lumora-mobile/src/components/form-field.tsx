// ponytail: mirrors the web app's repeated label + input + error-list markup
// (login/register/add-student forms) — extracted once since the RN forms
// repeat it verbatim too.
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { Red, Zinc } from "@/constants/colors";

type FormFieldProps = TextInputProps & {
  label: string;
  errors?: string[];
};

export function FormField({ label, errors, style, ...rest }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} {...rest} />
      {errors?.map((m) => (
        <Text key={m} style={styles.error}>
          {m}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 4 },
  label: { fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: Zinc[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  error: { color: Red[600], fontSize: 13 },
});
