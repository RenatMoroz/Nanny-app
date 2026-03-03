import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { globalApi } from '../../serverConfig';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await globalApi.post('/auth/login', body);
    const cookieStore = await cookies();
    const setCookie = result.headers['set-cookie'];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const el of cookieArray) {
        const parsedCookie = parse(el);
        const options = {
          expires: parsedCookie.Expires
            ? new Date(parsedCookie.Expires)
            : undefined,
          path: parsedCookie.Path,
          maxAge: Number(parsedCookie['Max-Age']),
        };
        if (parsedCookie.accessToken) {
          cookieStore.set('accessToken', parsedCookie.accessToken, options);
        }
        if (parsedCookie.refreshToken) {
          cookieStore.set('refreshToken', parsedCookie.refreshToken, options);
        }
        if (parsedCookie.sessionId) {
          cookieStore.set('sessionId', parsedCookie.sessionId, options);
        }
      }
      return NextResponse.json(result.data);
    }
    return NextResponse.json(
      {
        error: '401',
      },
      {
        status: 401,
      }
    );
  } catch (error) {}
};
