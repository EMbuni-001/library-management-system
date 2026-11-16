import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
}
