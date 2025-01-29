import CsvConfig from "@/app/types/csv/csv-config";

export default class BancoInterCSVConfig implements CsvConfig {
  readonly EXPECTED_HEADERS = ["Data", "Lançamento", "Categoria", "Tipo", "Valor"];
  readonly MAPPER: Record<string, string> = {
    date: "Data",
    description: "Lançamento",
    installment: "Tipo",
    value: "Valor",
  };
  handleInstallments(data: { [key: string]: string }): number | null {
    const installment = data["Tipo"].includes("Parcela") ? data["Tipo"].replace("Parcela ", "") : null;
    if (!installment) return null;
    const [currentInstallment, totalInstallments] = installment.split("/");
    return currentInstallment == "1"
      ? parseInt(totalInstallments)
      : parseInt(totalInstallments) - parseInt(currentInstallment);
  }
}
