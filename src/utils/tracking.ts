// Eventos dos pixels (Meta e OpenAI), carregados em index.html. Se um bloqueador
// impedir o script, as funções simplesmente não existem: nunca quebra o fluxo.
type Fn = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: Fn;
    oaiq?: Fn;
  }
}

let registrado = false;

/** Lead cadastrado no CRM (dispara uma vez por carregamento da página). */
export function trackRegistration() {
  if (registrado) return;
  registrado = true;
  try {
    window.fbq?.("track", "Lead");
    window.oaiq?.("measure", "registration_completed", { type: "customer_action", amount: 0, currency: "USD" });
  } catch {
    /* pixel indisponível */
  }
}
