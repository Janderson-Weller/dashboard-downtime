export type LanguageCode = "pt-BR" | "en" | "zh-CN" | "de" | "es" | "ar";

export type TranslationPack = {
  nativeName: string;
  locale: string;
  rtl: boolean;
  pageTitle: string;
  uploadEyebrow: string;
  uploadTitle: string;
  uploadSubtitle: string;
  uploadDropTitle: string;
  uploadDropHint: string;
  uploadButton: string;
  replaceFileButton: string;
  waitingFile: string;
  invalidFileType: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  heroEyebrow: string;
  heroTitle: string;
  loadingSheet: string;
  loadingData: string;
  loadingTranslation: string;
  languageLabel: string;
  kpiEvents: string;
  kpiGrossMinutes: string;
  kpiLineMinutes: string;
  kpiAreas: string;
  kpiLosses: string;
  kpiUnitValue: string;
  filterMonth: string;
  filterDay: string;
  filterShift: string;
  filterDepartment: string;
  filterLine: string;
  filterTableStatus: string;
  allMonths: string;
  allDays: string;
  allShifts: string;
  allDepartments: string;
  allLines: string;
  allStatuses: string;
  areasCardTitle: string;
  areasCardPill: string;
  lossesCardTitle: string;
  lossesCardPill: string;
  lossesPieAriaLabel: string;
  pieceUnit: string;
  shiftsCardTitle: string;
  shiftsCardPill: string;
  problemsByAreaTitle: string;
  problemsByAreaPill: string;
  tableCardTitle: string;
  tableCardPill: string;
  thDepartment: string;
  thShift: string;
  thLine: string;
  thType: string;
  thDescription: string;
  thModel: string;
  thStatus: string;
  thMinutes: string;
  thPiecesLost: string;
  piecesLostSuffix: string;
  pieAriaLabel: string;
  emptyChart: string;
  emptyShifts: string;
  emptyAreaDetails: string;
  emptyTable: string;
  emptyGeneric: string;
  noProblemsRegistered: string;
  minutesInPeriodSuffix: string;
  minuteUnit: string;
  shiftPrefix: string;
  linePrefix: string;
  noResponsible: string;
  statusNotInformed: string;
  occurrenceSingular: string;
  occurrencePlural: string;
  errorPrefix: string;
  loadDataFailure: string;
};

export const DEFAULT_LANGUAGE: LanguageCode = "pt-BR";

export const TRANSLATIONS: Record<LanguageCode, TranslationPack> = {
  "pt-BR": {
    nativeName: "Português (Brasil)",
    locale: "pt-BR",
    rtl: false,
    pageTitle: "Dashboard de Paradas",
    uploadEyebrow: "Base de dados",
    uploadTitle: "Envie a planilha para iniciar o dashboard",
    uploadSubtitle: "Arraste o arquivo XLSX ou selecione no seu computador.",
    uploadDropTitle: "Arraste e solte o arquivo aqui",
    uploadDropHint: "Formato aceito: .xlsx",
    uploadButton: "Selecionar arquivo",
    replaceFileButton: "Trocar arquivo",
    waitingFile: "Selecione uma planilha para carregar o dashboard.",
    invalidFileType: "Arquivo inválido. Envie um arquivo .xlsx.",
    themeLabel: "Tema",
    themeLight: "Claro",
    themeDark: "Escuro",
    heroEyebrow: "Operações e Confiabilidade",
    heroTitle: "Parada de Linha Packing",
    loadingSheet: "Carregando planilha...",
    loadingData: "Carregando dados...",
    loadingTranslation: "Traduzindo dados...",
    languageLabel: "Idioma",
    kpiEvents: "Ocorrências",
    kpiGrossMinutes: "Horas paradas",
    kpiLineMinutes: "Minutos reais de linha",
    kpiAreas: "Áreas impactadas",
    kpiLosses: "Total de perdas",
    kpiUnitValue: "Valor total",
    filterMonth: "Filtrar por mês",
    filterDay: "Filtrar por dia",
    filterShift: "Filtrar por turno",
    filterDepartment: "Filtrar por departamento",
    filterLine: "Filtrar por linha",
    filterTableStatus: "Filtrar status da tabela",
    allMonths: "Todos os meses",
    allDays: "Todos os dias",
    allShifts: "Todos os turnos",
    allDepartments: "Todos os departamentos",
    allLines: "Todas as linhas",
    allStatuses: "Todos os status",
    areasCardTitle: "Áreas por tempo de parada",
    areasCardPill: "Ordenado do maior para o menor",
    lossesCardTitle: "Áreas por peças perdidas",
    lossesCardPill: "Ordenado do maior para o menor",
    lossesPieAriaLabel: "Gráfico de pizza das áreas por perdas",
    pieceUnit: "pçs",
    shiftsCardTitle: "Top 3 turnos com mais parada",
    shiftsCardPill: "Acumulado por turno",
    problemsByAreaTitle: "Top 3 problemas de cada área",
    problemsByAreaPill: "Ranking por tipo de problema",
    tableCardTitle: "Tabela de problemas",
    tableCardPill: "Registros filtrados",
    thDepartment: "Departamento",
    thShift: "Turno",
    thLine: "Linha",
    thType: "Tipo",
    thDescription: "Descrição",
    thModel: "Modelo do produto",
    thStatus: "Status",
    thMinutes: "Minutos",
    thPiecesLost: "Peças perdidas",
    piecesLostSuffix: "peças perdidas",
    pieAriaLabel: "Gráfico de pizza das áreas",
    emptyChart: "Sem dados para exibir o gráfico.",
    emptyShifts: "Sem dados para o ranking de turnos.",
    emptyAreaDetails: "Sem dados para detalhar problemas por área.",
    emptyTable: "Nenhum problema encontrado para os filtros aplicados.",
    emptyGeneric: "Sem dados para exibir.",
    noProblemsRegistered: "Sem problemas registrados.",
    minutesInPeriodSuffix: "minutos no período",
    minuteUnit: "min",
    shiftPrefix: "Turno",
    linePrefix: "Linha",
    noResponsible: "Sem responsável",
    statusNotInformed: "Não informado",
    occurrenceSingular: "ocorrência",
    occurrencePlural: "ocorrências",
    errorPrefix: "Erro",
    loadDataFailure: "Falha ao carregar os dados.",
  },
  en: {
    nativeName: "English",
    locale: "en-US",
    rtl: false,
    pageTitle: "Downtime Dashboard",
    uploadEyebrow: "Data source",
    uploadTitle: "Upload the spreadsheet to start the dashboard",
    uploadSubtitle: "Drag an XLSX file here or select one from your computer.",
    uploadDropTitle: "Drag and drop the file here",
    uploadDropHint: "Accepted format: .xlsx",
    uploadButton: "Select file",
    replaceFileButton: "Replace file",
    waitingFile: "Select a spreadsheet to load the dashboard.",
    invalidFileType: "Invalid file. Please upload a .xlsx file.",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    heroEyebrow: "Operations and Reliability",
    heroTitle: "Packing Line Downtime",
    loadingSheet: "Loading spreadsheet...",
    loadingData: "Loading data...",
    loadingTranslation: "Translating data...",
    languageLabel: "Language",
    kpiEvents: "Events",
    kpiGrossMinutes: "Downtime hours",
    kpiLineMinutes: "Real line minutes",
    kpiAreas: "Impacted areas",
    kpiLosses: "Total losses",
    kpiUnitValue: "Total value",
    filterMonth: "Filter by month",
    filterDay: "Filter by day",
    filterShift: "Filter by shift",
    filterDepartment: "Filter by department",
    filterLine: "Filter by line",
    filterTableStatus: "Filter table status",
    allMonths: "All months",
    allDays: "All days",
    allShifts: "All shifts",
    allDepartments: "All departments",
    allLines: "All lines",
    allStatuses: "All statuses",
    areasCardTitle: "Areas by downtime",
    areasCardPill: "Sorted from highest to lowest",
    lossesCardTitle: "Areas by lost pieces",
    lossesCardPill: "Sorted from highest to lowest",
    lossesPieAriaLabel: "Areas pie chart by losses",
    pieceUnit: "pcs",
    shiftsCardTitle: "Top 3 shifts with most downtime",
    shiftsCardPill: "Total by shift",
    problemsByAreaTitle: "Top 3 problems by area",
    problemsByAreaPill: "Ranking by problem type",
    tableCardTitle: "Problems table",
    tableCardPill: "Filtered records",
    thDepartment: "Department",
    thShift: "Shift",
    thLine: "Line",
    thType: "Type",
    thDescription: "Description",
    thModel: "Product model",
    thStatus: "Status",
    thMinutes: "Minutes",
    thPiecesLost: "Lost pieces",
    piecesLostSuffix: "pieces lost",
    pieAriaLabel: "Areas pie chart",
    emptyChart: "No data to display the chart.",
    emptyShifts: "No data for shift ranking.",
    emptyAreaDetails: "No data to detail problems by area.",
    emptyTable: "No problems found for the selected filters.",
    emptyGeneric: "No data to display.",
    noProblemsRegistered: "No problems registered.",
    minutesInPeriodSuffix: "minutes in period",
    minuteUnit: "min",
    shiftPrefix: "Shift",
    linePrefix: "Line",
    noResponsible: "Unassigned",
    statusNotInformed: "Not informed",
    occurrenceSingular: "event",
    occurrencePlural: "events",
    errorPrefix: "Error",
    loadDataFailure: "Failed to load data.",
  },
  "zh-CN": {
    nativeName: "简体中文",
    locale: "zh-CN",
    rtl: false,
    pageTitle: "停线看板",
    uploadEyebrow: "数据源",
    uploadTitle: "上传表格以启动看板",
    uploadSubtitle: "将 XLSX 文件拖到此处，或从电脑中选择文件。",
    uploadDropTitle: "将文件拖放到这里",
    uploadDropHint: "支持格式：.xlsx",
    uploadButton: "选择文件",
    replaceFileButton: "更换文件",
    waitingFile: "请选择一个表格以加载看板。",
    invalidFileType: "文件无效。请上传 .xlsx 文件。",
    themeLabel: "主题",
    themeLight: "浅色",
    themeDark: "深色",
    heroEyebrow: "运营与可靠性",
    heroTitle: "包装线停线",
    loadingSheet: "正在加载表格...",
    loadingData: "正在加载数据...",
    loadingTranslation: "正在翻译数据...",
    languageLabel: "语言",
    kpiEvents: "事件数",
    kpiGrossMinutes: "停机小时",
    kpiLineMinutes: "产线实际分钟",
    kpiAreas: "受影响区域",
    kpiLosses: "损失总数",
    kpiUnitValue: "总价值",
    filterMonth: "按月份筛选",
    filterDay: "按日期筛选",
    filterShift: "按班次筛选",
    filterDepartment: "按部门筛选",
    filterLine: "按产线筛选",
    filterTableStatus: "按表格状态筛选",
    allMonths: "全部月份",
    allDays: "全部日期",
    allShifts: "全部班次",
    allDepartments: "全部部门",
    allLines: "全部产线",
    allStatuses: "全部状态",
    areasCardTitle: "按停机时长的区域",
    areasCardPill: "按从高到低排序",
    lossesCardTitle: "按损失数量的区域",
    lossesCardPill: "按从高到低排序",
    lossesPieAriaLabel: "区域按损失饼图",
    pieceUnit: "件",
    shiftsCardTitle: "停机最多的前3个班次",
    shiftsCardPill: "按班次汇总",
    problemsByAreaTitle: "各区域前3个问题",
    problemsByAreaPill: "按问题类型排名",
    tableCardTitle: "问题明细表",
    tableCardPill: "筛选后记录",
    thDepartment: "部门",
    thShift: "班次",
    thLine: "产线",
    thType: "类型",
    thDescription: "描述",
    thModel: "产品型号",
    thStatus: "状态",
    thMinutes: "分钟",
    thPiecesLost: "损失件数",
    piecesLostSuffix: "件已损失",
    pieAriaLabel: "区域饼图",
    emptyChart: "没有可显示的图表数据。",
    emptyShifts: "没有班次排名数据。",
    emptyAreaDetails: "没有可按区域展开的问题数据。",
    emptyTable: "当前筛选条件下没有问题记录。",
    emptyGeneric: "暂无可显示数据。",
    noProblemsRegistered: "暂无问题记录。",
    minutesInPeriodSuffix: "分钟（当前周期）",
    minuteUnit: "分钟",
    shiftPrefix: "班次",
    linePrefix: "产线",
    noResponsible: "未指定负责人",
    statusNotInformed: "未提供",
    occurrenceSingular: "事件",
    occurrencePlural: "事件",
    errorPrefix: "错误",
    loadDataFailure: "数据加载失败。",
  },
  de: {
    nativeName: "Deutsch",
    locale: "de-DE",
    rtl: false,
    pageTitle: "Stillstands-Dashboard",
    uploadEyebrow: "Datenquelle",
    uploadTitle: "Laden Sie die Tabelle hoch, um das Dashboard zu starten",
    uploadSubtitle: "Ziehen Sie eine XLSX-Datei hierher oder wählen Sie sie auf Ihrem Computer aus.",
    uploadDropTitle: "Datei hierher ziehen und ablegen",
    uploadDropHint: "Akzeptiertes Format: .xlsx",
    uploadButton: "Datei auswählen",
    replaceFileButton: "Datei wechseln",
    waitingFile: "Wählen Sie eine Tabelle, um das Dashboard zu laden.",
    invalidFileType: "Ungültige Datei. Bitte laden Sie eine .xlsx-Datei hoch.",
    themeLabel: "Design",
    themeLight: "Hell",
    themeDark: "Dunkel",
    heroEyebrow: "Betrieb und Zuverlässigkeit",
    heroTitle: "Stillstand der Verpackungslinie",
    loadingSheet: "Tabelle wird geladen...",
    loadingData: "Daten werden geladen...",
    loadingTranslation: "Daten werden übersetzt...",
    languageLabel: "Sprache",
    kpiEvents: "Ereignisse",
    kpiGrossMinutes: "Stillstandsstunden",
    kpiLineMinutes: "Reale Linienminuten",
    kpiAreas: "Betroffene Bereiche",
    kpiLosses: "Verluste gesamt",
    kpiUnitValue: "Gesamtwert",
    filterMonth: "Nach Monat filtern",
    filterDay: "Nach Tag filtern",
    filterShift: "Nach Schicht filtern",
    filterDepartment: "Nach Abteilung filtern",
    filterLine: "Nach Linie filtern",
    filterTableStatus: "Tabellenstatus filtern",
    allMonths: "Alle Monate",
    allDays: "Alle Tage",
    allShifts: "Alle Schichten",
    allDepartments: "Alle Abteilungen",
    allLines: "Alle Linien",
    allStatuses: "Alle Status",
    areasCardTitle: "Bereiche nach Stillstandszeit",
    areasCardPill: "Absteigend sortiert",
    lossesCardTitle: "Bereiche nach verlorenen Stücken",
    lossesCardPill: "Absteigend sortiert",
    lossesPieAriaLabel: "Bereichs-Kreisdiagramm nach Verlusten",
    pieceUnit: "Stk",
    shiftsCardTitle: "Top 3 Schichten mit den meisten Ausfällen",
    shiftsCardPill: "Summiert nach Schicht",
    problemsByAreaTitle: "Top 3 Probleme je Bereich",
    problemsByAreaPill: "Ranking nach Problemtyp",
    tableCardTitle: "Problemtabelle",
    tableCardPill: "Gefilterte Datensätze",
    thDepartment: "Abteilung",
    thShift: "Schicht",
    thLine: "Linie",
    thType: "Typ",
    thDescription: "Beschreibung",
    thModel: "Produktmodell",
    thStatus: "Status",
    thMinutes: "Minuten",
    thPiecesLost: "Verlorene Stücke",
    piecesLostSuffix: "Stücke verloren",
    pieAriaLabel: "Bereichs-Kreisdiagramm",
    emptyChart: "Keine Daten für das Diagramm.",
    emptyShifts: "Keine Daten für das Schichtranking.",
    emptyAreaDetails: "Keine Daten für Problemdetails pro Bereich.",
    emptyTable: "Keine Probleme für die gewählten Filter gefunden.",
    emptyGeneric: "Keine Daten zum Anzeigen.",
    noProblemsRegistered: "Keine Probleme registriert.",
    minutesInPeriodSuffix: "Minuten im Zeitraum",
    minuteUnit: "Min",
    shiftPrefix: "Schicht",
    linePrefix: "Linie",
    noResponsible: "Kein Verantwortlicher",
    statusNotInformed: "Nicht angegeben",
    occurrenceSingular: "Ereignis",
    occurrencePlural: "Ereignisse",
    errorPrefix: "Fehler",
    loadDataFailure: "Daten konnten nicht geladen werden.",
  },
  es: {
    nativeName: "Español",
    locale: "es-ES",
    rtl: false,
    pageTitle: "Panel de Paradas",
    uploadEyebrow: "Fuente de datos",
    uploadTitle: "Sube la hoja para iniciar el panel",
    uploadSubtitle: "Arrastra un archivo XLSX aquí o selecciónalo desde tu equipo.",
    uploadDropTitle: "Arrastra y suelta el archivo aquí",
    uploadDropHint: "Formato aceptado: .xlsx",
    uploadButton: "Seleccionar archivo",
    replaceFileButton: "Cambiar archivo",
    waitingFile: "Selecciona una hoja para cargar el panel.",
    invalidFileType: "Archivo no válido. Sube un archivo .xlsx.",
    themeLabel: "Tema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    heroEyebrow: "Operaciones y Confiabilidad",
    heroTitle: "Parada de Línea de Empaque",
    loadingSheet: "Cargando hoja...",
    loadingData: "Cargando datos...",
    loadingTranslation: "Traduciendo datos...",
    languageLabel: "Idioma",
    kpiEvents: "Eventos",
    kpiGrossMinutes: "Horas de parada",
    kpiLineMinutes: "Minutos reales de línea",
    kpiAreas: "Áreas impactadas",
    kpiLosses: "Total de pérdidas",
    kpiUnitValue: "Valor total",
    filterMonth: "Filtrar por mes",
    filterDay: "Filtrar por día",
    filterShift: "Filtrar por turno",
    filterDepartment: "Filtrar por departamento",
    filterLine: "Filtrar por línea",
    filterTableStatus: "Filtrar estado de la tabla",
    allMonths: "Todos los meses",
    allDays: "Todos los días",
    allShifts: "Todos los turnos",
    allDepartments: "Todos los departamentos",
    allLines: "Todas las líneas",
    allStatuses: "Todos los estados",
    areasCardTitle: "Áreas por tiempo de parada",
    areasCardPill: "Ordenado de mayor a menor",
    lossesCardTitle: "Áreas por piezas perdidas",
    lossesCardPill: "Ordenado de mayor a menor",
    lossesPieAriaLabel: "Gráfico circular de áreas por pérdidas",
    pieceUnit: "pzs",
    shiftsCardTitle: "Top 3 turnos con más paradas",
    shiftsCardPill: "Acumulado por turno",
    problemsByAreaTitle: "Top 3 problemas por área",
    problemsByAreaPill: "Ranking por tipo de problema",
    tableCardTitle: "Tabla de problemas",
    tableCardPill: "Registros filtrados",
    thDepartment: "Departamento",
    thShift: "Turno",
    thLine: "Línea",
    thType: "Tipo",
    thDescription: "Descripción",
    thModel: "Modelo del producto",
    thStatus: "Estado",
    thMinutes: "Minutos",
    thPiecesLost: "Piezas perdidas",
    piecesLostSuffix: "piezas perdidas",
    pieAriaLabel: "Gráfico circular de áreas",
    emptyChart: "Sin datos para mostrar el gráfico.",
    emptyShifts: "Sin datos para el ranking de turnos.",
    emptyAreaDetails: "Sin datos para detallar problemas por área.",
    emptyTable: "No se encontraron problemas para los filtros aplicados.",
    emptyGeneric: "Sin datos para mostrar.",
    noProblemsRegistered: "Sin problemas registrados.",
    minutesInPeriodSuffix: "minutos en el período",
    minuteUnit: "min",
    shiftPrefix: "Turno",
    linePrefix: "Línea",
    noResponsible: "Sin responsable",
    statusNotInformed: "No informado",
    occurrenceSingular: "evento",
    occurrencePlural: "eventos",
    errorPrefix: "Error",
    loadDataFailure: "Error al cargar los datos.",
  },
  ar: {
    nativeName: "العربية",
    locale: "ar",
    rtl: true,
    pageTitle: "لوحة توقف الخط",
    uploadEyebrow: "مصدر البيانات",
    uploadTitle: "ارفع ملف الجدول لبدء لوحة المعلومات",
    uploadSubtitle: "اسحب ملف XLSX هنا أو اختره من جهازك.",
    uploadDropTitle: "اسحب الملف وأفلته هنا",
    uploadDropHint: "الصيغة المدعومة: .xlsx",
    uploadButton: "اختيار ملف",
    replaceFileButton: "تغيير الملف",
    waitingFile: "اختر ملف جدول لتحميل لوحة المعلومات.",
    invalidFileType: "ملف غير صالح. يرجى رفع ملف .xlsx.",
    themeLabel: "السمة",
    themeLight: "فاتح",
    themeDark: "داكن",
    heroEyebrow: "العمليات والاعتمادية",
    heroTitle: "توقف خط التعبئة",
    loadingSheet: "جاري تحميل الملف...",
    loadingData: "جاري تحميل البيانات...",
    loadingTranslation: "جاري ترجمة البيانات...",
    languageLabel: "اللغة",
    kpiEvents: "عدد الحالات",
    kpiGrossMinutes: "ساعات التوقف",
    kpiLineMinutes: "دقائق الخط الفعلية",
    kpiAreas: "المناطق المتأثرة",
    kpiLosses: "إجمالي الخسائر",
    kpiUnitValue: "القيمة الإجمالية",
    filterMonth: "تصفية حسب الشهر",
    filterDay: "تصفية حسب اليوم",
    filterShift: "تصفية حسب الوردية",
    filterDepartment: "تصفية حسب القسم",
    filterLine: "تصفية حسب الخط",
    filterTableStatus: "تصفية حالة الجدول",
    allMonths: "كل الأشهر",
    allDays: "كل الأيام",
    allShifts: "كل الورديات",
    allDepartments: "كل الأقسام",
    allLines: "كل الخطوط",
    allStatuses: "كل الحالات",
    areasCardTitle: "المناطق حسب زمن التوقف",
    areasCardPill: "مرتبة من الأكبر إلى الأصغر",
    lossesCardTitle: "المناطق حسب القطع المفقودة",
    lossesCardPill: "مرتبة من الأكبر إلى الأصغر",
    lossesPieAriaLabel: "مخطط دائري للمناطق حسب الخسائر",
    pieceUnit: "قطعة",
    shiftsCardTitle: "أكثر 3 ورديات توقفاً",
    shiftsCardPill: "إجمالي حسب الوردية",
    problemsByAreaTitle: "أعلى 3 مشاكل لكل منطقة",
    problemsByAreaPill: "ترتيب حسب نوع المشكلة",
    tableCardTitle: "جدول المشاكل",
    tableCardPill: "السجلات المفلترة",
    thDepartment: "القسم",
    thShift: "الوردية",
    thLine: "الخط",
    thType: "النوع",
    thDescription: "الوصف",
    thModel: "طراز المنتج",
    thStatus: "الحالة",
    thMinutes: "الدقائق",
    thPiecesLost: "القطع المفقودة",
    piecesLostSuffix: "قطعة مفقودة",
    pieAriaLabel: "مخطط دائري للمناطق",
    emptyChart: "لا توجد بيانات لعرض المخطط.",
    emptyShifts: "لا توجد بيانات لترتيب الورديات.",
    emptyAreaDetails: "لا توجد بيانات لتفصيل المشاكل حسب المنطقة.",
    emptyTable: "لم يتم العثور على مشاكل وفق الفلاتر المحددة.",
    emptyGeneric: "لا توجد بيانات للعرض.",
    noProblemsRegistered: "لا توجد مشاكل مسجلة.",
    minutesInPeriodSuffix: "دقيقة خلال الفترة",
    minuteUnit: "د",
    shiftPrefix: "وردية",
    linePrefix: "خط",
    noResponsible: "بدون مسؤول",
    statusNotInformed: "غير محدد",
    occurrenceSingular: "حالة",
    occurrencePlural: "حالات",
    errorPrefix: "خطأ",
    loadDataFailure: "فشل تحميل البيانات.",
  },
};

export const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string }> = [
  { code: "pt-BR", label: TRANSLATIONS["pt-BR"].nativeName },
  { code: "en", label: TRANSLATIONS.en.nativeName },
  { code: "zh-CN", label: TRANSLATIONS["zh-CN"].nativeName },
  { code: "de", label: TRANSLATIONS.de.nativeName },
  { code: "es", label: TRANSLATIONS.es.nativeName },
  { code: "ar", label: TRANSLATIONS.ar.nativeName },
];

export function resolveLanguage(value: string | null | undefined): LanguageCode {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  if (value in TRANSLATIONS) {
    return value as LanguageCode;
  }

  const normalized = value.toLowerCase();

  if (normalized.startsWith("pt")) return "pt-BR";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("de")) return "de";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("ar")) return "ar";

  return DEFAULT_LANGUAGE;
}

export function detectBrowserLanguage(): LanguageCode {
  return resolveLanguage(navigator.language);
}

export function getTranslation(language: LanguageCode): TranslationPack {
  return TRANSLATIONS[language] ?? TRANSLATIONS[DEFAULT_LANGUAGE];
}
