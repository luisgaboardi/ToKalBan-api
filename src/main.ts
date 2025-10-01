import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- 1. CONFIGURAÇÃO DO SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('ToKalBan API')
    .setDescription('API para gerenciar tarefas, eventos e kanban.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // O Swagger estará acessível em http://localhost:3000/api
  SwaggerModule.setup('docs', app, document); 
  
  // ---------------------------------

  app.enableShutdownHooks(); 

  await app.listen(3333);
}
bootstrap();