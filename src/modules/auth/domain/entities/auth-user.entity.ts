export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name?: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(id: string, email: string, passwordHash: string, name?: string): AuthUser {
    return new AuthUser(id, email, passwordHash, name);
  }

  // Método para obtener datos seguros (sin password)
  toSafeObject() {
    const { passwordHash, ...safeData } = this;
    return safeData;
  }
}