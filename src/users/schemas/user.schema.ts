import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/common/enums/role.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ unique: true })
    googleId?: string

    @Prop({ enum: Role, default: Role.AUTHOR })
    role: Role;

    @Prop()
    fullname?: string;
}

export const UserSchema = SchemaFactory.createForClass(User)