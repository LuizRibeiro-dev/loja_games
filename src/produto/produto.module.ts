import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Produto } from "./entities/produto.entity";
import { ProdutoService } from "./services/produto.service";
import { ProdutoController } from "./controllers/produto.controller";
import { TemaService } from "../tema/services/tema.service";
import { TemaModule } from "../tema/tema.module";

@Module({
    imports: [TypeOrmModule.forFeature([Produto]), TemaModule],
    providers: [ProdutoService,TemaService],
    controllers: [ProdutoController],
    exports: [TypeOrmModule]
})
export class ProdutoModule{}
