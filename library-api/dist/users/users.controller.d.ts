import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
