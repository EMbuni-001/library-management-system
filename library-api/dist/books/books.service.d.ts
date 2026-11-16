import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BooksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(genreId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: ({
            genre: {
                name: string;
                id: number;
            };
        } & {
            id: number;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            genreId: number;
            availableCopies: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        genre: {
            name: string;
            id: number;
        };
        reviews: {
            id: number;
            rating: number;
            comment: string;
            bookId: number;
            userId: number;
        }[];
    } & {
        id: number;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        genreId: number;
        availableCopies: number;
    }>;
    create(dto: CreateBookDto): import(".prisma/client").Prisma.Prisma__BookClient<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        genreId: number;
        availableCopies: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateBookDto): Promise<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        genreId: number;
        availableCopies: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        genreId: number;
        availableCopies: number;
    }>;
}
