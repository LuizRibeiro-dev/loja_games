import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import moment from 'moment';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findByUsuario(usuario: string): Promise<Usuario | undefined> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            }
        })
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find(
            {
                relations:{
                    produto: true
                }
            }
        );

    }

    async findById(id: number): Promise<Usuario> {

        let usuario = await this.usuarioRepository.findOne({
            where: {
                id
            },
            relations: {
                produto: true
            }
        });

        if (!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

        return usuario;

    }

    async create(usuario: Usuario): Promise<Usuario> {
        
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (!buscaUsuario) {
            const nascimentoMoment = moment(usuario.nascimento, 'DD/MM/YYYY', true);
            if (!nascimentoMoment.isValid()) {
                throw new HttpException('Data de nascimento inválida!', HttpStatus.BAD_REQUEST);
            }
    
            const nascimento = nascimentoMoment.toDate();
            const idade = moment().diff(nascimento, 'years');
    
            if (idade >= 18) {
                usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
                usuario.nascimento = nascimento;
                return await this.usuarioRepository.save(usuario);
            } else {
                throw new HttpException('Você tem menos de 18 anos!', HttpStatus.BAD_REQUEST);
            }
        }
    
        throw new HttpException('O usuário já existe!', HttpStatus.BAD_REQUEST);
    }

    async update(usuario: Usuario): Promise<Usuario> {

        let updateUsuario: Usuario = await this.findById(usuario.id);
        let buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (!updateUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException('Usuário (e-mail) já Cadastrado!', HttpStatus.BAD_REQUEST);

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario);

    }}