import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.alert.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'testuser61@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('testuser61@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'testuser@example.com' });

      expect(response.status).toBe(400);
    });

    it('should return 401 if email is already in use', async () => {
      await prisma.user.create({
        data: {
          email: 'duplicate@example.com',
          password: bcrypt.hashSync('password123', 10),
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'duplicate@example.com', password: 'password123' });

      expect(response.status).toBe(401);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeAll(async () => {
      await prisma.user.create({
        data: {
          email: 'validuser@example.com',
          password: bcrypt.hashSync('validpassword', 10),
        },
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'validuser@example.com', password: 'validpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wronguser@example.com', password: 'validpassword' });

      expect(response.status).toBe(401);
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'validuser@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'validpassword' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'validuser@example.com' });

      expect(response.status).toBe(400);
    });
  });
});
