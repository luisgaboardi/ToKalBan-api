import { Controller, Get, Post, Body, Patch, Param, Query, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
// Importe ApiBody e ApiParam, se ainda não o fez, para documentar PATCH e DELETE
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger'; 

@ApiTags('tasks') // Corrigindo para minúsculas 'tasks' para convenção
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // POST /tasks: Cria uma nova tarefa
  @Post()
  @ApiOperation({ summary: 'Cria uma nova tarefa ou evento.' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // GET /tasks: Lista todas as tarefas
  @Get()
  @ApiOperation({ summary: 'Lista todas as tarefas, com opções de filtro.' })
  @ApiResponse({ status: 200, description: 'Retorna a lista de tarefas.' })
  @ApiQuery({ 
    name: 'status', 
    required: false,
    enum: TaskStatus,
    description: 'Filtra tarefas por status no Kanban.',
  })
  @ApiQuery({ 
    name: 'priority', 
    required: false,
    enum: TaskPriority,
    description: 'Filtra tarefas por prioridade na To-Do List.',
  })
  findAll(
    @Query('status') status: TaskStatus,
    @Query('priority') priority: TaskPriority,
  ) {
    return this.tasksService.findAll(status, priority);
  }

  // GET /tasks/:id: Busca detalhes de uma tarefa
  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de uma tarefa específica pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID (UUID) da tarefa.' })
  @ApiResponse({ status: 200, description: 'Retorna os detalhes da tarefa.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // PATCH /tasks/:id/status: Rota dedicada para o Kanban
  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualiza o status de uma tarefa (usado no Kanban).' })
  @ApiParam({ name: 'id', description: 'ID (UUID) da tarefa.' })
  @ApiResponse({ status: 200, description: 'Status da tarefa atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, updateStatusDto);
  }

  // PATCH /tasks/:id: Atualiza detalhes de uma tarefa (CORREÇÃO APLICADA AQUI)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza detalhes de uma tarefa específica.' })
  @ApiParam({ name: 'id', description: 'ID (UUID) da tarefa.' })
  @ApiBody({ type: CreateTaskDto, description: 'Campos opcionais para atualização. Use apenas os campos que deseja modificar.' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  update(@Param('id') id: string, @Body() data: Partial<CreateTaskDto>) {
    return this.tasksService.update(id, data);
  }

  // DELETE /tasks/:id: Remove uma tarefa
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma tarefa específica.' })
  @ApiParam({ name: 'id', description: 'ID (UUID) da tarefa.' })
  @ApiResponse({ status: 204, description: 'Tarefa removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}