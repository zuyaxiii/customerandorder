import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private users: any[] = [];

    constructor(private jwtService: JwtService) {
        this.initializeUsers();
    }

    private async initializeUsers() {
        this.users = [
            {
                id: 1,
                username: 'test',
                password: await bcrypt.hash('123456', 10),
            },
            {
                id: 2,
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
            },
        ];
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find((u) => u.username === username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
