export type Note = {
  id: number;
  title: string;
  body: string;
  tags?: string[] | null;
};