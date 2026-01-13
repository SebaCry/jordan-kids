import { RegisterForm } from '../components/RegisterForm';
import logoIglesia from '../assets/icons/logo.png';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      {/* Logo de la iglesia en la esquina */}
      <div className="absolute top-8 left-8">
        <img
          src={logoIglesia}
          alt="Logo Iglesia"
          className="w-12 h-12 opacity-70 hover:opacity-100 transition-opacity rounded-full"
        />
      </div>

      <RegisterForm />
    </div>
  );
}
