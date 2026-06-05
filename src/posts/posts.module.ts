import { Module } from "@nestjs/common"
import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"
import { CreatePostUseCase } from "@/application/use-cases/create-post.use-case"
import { GetFeedUseCase } from "@/application/use-cases/get-feed.use-case"
import { ListPostsUseCase } from "@/application/use-cases/list-posts.use-case"
import { PostRepository } from "@/domain/repositories/post.repository"
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post.repository"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService,
        FeedRankingStrategyFactory,
        CreatePostUseCase,
        ListPostsUseCase,
        GetFeedUseCase,
        {
            provide: PostRepository,
            useClass: PrismaPostRepository,
        },
    ],
    exports: [PostsService],
})
export class PostsModule {}
