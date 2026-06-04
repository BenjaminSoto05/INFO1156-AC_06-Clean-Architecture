# Propuesta de Clean Architecture

## Diseño objetivo
Construir una solución de capas con responsabilidades claras:
- `domain`: entidades, valor objects, interfaces de repositorio y servicios de dominio.
- `application`: casos de uso, DTOs y puertos.
- `infrastructure`: repositorios concretos, Prisma, adaptadores externos.
- `presentation`: controladores, rutas y middleware.

## Estructura propuesta
```
src/
├── application/
│   ├── dto/
│   ├── interfaces/
│   └── use-cases/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   └── value-objects/
├── infrastructure/
│   ├── database/
│   ├── prisma/
│   ├── repositories/
│   └── services/
└── presentation/
    ├── controllers/
    ├── routes/
    └── middlewares/
```

## Casos de uso
- `CreatePostUseCase`
- `ListPostsUseCase`
- `GetFeedUseCase`
- `CreateCommentUseCase`
- `ListCommentsByPostUseCase`
- `AddLikeUseCase`
- `ListCategoriesUseCase`
- `ManageProhibitedWordsUseCase`

## Entidades
- `Post`
- `Comment`
- `Like`
- `Category`
- `ProhibitedWord`

## Adaptadores
- `PrismaPostRepository`
- `PrismaCommentRepository`
- `PrismaLikeRepository`
- `PrismaCategoryRepository`
- `PrismaModerationRepository`

## Repositorios
- `PostRepository` (interfaz)
- `CommentRepository`
- `LikeRepository`
- `CategoryRepository`
- `ModerationRepository`

## Beneficios
- Desacoplamiento entre dominio e infraestructura.
- Reemplazo más fácil de la base de datos.
- Mejor soporte para pruebas unitarias y de integración.
- Control claro de dependencias y flujo de ejecución.
