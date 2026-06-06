# Análisis SOLID

## SRP - Single Responsibility Principle
- Estado: Parcialmente cumple.
- Evidencia:
  - `PostsService.create()` valida, modera y persiste en la base de datos.
  - `CommentsService.create()` verifica existencia del post, modera y persiste el comentario.
  - `ModerationService` mezcla consulta de palabras prohibidas con generación de regex.
- Impacto:
  - Dificulta pruebas unitarias aisladas.
  - Aumenta el riesgo de cambios no deseados al modificar una responsabilidad.
- Recomendación:
  - Separar validación de moderación en un servicio de dominio/servicio de moderación.
  - Extraer persistencia a repositorios.

## OCP - Open/Closed Principle
- Estado: Parcialmente cumple.
- Evidencia:
  - `FeedRankingStrategyFactory.forMode()` usa condicionales para modos de ranking.
- Impacto:
  - Agregar un nuevo modo requiere modificar la fábrica.
- Recomendación:
  - Implementar un registro de estrategias o un mapa de modo a estrategia.

## LSP - Liskov Substitution Principle
- Estado: Cumple parcialmente.
- Evidencia:
  - No hay jerarquías de clases que muestren sustitución explícita.
  - Clases de estrategia respetan la interfaz `FeedRankingStrategy`.
- Impacto:
  - Actualmente no hay violaciones claras, pero la ausencia de abstracciones limita la extensión segura.
- Recomendación:
  - Mantener las interfaces de estrategia y extraer repositorios para preservar la substituibilidad.

## ISP - Interface Segregation Principle
- Estado: Parcialmente cumple.
- Evidencia:
  - No existen interfaces explícitas por dominio.
  - Los servicios inyectan implementaciones completas en lugar de contratos finos.
- Impacto:
  - Los consumidores quedan acoplados a APIs grandes y concretas.
- Recomendación:
  - Introducir interfaces de repositorio y casos de uso con contratos pequeños.

## DIP - Dependency Inversion Principle
- Estado: No cumple.
- Evidencia:
  - `PostsService`, `CommentsService`, `LikesService` y `ModerationService` dependen de la clase concreta `PrismaService`.
  - `CommentsService` y `LikesService` dependen de la implementación `PostsService`.
- Impacto:
  - Dificulta cambiar la implementación de persistencia.
  - Aumenta el acoplamiento y la rigidez arquitectónica.
- Recomendación:
  - Definir abstracciones de repositorio en `domain` o `application`.
  - Hacer que los servicios dependan de interfaces en lugar de clases concretas.
