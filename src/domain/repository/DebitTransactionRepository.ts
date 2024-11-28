import DebitTransaction from "@/domain/entities/DebitTransaction";

export default interface DebitTransactionRepository {
  create(DebitTransaction: DebitTransaction): Promise<void>;
  findById(id: string): Promise<DebitTransaction | undefined>;
}
