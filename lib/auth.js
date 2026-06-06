import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('robo_auth_token')?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload; // { userId, email }
  } catch (error) {
    return null;
  }
}
