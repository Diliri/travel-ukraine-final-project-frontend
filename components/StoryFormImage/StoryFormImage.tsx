'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import styles from './StoryFormImage.module.css';

type StoryFormImageProps = {
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
};

export default function StoryFormImage({
  file,
  error,
  onChange,
}: StoryFormImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!file && objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [file]);

  const selectFile = (selectedFile: File | undefined) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextPreviewUrl = selectedFile
      ? URL.createObjectURL(selectedFile)
      : null;
    objectUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    onChange(selectedFile ?? null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>Обкладинка статті</span>
      <div className={styles.uploadArea}>
        <button
          className={`${styles.imageFrame} ${isDragging ? styles.dragging : ''}`}
          type="button"
          aria-label="Завантажити обкладинку статті"
          aria-describedby={error ? 'story-image-error' : undefined}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragEnter={event => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={event => event.preventDefault()}
          onDragLeave={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
        >
          <Image
            className={styles.image}
            src={file && previewUrl ? previewUrl : '/images/story-cover-placeholder.png'}
            alt={file && previewUrl ? 'Попередній перегляд обкладинки статті' : ''}
            fill
            sizes="(min-width: 1440px) 1091px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)"
            unoptimized={Boolean(file && previewUrl)}
          />
          {isDragging && (
            <span className={styles.dropMessage}>Відпустіть фото тут</span>
          )}
        </button>

        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          tabIndex={-1}
        />

        <button
          className={styles.uploadButton}
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          Завантажити фото
        </button>
      </div>

      {error && (
        <p className={styles.error} id="story-image-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
