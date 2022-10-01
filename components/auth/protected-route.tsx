import React, { useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { useRouter } from "next/router";

const ProtectedRoute: React.FC = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //  @ts-ignore
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login").then();
    }
  }, [router, user]);
  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
