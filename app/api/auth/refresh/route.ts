import { NextResponse } from 'next/server';
import { globalApi } from '../../serverConfig';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  console.log(refreshToken, accessToken);

  if (!refreshToken && !accessToken) {
    return NextResponse.json({ success: false });
  }

  if (accessToken) {
    return NextResponse.json({ success: true });
  }

  try {
    const response = await globalApi.post('/auth/refresh', null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    const setCookie = response.headers['set-cookie'];

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
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
