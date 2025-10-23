export type Note = {
  id: number;
  title: string;
  body: string;
  tags?: string[] | null;
  summary?: string | null;
  updatedAt: string
};