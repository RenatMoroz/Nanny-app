import { NextResponse } from 'next/server';
import { globalApi } from '@/app/api/serverConfig';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const response = await globalApi.get(`/reviews/nanny/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 500;
    const data = (error as { response?: { data?: unknown } })?.response?.data;

    return NextResponse.json(
      data ?? { error: 'Failed to fetch reviews' },
      { status }
    );
  }
}
