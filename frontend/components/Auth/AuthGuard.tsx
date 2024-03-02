// components/AuthGuard.tsx
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      // Se o usuário não estiver autenticado, redirecione para a página de login
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, []);

  // Renderize o conteúdo da rota protegida se o usuário estiver autenticado
  return <>{children}</>;
};

export default AuthGuard;
