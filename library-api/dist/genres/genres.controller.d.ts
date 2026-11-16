import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenresController {
    private readonly genresService;
    constructor(genresService: GenresService);
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
            totalCopies: number;
            genreId: number;
            availableCopies: number;
        }[];
    } & {
        name: string;
        id: number;
    })[]>;
    findOne(id: string): Promise<{
        books: {
            id: number;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            genreId: number;
            availableCopies: number;
        }[];
    } & {
        name: string;
        id: number;
    }>;
    update(id: string, dto: UpdateGenreDto): Promise<{
        name: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: number;
    }>;
}
