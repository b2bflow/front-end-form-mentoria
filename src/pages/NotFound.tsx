import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-5 text-center">
    <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Erro 404</p>
    <h1 className="mt-3 font-serif text-3xl font-medium text-foreground sm:text-4xl">Página não encontrada</h1>
    <Link to="/" className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-gold">
      Voltar ao início
    </Link>
  </div>
);

export default NotFound;
