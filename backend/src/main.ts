import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Set Global Prefix
  app.setGlobalPrefix('api');

  // 2. Aktifkan CORS (Wajib agar Next.js bisa nembak API ini)
  app.enableCors({
    origin: '*', // Nanti saat production, ubah ke URL domain Next.js-mu
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Aktifkan Validation secara Global (Ini sudah sempurna)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // 4. Aktifkan Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Konfigurasi Swagger OpenAPI (Untuk Dokumentasi Otomatis)
  const config = new DocumentBuilder()
    .setTitle('API Klinik Compliance MVP')
    .setDescription('Dokumentasi internal API Registrasi dan RME')
    .setVersion('1.0')
    .addBearerAuth() // Penting: Supaya kita bisa test endpoint JWT langsung dari UI Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger bisa diakses di http://localhost:3001/api/docs

  // 6. Ganti Port ke 3001 (Sesuai Blueprint Infrastruktur Docker)
  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT);
  
  console.log(`🚀 API berjalan di: http://localhost:${PORT}/api`);
  console.log(`📚 Dokumentasi Swagger: http://localhost:${PORT}/api/docs`);
}
bootstrap();