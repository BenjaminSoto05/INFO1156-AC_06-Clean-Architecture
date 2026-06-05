import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { PostRepository } from "@/domain/repositories/post.repository"
import { LikeRepository } from "@/domain/repositories/like.repository"
import { AddLikeDto } from "@/posts/posts.dtos"

@Injectable()
export class AddLikeUseCase {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly likeRepository: LikeRepository,
    ) {}

    async execute(postId: string, data: AddLikeDto) {
        const post = await this.postRepository.findById(postId)

        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }

        const weight = data.weight ?? 1

        if (weight < 1) {
            throw new BadRequestException("El peso debe ser al menos 1")
        }

        return this.likeRepository.create({
            postId,
            reactionType: data.reactionType ?? "like",
            weight,
            source: "likes-module",
        })
    }
}
