// types.ts
export type Id = string;

export interface Task {
  id: Id;
  content: string;
  columnId: Id; // Add the columnId property
}

export interface Column {
  id: Id;
  title: string;
}
