import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { updateArticleDto } from './dto/update-article.dto';
import { getArticlesDto } from './dto/get-articles.dto';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post() 
    async createArticle(@Body() createArticleDto: CreateArticleDto, @Req() req) {
        return this.articlesService.createArticle(createArticleDto, req.user.userId);
    }

    @Get()
    async getAllArticles(
        @Query() getArticlesDto: getArticlesDto
    ) {
        return this.articlesService.getAllArticles(getArticlesDto);
    }

    @Get(':id')
    async getArticleById(@Param('id') id: string){
        return this.articlesService.getArticleById(id);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updateArticle(
        @Body() updateArticleDto: updateArticleDto,
        @Param('id') articleId: string,
        @Req() req: any
    ) {
        return this.articlesService.updateArticle(
            updateArticleDto,
            articleId = articleId,
            req.user.userId
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteArticle(@Param('id') articleId: string, @Req() req: any) {
        return this.articlesService.deleteArticle(articleId, req.user.userId, req.user.role);
    }
}
