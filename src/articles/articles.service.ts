import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { updateArticleDto } from './dto/update-article.dto';
import { Role } from 'src/common/enums/role.enum';
import { getArticlesDto } from './dto/get-articles.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SuccessResponse } from 'src/common/interfaces/success-response.interface';
import { ResponseUtil } from 'src/common/utils/response.util';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interfact';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Article.name) private readonly articleModel: Model<ArticleDocument>
    ) { }
    async createArticle(createArticleDto: CreateArticleDto, userId: string): Promise<SuccessResponse<ArticleDocument>> {
        const { title, content } = createArticleDto;

        const newArticle = await this.articleModel.create({
            title,
            content,
            author: userId
        })

        return ResponseUtil.created(newArticle, 'Article created successfully');
    }

    async getAllArticles(
        getArticlesDto: getArticlesDto
    ): Promise<PaginatedResponse<Article>> {
        const { page = 1, limit = 5, search, authorId } = getArticlesDto;

        const query: any = { };
        if (authorId) query.author = authorId;
        if (search) query.$text = { $search: search };

        const articles = await this.articleModel
                                    .find(query)
                                    .populate('author', 'fullname email')
                                    .select('-__v')
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .exec();

        const total = await this.articleModel
                                    .countDocuments(query)
                                    .exec();
        
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ResponseUtil.paginated(articles, {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNext,
            hasPrev
        }, 'Articles retrieved successfully');
    }

    async getMyArticles(getArticlesDto: getArticlesDto, userId: string): Promise<PaginatedResponse<Article>> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const { page = 1, limit = 5, search } = getArticlesDto;

        const query: any = { 
            author: userId
        };
        if (search) query.title = RegExp(search, 'i');

        const articles = await this.articleModel
                                    .find(query)
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .sort({ createdAt: -1 })
                                    .exec();

        const total = await this.articleModel
                                    .countDocuments(query)
                                    .exec();
        
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ResponseUtil.paginated(articles, {
            total, 
            totalPages, 
            currentPage: page,
            limit,
            hasNext,
            hasPrev
        })                         
    }

    async getArticleById(id: string): Promise<SuccessResponse<Article>> {
        const article = await this.articleModel
                                    .findById(id)
                                    .populate('author', 'email fullname')
                                    .select('-__v')
                                    .exec();

        if (!article) throw new NotFoundException(`Article with id ${id} not found`);

        return ResponseUtil.success(article, 'Article retrieved successfully.')
    }

    async updateArticle(
        updateArticleDto: updateArticleDto,
        articleId: string,
        userId: string
    ): Promise<SuccessResponse<Article>> {
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

        return ResponseUtil.success(updatedArticle!, 'Article updated successfully.')
    }

    async deleteArticle(articleId: string, userId: string, role: string): Promise<SuccessResponse<null>> {
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

        return ResponseUtil.noContent('Article deleted successfully')
    }
}
