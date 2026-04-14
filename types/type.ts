export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  tags?: string[];
  color?: string;
}
