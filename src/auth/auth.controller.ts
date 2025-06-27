import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    @UseGuards(AuthGuard('google'))
    @Get('google/login')
    async googleLogin() {

    }

    @UseGuards(AuthGuard('google'))
    @Get('google/callback')
    async googleCallback(@Req() req: any) {
        const { accessToken } = req.user;
        return {
            accessToken
        }
    }  
}
