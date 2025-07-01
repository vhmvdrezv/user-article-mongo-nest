import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { updateArticleDto } from './dto/update-article.dto';
import { Role } from 'src/common/enums/role.enum';
import { getArticlesDto } from './dto/get-articles.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name) private readonly articleModel: Model<ArticleDocument>
    ) { }
    async createArticle(createArticleDto: CreateArticleDto, userId: string) {
        const { title, content } = createArticleDto;

        const newArticle = await this.articleModel.create({
            title,
            content,
            author: userId
        })

        return {
            status: 'success',
            message: 'article created successfully',
            data: newArticle
        }
    }

    async getAllArticles(
        getArticlesDto: getArticlesDto
    ) {
        const { page = 1, limit = 5 } = getArticlesDto;

        const articles = await this.articleModel
                                    .find()
                                    .populate('author', 'fullname email')
                                    .select('-__v')
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .exec();

        const total = await this.articleModel
                                    .countDocuments()
                                    .exec();
        
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            status:'success',
            message: 'artilces retireved succussfully',
            data: articles,
            total,
            totalPages,
            hasNext,
            hasPrev
        }
    }

    async getArticleById(id: string) {
        const article = await this.articleModel
                                    .findById(id)
                                    .populate('author', 'email fullname')
                                    .select('-__v')
                                    .exec();

        if (!article) throw new NotFoundException(`Article with id ${id} not found`);

        return { 
            status: 'success',
            message: 'article retrieved successfully',
            data: article
        }
    }

    async updateArticle(
        updateArticleDto: updateArticleDto,
        articleId: string,
        userId: string
    ) {
        const article = await this.articleModel
                                    .findById(articleId)
                                    .populate('author')
                                    .exec();

        if (!article) throw new NotFoundException(`Article with id ${articleId} not found`);

        if (article.author._id.toString() !== userId) {
            throw new NotFoundException('You are not authorized to update this article');
        }

        const updatedArticle = await this.articleModel
                                        .findByIdAndUpdate(
                                            articleId, 
                                            updateArticleDto,
                                            { new: true }
                                        )
                                        .populate('author', 'fullname email')
                                        .select('-__v')
                                        .exec();
        return {
            status: 'success',
            message: 'article updated successfully',
            data: updatedArticle
        }
    }

    async deleteArticle(articleId: string, userId: string, role: string) {
        const article = await this.articleModel
                                    .findById(articleId)
                                    .populate('author')
                                    .exec();
    
        if (!article) throw new NotFoundException(`Article with id ${articleId} not found`);
        if (role !== Role.ADMIN) {
            if (article.author._id.toString() !== userId) {
                throw new NotFoundException('You are not authorized to delete this article');
            }
        }

        await this.articleModel
                    .findByIdAndDelete(articleId)
                    .exec();

        return {
            status: 'success',
            message: 'article deleted successfully',
        }
    }
}
