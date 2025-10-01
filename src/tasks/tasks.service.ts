import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskStatus, TaskPriority } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  // 1. Encontra todas as tarefas (filtrável para Kanban e To-Do List)
  async findAll(status?: TaskStatus, priority?: TaskPriority): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        status: status,
        priority: priority,
      },
      orderBy: {
        dueDate: 'asc', // Ordem padrão para calendário e lista
      },
    });
  }

  // 2. Cria uma nova tarefa
  async create(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  // 3. Atualiza o status (principalmente usado pelo Kanban)
  async updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: { status: updateStatusDto.status },
      });
    } catch (e) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
  }

  // 4. Busca uma única tarefa (para ver detalhes)
  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    return task;
  }

  // Adicione outras operações CRUD (update, remove) conforme necessário

  // update
  async update(id: string, data: Partial<CreateTaskDto>): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
  }

  // remove
  async remove(id: string): Promise<Task> {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
  }

}