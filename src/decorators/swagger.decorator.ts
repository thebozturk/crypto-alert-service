import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerExamples } from '../swagger/swagger-examples';

export function SwaggerUsersController() {
  return applyDecorators(ApiTags('Users'), ApiBearerAuth());
}

export function SwaggerGetAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users (Admin only)' }),
    ApiResponse({
      status: 200,
      description: 'List of all users',
      content: {
        'application/json': SwaggerExamples.getUsersResponse,
      },
    }),
  );
}

export function SwaggerGetProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({
      status: 200,
      description: 'User profile data',
      content: {
        'application/json': SwaggerExamples.getUserProfileResponse,
      },
    }),
  );
}
