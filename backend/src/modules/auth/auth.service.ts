import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Validasi User (Email & Password)
  async validateUser(email: string, pass: string): Promise<any> {
    return null;
  }

  // 1. LOGIN FLOW (Standard)
  async login(loginDto: LoginDto) {
    // A. Cari User
    const user = await this.usersService.findOneByEmail(loginDto.email);

    // B. Validasi: User ada? Password cocok?
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Email atau Password salah');
    }

    // C. Generate Token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    return this.usersService.createUser(registerDto);
  }
}
