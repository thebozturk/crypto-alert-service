export const SwaggerExamples = {
  registerRequest: {
    example: {
      email: 'testuser@example.com',
      password: 'password123',
    },
  },
  registerResponse: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'testuser@example.com',
      role: 'user',
    },
  },
  loginRequest: {
    example: {
      email: 'testuser@example.com',
      password: 'password123',
    },
  },
  loginResponse: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
  createAlertRequest: {
    example: {
      coin: 'bitcoin',
      targetPrice: 50000,
    },
  },
  createAlertResponse: {
    example: {
      id: 'alert-123',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      coin: 'bitcoin',
      targetPrice: 50000,
      status: 'active',
    },
  },
  getAlertsResponse: {
    example: [
      {
        id: 'alert-123',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        coin: 'bitcoin',
        targetPrice: 50000,
        status: 'active',
      },
    ],
  },
  getUsersResponse: {
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@example.com',
        role: 'admin',
      },
      {
        id: '789e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        role: 'user',
      },
    ],
  },
  getUserProfileResponse: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      role: 'user',
    },
  },
};
