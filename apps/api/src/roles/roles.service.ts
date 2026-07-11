import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async findAll() {
    return this.rolRepository.find();
  }

  async findById(id: string) {
    const rol = await this.rolRepository.findOne({ where: { id } });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return rol;
  }

  async findByNombre(nombre: string) {
    return this.rolRepository.findOne({ where: { nombre } });
  }

  async create(createRolDto: CreateRolDto) {
    const rolExistente = await this.rolRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });

    if (rolExistente) {
      throw new ConflictException('El rol ya existe');
    }

    const rol = this.rolRepository.create(createRolDto);
    return this.rolRepository.save(rol);
  }

  async update(id: string, updateRolDto: UpdateRolDto) {
    const rol = await this.rolRepository.findOne({ where: { id } });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    if (updateRolDto.nombre && updateRolDto.nombre !== rol.nombre) {
      const rolExistente = await this.rolRepository.findOne({
        where: { nombre: updateRolDto.nombre },
      });

      if (rolExistente) {
        throw new ConflictException('El nombre de rol ya existe');
      }
    }

    await this.rolRepository.update(id, updateRolDto);

    return this.rolRepository.findOne({ where: { id } });
  }

  async delete(id: string) {
    const rol = await this.rolRepository.findOne({ where: { id } });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    await this.rolRepository.delete(id);

    return { message: 'Rol eliminado exitosamente' };
  }
}
