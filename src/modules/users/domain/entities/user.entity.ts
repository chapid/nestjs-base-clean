import { InvalidUserNameException } from '../exceptions/user.exceptions';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public avatar: string
  ) {}

  updateName(name: string) {
    if (!name || name.trim() === '') {
      throw new InvalidUserNameException();
    }
    this.name = name.trim();
  }

  // Método adicional para validar el usuario completo
  validate(): void {
    if (!this.name || this.name.trim() === '') {
      throw new InvalidUserNameException();
    }
  }

  // Método para obtener información pública del usuario
  getPublicInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar
    };
  }
}