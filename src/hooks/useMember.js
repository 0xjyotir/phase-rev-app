/**
 * useMember — the signed-in member + auth actions.
 *
 * Web equivalent: phaserev/src/hooks/use-member-access.ts → useMemberAccess()
 *
 *   const { user, firstName, isSignedIn, signIn, signOut } = useMember();
 *
 * Signing in/out flips `isSignedIn`, which the root layout's Stack.Protected
 * guards react to — so no screen needs to navigate manually after auth.
 */
import { useCallback } from "react";
import { signInWithEmail, signOutRemote } from "@/services/auth-service";
import { useProfileStore } from "@/stores/profile-store";
import { useSessionStore } from "@/stores/session-store";

export function useMember() {
  const user = useSessionStore((state) => state.user);
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);
  const ensureProfile = useProfileStore((state) => state.ensureProfile);

  const signIn = useCallback(
    async (email, password) => {
      const result = await signInWithEmail(email, password);
      ensureProfile(result.user.id);
      setSession(result);
      return result.user;
    },
    [ensureProfile, setSession],
  );

  const signOut = useCallback(async () => {
    await signOutRemote();
    clearSession();
  }, [clearSession]);

  return {
    user,
    isSignedIn: user !== null,
    firstName: user?.displayName.split(" ")[0] ?? null,
    signIn,
    signOut,
  };
}
