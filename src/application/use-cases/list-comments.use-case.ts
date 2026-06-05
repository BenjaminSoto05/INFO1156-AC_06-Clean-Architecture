import { Injectable, NotFoundException } from "@nestjs/common"
import { PostRepository } from "@/domain/repositories/post.repository"
import { CommentRepository } from "@/domain/repositories/comment.repository"

@Injectable()
export class ListCommentsUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository,
    ) {}

    async execute(postId: string) {
        const post = await this.postRepository.findById(postId)

        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }

        const comments = await this.commentRepository.findByPostId(postId)

        return {
            total_comments: comments.length,
            comments,
        }
    }
}
