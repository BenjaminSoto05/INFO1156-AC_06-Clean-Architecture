import {
    FeedRankingStrategyFactory,
    FeedRankingStrategy,
} from "@/posts/feed-ranking.strategy"
import { FeedPost } from "@/domain/entities/post.entity"

describe("FeedRankingStrategyFactory", () => {
    let factory: FeedRankingStrategyFactory

    beforeEach(() => {
        factory = new FeedRankingStrategyFactory()
    })

    const createFeedPost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
        id: "post-1",
        title: "Test Post",
        description: "Test description",
        imageUrl: "https://example.com/img.jpg",
        categoryId: null,
        category: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
        likesCount: 0,
        commentsCount: 0,
        relevanceScore: 0,
        ...overrides,
    })

    describe("forMode", () => {
        it("returns a strategy for 'latest' mode", () => {
            const strategy = factory.forMode("latest")
            expect(strategy).toBeDefined()
            expect(strategy.rank).toBeDefined()
        })

        it("returns a strategy for 'mostLiked' mode", () => {
            const strategy = factory.forMode("mostLiked")
            expect(strategy).toBeDefined()
        })

        it("returns a strategy for 'mostCommented' mode", () => {
            const strategy = factory.forMode("mostCommented")
            expect(strategy).toBeDefined()
        })

        it("returns a strategy for 'relevance' mode", () => {
            const strategy = factory.forMode("relevance")
            expect(strategy).toBeDefined()
        })

        it("falls back to 'latest' for unknown modes", () => {
            const latestStrategy = factory.forMode("latest")
            const fallbackStrategy = factory.forMode(
                "unknownMode" as "latest",
            )
            expect(fallbackStrategy).toBe(latestStrategy)
        })
    })

    describe("register", () => {
        it("allows registering new strategies dynamically", () => {
            const customStrategy: FeedRankingStrategy = {
                rank: (posts: FeedPost[]) =>
                    [...posts].sort(
                        (a, b) => a.likesCount - b.likesCount,
                    ),
            }

            factory.register(
                "custom" as "latest",
                customStrategy,
            )

            const retrieved = factory.forMode("custom" as "latest")
            expect(retrieved).toBe(customStrategy)
        })

        it("allows overriding existing strategies", () => {
            const customLatest: FeedRankingStrategy = {
                rank: (posts: FeedPost[]) => posts,
            }

            factory.register("latest", customLatest)

            const retrieved = factory.forMode("latest")
            expect(retrieved).toBe(customLatest)
        })
    })

    describe("ranking behavior", () => {
        it("latest strategy sorts by createdAt descending", () => {
            const posts = [
                createFeedPost({
                    id: "old",
                    createdAt: new Date("2025-01-01"),
                }),
                createFeedPost({
                    id: "new",
                    createdAt: new Date("2025-06-01"),
                }),
                createFeedPost({
                    id: "mid",
                    createdAt: new Date("2025-03-01"),
                }),
            ]

            const result = factory.forMode("latest").rank(posts)

            expect(result[0].id).toBe("new")
            expect(result[1].id).toBe("mid")
            expect(result[2].id).toBe("old")
        })

        it("mostLiked strategy sorts by likesCount descending", () => {
            const posts = [
                createFeedPost({ id: "low", likesCount: 1 }),
                createFeedPost({ id: "high", likesCount: 10 }),
                createFeedPost({ id: "mid", likesCount: 5 }),
            ]

            const result = factory.forMode("mostLiked").rank(posts)

            expect(result[0].id).toBe("high")
            expect(result[1].id).toBe("mid")
            expect(result[2].id).toBe("low")
        })

        it("mostCommented strategy sorts by commentsCount descending", () => {
            const posts = [
                createFeedPost({ id: "low", commentsCount: 2 }),
                createFeedPost({ id: "high", commentsCount: 20 }),
                createFeedPost({ id: "mid", commentsCount: 8 }),
            ]

            const result = factory.forMode("mostCommented").rank(posts)

            expect(result[0].id).toBe("high")
            expect(result[1].id).toBe("mid")
            expect(result[2].id).toBe("low")
        })

        it("relevance strategy sorts by relevanceScore descending", () => {
            const posts = [
                createFeedPost({ id: "low", relevanceScore: 5 }),
                createFeedPost({ id: "high", relevanceScore: 100 }),
                createFeedPost({ id: "mid", relevanceScore: 50 }),
            ]

            const result = factory.forMode("relevance").rank(posts)

            expect(result[0].id).toBe("high")
            expect(result[1].id).toBe("mid")
            expect(result[2].id).toBe("low")
        })

        it("strategies do not mutate the original array", () => {
            const posts = [
                createFeedPost({
                    id: "a",
                    createdAt: new Date("2025-01-01"),
                }),
                createFeedPost({
                    id: "b",
                    createdAt: new Date("2025-06-01"),
                }),
            ]

            const originalOrder = [...posts]
            factory.forMode("latest").rank(posts)

            expect(posts[0].id).toBe(originalOrder[0].id)
            expect(posts[1].id).toBe(originalOrder[1].id)
        })
    })
})
