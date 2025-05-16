import { getExpiredToken, getToken } from '@/lib/cookies';
import { isTokenExpired, refreshAccessToken } from './auth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = async () => {
  try {
    let token = getToken();
    if (!token) throw new Error('No authentication token found');

    const expiredToken = getExpiredToken();
    const expiredTimestamp = expiredToken !== null ? Number(expiredToken) : 0;

    if (isTokenExpired(expiredTimestamp)) {
      const newToken: string = await refreshAccessToken();
      if (typeof newToken === 'string' && newToken.length > 0) {
        token = newToken;
      }
    }

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Error getting headers:', error);
    throw error;
  }
};

export const getAllData = async (endpoint: string) => {
  try {
    const url = `${apiUrl}${endpoint}`;
    const headers = await getHeaders();

    const res = await fetch(`${url}`, {
      method: 'GET',
      headers,
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getById = async (endpoint: string, id: string | number) => {
  try {
    const url = `${apiUrl}${endpoint}/${id}`;
    const headers = await getHeaders();

    const res = await fetch(`${url}`, {
      method: 'GET',
      headers,
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export type appParam = string | number | boolean | string[] | number[] | null;

export const uploadFile = async (
  xhr: XMLHttpRequest,
  endpoint: string,
  data: FormData,
): Promise<[id: string, message: string]> => {
  const url = `${apiUrl}${endpoint}`;
  const headers = await getHeaders();

  return new Promise((resolve, reject) => {
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', headers.Authorization);

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200 || xhr.status === 201) {
          resolve([response.data.id, response.message]);
        } else {
          reject(new Error(response.message ?? response.error ?? 'Unknown error'));
        }
      } catch (err) {
        reject(new Error(`Invalid JSON response: ${err}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network Error'));
    };

    xhr.send(data);
  });
};

export const created = async (
  endpoint: string,
  data: Record<string, appParam>,
) => {
  try {
    const url = `${apiUrl}${endpoint}`;
    const headers = await getHeaders();

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    console.error('Error creating data:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const updated = async (
  endpoint: string,
  id: string | number,
  data: Record<string, string | number | boolean>,
) => {
  try {
    const url = `${apiUrl}${endpoint}/${id}`;
    const headers = await getHeaders();

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    console.error('Error updating data:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const updateProfile = async (
  endpoint: string,
  data: Record<string, string | number | boolean>,
) => {
  try {
    const url = `${apiUrl}${endpoint}`;
    const headers = await getHeaders();

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    console.error('Error update profile:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const updatedWithQuery = async (
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>,
) => {
  try {
    const url = new URL(`${apiUrl}${endpoint}`);

    // Append query parameters if provided
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers = await getHeaders();

    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers,
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    console.error('Error updating data:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const deleted = async (endpoint: string, id: string | number) => {
  try {
    const url = `${apiUrl}${endpoint}/${id}`;
    const headers = await getHeaders();

    const res = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    const response = await res.json();

    if (!res.ok) {
      const message = response.message;
      throw new Error(message);
    }

    return response;
  } catch (error) {
    console.error('Error deleting data:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
