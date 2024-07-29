import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProdutoService } from "../services/produto.service";
import { Produto } from "../entities/produto.entity";

@Controller("/produtos")
export class ProdutoController {
    constructor(private readonly ProdutoService: ProdutoService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Produto[]> {
        return this.ProdutoService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id:number): Promise<Produto> {
        return this.ProdutoService.findById(id);
    }

    @Get('/titulo/:titulo')
     @HttpCode(HttpStatus.OK)
     findByTitulo(@Param('titulo') titulo: string): Promise<Produto[]> {
        return this.ProdutoService.findByTitulo(titulo);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Produto): Promise<Produto> {
        return this.ProdutoService.create(produto);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Produto): Promise<Produto> {
        return this.ProdutoService.update(produto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id',ParseIntPipe) id: number){
        return this.ProdutoService.delete(id);
    }
 
//Classificar por preço menor
   
    @Get('/precomenor/:preco')
    @HttpCode(HttpStatus.OK)
    async findByPrecoMenor(@Param('preco', ParseIntPipe) preco:number): Promise<Produto[]> { 
        return await this.ProdutoService.findByPrecoMenor(preco)}

//Classificar por preço maior

    @Get('/precomaior/:preco')
    @HttpCode(HttpStatus.OK)
    async findByPrecoMaior(@Param('preco', ParseIntPipe) preco:number): Promise<Produto[]> { 
        return await this.ProdutoService.findByPrecoMaior(preco)}
    


}