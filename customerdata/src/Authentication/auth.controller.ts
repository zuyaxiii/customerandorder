import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      return { message: 'Invalid username or password' };
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
      return this.authService.refreshAccessToken(body.refreshToken);
  }
}