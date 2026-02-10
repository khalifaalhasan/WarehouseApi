import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Load .env file secara global (biar ga perlu import di setiap module)
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}