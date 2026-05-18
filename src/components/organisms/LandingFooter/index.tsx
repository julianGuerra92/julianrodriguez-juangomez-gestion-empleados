export function LandingFooter() {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-6 text-center text-base-content/50 text-sm">
        <p>
          © {new Date().getFullYear()} GestiónRRHH — Plataforma de Gestión de
          Recursos Humanos
        </p>
      </div>
    </footer>
  );
}
