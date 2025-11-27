export const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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
  // 1. Registro solo con username, email y password
  const baseUser = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  };

  const response = await fetch(`${API_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(baseUser),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Error al registrar usuario');
  }

  const data: AuthResponse = await response.json();

  // 2. Update con los datos adicionales solo si existen y tienes JWT
  if ((userData.name || userData.phone) && data.jwt) {
    const updateRes = await fetch(`${API_URL}/api/users/${data.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({
        ...(userData.name && { name: userData.name }),
        ...(userData.phone && { phone: userData.phone }),
        account_status: 'pending', // Si quieres forzar el status tras crear
      }),
    });

    if (updateRes.ok) {
      const updatedUser = await updateRes.json();
      data.user = { ...data.user, ...updatedUser };
    }
    // Si falla el update, el registro sigue siendo válido
  }

  return data;
}

// Login
export async function loginUser(identifier: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/local`, {
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
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'Error al iniciar sesión');
  }

  return response.json();
}

// Obtener datos del usuario actual
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener datos del usuario');
  }

  return response.json();
}
