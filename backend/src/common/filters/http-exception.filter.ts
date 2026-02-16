import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// 1. Kosongkan parameter @Catch() agar ia menangkap SEMUA jenis error
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // 2. Deteksi apakah ini error HTTP biasa atau error sistem/database yang fatal
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 3. Ekstraksi pesan error secara aman
    let message: any = 'Terjadi kesalahan pada server internal';
    
    if (isHttpException) {
      const exceptionResponse = exception.getResponse();
      message = 
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse as any).message
          : exceptionResponse;
    } else if (exception instanceof Error) {
      // Best Practice: Log error asli di terminal/server, tapi JANGAN bocorkan ke user/frontend
      console.error(`[System Error] ${request.method} ${request.url}:`, exception.message);
    }

    // 4. Format Response Cantik & Konsisten (Standard REST API)
    response.status(status).json({
      success: false,         // Memudahkan frontend Next.js melakukan pengecekan
      statusCode: status,
      path: request.url,
      method: request.method,
      message: message,       // Berupa string atau array of strings (dari class-validator)
      timestamp: new Date().toISOString(),
    });
  }
}