import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. Ambil token dari Header: Authorization Bearer ...
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Token kadaluarsa ditolak
      ignoreExpiration: false,
      
      // 3. Pakai Secret Key dari .env buat verifikasi tanda tangan
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // 4. Kalau token valid, fungsi ini jalan.
  // Return value di sini akan ditempel ke `req.user`
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}