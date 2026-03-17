import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  detectBrowserLanguage,
  getTranslation,
  resolveLanguage,
  type LanguageCode,
  type TranslationPack,
} from "./translate";

type RegistroParada = {
  data: Date | null;
  dataChave: string;
  mesChave: string;
  faixaHora: string;
  turno: string;
  linha: string;
  departamento: string;
  responsavel: string;
  tipo: string;
  descricao: string;
  modelo: string;
  status: string;
  minutosParados: number;
};

type Filtros = {
  mes: string;
  dia: string;
  turno: string;
  departamento: string;
  linha: string;
};

type Colunas = {
  data: number;
  hora: number;
  turno: number;
  linha: number;
  departamento: number;
  tipo: number;
  minutos: number;
  descricao: number;
  modelo: number;
  responsavel: number;
  status: number;
};

type ItemRanking = {
  label: string;
  total: number;
};

type TranslationTextKey = {
  [K in keyof TranslationPack]: TranslationPack[K] extends string ? K : never;
}[keyof TranslationPack];

const TABLE_STATUS_EMPTY_VALUE = "__empty_status__";
const STORAGE_LANGUAGE_KEY = "dashboard_language";
const STORAGE_THEME_KEY = "dashboard_theme";
const GOOGLE_TRANSLATE_API_KEY = (import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY as string | undefined)?.trim() ?? "";

const idiomaInicial = resolverIdiomaInicial();
type ThemeMode = "light" | "dark";
const temaInicial = resolverTemaInicial();

const estado = {
  idioma: idiomaInicial,
  tema: temaInicial as ThemeMode,
  registros: [] as RegistroParada[],
  filtroStatusTabela: "all",
  filtros: {
    mes: "all",
    dia: "all",
    turno: "all",
    departamento: "all",
    linha: "all",
  } as Filtros,
};

const ui = {
  themeSwitch: obterElemento<HTMLInputElement>("themeSwitch"),
  uploadSection: obterElemento<HTMLElement>("uploadSection"),
  dashboardSection: obterElemento<HTMLElement>("dashboardSection"),
  uploadDropzone: obterElemento<HTMLDivElement>("uploadDropzone"),
  uploadInput: obterElemento<HTMLInputElement>("fileInput"),
  uploadButton: obterElemento<HTMLButtonElement>("uploadButton"),
  uploadError: obterElemento<HTMLParagraphElement>("uploadError"),
  replaceFileButton: obterElemento<HTMLButtonElement>("replaceFileButton"),
  inputIdioma: obterElemento<HTMLSelectElement>("languageFilter"),
  inputMes: obterElemento<HTMLSelectElement>("monthFilter"),
  inputDia: obterElemento<HTMLSelectElement>("dayFilter"),
  inputTurno: obterElemento<HTMLSelectElement>("shiftFilter"),
  inputDepartamento: obterElemento<HTMLSelectElement>("departmentFilter"),
  inputLinha: obterElemento<HTMLSelectElement>("lineFilter"),
  inputStatusTabela: obterElemento<HTMLSelectElement>("tableStatusFilter"),
  subtitulo: obterElemento<HTMLParagraphElement>("datasetInfo"),
  kpiOcorrencias: obterElemento<HTMLElement>("kpiEvents"),
  kpiMinutosBrutos: obterElemento<HTMLElement>("kpiMinutes"),
  kpiAreas: obterElemento<HTMLElement>("kpiAreas"),
  legendaAreas: obterElemento<HTMLUListElement>("areasLegend"),
  rankingTurnos: obterElemento<HTMLDivElement>("turnosRanking"),
  problemasPorArea: obterElemento<HTMLDivElement>("areaProblems"),
  corpoTabela: obterElemento<HTMLTableSectionElement>("problemsTableBody"),
  canvasPizza: obterElemento<HTMLCanvasElement>("areasPieChart"),
  loadingOverlay: obterElemento<HTMLDivElement>("loadingOverlay"),
  loadingMessage: obterElemento<HTMLParagraphElement>("loadingMessage"),
};

const textosFixos: Array<[string, TranslationTextKey]> = [
  ["uploadEyebrow", "uploadEyebrow"],
  ["uploadTitle", "uploadTitle"],
  ["uploadSubtitle", "uploadSubtitle"],
  ["uploadDropTitle", "uploadDropTitle"],
  ["uploadDropHint", "uploadDropHint"],
  ["uploadButton", "uploadButton"],
  ["replaceFileButton", "replaceFileButton"],
  ["heroEyebrow", "heroEyebrow"],
  ["heroTitle", "heroTitle"],
  ["kpiEventsLabel", "kpiEvents"],
  ["kpiMinutesLabel", "kpiGrossMinutes"],
  ["kpiAreasLabel", "kpiAreas"],
  ["languageFilterLabel", "languageLabel"],
  ["monthFilterLabel", "filterMonth"],
  ["dayFilterLabel", "filterDay"],
  ["shiftFilterLabel", "filterShift"],
  ["departmentFilterLabel", "filterDepartment"],
  ["lineFilterLabel", "filterLine"],
  ["tableStatusFilterLabel", "filterTableStatus"],
  ["areasCardTitle", "areasCardTitle"],
  ["areasCardPill", "areasCardPill"],
  ["shiftsCardTitle", "shiftsCardTitle"],
  ["shiftsCardPill", "shiftsCardPill"],
  ["problemsByAreaTitle", "problemsByAreaTitle"],
  ["problemsByAreaPill", "problemsByAreaPill"],
  ["tableCardTitle", "tableCardTitle"],
  ["thDepartment", "thDepartment"],
  ["thShift", "thShift"],
  ["thLine", "thLine"],
  ["thType", "thType"],
  ["thDescription", "thDescription"],
  ["thModel", "thModel"],
  ["thStatus", "thStatus"],
  ["thMinutes", "thMinutes"],
];

let formatadorNumero = new Intl.NumberFormat(getTranslation(estado.idioma).locale);
let formatadorData = new Intl.DateTimeFormat(getTranslation(estado.idioma).locale);
let graficoAreas: any = null;
let requisicaoTraducaoAtual = 0;
let loadingPendencias = 0;
const cacheTraducoesDinamicas = new Map<string, string>();

void inicializar();

function inicializar(): void {
  aplicarTema(estado.tema);
  sincronizarSwitchTema();
  popularIdiomas();
  aplicarIdioma(estado.idioma);
  configurarEventos();
  mostrarTelaUpload();
}

function configurarEventos(): void {
  ui.uploadDropzone.addEventListener("click", () => abrirSeletorArquivo());
  ui.uploadButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    abrirSeletorArquivo();
  });
  ui.replaceFileButton.addEventListener("click", () => abrirSeletorArquivo());
  ui.themeSwitch.addEventListener("change", () => {
    const proximoTema: ThemeMode = ui.themeSwitch.checked ? "dark" : "light";
    definirTema(proximoTema);
  });
  ui.uploadDropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      abrirSeletorArquivo();
    }
  });
  ui.uploadDropzone.addEventListener("dragenter", (event) => {
    event.preventDefault();
    ui.uploadDropzone.classList.add("drag-active");
  });
  ui.uploadDropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    ui.uploadDropzone.classList.add("drag-active");
  });
  ui.uploadDropzone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    ui.uploadDropzone.classList.remove("drag-active");
  });
  ui.uploadDropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    ui.uploadDropzone.classList.remove("drag-active");
    const arquivo = event.dataTransfer?.files?.[0];
    if (!arquivo) {
      return;
    }
    void processarArquivoEntrada(arquivo);
  });
  ui.uploadInput.addEventListener("change", () => {
    const arquivo = ui.uploadInput.files?.[0];
    if (!arquivo) {
      return;
    }
    void processarArquivoEntrada(arquivo);
  });

  ui.inputIdioma.addEventListener("change", () => {
    estado.idioma = resolveLanguage(ui.inputIdioma.value);
    persistirIdioma(estado.idioma);
    aplicarIdioma(estado.idioma);
    popularIdiomas();

    if (estado.registros.length) {
      popularFiltros(estado.registros);
      atualizarDashboard();
      void garantirTraducoesDinamicas();
    }
  });

  ui.inputMes.addEventListener("change", () => {
    estado.filtros.mes = ui.inputMes.value;
    estado.filtros.dia = "all";
    popularFiltros(estado.registros);
    atualizarDashboard();
  });

  ui.inputDia.addEventListener("change", () => {
    estado.filtros.dia = ui.inputDia.value;
    atualizarDashboard();
  });

  ui.inputTurno.addEventListener("change", () => {
    estado.filtros.turno = ui.inputTurno.value;
    atualizarDashboard();
  });

  ui.inputDepartamento.addEventListener("change", () => {
    estado.filtros.departamento = ui.inputDepartamento.value;
    atualizarDashboard();
  });

  ui.inputLinha.addEventListener("change", () => {
    estado.filtros.linha = ui.inputLinha.value;
    atualizarDashboard();
  });

  ui.inputStatusTabela.addEventListener("change", () => {
    estado.filtroStatusTabela = ui.inputStatusTabela.value;
    atualizarDashboard();
  });
}

function abrirSeletorArquivo(): void {
  limparErroUpload();
  ui.uploadInput.click();
}

async function processarArquivoEntrada(arquivo: File): Promise<void> {
  const tinhaDados = estado.registros.length > 0;
  const t = traducaoAtual();

  if (!/\.(xlsx|xls)$/i.test(arquivo.name)) {
    const mensagem = t.invalidFileType;
    if (tinhaDados) {
      ui.subtitulo.textContent = `${t.errorPrefix}: ${mensagem}`;
    } else {
      mostrarErroUpload(`${t.errorPrefix}: ${mensagem}`);
    }
    return;
  }

  mostrarLoading(t.loadingSheet);

  try {
    const workbook = await lerWorkbookArquivo(arquivo);
    const registros = extrairRegistros(workbook);

    if (!registros.length) {
      throw new Error(t.emptyGeneric);
    }

    estado.registros = registros;
    resetarFiltros();
    limparErroUpload();
    mostrarDashboard();
    popularFiltros(estado.registros);
    atualizarDashboard();
    void garantirTraducoesDinamicas();
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : t.loadDataFailure;
    if (tinhaDados) {
      ui.subtitulo.textContent = `${t.errorPrefix}: ${mensagem}`;
    } else {
      mostrarErroUpload(`${t.errorPrefix}: ${mensagem}`);
      mostrarTelaUpload();
    }
  } finally {
    esconderLoading();
    ui.uploadInput.value = "";
  }
}

function lerWorkbookArquivo(arquivo: File): Promise<Workbook> {
  return arquivo.arrayBuffer().then((dados) => XLSX.read(dados, { type: "array", cellDates: true }));
}

function resetarFiltros(): void {
  estado.filtros = {
    mes: "all",
    dia: "all",
    turno: "all",
    departamento: "all",
    linha: "all",
  };
  estado.filtroStatusTabela = "all";
}

function mostrarTelaUpload(): void {
  ui.uploadSection.classList.remove("d-none");
  ui.dashboardSection.classList.add("d-none");
}

function mostrarDashboard(): void {
  ui.uploadSection.classList.add("d-none");
  ui.dashboardSection.classList.remove("d-none");
}

function mostrarErroUpload(mensagem: string): void {
  ui.uploadError.textContent = mensagem;
  ui.uploadError.classList.remove("d-none");
}

function limparErroUpload(): void {
  ui.uploadError.textContent = "";
  ui.uploadError.classList.add("d-none");
}

function resolverIdiomaInicial(): LanguageCode {
  const salvo = localStorage.getItem(STORAGE_LANGUAGE_KEY);
  if (salvo) {
    return resolveLanguage(salvo);
  }

  return resolveLanguage(detectBrowserLanguage()) || DEFAULT_LANGUAGE;
}

function resolverTemaInicial(): ThemeMode {
  const salvo = localStorage.getItem(STORAGE_THEME_KEY);
  if (salvo === "light" || salvo === "dark") {
    return salvo;
  }
  return "light";
}

function persistirIdioma(idioma: LanguageCode): void {
  localStorage.setItem(STORAGE_LANGUAGE_KEY, idioma);
}

function persistirTema(tema: ThemeMode): void {
  localStorage.setItem(STORAGE_THEME_KEY, tema);
}

function popularIdiomas(): void {
  ui.inputIdioma.innerHTML = LANGUAGE_OPTIONS.map(
    (item) => `<option value="${item.code}">${escaparHtml(item.label)}</option>`,
  ).join("");

  ui.inputIdioma.value = estado.idioma;
}

function aplicarIdioma(idioma: LanguageCode): void {
  const t = getTranslation(idioma);

  document.documentElement.lang = t.locale;
  document.documentElement.dir = t.rtl ? "rtl" : "ltr";
  document.title = t.pageTitle;

  formatadorNumero = new Intl.NumberFormat(t.locale);
  formatadorData = new Intl.DateTimeFormat(t.locale);

  for (const [id, chave] of textosFixos) {
    obterElemento<HTMLElement>(id).textContent = t[chave];
  }

  atualizarRotuloSwitchTema();
  ui.canvasPizza.setAttribute("aria-label", t.pieAriaLabel);
  ui.loadingMessage.textContent = t.loadingData;

  if (!estado.registros.length) {
    ui.subtitulo.textContent = t.waitingFile;
  }
}

function definirTema(tema: ThemeMode): void {
  estado.tema = tema;
  persistirTema(tema);
  aplicarTema(tema);
  sincronizarSwitchTema();
  atualizarRotuloSwitchTema();
}

function aplicarTema(tema: ThemeMode): void {
  document.documentElement.dataset.theme = tema;
}

function sincronizarSwitchTema(): void {
  ui.themeSwitch.checked = estado.tema === "dark";
}

function atualizarRotuloSwitchTema(): void {
  const t = traducaoAtual();
  const temaDestino = estado.tema === "light" ? t.themeDark : t.themeLight;
  const rotulo = obterElemento<HTMLElement>("themeSwitchLabel");
  rotulo.textContent = temaDestino;
  ui.themeSwitch.setAttribute("aria-label", `${t.themeLabel}: ${temaDestino}`);
}

function traducaoAtual(): TranslationPack {
  return getTranslation(estado.idioma);
}

function precisaTraducaoDinamica(idioma: LanguageCode): boolean {
  return idioma !== "pt-BR";
}

function idiomaGoogle(idioma: LanguageCode): string {
  const mapa: Record<LanguageCode, string> = {
    "pt-BR": "pt",
    en: "en",
    "zh-CN": "zh-CN",
    de: "de",
    es: "es",
    ar: "ar",
  };

  return mapa[idioma];
}

function chaveCacheTraducao(idioma: LanguageCode, texto: string): string {
  return `${idioma}::${texto}`;
}

function traduzirDinamico(texto: string): string {
  if (!texto || !precisaTraducaoDinamica(estado.idioma)) {
    return texto;
  }

  const chave = chaveCacheTraducao(estado.idioma, texto);
  return cacheTraducoesDinamicas.get(chave) ?? texto;
}

function mostrarLoading(mensagem: string): void {
  loadingPendencias += 1;
  ui.loadingMessage.textContent = mensagem;
  ui.loadingOverlay.classList.remove("d-none");
}

function esconderLoading(): void {
  loadingPendencias = Math.max(0, loadingPendencias - 1);
  if (loadingPendencias === 0) {
    ui.loadingOverlay.classList.add("d-none");
  }
}

async function garantirTraducoesDinamicas(): Promise<void> {
  if (!estado.registros.length || !precisaTraducaoDinamica(estado.idioma)) {
    return;
  }

  const textos = coletarTextosDinamicos(estado.registros);
  const faltantes = textos.filter((texto) => !cacheTraducoesDinamicas.has(chaveCacheTraducao(estado.idioma, texto)));

  if (!faltantes.length) {
    return;
  }

  const idRequisicao = ++requisicaoTraducaoAtual;
  mostrarLoading(traducaoAtual().loadingTranslation);

  try {
    const target = idiomaGoogle(estado.idioma);
    const traducoes = GOOGLE_TRANSLATE_API_KEY
      ? await traduzirLotesGoogleCloud(faltantes, target)
      : await traduzirLotesGooglePublico(faltantes, target);

    if (idRequisicao !== requisicaoTraducaoAtual) {
      return;
    }

    for (const [original, traduzido] of traducoes.entries()) {
      cacheTraducoesDinamicas.set(chaveCacheTraducao(estado.idioma, original), traduzido);
    }

    popularFiltros(estado.registros);
    atualizarDashboard();
  } catch (error) {
    console.error("Erro ao traduzir dados dinâmicos via Google Translate API.", error);
  } finally {
    esconderLoading();
  }
}

function coletarTextosDinamicos(registros: RegistroParada[]): string[] {
  const textos = new Set<string>();

  for (const item of registros) {
    adicionarTextoSeValido(textos, item.departamento);
    adicionarTextoSeValido(textos, item.turno);
    adicionarTextoSeValido(textos, item.tipo);
    adicionarTextoSeValido(textos, item.descricao);
    adicionarTextoSeValido(textos, item.modelo);
    adicionarTextoSeValido(textos, item.status);
  }

  return Array.from(textos);
}

function adicionarTextoSeValido(set: Set<string>, texto: string): void {
  const limpo = texto.trim();
  if (!limpo) {
    return;
  }
  set.add(limpo);
}

async function traduzirLotesGoogleCloud(textos: string[], target: string): Promise<Map<string, string>> {
  const resultado = new Map<string, string>();
  const tamanhoLote = 40;

  for (let i = 0; i < textos.length; i += tamanhoLote) {
    const lote = textos.slice(i, i + tamanhoLote);
    const traduzidos = await traduzirLoteGoogleCloud(lote, target);

    for (let j = 0; j < lote.length; j += 1) {
      const original = lote[j];
      if (original === undefined) {
        continue;
      }
      resultado.set(original, traduzidos[j] ?? original);
    }
  }

  return resultado;
}

async function traduzirLoteGoogleCloud(lote: string[], target: string): Promise<string[]> {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(
    GOOGLE_TRANSLATE_API_KEY,
  )}`;

  const resposta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: lote,
      source: "pt",
      target,
      format: "text",
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(`Google Translate API retornou ${resposta.status}: ${detalhe}`);
  }

  const payload = (await resposta.json()) as {
    data?: {
      translations?: Array<{ translatedText?: string }>;
    };
  };

  const traducoes = payload.data?.translations ?? [];
  if (!Array.isArray(traducoes) || traducoes.length === 0) {
    return lote;
  }

  return lote.map((original, idx) => decodificarHtml(traducoes[idx]?.translatedText ?? original));
}

async function traduzirLotesGooglePublico(textos: string[], target: string): Promise<Map<string, string>> {
  const resultado = new Map<string, string>();

  const traducoes = await Promise.all(
    textos.map(async (texto) => {
      try {
        return await traduzirTextoGooglePublico(texto, target);
      } catch {
        return texto;
      }
    }),
  );

  for (let i = 0; i < textos.length; i += 1) {
    const original = textos[i];
    if (original === undefined) {
      continue;
    }
    resultado.set(original, traducoes[i] ?? original);
  }

  return resultado;
}

async function traduzirTextoGooglePublico(texto: string, target: string): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "pt");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", texto);

  const resposta = await fetch(url.toString());
  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(`Google Translate público retornou ${resposta.status}: ${detalhe}`);
  }

  const payload = (await resposta.json()) as unknown;
  return extrairTraducaoPayloadPublico(payload, texto);
}

function extrairTraducaoPayloadPublico(payload: unknown, fallback: string): string {
  if (!Array.isArray(payload) || payload.length === 0) {
    return fallback;
  }

  const blocos = payload[0];
  if (!Array.isArray(blocos)) {
    return fallback;
  }

  const partes = blocos
    .map((bloco) => (Array.isArray(bloco) && typeof bloco[0] === "string" ? bloco[0] : ""))
    .filter((parte) => parte.length > 0);

  if (!partes.length) {
    return fallback;
  }

  return decodificarHtml(partes.join(""));
}

function decodificarHtml(texto: string): string {
  const parser = document.createElement("textarea");
  parser.innerHTML = texto;
  return parser.value;
}

function extrairRegistros(workbook: Workbook): RegistroParada[] {
  const candidatas: Array<{
    registros: RegistroParada[];
    temColunaResponsavel: boolean;
    temColunaStatus: boolean;
    quantidadeResponsaveis: number;
    quantidadeStatus: number;
  }> = [];

  for (const nomeAba of workbook.SheetNames) {
    const aba = workbook.Sheets[nomeAba];
    if (!aba) {
      continue;
    }

    const matriz = XLSX.utils.sheet_to_json<unknown[]>(aba, {
      header: 1,
      defval: null,
      raw: true,
    });

    if (!matriz.length) {
      continue;
    }

    const indiceCabecalho = encontrarLinhaCabecalho(matriz);
    if (indiceCabecalho < 0) {
      continue;
    }

    const cabecalho = (matriz[indiceCabecalho] ?? []).map((item) => limparTexto(item));
    let colunas: Colunas;

    try {
      colunas = mapearColunas(cabecalho);
    } catch {
      continue;
    }

    const linhasDados = matriz.slice(indiceCabecalho + 1);
    const registros = linhasDados
      .filter((linha) => linhaTemConteudo(linha))
      .map((linha) => converterLinhaEmRegistro(linha, colunas))
      .filter((registro): registro is RegistroParada => registro !== null);

    if (!registros.length) {
      continue;
    }

    const quantidadeResponsaveis = registros.filter((item) => item.responsavel.trim().length > 0).length;
    const quantidadeStatus = registros.filter((item) => item.status.trim().length > 0).length;

    candidatas.push({
      registros,
      temColunaResponsavel: colunas.responsavel >= 0,
      temColunaStatus: colunas.status >= 0,
      quantidadeResponsaveis,
      quantidadeStatus,
    });
  }

  if (!candidatas.length) {
    throw new Error("Nenhuma aba válida foi encontrada. Verifique o cabeçalho da planilha.");
  }

  candidatas.sort((a, b) => {
    if (a.temColunaResponsavel !== b.temColunaResponsavel) {
      return a.temColunaResponsavel ? -1 : 1;
    }

    if (a.temColunaStatus !== b.temColunaStatus) {
      return a.temColunaStatus ? -1 : 1;
    }

    if (a.quantidadeResponsaveis !== b.quantidadeResponsaveis) {
      return b.quantidadeResponsaveis - a.quantidadeResponsaveis;
    }

    if (a.quantidadeStatus !== b.quantidadeStatus) {
      return b.quantidadeStatus - a.quantidadeStatus;
    }

    return b.registros.length - a.registros.length;
  });

  const melhorCandidata = candidatas[0];
  if (!melhorCandidata) {
    throw new Error("Nenhuma aba válida foi encontrada. Verifique o cabeçalho da planilha.");
  }

  return melhorCandidata.registros;
}

function encontrarLinhaCabecalho(matriz: unknown[][]): number {
  return matriz.findIndex((linha) => {
    const normalizados = linha.map((item) => normalizarTexto(item));
    const temData = normalizados.some((campo) => campo.includes("data") || campo.includes("dia"));
    const temDepartamento = normalizados.some((campo) => campo.includes("departamento") || campo.includes("area"));
    const temMinutos = normalizados.some((campo) => campo.includes("minutos"));
    return temData && temDepartamento && temMinutos;
  });
}

function mapearColunas(cabecalho: string[]): Colunas {
  const colunas: Colunas = {
    data: encontrarIndiceColuna(cabecalho, ["data", "dia"]),
    hora: encontrarIndiceColuna(cabecalho, ["hora", "faixa", "horario", "horário"]),
    turno: encontrarIndiceColuna(cabecalho, ["turno"]),
    linha: encontrarIndiceColuna(cabecalho, ["linha"]),
    departamento: encontrarIndiceColuna(cabecalho, ["departamento", "area"]),
    tipo: encontrarIndiceColuna(cabecalho, ["tipo", "problema"]),
    minutos: encontrarIndiceColuna(cabecalho, ["minutos", "minutos_parados", "minutos parados"]),
    descricao: encontrarIndiceColuna(cabecalho, ["descricao", "descrição"]),
    modelo: encontrarIndiceColuna(cabecalho, ["modelo", "produto"]),
    responsavel: encontrarIndiceColuna(cabecalho, ["responsavel"], false),
    status: encontrarIndiceColuna(cabecalho, ["status"], false),
  };

  const obrigatorias: Array<[string, number]> = [
    ["data", colunas.data],
    ["hora", colunas.hora],
    ["turno", colunas.turno],
    ["linha", colunas.linha],
    ["departamento", colunas.departamento],
    ["tipo", colunas.tipo],
    ["minutos", colunas.minutos],
    ["descricao", colunas.descricao],
    ["modelo", colunas.modelo],
  ];

  const faltantes = obrigatorias
    .filter(([, indice]) => indice < 0)
    .map(([nome]) => nome);

  if (faltantes.length > 0) {
    throw new Error(`Colunas obrigatórias ausentes: ${faltantes.join(", ")}.`);
  }

  if (colunas.responsavel < 0) {
    console.warn("Coluna 'responsavel' não encontrada no cabeçalho da planilha.");
  }
  if (colunas.status < 0) {
    console.warn("Coluna 'status' não encontrada no cabeçalho da planilha.");
  }

  return colunas;
}

function encontrarIndiceColuna(cabecalho: string[], aliases: string[], obrigatoria = true): number {
  const normalizados = cabecalho.map((nome) => normalizarTexto(nome));
  for (const alias of aliases) {
    const alvo = normalizarTexto(alias);
    const indice = normalizados.findIndex((coluna) => coluna === alvo || coluna.includes(alvo));
    if (indice >= 0) {
      return indice;
    }
  }

  if (!obrigatoria) {
    return -1;
  }

  return -1;
}

function converterLinhaEmRegistro(linha: unknown[], colunas: Colunas): RegistroParada | null {
  const minutosParados = converterNumero(linha[colunas.minutos]);
  const departamento = limparTexto(linha[colunas.departamento]);
  const tipo = limparTexto(linha[colunas.tipo]);
  const descricao = limparTexto(linha[colunas.descricao]) || "Sem descrição";

  if (!Number.isFinite(minutosParados) || minutosParados <= 0 || !departamento || !tipo) {
    return null;
  }

  const data = converterData(linha[colunas.data]);
  const responsavelColuna = colunas.responsavel >= 0 ? limparTexto(linha[colunas.responsavel]) : "";
  const statusColuna = colunas.status >= 0 ? limparTexto(linha[colunas.status]) : "";

  return {
    data,
    dataChave: data ? formatarChaveData(data) : "sem-data",
    mesChave: data ? formatarChaveMes(data) : "sem-mes",
    faixaHora: limparTexto(linha[colunas.hora]) || "Sem hora",
    turno: limparTexto(linha[colunas.turno]) || "Sem turno",
    linha: limparTexto(linha[colunas.linha]) || "-",
    departamento,
    responsavel: responsavelColuna,
    tipo,
    descricao,
    modelo: limparTexto(linha[colunas.modelo]) || "Sem modelo",
    status: statusColuna,
    minutosParados,
  };
}

function popularFiltros(registros: RegistroParada[]): void {
  const t = traducaoAtual();

  const meses = Array.from(new Set(registros.map((r) => r.mesChave))).sort(ordenarMeses);
  estado.filtros.mes = popularSelect(ui.inputMes, meses, t.allMonths, formatarLabelMes, estado.filtros.mes);

  const baseDias = estado.filtros.mes === "all" ? registros : registros.filter((r) => r.mesChave === estado.filtros.mes);
  const dias = Array.from(new Set(baseDias.map((r) => r.dataChave))).sort();
  estado.filtros.dia = popularSelect(ui.inputDia, dias, t.allDays, formatarLabelData, estado.filtros.dia);

  const turnos = Array.from(new Set(registros.map((r) => r.turno))).sort(ordenarTurnos);
  estado.filtros.turno = popularSelect(ui.inputTurno, turnos, t.allShifts, formatarLabelTurno, estado.filtros.turno);

  const responsaveisPorDepartamento = mapearResponsaveisPorDepartamento(registros);
  const departamentos = Array.from(new Set(registros.map((r) => r.departamento))).sort((a, b) =>
    traduzirDinamico(a).localeCompare(traduzirDinamico(b), t.locale),
  );
  estado.filtros.departamento = popularSelect(
    ui.inputDepartamento,
    departamentos,
    t.allDepartments,
    (valor) =>
      formatarDepartamentoComResponsaveis(
        valor,
        responsaveisPorDepartamento.get(chaveDepartamentoNormalizada(valor)) ?? [],
      ),
    estado.filtros.departamento,
  );

  const linhas = Array.from(new Set(registros.map((r) => r.linha))).sort(ordenarRotulosNumericos);
  estado.filtros.linha = popularSelect(ui.inputLinha, linhas, t.allLines, undefined, estado.filtros.linha);
}

function popularFiltroStatusTabela(registros: RegistroParada[]): void {
  const t = traducaoAtual();
  const statusSemVazio = Array.from(
    new Set(registros.map((item) => limparTexto(item.status)).filter((valor) => valor.length > 0)),
  ).sort((a, b) => formatarStatus(a).localeCompare(formatarStatus(b), t.locale));
  const temStatusVazio = registros.some((item) => limparTexto(item.status).length === 0);

  const opcoes: string[] = [`<option value="all">${escaparHtml(t.allStatuses)}</option>`];
  for (const status of statusSemVazio) {
    opcoes.push(`<option value="${escaparHtml(status)}">${escaparHtml(formatarStatus(status))}</option>`);
  }
  if (temStatusVazio) {
    opcoes.push(
      `<option value="${TABLE_STATUS_EMPTY_VALUE}">${escaparHtml(t.statusNotInformed)}</option>`,
    );
  }

  ui.inputStatusTabela.innerHTML = opcoes.join("");

  const selecionadoValido =
    estado.filtroStatusTabela === "all" ||
    statusSemVazio.includes(estado.filtroStatusTabela) ||
    (estado.filtroStatusTabela === TABLE_STATUS_EMPTY_VALUE && temStatusVazio);

  estado.filtroStatusTabela = selecionadoValido ? estado.filtroStatusTabela : "all";
  ui.inputStatusTabela.value = estado.filtroStatusTabela;
}

function popularSelect(
  select: HTMLSelectElement,
  valores: string[],
  labelPadrao: string,
  formatador: ((valor: string) => string) | undefined,
  valorSelecionado: string,
): string {
  const opcoes = [
    `<option value="all">${escaparHtml(labelPadrao)}</option>`,
    ...valores.map((valor) => {
      const label = formatador ? formatador(valor) : valor;
      return `<option value="${escaparHtml(valor)}">${escaparHtml(label)}</option>`;
    }),
  ];

  select.innerHTML = opcoes.join("");

  const selecionado = valorSelecionado !== "all" && valores.includes(valorSelecionado) ? valorSelecionado : "all";
  select.value = selecionado;
  return selecionado;
}

function atualizarDashboard(): void {
  const filtrados = aplicarFiltros(estado.registros, estado.filtros);
  popularFiltroStatusTabela(filtrados);
  const filtradosTabela = aplicarFiltroStatusTabela(filtrados);

  atualizarSubtitulo(filtrados);
  atualizarKpis(filtrados);
  renderizarTopAreas(filtrados);
  renderizarTopTurnos(filtrados);
  renderizarTopProblemasPorArea(filtrados);
  renderizarTabelaProblemas(filtradosTabela);
}

function aplicarFiltroStatusTabela(registros: RegistroParada[]): RegistroParada[] {
  if (estado.filtroStatusTabela === "all") {
    return registros;
  }

  if (estado.filtroStatusTabela === TABLE_STATUS_EMPTY_VALUE) {
    return registros.filter((item) => limparTexto(item.status).length === 0);
  }

  return registros.filter((item) => limparTexto(item.status) === estado.filtroStatusTabela);
}

function aplicarFiltros(registros: RegistroParada[], filtros: Filtros): RegistroParada[] {
  return registros.filter((item) => {
    const okMes = filtros.mes === "all" || item.mesChave === filtros.mes;
    const okDia = filtros.dia === "all" || item.dataChave === filtros.dia;
    const okTurno = filtros.turno === "all" || item.turno === filtros.turno;
    const okDepartamento = filtros.departamento === "all" || item.departamento === filtros.departamento;
    const okLinha = filtros.linha === "all" || item.linha === filtros.linha;
    return okMes && okDia && okTurno && okDepartamento && okLinha;
  });
}

function atualizarSubtitulo(registros: RegistroParada[]): void {
  const t = traducaoAtual();

  const labelMes = estado.filtros.mes === "all" ? t.allMonths : formatarLabelMes(estado.filtros.mes);
  const labelDia = estado.filtros.dia === "all" ? t.allDays : formatarLabelData(estado.filtros.dia);
  const labelTurno = estado.filtros.turno === "all" ? t.allShifts : formatarLabelTurno(estado.filtros.turno);
  const responsaveisDepartamento = obterResponsaveisDepartamento(estado.registros, estado.filtros.departamento);
  const labelDepartamento =
    estado.filtros.departamento === "all"
      ? t.allDepartments
      : formatarDepartamentoComResponsaveis(estado.filtros.departamento, responsaveisDepartamento);
  const labelLinha = estado.filtros.linha === "all" ? t.allLines : `${t.linePrefix} ${estado.filtros.linha}`;

  ui.subtitulo.textContent = `${formatarOcorrencias(registros.length)} | ${labelMes} | ${labelDia} | ${labelTurno} | ${labelDepartamento} | ${labelLinha}`;
}

function formatarOcorrencias(total: number): string {
  const t = traducaoAtual();
  const label = total === 1 ? t.occurrenceSingular : t.occurrencePlural;
  return `${formatadorNumero.format(total)} ${label}`;
}

function atualizarKpis(registros: RegistroParada[]): void {
  const totalMinutosBrutos = registros.reduce((soma, item) => soma + item.minutosParados, 0);
  const totalAreas = new Set(registros.map((item) => item.departamento)).size;

  ui.kpiOcorrencias.textContent = formatadorNumero.format(registros.length);
  ui.kpiMinutosBrutos.textContent = formatarDuracaoHoras(totalMinutosBrutos);
  ui.kpiAreas.textContent = formatadorNumero.format(totalAreas);
}

function renderizarTopAreas(registros: RegistroParada[]): void {
  const t = traducaoAtual();
  const agrupado = agruparPor(registros, (item) => item.departamento);
  const rankingAreas = Array.from(agrupado.entries())
    .map(([departamento, itens]) => {
      const responsaveis = extrairResponsaveis(itens);
      const responsavelPrincipal = responsaveis[0] ?? "";
      return {
        label: formatarDepartamentoComResponsaveis(departamento, [responsavelPrincipal]),
        total: itens.reduce((soma, item) => soma + item.minutosParados, 0),
      };
    })
    .sort((a, b) => b.total - a.total);

  if (!rankingAreas.length) {
    destruirGraficoAreas();
    ui.legendaAreas.innerHTML = `<li class="empty-state">${escaparHtml(t.emptyChart)}</li>`;
    return;
  }

  const cores = gerarCoresPizza(rankingAreas.length);
  const labelsTraduzidos = rankingAreas.map((item) => item.label);

  if (graficoAreas) {
    graficoAreas.destroy();
  }

  graficoAreas = new Chart(ui.canvasPizza, {
    type: "pie",
    data: {
      labels: labelsTraduzidos,
      datasets: [
        {
          data: rankingAreas.map((item) => item.total),
          backgroundColor: cores,
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  const total = rankingAreas.reduce((soma, item) => soma + item.total, 0);

  ui.legendaAreas.innerHTML = rankingAreas
    .map((item, indice) => {
      const percentual = total > 0 ? Math.round((item.total / total) * 100) : 0;
      const labelLegenda = labelsTraduzidos[indice] ?? item.label;
      return `
        <li>
          <span class="legend-main">
            <span class="swatch" style="background:${cores[indice]}"></span>
            ${escaparHtml(labelLegenda)}
          </span>
          <span class="legend-minutes">${formatadorNumero.format(item.total)} ${escaparHtml(t.minuteUnit)} (${percentual}%)</span>
        </li>
      `;
    })
    .join("");
}

function destruirGraficoAreas(): void {
  if (graficoAreas) {
    graficoAreas.destroy();
    graficoAreas = null;
  }
}

function renderizarTopTurnos(registros: RegistroParada[]): void {
  const t = traducaoAtual();
  const ranking = gerarRanking(registros, (item) => item.turno).slice(0, 3);

  if (!ranking.length) {
    ui.rankingTurnos.innerHTML = `<div class="empty-state">${escaparHtml(t.emptyShifts)}</div>`;
    return;
  }

  const primeiroItem = ranking[0];
  if (!primeiroItem) {
    ui.rankingTurnos.innerHTML = `<div class="empty-state">${escaparHtml(t.emptyShifts)}</div>`;
    return;
  }
  const maiorValor = primeiroItem.total || 1;

  ui.rankingTurnos.innerHTML = ranking
    .map((item, indice) => {
      const largura = Math.max(6, Math.round((item.total / maiorValor) * 100));
      return `
        <article class="rank-item">
          <div class="rank-row">
            <span class="rank-label">#${indice + 1} - ${escaparHtml(rotuloTurno(item.label))}</span>
            <span class="rank-value">${formatadorNumero.format(item.total)} ${escaparHtml(t.minuteUnit)}</span>
          </div>
          <div class="progress" role="progressbar" aria-valuenow="${largura}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width: ${largura}%"></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function formatarLabelTurno(valor: string): string {
  const limpo = valor.trim();
  const t = traducaoAtual();

  if (!limpo) {
    return t.shiftPrefix;
  }

  if (/^\d+$/.test(limpo)) {
    return `${t.shiftPrefix} ${limpo}`;
  }

  const traduzido = traduzirDinamico(limpo);
  if (traduzido.toLowerCase().includes(t.shiftPrefix.toLowerCase())) {
    return traduzido;
  }

  return `${t.shiftPrefix} ${traduzido}`;
}

function rotuloTurno(valor: string): string {
  return formatarLabelTurno(valor);
}

function mapearResponsaveisPorDepartamento(registros: RegistroParada[]): Map<string, string[]> {
  const mapa = new Map<string, string[]>();

  for (const item of registros) {
    const chaveDepartamento = chaveDepartamentoNormalizada(item.departamento);
    if (!chaveDepartamento) {
      continue;
    }

    const lista = mapa.get(chaveDepartamento) ?? [];
    adicionarResponsaveisUnicos(lista, separarResponsaveis(item.responsavel));
    mapa.set(chaveDepartamento, lista);
  }

  return mapa;
}

function obterResponsaveisDepartamento(registros: RegistroParada[], departamento: string): string[] {
  if (departamento === "all") {
    return [];
  }

  const chaveDepartamento = chaveDepartamentoNormalizada(departamento);
  const mapa = mapearResponsaveisPorDepartamento(registros);
  return mapa.get(chaveDepartamento) ?? [];
}

function extrairResponsaveis(registros: RegistroParada[]): string[] {
  const encontrados: string[] = [];
  for (const item of registros) {
    adicionarResponsaveisUnicos(encontrados, separarResponsaveis(item.responsavel));
  }
  return encontrados;
}

function formatarDepartamentoComResponsaveis(departamento: string, responsaveis: string[]): string {
  const t = traducaoAtual();
  const departamentoTraduzido = traduzirDinamico(departamento);
  const unicos: string[] = [];
  adicionarResponsaveisUnicos(unicos, responsaveis);

  if (unicos.length === 0) {
    return `${departamentoTraduzido} (${t.noResponsible})`;
  }

  return `${departamentoTraduzido} (${unicos.join(", ")})`;
}

function chaveDepartamentoNormalizada(departamento: string): string {
  return normalizarTexto(departamento);
}

function separarResponsaveis(responsavel: string): string[] {
  const texto = limparTexto(responsavel);
  if (!texto) {
    return [];
  }

  return texto
    .split(/[;,/|]+/g)
    .map((parte) => limparTexto(parte))
    .filter((parte) => parte.length > 0);
}

function adicionarResponsaveisUnicos(destino: string[], origem: string[]): void {
  const existentes = new Set(destino.map((nome) => normalizarTexto(nome)));

  for (const nome of origem) {
    const chave = normalizarTexto(nome);
    if (!chave || existentes.has(chave)) {
      continue;
    }

    destino.push(nome);
    existentes.add(chave);
  }
}

function formatarStatus(status: string): string {
  const t = traducaoAtual();
  const limpo = status.trim();
  if (!limpo) {
    return t.statusNotInformed;
  }
  return traduzirDinamico(limpo);
}

function classeStatus(status: string): string {
  const normalizado = normalizarTexto(status);
  if (!normalizado) {
    return "text-bg-secondary";
  }

  if (normalizado.includes("finalizado")) {
    return "text-bg-success";
  }

  if (normalizado.includes("pendente")) {
    return "text-bg-warning";
  }

  return "text-bg-secondary";
}

function renderizarBadgeStatus(status: string): string {
  const texto = formatarStatus(status);
  const classe = classeStatus(status);
  return `<span class="badge status-badge ${classe}">${escaparHtml(texto)}</span>`;
}

function renderizarTopProblemasPorArea(registros: RegistroParada[]): void {
  const t = traducaoAtual();

  if (!registros.length) {
    ui.problemasPorArea.innerHTML =
      `<div class="col-12"><div class="empty-state">${escaparHtml(t.emptyAreaDetails)}</div></div>`;
    return;
  }

  const porDepartamento = agruparPor(registros, (item) => item.departamento);
  const areas = Array.from(porDepartamento.entries())
    .map(([area, itens]) => {
      const total = itens.reduce((soma, item) => soma + item.minutosParados, 0);
      const topProblemas = gerarRanking(itens, (item) => item.tipo).slice(0, 3);
      const responsaveis = extrairResponsaveis(itens);
      return { area, total, topProblemas, responsaveis };
    })
    .sort((a, b) => b.total - a.total);

  ui.problemasPorArea.innerHTML = areas
    .map((area) => {
      const listaProblemas = area.topProblemas
        .map(
          (problema) =>
            `<li>${escaparHtml(traduzirDinamico(problema.label))} <span class="problem-minutes">(${formatadorNumero.format(problema.total)} ${escaparHtml(t.minuteUnit)})</span></li>`,
        )
        .join("");

      return `
        <div class="col-md-6 col-xl-4">
          <article class="area-card">
            <h3>${escaparHtml(formatarDepartamentoComResponsaveis(area.area, area.responsaveis))}</h3>
            <p class="area-total">${formatadorNumero.format(area.total)} ${escaparHtml(t.minutesInPeriodSuffix)}</p>
            <ol class="problem-list">
              ${listaProblemas || `<li>${escaparHtml(t.noProblemsRegistered)}</li>`}
            </ol>
          </article>
        </div>
      `;
    })
    .join("");
}

function renderizarTabelaProblemas(registros: RegistroParada[]): void {
  const t = traducaoAtual();

  if (!registros.length) {
    ui.corpoTabela.innerHTML =
      `<tr><td colspan="8"><div class="empty-state">${escaparHtml(t.emptyTable)}</div></td></tr>`;
    return;
  }

  const ordenado = [...registros].sort((a, b) => b.minutosParados - a.minutosParados);
  const responsaveisPorDepartamento = mapearResponsaveisPorDepartamento(registros);

  ui.corpoTabela.innerHTML = ordenado
    .map(
      (item) => `
        <tr>
          <td>${escaparHtml(
            formatarDepartamentoComResponsaveis(
              item.departamento,
              responsaveisPorDepartamento.get(chaveDepartamentoNormalizada(item.departamento)) ??
                separarResponsaveis(item.responsavel),
            ),
          )}</td>
          <td>${escaparHtml(item.turno)}</td>
          <td>${escaparHtml(item.linha)}</td>
          <td>${escaparHtml(traduzirDinamico(item.tipo))}</td>
          <td>${escaparHtml(traduzirDinamico(item.descricao))}</td>
          <td>${escaparHtml(traduzirDinamico(item.modelo))}</td>
          <td class="text-end fw-bold">${formatadorNumero.format(item.minutosParados)}</td>
          <td>${renderizarBadgeStatus(item.status)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderizarEstadoVazio(): void {
  const t = traducaoAtual();

  ui.kpiOcorrencias.textContent = "0";
  ui.kpiMinutosBrutos.textContent = "00:00";
  ui.kpiAreas.textContent = "0";

  destruirGraficoAreas();
  ui.legendaAreas.innerHTML = `<li class="empty-state">${escaparHtml(t.emptyGeneric)}</li>`;
  ui.rankingTurnos.innerHTML = `<div class="empty-state">${escaparHtml(t.emptyGeneric)}</div>`;
  ui.problemasPorArea.innerHTML = `<div class="col-12"><div class="empty-state">${escaparHtml(t.emptyGeneric)}</div></div>`;
  ui.corpoTabela.innerHTML = `<tr><td colspan="8"><div class="empty-state">${escaparHtml(t.emptyGeneric)}</div></td></tr>`;
}

function formatarDuracaoHoras(totalMinutos: number): string {
  const minutosInteiros = Math.max(0, Math.round(totalMinutos));
  const horas = Math.floor(minutosInteiros / 60);
  const minutos = minutosInteiros % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function gerarRanking(registros: RegistroParada[], chave: (item: RegistroParada) => string): ItemRanking[] {
  const acumulado = new Map<string, number>();

  for (const item of registros) {
    const label = chave(item) || "Sem informação";
    acumulado.set(label, (acumulado.get(label) ?? 0) + item.minutosParados);
  }

  return Array.from(acumulado.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total);
}

function agruparPor(
  registros: RegistroParada[],
  chave: (item: RegistroParada) => string,
): Map<string, RegistroParada[]> {
  const mapa = new Map<string, RegistroParada[]>();

  for (const item of registros) {
    const grupo = chave(item) || "Sem informação";
    const lista = mapa.get(grupo);

    if (lista) {
      lista.push(item);
    } else {
      mapa.set(grupo, [item]);
    }
  }

  return mapa;
}

function ordenarTurnos(a: string, b: string): number {
  const aNumero = Number.parseInt(a, 10);
  const bNumero = Number.parseInt(b, 10);

  if (Number.isFinite(aNumero) && Number.isFinite(bNumero)) {
    return aNumero - bNumero;
  }

  return a.localeCompare(b, traducaoAtual().locale);
}

function ordenarRotulosNumericos(a: string, b: string): number {
  return a.localeCompare(b, traducaoAtual().locale, { numeric: true });
}

function ordenarMeses(a: string, b: string): number {
  if (a === "sem-mes") {
    return 1;
  }
  if (b === "sem-mes") {
    return -1;
  }
  return a.localeCompare(b);
}

function gerarCoresPizza(quantidade: number): string[] {
  const cores: string[] = [];

  for (let i = 0; i < quantidade; i += 1) {
    const hue = Math.round((360 / quantidade) * i);
    cores.push(`hsl(${hue}, 68%, 45%)`);
  }

  return cores;
}

function converterNumero(valor: unknown): number {
  if (typeof valor === "number") {
    return valor;
  }

  if (typeof valor === "string") {
    const normalizado = valor.trim().replace(/\./g, "").replace(",", ".");
    const numero = Number(normalizado);
    return Number.isFinite(numero) ? numero : Number.NaN;
  }

  return Number.NaN;
}

function converterData(valor: unknown): Date | null {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor;
  }

  if (typeof valor === "number") {
    const parseada = XLSX.SSF.parse_date_code(valor);
    if (parseada) {
      return new Date(Date.UTC(parseada.y, parseada.m - 1, parseada.d));
    }
  }

  if (typeof valor === "string") {
    const texto = valor.trim();
    if (!texto) {
      return null;
    }

    const br = texto.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (br) {
      const diaTexto = br[1];
      const mesTexto = br[2];
      const anoTexto = br[3];
      if (!diaTexto || !mesTexto || !anoTexto) {
        return null;
      }

      const dia = Number(diaTexto);
      const mes = Number(mesTexto);
      const ano = Number(anoTexto.length === 2 ? `20${anoTexto}` : anoTexto);
      return new Date(Date.UTC(ano, mes - 1, dia));
    }

    const tentativa = new Date(texto);
    if (!Number.isNaN(tentativa.getTime())) {
      return tentativa;
    }
  }

  return null;
}

function formatarChaveData(data: Date): string {
  const ano = data.getUTCFullYear();
  const mes = `${data.getUTCMonth() + 1}`.padStart(2, "0");
  const dia = `${data.getUTCDate()}`.padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarChaveMes(data: Date): string {
  const ano = data.getUTCFullYear();
  const mes = `${data.getUTCMonth() + 1}`.padStart(2, "0");
  return `${ano}-${mes}`;
}

function formatarLabelData(chave: string): string {
  const t = traducaoAtual();

  if (chave === "sem-data") {
    return t.allDays;
  }

  const [ano, mes, dia] = chave.split("-");
  if (!ano || !mes || !dia) {
    return chave;
  }

  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return formatadorData.format(data);
}

function formatarLabelMes(chave: string): string {
  const t = traducaoAtual();

  if (chave === "sem-mes") {
    return t.allMonths;
  }

  const [ano, mes] = chave.split("-");
  if (!ano || !mes) {
    return chave;
  }

  const data = new Date(Number(ano), Number(mes) - 1, 1);
  return data.toLocaleDateString(t.locale, { month: "long", year: "numeric" });
}

function limparTexto(valor: unknown): string {
  if (valor === null || valor === undefined) {
    return "";
  }

  return String(valor).replace(/\s+/g, " ").trim();
}

function normalizarTexto(valor: unknown): string {
  return limparTexto(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function linhaTemConteudo(linha: unknown[]): boolean {
  return linha.some((item) => item !== null && item !== undefined && String(item).trim() !== "");
}

function escaparHtml(valor: string): string {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function obterElemento<T extends HTMLElement>(id: string): T {
  const elemento = document.getElementById(id);
  if (!elemento) {
    throw new Error(`Elemento #${id} não encontrado.`);
  }

  return elemento as T;
}
