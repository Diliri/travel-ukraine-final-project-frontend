import type { Metadata } from 'next';
import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import styles from './CreateStory.module.css';

export const metadata: Metadata = {
  title: 'Створити нову історію',
  description: 'Форма створення нової історії про подорож Україною.',
};

export default function CreateStoryPage() {
  return (
    <section className={styles.page}>
      <div className={styles.headingSection}>
        <div className={styles.headingContainer}>
          <h1 className={styles.title}>Створити нову історію</h1>
        </div>
      </div>
      <AddStoryForm />
    </section>
  );
}
