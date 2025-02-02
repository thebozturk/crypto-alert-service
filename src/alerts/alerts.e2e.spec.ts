import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AlertsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // create user or get existing user
    await prisma.user.upsert({
      where: { email: 'testuser@example.com' },
      update: {},
      create: {
        id: 'test-user',
        email: 'testuser@example.com',
        password: bcrypt.hashSync('hashedpassword', 10),
        role: 'user',
      },
    });

    // login and get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'testuser@example.com', password: 'hashedpassword' });

    expect(loginResponse.status).toBe(200);
    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prisma.alert.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/alerts (POST)', () => {
    it('should create a new alert with valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/alerts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ coin: 'bitcoin', targetPrice: 50000 });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.coin).toBe('bitcoin');
      expect(response.body.targetPrice).toBe(50000);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/alerts')
        .send({ coin: 'bitcoin', targetPrice: 50000 });

      expect(response.status).toBe(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/alerts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ coin: 'bitcoin' });

      expect(response.status).toBe(400);
    });
  });

  describe('/alerts (GET)', () => {
    it('should return all alerts for the authenticated user', async () => {
      await prisma.alert.create({
        data: {
          id: 'alert-1',
          userId: 'test-user',
          coin: 'ethereum',
          targetPrice: 3000,
          status: 'active',
        },
      });

      const response = await request(app.getHttpServer())
        .get('/alerts')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].coin).toBe('bitcoin');
      expect(response.body[1].coin).toBe('ethereum');
    });
  });

  describe('/alerts/:id (DELETE)', () => {
    let createdAlert;

    beforeEach(async () => {
      await prisma.alert.deleteMany();

      createdAlert = await prisma.alert.create({
        data: {
          id: 'alert-delete-test',
          userId: 'test-user',
          coin: 'dogecoin',
          targetPrice: 0.1,
          status: 'active',
        },
      });
    });

    it('should delete an alert with valid token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/alerts/${createdAlert.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);

      const checkAlert = await prisma.alert.findUnique({
        where: { id: createdAlert.id },
      });
      expect(checkAlert).toBeNull();
    });
  });
});
