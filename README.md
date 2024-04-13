<p align="center" style="display:flex;align-items: center;justify-content: center;gap: 30px">
  <a href="http://nestjs.com/" target="blank"><img src="https://api.iconify.design/logos:nestjs.svg" width="150" alt="Nest Logo" /></a>
  +
  <a href="http://nestjs.com/" target="blank"><img src="https://api.iconify.design/devicon:oauth.svg" width="150" alt="OAuth2 Logo" /></a>

</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Best practice Authentication & Authorization implementation</p>
  
---

## Navigation

- [Navigation](#navigation)
- [What we have here?](#what-we-have-here)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)
- [Features](#features)
  - [Auth decorator:](#auth-decorator)
  - [Available Auth types:](#available-auth-types)
- [Support](#support)
- [License](#license)

## What we have here?

- NestJs
- Prisma as ORM
- Zod for input validation
- JWT tokens(Access & Refresh tokens)
- Redis for auto-detection refresh token system

## Installation

You need to install and run postgresql as database and redis for auto detection refresh token system.
if you are not installed and run them you can use `docker-compose.yml` file which i provide it for you:

```bash
$ docker compose up -d
```

> You can run separatly by below command too:
>
> ```bash
> $ docker compose up -d redis
> $ docker compose up -d db
> ```

**Run above command just if you do not have postgres & redis on your system.**

```bash
$ git clone https://github.com/dinno7/auth_nestjs
$ cd auth_nestjs
$ npm install
```

## Running the app

```bash
# development watch mode
$ npm run start:dev

# development
$ npm run start

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Features

### Auth decorator:

You can use `@Auth(...AuthTypes)` decorator to define authentication system for special route's handler or controller,
The JWT Bearer token is active for all routes by default and you can deactive it by passing `AuthTypes.None` to `@Auth()` decorator:

```typescript
// Some route handler in controller
@Auth(AuthTypes.None)
routeHandler(){
  // Your codes...
}
```

Also you can append this `@Auth` decorator to hole controller:

```typescript
// Some controller
@Auth(AuthTypes.None)
@Controller('dinno')
export class DinnoController {
  // ...
}
```

### Available Auth types:

There is 3 type of Auth types:

```typescript
AuthTypes.None;
AuthTypes.Bearer; // -> Appended to all routes by default
AuthTypes.ApiKey;
```

<!-- `@Auth(AuthTypes.Bearer)` -->

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
