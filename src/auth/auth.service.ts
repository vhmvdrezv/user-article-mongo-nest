import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { User, UserDocument } from 'src/users/schemas/user.schema';

interface GoogleUser {
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
    role: Role
}
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    async googleLogin(googleUser: GoogleUser) {
        const { googleId, email, firstName, lastName, role } = googleUser;

        let user = await this.userModel.findOne({
            email
        }).exec();

        if (!user) {
            user = await this.userModel.create({
                email,
                googleId,
                fullname: firstName.concat(lastName),
                role
            });
        }

        const payload = { sub: user._id, role: user.role }
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }
}
