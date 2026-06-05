import { Module } from "@nestjs/common"
import { PrismaLikeRepository } from "@/infrastructure/repositories/prisma-like.repository"
import { LikesController } from "@/likes/likes.controller"
import { AddLikeUseCase } from "@/application/use-cases/add-like.use-case"
import { PostRepository } from "@/domain/repositories/post.repository"
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post.repository"
import { LikeRepository } from "@/domain/repositories/like.repository"
import { PrismaLikeRepository } from "@/infrastructure/repositories/prisma-like.repository"

@Module({
    controllers: [LikesController],
    providers: [
        AddLikeUseCase,
        { provide: PostRepository, useClass: PrismaPostRepository },
        { provide: LikeRepository, useClass: PrismaLikeRepository },
    ],
})
export class LikesModule {}
