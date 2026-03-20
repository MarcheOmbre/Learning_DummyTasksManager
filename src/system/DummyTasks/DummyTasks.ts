import ITasksService from '../../services/ITasksService';
import Task from '../../models/Task';
import tasks = require("./Tasks.json");

class DummyTasksService implements ITasksService {
  private readonly allTasks = new Array<Task>();

  constructor() {

    for (let i = 0; i < tasks.length; i++) {
      this.allTasks.push(new Task
      (
        tasks[i].userId,
        tasks[i].title,
        tasks[i].description,
        new Date(tasks[i].dueDate)
      ));
    }
  }

  getAllTasksByUserId(userId: number): ReadonlyArray<Task> {
    return this.allTasks.filter(task => task.UserID === userId);
  }

  getAllTasks(): Task[] {
    return this.allTasks;
  }

  tryAdd(task: Task) {

    if (task == null)
      throw new Error("Task is null");

    const id = this.allTasks.indexOf(task);

    if (id >= 0 && id < this.allTasks.length)
      return false

    this.allTasks.push(task);
    return true;
  }

  removeTask(task: Task): boolean {

    if (task == null)
      throw new Error("Task is null");

    const index = this.allTasks.indexOf(task);
    if (index !== -1) {
      this.allTasks.splice(index, 1);
      return true;
    }

    return false;
  }
}

export default DummyTasksService;
