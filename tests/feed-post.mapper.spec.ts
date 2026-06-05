import { FeedPostMapper } from "@/domain/mappers/feed-post.mapper"
import { RawFeedPost } from "@/domain/entities/post.entity"

describe("FeedPostMapper", () => {
    let mapper: FeedPostMapper

    beforeEach(() => {
        mapper = new FeedPostMapper()
    })

    const createRawFeedPost = (
        overrides: Partial<RawFeedPost> = {},
    ): RawFeedPost => ({
        id: "post-1",
        title: "Test Post",
        description: "Test description for the post.",
        imageUrl: "https://example.com/image.jpg",
        categoryId: "cat-1",
        category: "Technology",
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
        likes: [],
        comments: [],
        ...overrides,
    })

    describe("toFeedPost", () => {
        it("calculates likesCount as the sum of weights", () => {
            const raw = createRawFeedPost({
                likes: [{ weight: 2 }, { weight: 3 }, { weight: 1 }],
            })

            const result = mapper.toFeedPost(raw)

            expect(result.likesCount).toBe(6)
        })

        it("calculates commentsCount as the number of comments", () => {
            const raw = createRawFeedPost({
                comments: [{ id: "c1" }, { id: "c2" }, { id: "c3" }],
            })

            const result = mapper.toFeedPost(raw)

            expect(result.commentsCount).toBe(3)
        })

        it("calculates relevanceScore as likesCount * 2 + commentsCount", () => {
            const raw = createRawFeedPost({
                likes: [{ weight: 5 }, { weight: 3 }],
                comments: [{ id: "c1" }, { id: "c2" }],
            })

            const result = mapper.toFeedPost(raw)

            // likesCount = 8, commentsCount = 2, relevanceScore = 8*2 + 2 = 18
            expect(result.relevanceScore).toBe(18)
        })

        it("returns 0 for all metrics when likes and comments are empty", () => {
            const raw = createRawFeedPost({
                likes: [],
                comments: [],
            })

            const result = mapper.toFeedPost(raw)

            expect(result.likesCount).toBe(0)
            expect(result.commentsCount).toBe(0)
            expect(result.relevanceScore).toBe(0)
        })

        it("preserves all original post fields", () => {
            const raw = createRawFeedPost({
                id: "post-42",
                title: "My Title",
                description: "My Description",
                imageUrl: "https://example.com/img.jpg",
                categoryId: "cat-5",
                category: "Science",
            })

            const result = mapper.toFeedPost(raw)

            expect(result.id).toBe("post-42")
            expect(result.title).toBe("My Title")
            expect(result.description).toBe("My Description")
            expect(result.imageUrl).toBe("https://example.com/img.jpg")
            expect(result.categoryId).toBe("cat-5")
            expect(result.category).toBe("Science")
        })

        it("handles null category", () => {
            const raw = createRawFeedPost({
                categoryId: null,
                category: null,
            })

            const result = mapper.toFeedPost(raw)

            expect(result.categoryId).toBeNull()
            expect(result.category).toBeNull()
        })
    })

    describe("toFeedPosts", () => {
        it("maps an array of raw posts to feed posts", () => {
            const raws = [
                createRawFeedPost({
                    id: "p1",
                    likes: [{ weight: 1 }],
                    comments: [{ id: "c1" }],
                }),
                createRawFeedPost({
                    id: "p2",
                    likes: [{ weight: 2 }, { weight: 3 }],
                    comments: [],
                }),
            ]

            const results = mapper.toFeedPosts(raws)

            expect(results).toHaveLength(2)
            expect(results[0].id).toBe("p1")
            expect(results[0].likesCount).toBe(1)
            expect(results[0].commentsCount).toBe(1)
            expect(results[1].id).toBe("p2")
            expect(results[1].likesCount).toBe(5)
            expect(results[1].commentsCount).toBe(0)
        })

        it("returns empty array for empty input", () => {
            const results = mapper.toFeedPosts([])

            expect(results).toEqual([])
        })
    })
})
