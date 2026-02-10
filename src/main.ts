import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Aktifkan Validation secara Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus field yang tidak ada di DTO (Security: Mencegah injeksi data sampah)
      forbidNonWhitelisted: true, // Tolak request kalau ada field aneh
      transform: true, // Otomatis ubah tipe data 
    }),
  );

  // 2. (Opsional) Set Global Prefix biar URL jadi: /api/users, /api/products
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();