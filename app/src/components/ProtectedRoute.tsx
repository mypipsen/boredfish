import { Navigate } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
