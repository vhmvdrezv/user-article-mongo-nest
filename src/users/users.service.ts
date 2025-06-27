import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument> 
    ) { }
    
    async createUser(createUserDto: CreateUserDto) {
        const { email, fullname } = createUserDto;

        const emailExists = await this.userModel.findOne({
            email
        }).exec();

        if (emailExists) throw new ConflictException('User with this email exists, change Your email and try again');

        const newUser = await this.userModel.create(createUserDto);

        return {
            status: 'success',
            message: 'user created successfully',
            data: newUser,
        }   
    }

    async getAllUsers() {
        const users = await this.userModel.find().exec();
        return {
            status: 'success',
            message: 'users retrieved successfully',
            data: users
        }
    }

    async getUserById(id: string) {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not found');

        return {
            status: 'success',
            message: 'user retrieved successfully',
            data: user
        }
    }
}