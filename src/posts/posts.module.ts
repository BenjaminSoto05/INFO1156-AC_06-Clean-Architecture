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

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService,
        LatestRankingStrategy,
        MostLikedRankingStrategy,
        MostCommentedRankingStrategy,
        RelevanceRankingStrategy,
        {
            provide: FeedRankingStrategyFactory,
            useFactory: (
                latest: LatestRankingStrategy,
                mostLiked: MostLikedRankingStrategy,
                mostCommented: MostCommentedRankingStrategy,
                relevance: RelevanceRankingStrategy,
            ) => {
                const strategies: IFeedRankingStrategy[] = [
                    latest,
                    mostLiked,
                    mostCommented,
                    relevance,
                ]
                return new FeedRankingStrategyFactory(strategies)
            },
            inject: [
                LatestRankingStrategy,
                MostLikedRankingStrategy,
                MostCommentedRankingStrategy,
                RelevanceRankingStrategy,
            ],
        },
        {
            provide: "POST_REPOSITORY",
            useClass: PrismaPostRepository,
        },
    ],
    exports: [PostsService, "POST_REPOSITORY"],
})
export class PostsModule {}
