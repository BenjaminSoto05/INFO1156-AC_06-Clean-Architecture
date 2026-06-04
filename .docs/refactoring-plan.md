# Plan de Refactorización

## Lista de refactorizaciones
1. Extraer repositorios de persistencia.
2. Extraer casos de uso de la lógica de `PostsService`.
3. Separar validación de moderación en un dominio específico.
4. Reducir acoplamientos entre `CommentsService`, `LikesService` y `PostsService`.
5. Renombrar y reubicar módulos hacia una estructura de Clean Architecture.
6. Implementar interfaces de repositorio y adaptadores de datos.

## Prioridades
- Alta: separación de repositorios e inversión de dependencias.
- Media: extracción de casos de uso y refactorización de `ModerationService`.
- Baja: reordenar árbol de carpetas y nombre de módulos.

## Riesgos
- Modificar contratos de servicio puede afectar rutas existentes.
- Cambios en la persistencia deben validar la integridad de datos con pruebas.
- Una refactorización inadecuada de los casos de uso puede romper la lógica de negocio.

## Beneficios
- Mayor testabilidad y modularidad.
- Menor acoplamiento entre capas.
- Más fácil mantenimiento y evolución.
- Mejores posibilidades de aplicar DDD.

## Dependencias
- `PrismaService` debe transformarse en infraestructura concreta.
- `PostsService` debe depender de repositorios e interfaces.
- `ModerationService` debe ser un servicio de dominio desacoplado.

## Orden recomendado
1. Crear `domain` y `infrastructure` base.
2. Extraer repositorios de `PrismaService`.
3. Migrar `PostsService` a casos de uso.
4. Refactorizar `CommentsService` y `LikesService` para usar repositorios.
5. Ajustar controladores a nuevos casos de uso.
