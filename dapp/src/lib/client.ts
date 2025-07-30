'use client';

export async function useMutator<T>({ endpoint, body }: { endpoint: string; body: string | FormData }) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body,
    credentials: 'include',
  });

  const data = await response.json();
  return data as T;
}
