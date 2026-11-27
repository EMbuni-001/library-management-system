import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    findAll(genreId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: ({
            genre: {
                name: string;
                id: number;
            };
            reviews: {
                id: number;
                rating: number;
                comment: string | null;
                userId: number;
                bookId: number;
                createdAt: Date;
            }[];
        } & {
            id: number;
            title: string;
            author: string;
            isbn: string;
            description: string | null;
            coverImage: string | null;
            totalCopies: number;
            availableCopies: number;
            genreId: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        genre: {
            name: string;
            id: number;
        };
        reviews: {
            id: number;
            rating: number;
            comment: string | null;
            userId: number;
            bookId: number;
            createdAt: Date;
        }[];
    } & {
        id: number;
        title: string;
        author: string;
        isbn: string;
        description: string | null;
        coverImage: string | null;
        totalCopies: number;
        availableCopies: number;
        genreId: number;
    }>;
    create(createBookDto: CreateBookDto): import(".prisma/client").Prisma.Prisma__BookClient<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        description: string | null;
        coverImage: string | null;
        totalCopies: number;
        availableCopies: number;
        genreId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateBookDto: UpdateBookDto): import(".prisma/client").Prisma.Prisma__BookClient<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        description: string | null;
        coverImage: string | null;
        totalCopies: number;
        availableCopies: number;
        genreId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__BookClient<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        description: string | null;
        coverImage: string | null;
        totalCopies: number;
        availableCopies: number;
        genreId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
