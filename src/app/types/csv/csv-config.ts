export default interface CsvConfig {
  readonly EXPECTED_HEADERS: string[];
  readonly MAPPER: Record<string, string>;
  handleInstallments(data: { [key: string]: string }): number | null;
}
