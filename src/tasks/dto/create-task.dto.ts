import { TaskStatus, TaskPriority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Título da tarefa/evento.' })
  title: string;

  @ApiProperty({ description: 'Detalhes completos da tarefa.', required: false })
  description?: string;

  @ApiProperty({ description: 'Data limite para conclusão (para o calendário).', required: false })
  dueDate?: Date;

  @ApiProperty({
    enum: TaskStatus,
    description: 'Status no quadro Kanban.',
    default: TaskStatus.TO_DO,
    required: false
  })
  status?: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
    description: 'Nível de prioridade na To-Do List.',
    default: TaskPriority.MEDIUM,
    required: false
  })
  priority?: TaskPriority;
}