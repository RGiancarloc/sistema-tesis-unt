import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../roles/entities/rol.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const roles = [
      {
        nombre: 'administrador',
        descripcion: 'Administrador del sistema con acceso total',
        permisos: {
          usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
          proyectos: ['crear', 'leer', 'actualizar', 'eliminar'],
          informes: ['crear', 'leer', 'actualizar', 'eliminar'],
          sustentaciones: ['crear', 'leer', 'actualizar', 'eliminar'],
          configuracion: ['crear', 'leer', 'actualizar', 'eliminar'],
          reportes: ['leer', 'exportar'],
        },
      },
      {
        nombre: 'decano',
        descripcion: 'Decano de facultad con acceso a reportes y aprobaciones',
        permisos: {
          usuarios: ['leer'],
          proyectos: ['leer', 'aprobar'],
          informes: ['leer', 'aprobar'],
          sustentaciones: ['leer', 'aprobar'],
          reportes: ['leer', 'exportar'],
        },
      },
      {
        nombre: 'coordinador',
        descripcion: 'Coordinador de programa de posgrado',
        permisos: {
          usuarios: ['leer'],
          proyectos: ['crear', 'leer', 'actualizar'],
          informes: ['leer', 'actualizar'],
          sustentaciones: ['crear', 'leer', 'actualizar'],
          jurados: ['asignar'],
          reportes: ['leer', 'exportar'],
        },
      },
      {
        nombre: 'asesor',
        descripcion: 'Docente asesor de tesis',
        permisos: {
          proyectos: ['leer', 'actualizar'],
          asesorias: ['crear', 'leer', 'actualizar'],
          informes: ['leer', 'actualizar', 'revisar'],
          evaluaciones: ['crear'],
        },
      },
      {
        nombre: 'jurado',
        descripcion: 'Jurado de sustentación',
        permisos: {
          sustentaciones: ['leer'],
          evaluaciones: ['crear', 'actualizar'],
        },
      },
      {
        nombre: 'estudiante',
        descripcion: 'Estudiante de posgrado',
        permisos: {
          proyectos: ['crear', 'leer', 'actualizar'],
          asesorias: ['leer', 'crear'],
          informes: ['crear', 'leer', 'actualizar'],
          sustentaciones: ['leer', 'solicitar'],
        },
      },
    ];

    for (const rolData of roles) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: rolData.nombre },
      });

      if (!existingRol) {
        const rol = this.rolRepository.create(rolData);
        await this.rolRepository.save(rol);
        console.log(`✅ Rol '${rolData.nombre}' creado exitosamente`);
      } else {
        console.log(`ℹ️  Rol '${rolData.nombre}' ya existe`);
      }
    }
  }
}
