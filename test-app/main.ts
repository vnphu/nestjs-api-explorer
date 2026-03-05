import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiExplorerModule } from '@vnphu/nestjs-api-explorer';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';

// ── DTOs ─────────────────────────────────────────────────────────

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsIn(['active', 'draft', 'archived'])
  @IsOptional()
  status: string;
}

class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  note: string;
}

// ── Controllers ───────────────────────────────────────────────────

@Controller('users')
class UsersController {
  @Get()          getAll()              { return [{ id: 1, name: 'Alice' }]; }
  @Post()         create(@Body() b: any){ return { id: 2, ...b }; }
  @Get(':id')     getOne(@Param('id') id: string) { return { id, name: 'Alice' }; }
  @Put(':id')     update(@Param('id') id: string, @Body() b: any) { return { id, ...b }; }
  @Delete(':id')  remove(@Param('id') id: string) { return { deleted: id }; }
}

@Controller('auth')
class AuthController {
  @Post('login')    login(@Body() body: LoginDto) { return { token: 'eyJhbGc...' }; }
  @Post('register') register(@Body() body: RegisterDto) { return { id: 99 }; }
  @Get('me')        me() { return { id: 1, email: 'alice@example.com' }; }
}

@Controller('products')
class ProductsController {
  @Get()            list()                        { return []; }
  @Post()           create(@Body() body: CreateProductDto)        { return body; }
  @Get(':id')       get(@Param('id') id: string)  { return { id }; }
  @Put(':id')       update(@Param('id') id: string, @Body() b: any) { return { id, ...b }; }
  @Delete(':id')    remove(@Param('id') id: string) { return { ok: true }; }
  @Get(':id/reviews') reviews(@Param('id') id: string) { return []; }
}

@Controller('orders')
class OrdersController {
  @Get()                  list()                         { return []; }
  @Post()                 place(@Body() body: PlaceOrderDto)           { return { orderId: 'ORD-001' }; }
  @Get(':orderId')        get(@Param('orderId') id: string) { return { id }; }
  @Put(':orderId/status') updateStatus(@Param('orderId') id: string, @Body() b: any) { return b; }
}

// ── App Module ────────────────────────────────────────────────────

@Module({
  imports: [
    ApiExplorerModule.register({
      path: 'api-explorer',
      title: 'My API — Explorer',
      docsFile: './api-explorer.md',
    }),
  ],
  controllers: [UsersController, AuthController, ProductsController, OrdersController],
})
class AppModule {}

// ── Bootstrap ────────────────────────────────────────────────────

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  await app.listen(3000);
  console.log('\n  API Explorer → http://localhost:3000/api-explorer\n');
}
bootstrap();
