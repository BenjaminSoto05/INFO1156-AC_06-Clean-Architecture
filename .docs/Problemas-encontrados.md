## Problemas principales basados en Clean Architecture

### 1. Dependencias de infraestructura dentro del dominio
- posts.service.ts, comments.service.ts, likes.service.ts, moderation.service.ts
- Estos servicios usan directamente `PrismaService` para leer/escribir datos.
- En Clean Architecture, la capa de dominio/aplicación no debe depender de detalles de infraestructura como Prisma.

### 2. Ausencia de repositorios y abstracciones
- No existen interfaces `PostRepository`, `CommentRepository`, `LikeRepository`, `CategoryRepository`, `ModerationRepository`.
- El acceso a datos está acoplado a Prisma en cada servicio, lo que dificulta el cambio de ORM o pruebas unitarias.

### 3. Falta de casos de uso explícitos
- La lógica de negocio está dispersa en servicios de NestJS (`PostsService`, `CommentsService`, etc.).
- No hay capa `application/use-cases` que represente acciones como `CreatePost`, `AddComment`, `AddLike`.

### 4. Responsabilidades mezcladas
- `PostsService.create()`:
  - valida/modera texto
  - persiste el post
- `CommentsService.create()`:
  - valida existencia de post
  - modera contenido
  - persiste el comentario
- `ModerationService.moderate()`:
  - consulta palabras prohibidas
  - construye regex difusa
- En Clean Architecture cada clase debería tener una responsabilidad clara.

### 5. Acoplamiento entre servicios
- `CommentsService` y `LikesService` dependen de `PostsService.findById()` para validar existencia de post.
- Esto crea una dependencia innecesaria servicio-a-servicio y daña la modularidad.

### 6. Lógica de negocio mezclada con infraestructura
- Transformaciones como `likesCount`, `commentsCount`, `relevanceScore` están en `PostsService.getFeedPosts()`.
- El servicio combina consulta de datos con cálculo de presentación.

### 7. Patrón Strategy mal extendido
- `FeedRankingStrategyFactory.forMode()` usa condicional `if` en lugar de un registro dinámico.
- Esto viola OCP y dificulta añadir nuevos modos sin modificar la fábrica.

### Resumen corto
El problema central es que el proyecto funciona como un monolito NestJS, pero no adopta Clean Architecture: no existen capas limpias de dominio/aplicación/infrastructure, el acceso a datos está incrustado en la lógica de negocio, y los servicios tienen responsabilidades mezcladas y dependencias incorrectas.

Para refactorizarlo, hay que:
- extraer repositorios e interfaces,
- mover la lógica de negocio a casos de uso,
- mantener Prisma sólo en `infrastructure`,
- y dejar a los controladores sólo como capa de presentación.