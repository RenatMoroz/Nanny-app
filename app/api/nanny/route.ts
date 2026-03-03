import { NextRequest, NextResponse } from 'next/server';
import { globalApi } from '../serverConfig';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;

    try {
      const response = await globalApi.get(`/nannys${query}`);
      return NextResponse.json(response.data);
    } catch (error) {
      if (
        (error as { response?: { status?: number } })?.response?.status !== 404
      ) {
        throw error;
      }
    }

    const response = await globalApi.get(`/nanny${query}`);
    return NextResponse.json(response.data);
  } catch (error) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ?? 500;
    const data = (error as { response?: { data?: unknown } })?.response?.data;

    return NextResponse.json(data ?? { message: 'Failed to load nannies' }, {
      status,
    });
  }
}
