import { NextRequest, NextResponse } from 'next/server';
import { globalApi } from '../../serverConfig';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await globalApi.post('/auth/register', body);
    return NextResponse.json(result.data);
  } catch (error) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 500;
    const data = (error as { response?: { data?: unknown } })?.response?.data;

    return NextResponse.json(
      data ?? { message: 'Registration failed' },
      { status }
    );
  }
};
