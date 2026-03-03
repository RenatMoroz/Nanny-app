import { LoginParams, RegisterParams } from '@/types/auth';
import { nextApi } from './serverConfig';

export async function me() {
  const result = await nextApi.get('/auth/me');
  return result.data;
}

export async function register(body: RegisterParams) {
  const result = await nextApi.post('/auth/register', body);
  return result.data;
}

export async function login(body: LoginParams) {
  const result = await nextApi.post('/auth/login', body);
  return result.data;
}

export async function logout() {
  const result = await nextApi.post('/auth/logout');
  return result.data;
}

export async function refresh() {
  const result = await nextApi.post('/auth/refresh');
  return result.data;
}
