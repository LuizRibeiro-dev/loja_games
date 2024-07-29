import { IsNotEmpty, IsNumber } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tema } from "../../tema/entities/tema.entity";

@Entity({name: "tb_produtos"})
export class Produto {
    @PrimaryGeneratedColumn()
    id: number

    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    titulo: string

    @IsNotEmpty()
    @Column({length: 1000, nullable: false})
    descricao: string

    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 2})
    @Column({ type: "decimal", precision: 10, scale: 2 })
    preco: number

    @UpdateDateColumn()
    data_do_anuncio: Date

    @ManyToOne(() => Tema, (tema) => tema.produto, {
        onDelete: "CASCADE"
    })
    tema: Tema
}