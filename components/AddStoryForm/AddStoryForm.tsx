'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import type { CreateStoryFormValues } from '@/types/story';
import type { Category } from '@/types/category';
import StoryFormImage from '@/components/StoryFormImage/StoryFormImage';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import type { ProfileUser } from '@/lib/api/profileApi';
import styles from './AddStoryForm.module.css';

const MAX_IMAGE_SIZE = 1024 * 1024;
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

const initialValues: CreateStoryFormValues = {
  image: null,
  title: '',
  category: '',
  article: '',
};

const validationSchema = Yup.object({
  image: Yup.mixed<File>()
    .required('Додайте обкладинку статті')
    .test(
      'image-type',
      'Оберіть файл зображення',
      value => !value || value.type.startsWith('image/'),
    )
    .test(
      'image-size',
      'Розмір зображення не повинен перевищувати 1 МБ',
      value => !value || value.size <= MAX_IMAGE_SIZE,
    ),
  title: Yup.string()
    .trim()
    .required('Введіть заголовок історії')
    .min(2, 'Заголовок повинен містити щонайменше 2 символи')
    .max(40, 'Заголовок не повинен перевищувати 40 символів'),
  category: Yup.string()
    .required('Оберіть категорію')
    .matches(OBJECT_ID_PATTERN, 'Оберіть коректну категорію'),
  article: Yup.string()
    .trim()
    .required('Введіть текст історії')
    .min(12, 'Текст історії повинен містити щонайменше 12 символів')
    .max(3000, 'Текст історії не повинен перевищувати 3000 символів'),
});

function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    typeof value._id === 'string' &&
    'category' in value &&
    typeof value.category === 'string'
  );
}

function readCreatedStoryId(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const record = payload as Record<string, unknown>;

  if (typeof record._id === 'string') {
    return record._id;
  }

  if (typeof record.id === 'string') {
    return record.id;
  }

  for (const key of ['data', 'story']) {
    if (key in record) {
      const nestedId = readCreatedStoryId(record[key]);
      if (nestedId) return nestedId;
    }
  }

  return null;
}

function readErrorMessage(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const record = payload as Record<string, unknown>;

  for (const key of ['message', 'error']) {
    if (typeof record[key] === 'string') {
      return record[key];
    }
  }

  return null;
}

export default function AddStoryForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch('/api/categories', {
          cache: 'no-store',
          signal: controller.signal,
        });
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            readErrorMessage(payload) ?? 'Не вдалося завантажити категорії',
          );
        }

        if (!Array.isArray(payload) || !payload.every(isCategory)) {
          throw new Error('Сервер повернув некоректний список категорій');
        }

        setCategories(payload);
        setCategoriesError(null);
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          error instanceof Error
            ? error.message
            : 'Не вдалося завантажити категорії';
        setCategoriesError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCategories(false);
        }
      }
    }

    void loadCategories();
    return () => controller.abort();
  }, []);

  const formik = useFormik<CreateStoryFormValues>({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      if (!values.image) return;

      const formData = new FormData();
      formData.append('img', values.image);
      formData.append('title', values.title.trim());
      formData.append('category', values.category);
      formData.append('article', values.article.trim());

      try {
        const response = await fetch('/api/stories/new', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            readErrorMessage(payload) ?? 'Не вдалося зберегти історію',
          );
        }

        const storyId = readCreatedStoryId(payload);
        if (!storyId) {
          throw new Error('Сервер не повернув ID створеної історії');
        }

        queryClient.setQueryData<ProfileUser | undefined>(
          CURRENT_USER_KEY,
          currentUser =>
            currentUser
              ? {
                  ...currentUser,
                  articlesAmount: (currentUser.articlesAmount ?? 0) + 1,
                }
              : currentUser,
        );
        void queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });

        toast.success('Історію успішно створено');
        router.push(`/stories/${storyId}`);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Не вдалося зберегти історію',
        );
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '180px';
    textarea.style.height = `${Math.max(180, textarea.scrollHeight)}px`;
  }, [formik.values.article]);

  const allFieldsFilled = Boolean(
    formik.values.image &&
      formik.values.title.trim() &&
      formik.values.category &&
      formik.values.article.trim(),
  );
  const isSaveDisabled =
    !allFieldsFilled ||
    !formik.isValid ||
    formik.isSubmitting ||
    isLoadingCategories ||
    Boolean(categoriesError);

  const fieldError = (name: keyof CreateStoryFormValues) =>
    formik.touched[name] && typeof formik.errors[name] === 'string'
      ? formik.errors[name]
      : undefined;

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    formik.handleChange(event);
  };

  return (
    <div className={styles.formSection}>
      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        <div className={styles.fields}>
          <StoryFormImage
            file={formik.values.image}
            error={fieldError('image')}
            onChange={file => {
              void (async () => {
                await formik.setFieldValue('image', file, true);
                await formik.setFieldTouched('image', true, false);
              })();
            }}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="story-title">
              Заголовок
            </label>
            <input
              className={`${styles.control} ${fieldError('title') ? styles.invalid : ''}`}
              id="story-title"
              name="title"
              type="text"
              placeholder="Введіть заголовок історії"
              value={formik.values.title}
              aria-describedby={fieldError('title') ? 'story-title-error' : undefined}
              aria-invalid={Boolean(fieldError('title'))}
              onChange={handleTextChange}
              onBlur={formik.handleBlur}
            />
            {fieldError('title') && (
              <p className={styles.error} id="story-title-error" role="alert">
                {fieldError('title')}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="story-category">
              Категорія
            </label>
            <div className={styles.selectWrapper}>
              <select
                className={`${styles.control} ${styles.select} ${fieldError('category') || categoriesError ? styles.invalid : ''}`}
                id="story-category"
                name="category"
                value={formik.values.category}
                disabled={isLoadingCategories || Boolean(categoriesError)}
                aria-describedby={
                  fieldError('category') || categoriesError
                    ? 'story-category-error'
                    : undefined
                }
                aria-invalid={Boolean(fieldError('category') || categoriesError)}
                onChange={handleTextChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>
                  {isLoadingCategories ? 'Завантаження категорій...' : 'Категорія'}
                </option>
                {categories.map(category => (
                  <option value={category._id} key={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
            {(fieldError('category') || categoriesError) && (
              <p className={styles.error} id="story-category-error" role="alert">
                {fieldError('category') ?? categoriesError}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="story-article">
              Текст історії
            </label>
            <textarea
              ref={textareaRef}
              className={`${styles.control} ${styles.textarea} ${fieldError('article') ? styles.invalid : ''}`}
              id="story-article"
              name="article"
              placeholder="Ваша історія тут"
              value={formik.values.article}
              aria-describedby={fieldError('article') ? 'story-article-error' : undefined}
              aria-invalid={Boolean(fieldError('article'))}
              onChange={handleTextChange}
              onBlur={formik.handleBlur}
            />
            {fieldError('article') && (
              <p className={styles.error} id="story-article-error" role="alert">
                {fieldError('article')}
              </p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.saveButton}`}
            type="submit"
            disabled={isSaveDisabled}
          >
            {formik.isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
            {formik.isSubmitting ? 'Збереження...' : 'Зберегти'}
          </button>
          <button
            className={`${styles.actionButton} ${styles.cancelButton}`}
            type="button"
            disabled={formik.isSubmitting}
            onClick={() => formik.resetForm()}
          >
            Відмінити
          </button>
        </div>
      </form>
    </div>
  );
}
