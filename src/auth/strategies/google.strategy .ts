import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { Role } from "src/common/enums/role.enum";

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            clientID: '591943347285-k8mb9iasvue415nl5hde0bv91lejgggt.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: [
                "email",
                "profile",
            ],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { name, emails } = profile;
        const role = Role.AUTHOR;

        const user = {
            googleId: profile.id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
            refreshToken,
            role,
        }

        const result = await this.authService.googleLogin(user)

        done(null, result)
    }
}