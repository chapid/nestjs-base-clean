import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  id: String,
  name: String,
  email: String,
  avatar: String,
  passwordHash: { type: String, required: false }, // Campo opcional para autenticación
});