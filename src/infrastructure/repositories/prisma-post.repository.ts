import { Injectable } from "@nestjs/common"
import {
    CreatePostData,
    PostEntity,
    PostRepository,
} from "@/domain/repositories/post.repository"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaPostRepository extends PostRepository {
    constructor(private readonly prisma: PrismaService) {
        super()
    }

    async create(data: CreatePostData): Promise<PostEntity> {
        return this.prisma.post.create({ data })
    }

    async findById(id: string): Promise<PostEntity | null> {
        return this.prisma.post.findUnique({ where: { id } })
    }
}
