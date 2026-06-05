import { Injectable } from "@nestjs/common"
import { PostRepository } from "@/domain/repositories/post.repository"
import { Post } from "@/domain/entities/post.entity"

@Injectable()
export class ListPostsUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    execute(): Promise<Post[]> {
        return this.postRepository.findAll()
    }
}
