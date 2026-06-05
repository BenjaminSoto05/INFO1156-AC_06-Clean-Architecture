import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { ILikeRepository } from "@/domain/repositories/like.repository"
import { IPostRepository } from "@/domain/repositories/post.repository"
import { AddLikeDto } from "@/posts/posts.dtos"

@Injectable()
export class LikesService {
    constructor(
        @Inject("LIKE_REPOSITORY")
        private readonly likesRepository: ILikeRepository,
        @Inject("POST_REPOSITORY")
        private readonly postsRepository: IPostRepository,
    ) {}

    async create(postId: string, data: AddLikeDto) {
        await this.assertPostExists(postId)

        const weight = data.weight ?? 1

        if (weight < 1) {
            throw new BadRequestException("El peso debe ser al menos 1")
        }

        return this.likesRepository.createForPost(postId, { ...data, weight })
    }

    private async assertPostExists(postId: string) {
        const post = await this.postsRepository.findById(postId)

        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }
    }
}
