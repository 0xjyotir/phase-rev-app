/**
 * Login — sign in to Rev (the member app).
 * Web equivalent: phaserev/src/sections/login/login-section.tsx
 */
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Wordmark } from "@/components/brand/Wordmark";
import { AppText, Screen, ScreenHeader } from "@/components/ui";
import { DemoAccountCard } from "@/features/auth/DemoAccountCard";
import { LoginForm } from "@/features/auth/LoginForm";
import { palette, spacing } from "@/theme";

export default function LoginScreen() {
  const formRef = useRef(null);

  return (
    <Screen
      background={palette.black}
      header={<ScreenHeader leftIcon="arrow-left" />}
      keyboardAware
      gap={spacing.xxl}
    >
      <View style={styles.intro}>
        <Wordmark size="lg" />
        <AppText variant="h2">Welcome back</AppText>
        <AppText variant="body" color="textMuted">
          {
            "Sign in to plan today’s session, log your sets and see your progress across every pillar."
          }
        </AppText>
      </View>

      <LoginForm ref={formRef} />

      <DemoAccountCard onUse={(email, password) => formRef.current?.prefill(email, password)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginTop: spacing.md },
});
