import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  BadgeHelp,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  FileBadge,
  HeartPulse,
  Home,
  Search,
  SquareMenu,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Serviço Sem Fila — Guia de serviços públicos digitais" },
      { name: "description", content: "Passo a passo simples para acessar RG, CPF, aposentadoria, SUS e outros serviços públicos digitais." },
      { property: "og:title", content: "Serviço Sem Fila — Guia de serviços públicos digitais" },
      { property: "og:description", content: "Orientações claras, em letras grandes e com leitura em voz alta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

type CityId = "guaruja" | "prudente" | "bh" | "bc";
type ServiceId = "rg" | "cpf" | "inss" | "sus" | "cadunico" | "titulo" | "ctps";

const cities: Record<CityId, string> = {
  guaruja: "Guarujá",
  prudente: "Presidente Prudente",
  bh: "Belo Horizonte",
  bc: "Balneário Camboriú",
};

const rgByCity: Record<CityId, { note: string; documents: string[]; steps: string[]; url: string; site: string }> = {
  guaruja: { note: "Em Guarujá, a carteira de identidade é feita pelo Poupatempo.", documents: ["Certidão de nascimento ou casamento", "RG anterior, se tiver"], steps: ["Entre no site do Poupatempo ou abra o aplicativo Poupatempo Digital.", "Escolha “Carteira de Identidade” e agende no posto de Guarujá.", "Vá no dia e horário marcados com seus documentos."], url: "https://www.poupatempo.sp.gov.br", site: "Abrir o Poupatempo" },
  prudente: { note: "Em Presidente Prudente, a carteira de identidade é feita pelo Poupatempo.", documents: ["Certidão de nascimento ou casamento", "RG anterior, se tiver"], steps: ["Entre no site do Poupatempo ou abra o aplicativo Poupatempo Digital.", "Escolha “Carteira de Identidade” e agende no posto de Presidente Prudente.", "Vá no dia e horário marcados com seus documentos."], url: "https://www.poupatempo.sp.gov.br", site: "Abrir o Poupatempo" },
  bh: { note: "Em Belo Horizonte, a Carteira de Identidade Nacional é feita pela Polícia Civil.", documents: ["CPF", "Certidão de nascimento ou casamento"], steps: ["Entre no Portal MG ou no aplicativo MG Cidadão com sua conta gov.br.", "Agende na UAI mais próxima de você.", "Vá no dia marcado. A primeira via é gratuita."], url: "https://www.mg.gov.br", site: "Abrir o Portal MG" },
  bc: { note: "Em Balneário Camboriú, a identidade é emitida pela Polícia Científica de Santa Catarina.", documents: ["CPF", "Certidão de nascimento ou casamento"], steps: ["Entre no site da Polícia Científica de Santa Catarina.", "Toque em “Carteira de Identidade” e depois em “Agendamento”.", "Escolha Balneário Camboriú e vá no dia marcado."], url: "https://www.policiacientifica.sc.gov.br/carteira-de-identidade/", site: "Abrir a Polícia Científica" },
};

const baseServices = {
  cpf: { short: "CPF", title: "Tirar a 2ª via do CPF", question: "Preciso da 2ª via do CPF", category: "Documento", icon: FileBadge, note: "O CPF é federal. O passo a passo é igual em qualquer cidade do Brasil.", documents: ["Número do CPF", "Um documento com foto"], steps: ["Entre no site da Receita Federal e procure “Meu CPF”.", "Informe seu CPF para consultar a situação.", "Se estiver regular, salve o comprovante em PDF."], url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-cpf", site: "Abrir a Receita Federal" },
  inss: { short: "INSS", title: "Pedir aposentadoria", question: "Quero pedir aposentadoria", category: "Benefício", icon: BadgeHelp, note: "Você pode fazer o pedido e acompanhar tudo pelo Meu INSS.", documents: ["CPF", "Senha da conta gov.br", "Carteira de trabalho, se tiver"], steps: ["Entre no aplicativo ou site Meu INSS com sua conta gov.br.", "Toque em “Agendamentos/Solicitações” e escolha o tipo de aposentadoria.", "Envie o pedido e guarde o número do protocolo."], url: "https://www.gov.br/inss/pt-br", site: "Abrir o Meu INSS" },
  sus: { short: "SUS", title: "Ver o cartão do SUS", question: "Preciso do cartão do SUS", category: "Saúde", icon: HeartPulse, note: "Seu cartão pode ser visto no aplicativo Meu SUS Digital.", documents: ["CPF", "Senha da conta gov.br"], steps: ["Baixe o aplicativo Meu SUS Digital.", "Entre com sua conta gov.br.", "Na tela inicial, procure o número do seu cartão e salve uma foto da tela."], url: "https://www.gov.br/saude/pt-br/composicao/seidigi/meususdigital", site: "Abrir o Meu SUS Digital" },
  cadunico: { short: "CadÚnico", title: "Fazer o Cadastro Único", question: "Quero um benefício social", category: "Benefício", icon: Home, note: "A primeira inscrição precisa ser feita pessoalmente no CRAS.", documents: ["Documentos de todas as pessoas da casa", "Comprovante de endereço"], steps: ["Procure o CRAS mais próximo da sua casa.", "Faça a entrevista e o cadastro. É gratuito.", "Depois, acompanhe seus dados pelo aplicativo Cadastro Único."], url: "https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico", site: "Abrir o site do Cadastro Único" },
  titulo: { short: "Título", title: "Consultar o título de eleitor", question: "Meu título está regular?", category: "Documento", icon: Check, note: "A situação do título pode ser consultada pela internet.", documents: ["CPF ou número do título"], steps: ["Baixe o aplicativo e-Título ou entre no site do TSE.", "Consulte sua situação eleitoral usando o CPF.", "Se houver pendência, siga as orientações mostradas na tela."], url: "https://www.tse.jus.br/eleitor/titulo-de-eleitor", site: "Abrir o site do TSE" },
  ctps: { short: "Trabalho", title: "Ver a Carteira de Trabalho Digital", question: "Fui contratado. E a carteira?", category: "Trabalho", icon: BriefcaseBusiness, note: "Ao ser contratado, normalmente basta informar seu CPF ao empregador.", documents: ["CPF", "Senha da conta gov.br"], steps: ["Baixe o aplicativo Carteira de Trabalho Digital.", "Entre usando sua conta gov.br.", "Veja seus contratos de trabalho na tela inicial."], url: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho", site: "Abrir o site oficial" },
} satisfies Record<Exclude<ServiceId, "rg">, ServiceData>;

type ServiceData = { short: string; title: string; question: string; category: string; icon: typeof FileBadge; note: string; documents: string[]; steps: string[]; url: string; site: string };

function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button className={`min-h-12 rounded-2xl px-5 font-display font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}

function Index() {
  const [city, setCity] = useState<CityId>("guaruja");
  const [serviceId, setServiceId] = useState<ServiceId>("rg");
  const [query, setQuery] = useState("");
  const [fontSize, setFontSize] = useState(18);
  const [speaking, setSpeaking] = useState(false);
  const [started, setStarted] = useState(false);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  const service = useMemo<ServiceData>(() => serviceId === "rg" ? {
    short: "RG", title: "Tirar a carteira de identidade", question: "Perdi meu RG", category: "Documento", icon: FileBadge,
    ...rgByCity[city],
  } : baseServices[serviceId], [city, serviceId]);

  const services = useMemo(() => ([
    { id: "rg" as const, short: "RG", title: "Identidade (RG)", keywords: "identidade perdi documento cin" },
    ...Object.entries(baseServices).map(([id, item]) => ({ id: id as ServiceId, short: item.short, title: item.title, keywords: `${item.question} ${item.category}` })),
  ]), []);

  const chooseService = (id: ServiceId) => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setServiceId(id);
    setStarted(false);
    setDoneSteps([]);
    window.setTimeout(() => document.getElementById("servico")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  const search = () => {
    const text = query.trim().toLocaleLowerCase("pt-BR");
    if (!text) return;
    const result = services.find((item) => `${item.title} ${item.keywords}`.toLocaleLowerCase("pt-BR").split(" ").some((word) => word.length > 3 && text.includes(word)));
    if (result) chooseService(result.id);
  };

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `${service.title}. ${service.note}. Você precisa de: ${service.documents.join(", ")}. Passos: ${service.steps.map((step, index) => `Passo ${index + 1}: ${step}`).join(" ")}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.82;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased" style={{ "--reader-size": `${fontSize}px` } as React.CSSProperties}>
      <a href="#conteudo" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-xl bg-ink px-4 py-3 font-bold text-paper focus:translate-y-0">Pular para o conteúdo</a>
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink font-display text-2xl font-extrabold text-paper deep-shadow" aria-hidden="true">S</div>
            <div><p className="font-display text-2xl font-extrabold leading-none">Serviço Sem Fila</p><p className="mt-1 text-sm text-ink/75">Guia simples para o seu dia</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="flex min-h-12 items-center gap-2 rounded-2xl bg-paper px-3 soft-shadow">
              <span className="hidden text-sm font-bold text-ink/75 sm:inline">Sua cidade</span>
              <select value={city} onChange={(event) => setCity(event.target.value as CityId)} className="min-h-11 cursor-pointer rounded-xl bg-sun/30 px-3 font-display font-bold text-ink" aria-label="Escolher cidade">
                {Object.entries(cities).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-1 rounded-2xl bg-paper p-1 soft-shadow" role="group" aria-label="Tamanho do texto">
              <span className="hidden px-2 text-sm font-bold text-ink/70 sm:inline">Texto</span>
              <Button aria-label="Diminuir texto" onClick={() => setFontSize((size) => Math.max(16, size - 2))} disabled={fontSize === 16} className="min-h-11 min-w-11 bg-muted px-2 text-lg hover:bg-sun/40">A−</Button>
              <Button aria-label="Aumentar texto" onClick={() => setFontSize((size) => Math.min(24, size + 2))} disabled={fontSize === 24} className="min-h-11 min-w-11 bg-muted px-2 text-lg hover:bg-sun/40">A+</Button>
            </div>
            <Button onClick={speak} className="flex items-center gap-2 bg-coral text-paper hover:bg-coral/90" aria-pressed={speaking}>
              {speaking ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />} {speaking ? "Parar áudio" : "Ouvir a página"}
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="lg:w-72 lg:shrink-0">
            <div className="rounded-3xl bg-ink p-4 deep-shadow lg:sticky lg:top-4">
              <p className="px-2 pb-3 pt-1 font-display text-sm font-bold uppercase text-sun">Escolha um serviço</p>
              <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Serviços disponíveis">
                {services.map((item) => (
                  <Button key={item.id} onClick={() => chooseService(item.id)} aria-current={serviceId === item.id ? "page" : undefined} className={`flex shrink-0 items-center gap-3 px-3 py-3 text-left text-paper lg:w-full ${serviceId === item.id ? "bg-paper/20 ring-2 ring-sun" : "bg-transparent hover:bg-paper/10"}`}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper/10 text-sm">{item.short}</span><span>{item.title}</span>
                  </Button>
                ))}
              </nav>
              <div className="mt-3 rounded-2xl bg-sun p-4 text-ink">
                <p className="font-display text-lg font-bold">Precisa de ajuda?</p>
                <p className="mt-1 text-sm">Peça ajuda a alguém de confiança. Não compartilhe sua senha.</p>
              </div>
            </div>
          </aside>

          <div id="conteudo" className="min-w-0 flex-1 space-y-6" tabIndex={-1}>
            <section aria-labelledby="busca-titulo" className="rounded-3xl bg-paper p-5 soft-shadow ring-1 ring-ink/10">
              <label id="busca-titulo" htmlFor="busca" className="font-display text-xl font-bold">O que você precisa hoje?</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60" aria-hidden="true" /><input id="busca" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && search()} placeholder="Ex.: perdi meu RG" className="min-h-14 w-full rounded-2xl bg-canvas pl-12 pr-5 text-lg ring-1 ring-ink/15 placeholder:text-ink/60" /></div>
                <Button onClick={search} className="bg-ink px-7 text-paper hover:bg-ink/90">Buscar</Button>
              </div>
              <p className="mt-3 text-sm text-ink/70">Escreva do seu jeito. Exemplo: “quero me aposentar”.</p>
            </section>

            <section id="servico" aria-labelledby="titulo-servico" className="scroll-mt-4 rounded-3xl bg-ink p-6 text-paper deep-shadow sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><span className="inline-block rounded-full bg-sun px-3 py-1 font-display text-xs font-bold uppercase text-ink">{service.category} · {cities[city]}</span><h1 id="titulo-servico" className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">{service.title}</h1><p className="mt-2 max-w-xl text-lg text-paper/85">{service.note}</p></div>
                <div className="flex items-center gap-2 rounded-2xl bg-paper/10 px-4 py-3"><span className="font-display text-3xl font-extrabold text-sun">{doneSteps.length}</span><span className="text-sm leading-tight text-paper/80">de {service.steps.length}<br />passos prontos</span></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => { setStarted(true); document.getElementById("passos")?.scrollIntoView({ behavior: "smooth" }); }} className="bg-coral px-7 text-paper hover:bg-coral/90">Começar agora <ChevronRight className="ml-1 inline" aria-hidden="true" /></Button>
                <Button onClick={speak} className="bg-paper/10 text-paper hover:bg-paper/20"><Volume2 className="mr-2 inline" aria-hidden="true" />Ouvir os passos</Button>
              </div>
            </section>

            <section aria-labelledby="documentos" className="rounded-3xl bg-paper p-6 soft-shadow ring-1 ring-ink/10 sm:p-8">
              <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-sun"><Check aria-hidden="true" /></span><h2 id="documentos" className="font-display text-2xl font-bold">Separe estes documentos</h2></div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">{service.documents.map((document, index) => <li key={document} className="flex items-center gap-3 rounded-2xl bg-canvas px-4 py-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink font-bold text-paper">{index + 1}</span><span className="text-lg font-semibold">{document}</span></li>)}</ul>
            </section>

            <section id="passos" aria-labelledby="passos-titulo" className="scroll-mt-4 rounded-3xl bg-paper p-6 soft-shadow ring-1 ring-ink/10 sm:p-8">
              <div className="flex items-center justify-between gap-4"><h2 id="passos-titulo" className="font-display text-2xl font-bold">Faça um passo de cada vez</h2>{started && <span className="rounded-full bg-sun/40 px-3 py-1 text-sm font-bold">Você começou</span>}</div>
              <ol className="mt-5 space-y-4">{service.steps.map((step, index) => { const done = doneSteps.includes(index); return <li key={step} className={`flex items-start gap-4 rounded-2xl p-4 ${done ? "bg-success/10 ring-2 ring-success" : index === 0 && started ? "bg-sun/25 ring-2 ring-sun" : "bg-canvas"}`}><span className={`grid size-14 shrink-0 place-items-center rounded-2xl font-display text-3xl font-extrabold ${done ? "bg-success text-paper" : "bg-ink text-paper"}`}>{done ? <Check aria-label="Concluído" /> : index + 1}</span><div className="min-w-0 flex-1"><p className="text-lg font-semibold">{step}</p><Button onClick={() => setDoneSteps((current) => done ? current.filter((number) => number !== index) : [...current, index])} className={`mt-3 min-h-11 px-4 text-sm ${done ? "bg-success text-paper" : "bg-paper text-ink ring-2 ring-ink/20 hover:bg-sun/30"}`}>{done ? "Feito! Toque para desfazer" : "Marcar como feito"}</Button></div></li>; })}</ol>
              <a href={service.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-coral px-6 py-3 font-display font-bold text-paper hover:bg-coral/90">{service.site}<ExternalLink aria-hidden="true" /></a>
            </section>

            <section aria-labelledby="seguranca" className="flex flex-col gap-4 rounded-3xl bg-sun p-6 soft-shadow sm:flex-row sm:items-center">
              <Accessibility className="size-12 shrink-0" aria-hidden="true" /><div className="flex-1"><h2 id="seguranca" className="font-display text-2xl font-bold">Antes de continuar</h2><p className="mt-1 text-lg">Este é um projeto acadêmico, não um canal do governo. Confira as informações no site oficial.</p></div>
            </section>
          </div>
        </div>

        <footer className="mt-10 border-t border-ink/20 py-8"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="font-display text-lg font-bold">Serviço Sem Fila</p><p className="flex items-center gap-2 text-sm text-ink/75"><CircleHelp className="size-5" aria-hidden="true" />Nunca informe sua senha a outra pessoa.</p></div></footer>
      </div>
    </div>
  );
}