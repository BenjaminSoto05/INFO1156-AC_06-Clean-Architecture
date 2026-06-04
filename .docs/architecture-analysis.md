# Análisis de la Arquitectura Actual

## Descripción de la arquitectura actual
El proyecto utiliza NestJS en una estructura modular por dominios funcionales. Hay un `AppModule` principal que importa `PrismaModule` y los módulos de `Categories`, `Posts`, `Comments`, `Likes` y `Moderation`.

## Componentes detectados
- `src/main.ts`: bootstrap de NestJS, configuración de CORS, assets estáticos y Swagger.
- `src/app.module.ts`: módulo raíz que importa los módulos de dominio e infraestructura.
- `src/shared/prisma.service.ts`: implementación concreta de PrismaClient con `PrismaLibSql`.
- `src/posts/*`: controlador, servicio, DTOs y estrategia de ranking.
- `src/comments/*`, `src/likes/*`, `src/categories/*`, `src/moderation/*`.

## Dependencias
- Marco principal: NestJS (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, etc.).
- ORM: Prisma (`@prisma/client`) con adapter `@prisma/adapter-libsql`.
- Validación: `class-validator`, `class-transformer`.
- Testing: `jest`, `supertest`, `@nestjs/testing`.
- Documentación: `@nestjs/swagger`.

## Problemas arquitectónicos
- Dependencias infraestrucutrail en dominio: `PostsService`, `CommentsService`, `LikesService`, `ModerationService` usan `PrismaService` directamente.
- Mezcla de reglas de negocio con persistencia: p. ej. `PostsService.create()` realiza moderación y persistencia.
- Ausencia de capa intermedia de casos de uso y de repositorios abstraídos.
- Servicios con múltiples responsabilidades y dependencias circulares implícitas.

## Acoplamiento
- Acoplamiento fuerte entre servicios de aplicación y Prisma.
- `CommentsService` y `LikesService` dependen de `PostsService` para validar existencia del post, lo que crea una dependencia de servicio a servicio.
- Controladores acoplan directamente los DTOs con los servicios.

## Cohesión
- Cohesión de módulos funcionales aceptable, pero la cohesión interna de los servicios es baja debido a múltiples responsabilidades.
- `ModerationService` mezcla acceso a datos (`prisma.prohibitedWord`) con lógica de regex y reglas de negocio.

## Patrones arquitectónicos identificados
- Monolito modular con capas implícitas.
- Patrón MVC leve en la capa de presentación: Controladores + Servicios.
- Dependency Injection de NestJS.
- Estrategia/Factory en `FeedRankingStrategyFactory`.
- No se observa Repository ni Use Case formal.
