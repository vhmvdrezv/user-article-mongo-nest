import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottleAuth } from 'src/common/decorators/throttle.decorator';

@Controller('auth')
export class AuthController {

    @ThrottleAuth()
    @UseGuards(AuthGuard('google'))
    @Get('google/login')
    async googleLogin() {

    }

    @ThrottleAuth()
    @UseGuards(AuthGuard('google'))
    @Get('google/callback')
    async googleCallback(@Req() req: any) {
        const { accessToken } = req.user;
        return {
            accessToken
        }
    }  
}
