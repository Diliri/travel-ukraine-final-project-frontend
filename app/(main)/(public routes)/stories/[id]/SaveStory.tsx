'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './page.module.css';

export default function SaveStory({ storyId }: { storyId: string }) {
  const user = useAuthStore(state => state.user);
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pending = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const saved = savedOverride ?? user?.savedArticles.includes(storyId) ?? false;

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/users/me', { signal: controller.signal, credentials: 'include' })
      .then(async response => {
        if (!response.ok) return;
        const payload = await response.json();
        const current = payload?.data?.user ?? payload?.data ?? payload?.user ?? payload;
        if (!controller.signal.aborted && Array.isArray(current?.savedArticles)) {
          setSavedOverride(current.savedArticles.some((item: unknown) => (
            item === storyId || (!!item && typeof item === 'object' && '_id' in item && item._id === storyId)
          )));
        }
      }).catch(() => {});
    return () => controller.abort();
  }, [storyId]);

  const toggleSaved = async () => {
    if (pending.current) return;
    pending.current = true;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/stories/${storyId}/favorite`, {
        method: saved ? 'DELETE' : 'POST', credentials: 'include',
      });
      if (response.status === 401) {
        dialog.current?.showModal();
        return;
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Не вдалося зберегти історію');
      }
      setSavedOverride(!saved);
      toast.success(saved ? 'Історію видалено зі збережених' : 'Історію збережено');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не вдалося зберегти історію');
    } finally {
      pending.current = false;
      setIsSaving(false);
    }
  };

  return (
    <>
      <section className={styles.saveCard} aria-labelledby="save-story-title">
        <h2 id="save-story-title">Збережіть собі історію</h2>
        <p>Вона буде доступна у вашому профілі у розділі збережене</p>
        <button type="button" className={styles.saveButton} disabled={isSaving}
          aria-busy={isSaving} onClick={() => void toggleSaved()}>
          {isSaving ? 'Завантаження…' : saved ? 'Видалити зі збережених' : 'Зберегти'}
        </button>
      </section>
      <dialog ref={dialog} className={styles.authDialog} aria-labelledby="save-auth-title"
        onClick={event => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right
            || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.current?.close();
        }}>
        <button type="button" className={styles.close} aria-label="Закрити вікно" onClick={() => dialog.current?.close()}>
          <svg width="24" height="24" aria-hidden="true"><use href="/svg/icons.svg#close" /></svg>
        </button>
        <h2 id="save-auth-title">Помилка під час збереження</h2>
        <p>Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису зареєструйтесь</p>
        <div className={styles.authActions}>
          <Link href="/login" onClick={() => dialog.current?.close()}>Увійти</Link>
          <Link href="/register" onClick={() => dialog.current?.close()}>Зареєструватись</Link>
        </div>
      </dialog>
    </>
  );
}
