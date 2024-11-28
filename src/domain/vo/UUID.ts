import crypto from "crypto";

export default class UUID {
  private value: string;

  constructor(value: string) {
    if (!UUID.isValid(value)) throw new Error("Invalid UUID");
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  static create(): UUID {
    return new UUID(crypto.randomUUID());
  }

  static isValid(value: string): boolean {
    return /^[a-z,0-9,-]{36,36}$/.test(value);
  }
}
