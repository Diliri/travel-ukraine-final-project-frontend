export type StoryCategory = {
  _id: string;
  category: string;
};

export type CreateStoryFormValues = {
  image: File | null;
  title: string;
  category: string;
  article: string;
};
