import { Injectable } from "@nestjs/common"
import {
    CreateLikeData,
    LikeEntity,
    LikeRepository,
} from "@/domain/repositories/like.repository"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaLikeRepository extends LikeRepository {
    constructor(private readonly prisma: PrismaService) {
        super()
    }

    async create(data: CreateLikeData): Promise<LikeEntity> {
        return this.prisma.like.create({ data })
    }
}
