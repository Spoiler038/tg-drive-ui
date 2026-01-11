import { useEffect, useState } from 'react';
import { tg, initTelegram } from './telegram';
import { api } from './api';
import { Org, Folder } from './types';
import Uploader from './Uploader';


type Level =
  | { type: 'orgs' }
  | { type: 'folders'; folderId: string; title: string };

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [level, setLevel] = useState<Level>({ type: 'orgs' });

  const [orgs, setOrgs] = useState<Org[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [stack, setStack] = useState<Level[]>([]);

  useEffect(() => {
    initTelegram();

    if (tg?.colorScheme === 'dark') setTheme('dark');

    api<Org[]>('getOrgs').then(res => {
      if (res.ok) setOrgs(res.data);
      else alert(res.error);
    });
  }, []);

  const openFolder = async (folderId: string, title: string) => {
    const res = await api<Folder[]>('listFolders', { parent_folder_id: folderId });
    if (!res.ok) return alert(res.error);

    setStack(prev => [...prev, level]);
    setLevel({ type: 'folders', folderId, title });
    setFolders(res.data);
  };

  const goBack = () => {
    const prev = [...stack];
    const last = prev.pop();
    if (!last) return;

    setStack(prev);
    setLevel(last);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white p-4">

        {/* HEADER */}
        <div className="flex items-center mb-4">
          {stack.length > 0 && (
            <button
              onClick={goBack}
              className="mr-3 text-blue-500"
            >
              ← Назад
            </button>
          )}
          <h1 className="text-lg font-semibold">
            {level.type === 'orgs' ? 'Организации' : level.title}
          </h1>
        </div>

        {/* CONTENT */}
        <div className="space-y-3">

  {level.type === 'orgs' &&
    orgs.map(o => (
      <div
        key={o.root_folder_id}
        onClick={() => openFolder(o.root_folder_id, o.org)}
        className="p-4 rounded-xl bg-gray-100 dark:bg-[#1c1c1e] cursor-pointer"
      >
        📁 {o.org}
      </div>
    ))}

  {level.type === 'folders' &&
    folders.map(f => (
      <div
        key={f.id}
        onClick={() => openFolder(f.id, f.name)}
        className="p-4 rounded-xl bg-gray-100 dark:bg-[#1c1c1e] cursor-pointer"
      >
        📂 {f.name}
      </div>
    ))}

  {/* ⬇️ ВОТ ЗДЕСЬ ⬇️ */}
  {level.type === 'folders' && (
    <Uploader folderId={level.folderId} />
  )}

</div>


      </div>
    </div>
  );
}
