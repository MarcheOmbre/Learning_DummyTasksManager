import {
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import ITasksService from '../../../services/ITasksService';
import {TaskComponent} from '../task/task.component';
import User from '../../../models/User';
import {Subscription} from 'rxjs';
import {TaskEditorComponent} from '../task-editor/task-editor.component';
import Task from '../../../models/Task';

@Component({
  selector: 'task-list',
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [
    TaskEditorComponent
  ],
  standalone: true
})

export class TasksListComponent implements OnInit, OnDestroy {

  private static readonly NO_MEMBER_SELECTED_MESSAGE = "Click on a member to see its tasks";

  protected readonly title = 'Tasks';
  protected readonly addTaskButtonText = "+ Add Task";
  private readonly newTaskTitle = "New Task";
  private readonly newTaskDescription = "New Task Description";
  private readonly newTaskDueDate = new Date();

  protected readonly informationSignal = signal(TasksListComponent.NO_MEMBER_SELECTED_MESSAGE);
  protected readonly nameSignal = signal("");
  protected readonly avatarSignal = signal("");

  private readonly viewContainerRef = viewChild.required('tasks', {read: ViewContainerRef});
  private readonly taskEditorRef = viewChild.required('task_editor', {read: TaskEditorComponent});
  private readonly addTaskButtonRef = viewChild.required('add_task_button', {read: ElementRef<HTMLButtonElement>});

  private readonly doneSubscriptionsMapper = new Map<TaskComponent, Subscription>();
  private modifySubscription !: Subscription;

  private tasksService: ITasksService | null = null;
  private currentUser: User | null = null;


  ngOnInit(): void {

    this.taskEditorRef().close();
    this.addTaskButtonRef().nativeElement.style.display = "none";

    // Subscribe to the events
    this.addTaskButtonRef().nativeElement.onclick = () => this.OnAddTaskButtonClicked();
    this.modifySubscription = this.taskEditorRef().OnConfirm.subscribe(task => TasksListComponent.OnTaskEditorConfirm(this, task))
  }

  public initialize(tasksService: ITasksService): void {
    this.tasksService = tasksService;
  }

  ngOnDestroy(): void {
    this.clear();

    // Unsubscribe from the events
    this.addTaskButtonRef().nativeElement.onclick = null;
    this.modifySubscription.unsubscribe();
  }

  public loadTasks(user: User | null): void {

    this.clear();

    // Set the current user
    this.currentUser = user;
    let name = "";
    let avatar = "";
    let information = TasksListComponent.NO_MEMBER_SELECTED_MESSAGE;
    let display = "none";

    if (this.currentUser != null) {
      name = this.currentUser.Name;
      avatar = this.currentUser.Avatar;
      information = "";
      display = "block";
    }

    // Set the information
    this.informationSignal.set(information)
    this.nameSignal.set(name);
    this.avatarSignal.set(avatar);
    this.addTaskButtonRef().nativeElement.style.display = display;

    // Load the tasks
    if (this.tasksService == null || user == null)
      return;

    Array.from(this.tasksService.getAllTasksByUserId(user.Id))
      .sort((x, y) => x.DueDate.getTime() - y.DueDate.getTime())
      .forEach(task => {
      const taskComponent = this.viewContainerRef().createComponent(TaskComponent).instance;
      taskComponent.initialize(task);

      // Subscribe to the events
      this.doneSubscriptionsMapper.set(taskComponent,
        taskComponent.OnDone.subscribe(_ => TasksListComponent.OnTaskDone(this, taskComponent)))

      this.doneSubscriptionsMapper.set(taskComponent,
        taskComponent.OnModify.subscribe(_ => this.OnModifyTaskButtonClicked(task)));
    });
  }

  private OnAddTaskButtonClicked(): void {
    if (this.currentUser == null)
      throw new Error("No user selected");

    this.taskEditorRef().openToCreate(
      new Task(this.currentUser.Id,
        this.newTaskTitle,
        this.newTaskDescription,
        this.newTaskDueDate)
    );
  }

  private OnModifyTaskButtonClicked(task: Task): void {
    if (this.currentUser == null)
      throw new Error("No user selected");

    if (task == null)
      throw new Error("No task selected");

    this.taskEditorRef().openToModify(task);
  }

  private static OnTaskEditorConfirm(taskListComponent: TasksListComponent, task: Task): void {

    if (taskListComponent.tasksService == null)
      throw new Error("No tasks service");

    if (task == null)
      throw new Error("No task");

    // Add the task to the data if it doesn't exist
    taskListComponent.tasksService.tryAdd(task)

    // Reload the tasks
    taskListComponent.loadTasks(taskListComponent.currentUser);
  }

  private static OnTaskDone(tasksListComponent: TasksListComponent, taskComponent: TaskComponent): void {

    if (tasksListComponent == null)
      throw new Error("TasksListComponent or TaskComponent is null");

    // Unsubscribe from the event
    tasksListComponent.doneSubscriptionsMapper.get(taskComponent)?.unsubscribe();
    tasksListComponent.doneSubscriptionsMapper.delete(taskComponent);

    // Remove the task from the data
    if (taskComponent.Task != null)
      tasksListComponent.tasksService?.removeTask(taskComponent.Task);

    // Reload the tasks
    tasksListComponent.loadTasks(tasksListComponent.currentUser);
  }

  private clear(): void {

    this.doneSubscriptionsMapper.forEach(subscription => subscription.unsubscribe());
    this.doneSubscriptionsMapper.clear();
    this.viewContainerRef().clear();
    this.currentUser = null;

    this.informationSignal.set(TasksListComponent.NO_MEMBER_SELECTED_MESSAGE);
    this.nameSignal.set("");
    this.avatarSignal.set("");
    this.addTaskButtonRef().nativeElement.style.display = "none";

    this.taskEditorRef().close();
  }
}
