import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateGenreDto): import(".prisma/client").Prisma.Prisma__GenreClient<{
        name: string;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        books: {
            id: number;
            title: string;
            author: string;
            isbn: string;
            description: string | null;
            coverImage: string | null;
            totalCopies: number;
            availableCopies: number;
            genreId: number;
        }[];
    } & {
        name: string;
        id: number;
    })[]>;
    findOne(id: number): Promise<{
        books: {
            id: number;
            title: string;
            author: string;
            isbn: string;
            description: string | null;
            coverImage: string | null;
            totalCopies: number;
            availableCopies: number;
            genreId: number;
        }[];
    } & {
        name: string;
        id: number;
    }>;
    update(id: number, dto: UpdateGenreDto): Promise<{
        name: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        id: number;
    }>;
}
