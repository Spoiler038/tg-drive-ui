import { tg } from './telegram';

const API_URL = 'https://script.google.com/macros/s/AKfycbz8jhdHer5qIfmLKT6zlJjU_ZOvEJ3ULTf3m0fIjpYCvGAtgVLTQV1xSBKbB1XKy9FWHw/exec';

export async function api(action: string, payload: any = {}) {
  if (!tg?.initData) {
    throw new Error('Telegram initData missing');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      initData: tg.initData,
      payload
    })
  });

  return res.json();
}

export async function uploadFiles(payload: {
  folder_id: string;
  base_name?: string;
  orientation?: 'portrait' | 'landscape';
  files: {
    name: string;
    type: string;
    data: string;
  }[];
}) {
  return api('upload', payload);
}

