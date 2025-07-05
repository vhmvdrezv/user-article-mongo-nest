import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SuccessResponse } from 'src/common/interfaces/success-response.interface';
import { ResponseUtil } from 'src/common/utils/response.util';
import { GetUsersDto } from './dto/get-users.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interfact';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument> 
    ) { }
    
    async createUser(createUserDto: CreateUserDto): Promise<SuccessResponse<User>> {
        const { email, fullname } = createUserDto;

        const emailExists = await this.userModel.findOne({
            email
        }).exec();

        if (emailExists) throw new ConflictException('User with this email exists, change Your email and try again');

        const newUser = await this.userModel.create(createUserDto);

        return ResponseUtil.created(newUser, 'User created Successfully');  
    }

    async getAllUsers(getUsersDto: GetUsersDto): Promise<PaginatedResponse<User>> {
        const { page = 1, limit = 5 } = getUsersDto;

        const users = await this.userModel
                                .find()
                                .skip((page - 1) * limit)
                                .limit(limit)
                                .exec();

        const total = await this.userModel.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
        
        return ResponseUtil.paginated(users, {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNext,
            hasPrev
        }, 'Users retrieved successfully');
    }

    async getUserById(id: string): Promise<SuccessResponse<User>> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not found');

        return ResponseUtil.success(user, 'User retrieved successfully');
    }
}