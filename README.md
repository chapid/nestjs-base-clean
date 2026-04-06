<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

# 🚀 Proyecto NestJS + Clean Architecture

Este proyecto está estructurado siguiendo los principios de **Clean Architecture**, permitiendo un bajo acoplamiento, alta mantenibilidad y facilidad para cambiar tecnologías como la base de datos o el framework.

---

# 🧱 Estructura del Proyecto

```bash
src/
 ├── modules/
 │    ├── user/
 │    │    ├── domain/
 │    │    │    ├── entities/
 │    │    │    ├── repositories/
 │    │    │
 │    │    ├── application/
 │    │    │    ├── use-cases/
 │    │    │
 │    │    ├── infrastructure/
 │    │    │    ├── database/
 │    │    │    ├── repositories/
 │    │    │
 │    │    ├── presentation/
 │    │    │    ├── controllers/
 │    │    │    ├── dtos/
 │    │    │
 │    │    ├── user.module.ts
 │    │
 │    ├── auth/
 │    │    ├── domain/
 │    │    ├── application/
 │    │    ├── infrastructure/
 │    │    ├── presentation/
 │    │    ├── auth.module.ts
 │
 ├── shared/
 │    ├── domain/
 │    ├── application/
 │    ├── infrastructure/
 │    ├── utils/
 │    ├── decorators/
 │    ├── guards/
 │
 ├── app.module.ts
```

---

## 🧠 Descripción de capas

### 🔹 Domain

* Contiene la lógica más pura del negocio.
* ❌ NO depende de frameworks (NestJS, Mongoose, etc).
* ❌ NO contiene librerías externas.
* ✔️ Solo reglas de negocio.

**entities/**

* Modelos del dominio.

**repositories/**

* Contratos (interfaces).
* ⚠️ IMPORTANTE: aquí defines **qué necesitas**, no cómo se implementa.

---

### 🔹 Application

* Contiene los **casos de uso**.
* 👉 Es el **cerebro del negocio**.
* ❌ No sabe si usas Mongo, Postgres o cualquier otra tecnología.

---

### 🔹 Infrastructure

* Implementaciones concretas.
* Aquí se conectan tecnologías externas.

**database/**

* Configuración de base de datos.

**repositories/**

* Implementación de los contratos del dominio.
* ✔️ Aquí sí usas Mongo, TypeORM, etc.
* 🔄 Puedes cambiar la base de datos sin afectar dominio ni application.

---

### 🔹 Presentation

* Aquí vive NestJS.
* Maneja HTTP, validaciones, Swagger, etc.

**controllers/**

* Endpoints de la API.

**dtos/**

* Objetos de transferencia de datos.
* ✔️ Aquí van validaciones (`class-validator`) y Swagger.

---

# ⚙️ Comandos básicos

## 1. Crear proyecto

```bash
nest new nombre-del-proyecto
```

## 2. Instalar dependencias

```bash
pnpm install
```

## 3. Ejecutar proyecto

```bash
pnpm run start:dev
```

---

# 📦 Dependencias principales

## MongoDB

```bash
pnpm add @nestjs/mongoose mongoose
```

---

## Docker (Base de datos)

```bash
docker-compose up -d
```

---

## Swagger

```bash
pnpm add @nestjs/swagger swagger-ui-express class-validator
```

⚠️ Importante:

* Los decoradores de Swagger deben ir **solo en la capa de presentación (DTOs)**.

---

## Testing (Jest)

```bash
pnpm install --save-dev jest @types/jest ts-jest
```

Pasos importantes:

* ❌ Eliminar configuración de Jest del `package.json`
* ✅ Crear archivo propio `jest.config.js`

---

## Configuración global

```bash
npm install @nestjs/config
```

---

## Logger

```bash
npm install winston nest-winston
```

---

## Autenticación

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
```

Tipos:

```bash
pnpm add -D @types/passport-jwt @types/bcrypt
```

---

# 🔐 Seguridad

## Guards

* Se utilizan para proteger endpoints.
* Permiten validar autenticación (JWT) y autorización (roles, permisos).

---

# 🧠 Principios clave

* ✅ El dominio NO depende de nadie.
* ✅ La base de datos es un detalle.
* ✅ NestJS vive en la capa de presentación.
* ✅ Se programa contra interfaces, no implementaciones.
* ✅ Fácil cambio de tecnología (Mongo → Postgres).

---

# 🚀 Beneficios

* 🔄 Alta escalabilidad
* 🧪 Fácil testing
* 🔌 Bajo acoplamiento
* 🧠 Código mantenible
* ⚡ Preparado para cambios futuros

---

# 📌 Notas finales

Este proyecto está diseñado para ser:

* Independiente del framework
* Fácil de mantener
* Escalable a nivel empresarial

---

**Autor:** Proyecto basado en buenas prácticas de Clean Architecture + NestJS 🚀



## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
