import logoIglesia from '../assets/icons/logo.png';
import img3 from '../assets/images/img3.png';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Background decorative image */}
      <div
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${img3})` }}
      />

      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white py-6 px-6 shadow-2xl border-b border-purple-700 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <img
            src={logoIglesia}
            alt="Logo Iglesia"
            className="w-14 h-14 drop-shadow-2xl hover:scale-110 transition-transform duration-300 rounded-full"
          />
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            JordanList
          </h1>
        </div>
        <p className="text-center text-purple-200 mt-2 text-sm">
          Sistema de Gestión de Niños de Iglesia
        </p>
      </header>

      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full relative z-10">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-4 px-6 text-center border-t border-slate-800 relative z-10">
        <p className="text-sm flex items-center justify-center gap-2">
          <img src={logoIglesia} alt="Logo" className="w-5 h-5 opacity-70 rounded-full" />
          Sistema de Puntos para Niños de Iglesia
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
