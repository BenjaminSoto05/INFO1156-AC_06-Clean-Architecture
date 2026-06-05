import { Module } from "@nestjs/common"
import {
    FeedRankingStrategyFactory,
    LatestRankingStrategy,
    MostLikedRankingStrategy,
    MostCommentedRankingStrategy,
    RelevanceRankingStrategy,
    IFeedRankingStrategy,
} from "@/posts/feed-ranking.strategy"
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post.repository"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"
import { CreatePostUseCase } from "@/application/use-cases/create-post.use-case"
import { GetFeedUseCase } from "@/application/use-cases/get-feed.use-case"
import { ListPostsUseCase } from "@/application/use-cases/list-posts.use-case"
import { PostRepository } from "@/domain/repositories/post.repository"
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post.repository"
import { FeedPostMapper } from "@/domain/mappers/feed-post.mapper"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService,
        FeedRankingStrategyFactory,
        FeedPostMapper,
        CreatePostUseCase,
        ListPostsUseCase,
        GetFeedUseCase,
        {
            provide: "POST_REPOSITORY",
            useClass: PrismaPostRepository,
        },
    ],
    exports: [PostsService, "POST_REPOSITORY"],
})
export class PostsModule {}

