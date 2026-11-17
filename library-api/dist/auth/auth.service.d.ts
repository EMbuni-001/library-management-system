import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            email: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            id: number;
        };
    }>;
}
