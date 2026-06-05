import { Module } from "@nestjs/common"
import { PrismaLikeRepository } from "@/infrastructure/repositories/prisma-like.repository"
import { LikesController } from "@/likes/likes.controller"
import { LikesService } from "@/likes/likes.service"
import { PostsModule } from "@/posts/posts.module"

@Module({
    imports: [PostsModule],
    controllers: [LikesController],
    providers: [
        LikesService,
        {
            provide: "LIKE_REPOSITORY",
            useClass: PrismaLikeRepository,
        },
    ],
})
export class LikesModule {}
