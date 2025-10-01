import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Permite injeção em qualquer outro módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta o serviço para ser usado
})
export class PrismaModule {}