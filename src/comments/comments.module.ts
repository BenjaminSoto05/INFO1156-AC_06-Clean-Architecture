import { Module } from "@nestjs/common"
import { CommentsController } from "@/comments/comments.controller"
import { ModerationModule } from "@/moderation/moderation.module"
import { CreateCommentUseCase } from "@/application/use-cases/create-comment.use-case"
import { ListCommentsUseCase } from "@/application/use-cases/list-comments.use-case"
import { PostRepository } from "@/domain/repositories/post.repository"
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post.repository"
import { CommentRepository } from "@/domain/repositories/comment.repository"
import { PrismaCommentRepository } from "@/infrastructure/repositories/prisma-comment.repository"

@Module({
    imports: [ModerationModule],
    controllers: [CommentsController],
    providers: [
        CreateCommentUseCase,
        ListCommentsUseCase,
        { provide: PostRepository, useClass: PrismaPostRepository },
        {
            provide: CommentRepository,
            useClass: PrismaCommentRepository,
        },
    ],
})
export class CommentsModule {}
