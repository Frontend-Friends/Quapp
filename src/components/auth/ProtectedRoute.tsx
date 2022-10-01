import React, { FC, ReactNode, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login').then();
    }
  }, [router, user]);
  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
