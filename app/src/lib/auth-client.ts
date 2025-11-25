import { createAuthClient } from 'better-auth/react';

const baseURL = import.meta.env.VITE_AUTH_BASE_URL;

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signOut, useSession } = authClient;
