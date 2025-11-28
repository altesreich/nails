// Fuerza URL del backend sin usar env para probar
export const API_URL = 'https://nails-backend-fwjb.onrender.com';

console.log('API_URL en runtime (frontend):', API_URL);

// Tipos
export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  account_status: 'pending' | 'approved' | 'rejected';
  name?: string;
  phone?: string;
  confirmed: boolean;
  blocked: boolean;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
  };
}

// Registro de usuario (flujo de dos pasos)
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
}): Promise<AuthResponse> {
  const baseUser = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  };

  console.log('POST register ->', `${API_URL}/api/auth/local/register`);

  const response = await fetch(`${API_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(baseUser),
  });

  if (!response.ok) {
    let errorBody: ApiError | null = null;
    try {
      errorBody = await response.json();
    } catch {
      /* ignore */
    }
    throw new Error(
      errorBody?.error?.message || `Error al registrar usuario (status ${response.status})`,
    );
  }

  const data: AuthResponse = await response.json();

  if ((userData.name || userData.phone) && data.jwt) {
    const updateUrl = `${API_URL}/api/users/${data.user.id}`;
    console.log('PUT update user ->', updateUrl);

    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({
        ...(userData.name && { name: userData.name }),
        ...(userData.phone && { phone: userData.phone }),
        account_status: 'pending',
      }),
    });

    if (updateRes.ok) {
      const updatedUser = await updateRes.json();
      data.user = { ...data.user, ...updatedUser };
    }
  }

  return data;
}

// Login
export async function loginUser(identifier: string, password: string): Promise<AuthResponse> {
  const url = `${API_URL}/api/auth/local`;
  console.log('POST login ->', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  if (!response.ok) {
    let errorBody: ApiError | null = null;
    try {
      errorBody = await response.json();
    } catch {
      /* ignore */
    }
    throw new Error(
      errorBody?.error?.message || `Error al iniciar sesión (status ${response.status})`,
    );
  }

  return response.json();
}

// Obtener datos del usuario actual
export async function getCurrentUser(token: string): Promise<User> {
  const url = `${API_URL}/api/users/me`;
  console.log('GET current user ->', url);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener datos del usuario (status ${response.status})`);
  }

  return response.json();
}
