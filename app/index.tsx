import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserRole } from "../lib/enum/UserEnum";
import { RootState } from "../lib/store";

export default function Index() {
  const { isAuthenticated, userRole, isInitialized } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated) {
      const hasOwnerRole = userRole?.some((role) => role.id === UserRole.Owner);

      if (hasOwnerRole) {
        router.replace("/(owner)/dashboard");
      } else {
        router.replace("/(player)/home");
      }
    } else {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, userRole, isInitialized, router]);

  return null;
}
