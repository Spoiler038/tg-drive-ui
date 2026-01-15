import { tg } from './telegram';

/**
 * ⬇️ ОБЯЗАТЕЛЬНО
 * ВПИШИ СЮДА АДРЕС ТВОЕГО GAS WEB APP
 */
const API_URL =
  'https://script.google.com/macros/s/AKfycbygaXWDEwxJ_jqtWw5__kTxSi4YbMgGaGd4qCvHBZk0HeAWok58Evabsm0wRdpEvMXBpA/exec';

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

    const bodyString = JSON.stringify(body);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyString,
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
      error: e instanceof Error ? e.message : 'Unknown error',
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



