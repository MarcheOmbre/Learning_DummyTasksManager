import Task from '../models/Task';

interface ITasksService {

  getAllTasks(): ReadonlyArray<Task>;

  getAllTasksByUserId(userId: number): ReadonlyArray<Task>;

  tryAdd(task: Task, id?: number): boolean;

  removeTask(task: Task): boolean;
}

export default ITasksService;
