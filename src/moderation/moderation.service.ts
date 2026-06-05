import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class ModerationService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.prohibitedWord.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    create(word: string, category: string) {
        return this.prisma.prohibitedWord.create({ data: { word, category } })
    }

    async delete(id: string) {
        try {
            return await this.prisma.prohibitedWord.delete({ where: { id } })
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                "code" in err &&
                (err as { code: string }).code === "P2025"
            ) {
                throw new NotFoundException("Palabra prohibida no encontrada")
            }
            throw err
        }
    }
}
