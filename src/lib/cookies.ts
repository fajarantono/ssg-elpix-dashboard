import { User } from '@/types/user';
import { getCookie, setCookie } from 'cookies-next';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions: Parameters<typeof setCookie>[2] = {
  httpOnly: false,
  secure: isProduction,
  sameSite: 'strict', // the allowed values ('lax', 'strict', 'none', or undefined)
  path: '/',
};

const getTimestampFromExpiredToken = (expiredToken: string): number => {
  if (!expiredToken) return 0;
  const value = parseInt(expiredToken, 10);

  if (isNaN(value)) return 0;

  let durationInSeconds = 0;
  if (expiredToken.endsWith('d')) durationInSeconds = value * 24 * 60 * 60;
  else if (expiredToken.endsWith('h')) durationInSeconds = value * 60 * 60;
  else if (expiredToken.endsWith('m')) durationInSeconds = value * 60;
  else durationInSeconds = value;

  return Date.now() + durationInSeconds * 1000; // Simpan sebagai timestamp UNIX (milidetik)
};

export const setToken = (token: string, expiredToken: string) => {
  const expiredTimestamp = getTimestampFromExpiredToken(expiredToken);
  //const expiredTimestamp = getTimestampFromExpiredToken('1m');

  setCookie('token', token, {
    ...cookieOptions,
    maxAge: expiredTimestamp - Date.now(),
  });
  setCookie('expired_token', expiredTimestamp.toString(), {
    ...cookieOptions,
    maxAge: expiredTimestamp - Date.now(),
  });
};

// export const setRefreshToken = (refreshToken: string) => {
//   setCookie('refresh_token', refreshToken, cookieOptions);
// };

export const setRefreshToken = (
  refreshToken: string,
  expiredToken: string,
) => {
  const expiredTimestamp = getTimestampFromExpiredToken(expiredToken);
  // Default maxAge: 30 hari (dalam detik)
  setCookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: expiredTimestamp - Date.now(),
  });
};

export const setExpiredToken = (expiredToken: number) => {
  setCookie('expired_token', expiredToken, cookieOptions);
};

export const setUser = (user: User, expiredToken: string) => {
  const expiredTimestamp = getTimestampFromExpiredToken(expiredToken);

  // Filter the user object to only include the necessary properties
  const filteredUser = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    phone: user.phone,
    email: user.email,
    avatarFile: user.avatarFile,
    role: user.role,
    roleId: user.roleId,
    isActive: user.isActive,
  };

  setCookie('user', JSON.stringify(filteredUser), {
    ...cookieOptions,
    maxAge: expiredTimestamp - Date.now(),
  });
};

export const getToken = (): string | null => {
  return getCookie('token')?.toString() || null;
};

export const getRefreshToken = (): string | null => {
  return getCookie('refresh_token')?.toString() || null;
};

export const getExpiredToken = (): number => {
  const expiredToken = getCookie('expired_token');
  return expiredToken ? Number(expiredToken) || 0 : 0;
};

export const getUser = (): User | null => {
  const user = getCookie('user');
  return user ? JSON.parse(user.toString()) : null;
};

export const setCookieLocale = (locale: string) => {
  setCookie('locale', locale, cookieOptions);
};

export const getCookieLocale = (): string | null => {
  return getCookie('locale')?.toString() || null;
};
