import { TaskStatus } from "./taskStatus";

export type Task = {
  id: number;
  dueDate: string;
  status: TaskStatus;
  description: string;
};
