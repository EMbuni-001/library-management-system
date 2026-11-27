import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: number): Promise<{
        email: string;
        name: string | null;
        role: string;
        id: number;
        reviews: {
            book: {
                title: string;
            };
            id: number;
            rating: number;
            comment: string | null;
        }[];
    }>;
}
