declare const XLSX: {
  read: (data: ArrayBuffer, options: Record<string, unknown>) => Workbook;
  utils: {
    sheet_to_json: <T = unknown>(sheet: unknown, options: Record<string, unknown>) => T[];
  };
  SSF: {
    parse_date_code: (value: number) => { y: number; m: number; d: number } | null;
  };
};

declare const Chart: any;

interface Workbook {
  SheetNames: string[];
  Sheets: Record<string, unknown>;
}