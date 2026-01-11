import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const [stack, setStack] = useState<
  { level: Level; folders: Folder[] }[]
>([]);


  useEffect(() => {
  initTelegram();

  const bg = tg?.themeParams?.bg_color;

  // если фон светлый — считаем light
  if (bg && isLightColor(bg)) {
    setTheme('light');
  } else {
    setTheme('dark');
  }

  api<Org[]>('getOrgs').then(res => {
    if (res.ok) setOrgs(res.data);
    else alert(res.error);
  });
}, []);


  const openFolder = async (folderId: string, title: string) => {
    const res = await api<Folder[]>('listFolders', { folder_id: folderId });
    if (!res.ok) return alert(res.error);

    setStack(prev => [
  ...prev,
  { level, folders }
]);

    setLevel({ type: 'folders', folderId, title });
    setFolders(res.data);
  };

  const goBack = () => {
  const prev = [...stack];
  const last = prev.pop();
  if (!last) return;

  setStack(prev);
  setLevel(last.level);
  setFolders(last.folders);
};


  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div
  className="min-h-screen bg-white dark:bg-[#0f0f0f] px-6 pt-6"
  style={{
    color: theme === 'dark' ? '#f5f5f5' : '#000000',
    paddingBottom: '140px' // место под нижнюю панель
  }}
      >
        {/* HEADER */}
        <h1 className="text-xl font-semibold mb-6 pl-2">
          {level.type === 'orgs' ? 'Ресторан' : level.title}
        </h1>

        {/* CONTENT */}
        <div className="space-y-24 px-3">
          {level.type === 'orgs' &&
        orgs.map(o => (
            <div
            key={o.root_folder_id}
            onClick={() => openFolder(o.root_folder_id, o.org)}
            className="
                p-5
                rounded-2xl
                bg-gray-100 dark:bg-[#1c1c1e]
                cursor-pointer
                text-base font-semibold
                text-black dark:text-white
                active:scale-[0.97]
                transition-transform
            "
            >
            📁 {o.org}
            </div>
        ))}

          {level.type === 'folders' &&
            folders.map(f => (
                <div
                key={f.id}
                onClick={() => openFolder(f.id, f.name)}
                className="
                    p-5
                    rounded-2xl
                    bg-gray-100 dark:bg-[#1c1c1e]
                    cursor-pointer
                    text-base font-semibold
                    text-black dark:text-white
                    active:scale-[0.97]
                    transition-transform
                "
                >
                📂 {f.name}
                </div>
            ))}

        </div>

        {/* BOTTOM BAR */}
        <div
          className="
    fixed bottom-0 left-0 right-0
    bg-white dark:bg-[#1c1c1e]
    border-t border-gray-200 dark:border-gray-800
    px-6 py-6
    z-50
  "
        >
          <div className="flex gap-4">
            {stack.length > 0 && (
              <BottomButton onClick={goBack}>
                ← Назад
              </BottomButton>
            )}

            {level.type === 'folders' && (
              <Uploader folderId={level.folderId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function isLightColor(hex?: string) {
  if (!hex) return false;
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}


/* ---------- UI COMPONENTS ---------- */



function BottomButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="
        flex-1
        py-4
        rounded-2xl
        bg-blue-600
        text-white
        text-lg font-semibold
      "
    >
      {children}
    </motion.button>
  );
}
