import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/auth.register.dto';
import { Role } from '@/module/roles/role.enum';
import { LoginDto } from '../dto/auth.login.dto';
import { JwtUserPayload } from '../interface/auth.interface';
import { UsersService } from '../../user/service/user.service';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


 async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findByEmail(registerDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already registered.');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const user = await this.usersService.create({
        ...registerDto,
        name: registerDto.fullname,
        password: hashedPassword,
        role: Role.User,
      });
   
      const payload: JwtUserPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return this.generateToken(payload);
    } catch (error) {
      this.logger.error(`Register failed for ${registerDto.email}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Registration failed.');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const payload: JwtUserPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return this.generateToken(payload);
    } catch (error) {
      this.logger.warn(`Login failed for ${loginDto.email}`, error.stack);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Login failed.');
    }
  }

  private generateToken(payload: JwtUserPayload) {
    try {
      return {
        access_token: this.jwtService.sign({
          sub: payload.id,
          email: payload.email,
          role: payload.role,
        }),
        expires_in: '1d',
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        },
      };
    } catch (error) {
      this.logger.error('Token generation failed', error.stack);
      throw new InternalServerErrorException('Token generation failed.');
    }
  }
}