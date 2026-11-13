/**
 * LoginForm — email + password with inline validation and loading state.
 *
 * Calls `useMember().signIn()`. On success the session store updates and the
 * root layout's Stack.Protected guard moves the user into the app — so this
 * component never navigates by itself.
 *
 * `prefill` lets the DemoAccountCard drop the demo credentials in.
 */
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Button, TextField } from "@/components/ui";
import { useMember } from "@/hooks/useMember";
import { haptics } from "@/lib/haptics";
import { spacing } from "@/theme";

export const LoginForm = forwardRef(function LoginForm(_props, ref) {
  const { signIn } = useMember();
  const passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Parent can call ref.current.prefill(email, password)
  useImperativeHandle(ref, () => ({
    prefill(nextEmail, nextPassword) {
      setEmail(nextEmail);
      setPassword(nextPassword);
      setError(null);
    },
  }));

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      haptics.success();
    } catch (err) {
      haptics.warning();
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextField
        label="Email"
        icon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextField
        ref={passwordRef}
        label="Password"
        icon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
      />

      {error ? (
        <AppText variant="small" color="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      <Button
        label="Sign in"
        variant="brand"
        size="lg"
        fullWidth
        loading={submitting}
        onPress={handleSubmit}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
});
