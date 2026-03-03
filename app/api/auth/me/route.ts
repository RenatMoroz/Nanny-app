import { NextResponse } from 'next/server';
import { globalApi } from '../../serverConfig';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  console.log(accessToken);

  const response = await globalApi.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: cookieStore.toString(),
    },
  });

  return NextResponse.json(response.data);
}
