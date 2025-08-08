import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { Public } from '@/module/common/decorator/public.decorator';
import { RegisterDto } from '../dto/auth.register.dto';
import { LoginDto } from '../dto/auth.login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully and token returned',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }


  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful and JWT token returned',
  })
  @ApiResponse({ status: 401, description: 'Email or password is incorrect' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
