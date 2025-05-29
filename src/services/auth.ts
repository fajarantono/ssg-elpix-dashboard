import { getRefreshToken, setRefreshToken, setToken, setUser } from '@/lib/cookies';
import { deleteCookie } from 'cookies-next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = async () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const login = async (username: string, password: string) => {
  try {
    const url = `${apiUrl}/api/v1/login`;
    const headers = await getHeaders();

    const res = await fetch(`${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ username, password }),
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    const { token, refreshToken, expiredToken } = response.data;

    setToken(token, expiredToken);
    setRefreshToken(refreshToken, expiredToken);
    setUser(response.data, expiredToken);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const logout = () => {
  // Clear cookies
  deleteCookie('token', { path: '/' });
  deleteCookie('refresh_token', { path: '/' });
  deleteCookie('expired_token', { path: '/' });
  deleteCookie('user', { path: '/' });
};

const isTokenExpired = (expiredTimestamp: number): boolean => {
  return expiredTimestamp > 0 && Date.now() >= expiredTimestamp;
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  const url = `${apiUrl}/api/v1/refresh-token`;

  const res = await fetch(url, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ refreshToken }),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message);
  }

  const { token, expiredToken } = response.data;
  setToken(token, expiredToken);

  return token;
};

export { isTokenExpired };
