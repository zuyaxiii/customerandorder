import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from 'src/Utils/password.utils';

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
                password: await hashPassword('123456'),
            },
            {
                id: 2,
                username: 'admin',
                password: await hashPassword('admin123'),
            },
        ];
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find((u) => u.username === username);
        if (user && (await comparePassword(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = this.users.find((u) => u.id === payload.sub);
            if (!user) throw new UnauthorizedException('Invalid token');
            
            return {
                access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
            };
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
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