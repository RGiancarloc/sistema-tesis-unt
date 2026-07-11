import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Usuarios
  @Get()
  @Roles('administrador', 'coordinador')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAllUsuarios() {
    return this.usuariosService.findAllUsuarios();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findUsuarioById(@Param('id') id: string) {
    return this.usuariosService.findUsuarioById(id);
  }

  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  async createUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.createUsuario(createUsuarioDto);
  }

  @Put(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateUsuario(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.updateUsuario(id, updateUsuarioDto);
  }

  @Post(':id/activar')
  @Roles('administrador')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario activado exitosamente' })
  async activateUsuario(@Param('id') id: string) {
    return this.usuariosService.activateUsuario(id);
  }

  @Post(':id/desactivar')
  @Roles('administrador')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente' })
  async deactivateUsuario(@Param('id') id: string) {
    return this.usuariosService.deactivateUsuario(id);
  }

  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteUsuario(@Param('id') id: string) {
    return this.usuariosService.deleteUsuario(id);
  }

  // Estudiantes
  @Get('estudiantes/todos')
  @Roles('administrador', 'coordinador')
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes' })
  async findAllEstudiantes() {
    return this.usuariosService.findAllEstudiantes();
  }

  @Get('estudiantes/:id')
  @ApiOperation({ summary: 'Obtener estudiante por ID' })
  @ApiResponse({ status: 200, description: 'Estudiante encontrado' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  async findEstudianteById(@Param('id') id: string) {
    return this.usuariosService.findEstudianteById(id);
  }

  @Post('estudiantes')
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo estudiante' })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente' })
  async createEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.usuariosService.createEstudiante(createEstudianteDto);
  }

  @Put('estudiantes/:id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado exitosamente' })
  async updateEstudiante(
    @Param('id') id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
  ) {
    return this.usuariosService.updateEstudiante(id, updateEstudianteDto);
  }

  // Asesores
  @Get('asesores/todos')
  @Roles('administrador', 'coordinador')
  @ApiOperation({ summary: 'Obtener todos los asesores' })
  @ApiResponse({ status: 200, description: 'Lista de asesores' })
  async findAllAsesores() {
    return this.usuariosService.findAllAsesores();
  }

  @Get('asesores/:id')
  @ApiOperation({ summary: 'Obtener asesor por ID' })
  @ApiResponse({ status: 200, description: 'Asesor encontrado' })
  @ApiResponse({ status: 404, description: 'Asesor no encontrado' })
  async findAsesorById(@Param('id') id: string) {
    return this.usuariosService.findAsesorById(id);
  }

  @Post('asesores')
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo asesor' })
  @ApiResponse({ status: 201, description: 'Asesor creado exitosamente' })
  async createAsesor(@Body() createAsesorDto: CreateAsesorDto) {
    return this.usuariosService.createAsesor(createAsesorDto);
  }

  @Put('asesores/:id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar asesor' })
  @ApiResponse({ status: 200, description: 'Asesor actualizado exitosamente' })
  async updateAsesor(
    @Param('id') id: string,
    @Body() updateAsesorDto: UpdateAsesorDto,
  ) {
    return this.usuariosService.updateAsesor(id, updateAsesorDto);
  }

  // Jurados
  @Get('jurados/todos')
  @Roles('administrador', 'coordinador')
  @ApiOperation({ summary: 'Obtener todos los jurados' })
  @ApiResponse({ status: 200, description: 'Lista de jurados' })
  async findAllJurados() {
    return this.usuariosService.findAllJurados();
  }

  @Get('jurados/:id')
  @ApiOperation({ summary: 'Obtener jurado por ID' })
  @ApiResponse({ status: 200, description: 'Jurado encontrado' })
  @ApiResponse({ status: 404, description: 'Jurado no encontrado' })
  async findJuradoById(@Param('id') id: string) {
    return this.usuariosService.findJuradoById(id);
  }

  @Post('jurados')
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo jurado' })
  @ApiResponse({ status: 201, description: 'Jurado creado exitosamente' })
  async createJurado(@Body() createJuradoDto: CreateJuradoDto) {
    return this.usuariosService.createJurado(createJuradoDto);
  }

  @Put('jurados/:id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar jurado' })
  @ApiResponse({ status: 200, description: 'Jurado actualizado exitosamente' })
  async updateJurado(
    @Param('id') id: string,
    @Body() updateJuradoDto: UpdateJuradoDto,
  ) {
    return this.usuariosService.updateJurado(id, updateJuradoDto);
  }
}
