import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 * @param {boolean} props.adminOnly - Si es true, solo permite acceso a admins
 * @returns {React.ReactElement} Ruta protegida
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-300 text-lg">Verificando autenticación...</p>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir a dashboard de guest si requiere admin y no lo es
  if (adminOnly && !isAdmin) {
    return <Navigate to="/guest-dashboard" replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
}
