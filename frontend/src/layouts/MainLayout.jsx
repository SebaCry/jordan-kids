const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-green-500 text-white py-5 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">
          JordanList - Gestión de Niños de Iglesia
        </h1>
      </header>
      <main className="flex-1 py-6 px-4 max-w-full mx-auto w-full">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-3 px-6 text-center">
        <p className="text-xs">Sistema de Puntos para Niños de Iglesia</p>
      </footer>
    </div>
  );
};

export default MainLayout;
