import { useState } from 'react';
import { uploadFiles } from './api';
import { fileToBase64 } from './fileUtils';

type Props = {
  folderId: string;
};

export default function Uploader({ folderId }: Props) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const upload = async () => {
    if (!files.length) return;

    setLoading(true);

    const prepared = [];
    for (const f of files) {
      prepared.push({
        name: f.name,
        type: f.type || 'image/jpeg',
        data: await fileToBase64(f)
      });
    }

    const res = await uploadFiles({
      folder_id: folderId,
      base_name: new Date().toLocaleDateString('ru-RU'),
      orientation: 'landscape',
      files: prepared
    });

    setLoading(false);

    if (res.ok) {
      alert('Загружено успешно');
      setFiles([]);
    } else {
      alert(res.error || 'Ошибка загрузки');
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onSelect}
        className="block w-full text-sm"
      />

      <button
  disabled={loading || files.length === 0}
  onClick={upload}
  className="
    w-full
    bg-blue-600
    text-white
    py-4
    rounded-2xl
    text-lg font-semibold
    disabled:opacity-40
    disabled:cursor-not-allowed
  "
>
  {loading ? 'Загрузка…' : 'Загрузить'}
</button>

    </div>
  );
}
