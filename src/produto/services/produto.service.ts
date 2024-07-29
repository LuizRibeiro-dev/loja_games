import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { DataSource, DeleteResult, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { TemaService } from "../../tema/services/tema.service";

@Injectable ()
export class ProdutoService {
   
    constructor(
        @InjectRepository(Produto)
        private ProdutoRepository: Repository<Produto>,
        private temaService: TemaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.ProdutoRepository.find({relations:{
            tema: true
        }});
    }

    async findById(id: number): Promise<Produto> {

        let produto = await this.ProdutoRepository.findOne({
            where: {
                id
            },
            relations:{
                tema: true
            }
        });

        if (!produto)
            throw new HttpException('Jogo não encontrado!', HttpStatus.NOT_FOUND);

        return produto;
    }

    async findByTitulo (titulo: string): Promise<Produto[]> {
        return await this.ProdutoRepository.find({
         where:{ titulo: ILike(`%${titulo}%`)},
         relations:{
            tema: true
        }
    })
   }

   async create(produto: Produto): Promise<Produto> {
    if (produto.tema){
        let tema = await this.temaService.findById(produto.tema.id)
        if (!tema)
            throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
        return await this.ProdutoRepository.save(produto);
    }
    return await this.ProdutoRepository.save(produto);
   }

   async update(produto: Produto): Promise<Produto> {
    let buscaProduto: Produto = await this.findById(produto.id);
    if (!buscaProduto || !produto.id)
        throw new HttpException('Produto não encontrado!',HttpStatus.NOT_FOUND);
    if (produto.tema){
        let tema = await this.temaService.findById(produto.tema.id)
        if (!tema)
            throw new HttpException('Tema não encontrado!',HttpStatus.NOT_FOUND);
        return await this.ProdutoRepository.save(produto)
    }
    return await this.ProdutoRepository.save(produto);
   }

   async delete(id: number): Promise<DeleteResult> {
    let buscaProduto = await this.findById(id);
    if (!buscaProduto)
        throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
    return await this.ProdutoRepository.delete(id);
   }

// procura por preço menor ou igual
 async findByPrecoMenor(preco: number): Promise<Produto[]>{
    
    //Tentativa de mensagem de erro
    //if (Produto.length === 0)
    //throw new HttpException('Não há produtos com o valor menor ou igual a esse!', HttpStatus.NOT_FOUND);
     
    return await this.ProdutoRepository.findBy({ preco: LessThanOrEqual(preco) }
    )}

// procura por preço maior ou igual
async findByPrecoMaior(preco: number): Promise<Produto[]>{
    
    //Tentativa de mensagem de erro
    //if (Produto.length === 0)
        //throw new HttpException('Não há produtos com o valor maior ou igual a esse!', HttpStatus.NOT_FOUND);
    
    return await this.ProdutoRepository.findBy({ preco: MoreThanOrEqual(preco) }
   )
}
}

