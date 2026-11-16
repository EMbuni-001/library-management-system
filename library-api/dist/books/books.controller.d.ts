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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateBookDto): Promise<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        genreId: number;
        availableCopies: number;
    }>;
    remove(id: string): Promise<{
        id: number;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        genreId: number;
        availableCopies: number;
    }>;
}
