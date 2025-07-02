import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
    @Prop({ required: true, index: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    author: Types.ObjectId;
}

export const ArticleSchema = SchemaFactory.createForClass(Article)