/**
 * Login — sign in to Rev (the member app).
 * Web equivalent: phaserev/src/sections/login/login-section.tsx
 */
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Wordmark } from "@/components/brand/Wordmark";
import { AmbientBackground, AppText, Screen, ScreenHeader } from "@/components/ui";
import { DemoAccountCard } from "@/features/auth/DemoAccountCard";
import { LoginForm } from "@/features/auth/LoginForm";
import { palette, spacing } from "@/theme";

export default function LoginScreen() {
  const formRef = useRef(null);

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <Screen variant="bare" background="transparent" keyboardAware gap={spacing.xxl}>
        <ScreenHeader leftIcon="chevron-left" padded={false} />
        <View style={styles.intro}>
          <Wordmark size="lg" />
          <AppText variant="h1">Welcome back</AppText>
          <AppText variant="body" color="textMuted">
            {"Sign in to plan today’s session, log your sets and see your progress across every pillar."}
          </AppText>
        </View>

        <LoginForm ref={formRef} />

        <DemoAccountCard onUse={(email, password) => formRef.current?.prefill(email, password)} />
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.black },
  intro: { gap: spacing.sm },
});
