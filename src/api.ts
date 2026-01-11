import { tg } from './telegram';

/**
 * ⬇️ ОБЯЗАТЕЛЬНО
 * ВПИШИ СЮДА АДРЕС ТВОЕГО GAS WEB APP
 */
const API_URL =
  'https://script.google.com/macros/s/AKfycbz8jhdHer5qIfmLKT6zlJjU_ZOvEJ3ULTf3m0fIjpYCvGAtgVLTQV1xSBKbB1XKy9FWHw/exec';

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiError = {
  ok: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Универсальный вызов backend (GAS)
 */
export async function api<T>(
  action: string,
  payload: Record<string, any> = {}
): Promise<ApiResponse<T>> {
  try {
    const body = {
      action,
      payload,
      initData: tg?.initData || '',
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `HTTP ${res.status}`,
      };
    }

    const json = await res.json();

    if (!json || typeof json.ok !== 'boolean') {
      return {
        ok: false,
        error: 'Invalid server response',
      };
    }

    return json;
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : 'Unknown error',
    };
  }
}

type UploadPayload = {
  folder_id: string;
  base_name: string;
  orientation: 'portrait' | 'landscape';
  files: {
    name: string;
    type: string;
    data: string;
  }[];
};

export function uploadFiles(payload: UploadPayload) {
  return api<{ success: true }>('uploadFiles', payload);
}



