import { NextResponse } from 'next/server';
import { globalApi } from '../../serverConfig';
import { cookies } from 'next/headers';

export async function POST() {
  const response = await globalApi.post('/auth/logout');
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('sessionId');
  return NextResponse.json(response.data);
}
