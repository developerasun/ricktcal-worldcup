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

export function useFromUtc() {
  const date = new Date();
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const full = kstDate.toISOString().replace('T', ' ').slice(0, 19);
  const short = full.slice(0, 10);
  return { full, short, kstDate };
}

export async function useCopyText({ text }: { text: string }) {
  await navigator.clipboard.writeText(text);
}

export function useScrollReset() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
