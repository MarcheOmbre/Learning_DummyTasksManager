import {Component, EventEmitter, Output, signal} from '@angular/core';
import Task from '../../../models/Task';

@Component({
  selector: 'task-item',
  templateUrl: './task.component.html',
  imports: [],
  styleUrl: './task.component.css'
})

export class TaskComponent {

  @Output() OnModify = new EventEmitter<TaskComponent | null>();
  @Output() OnDone = new EventEmitter<TaskComponent | null>();


  get Task(): Task | null {
    return this.currentTask;
  }


  protected titleSignal = signal("")
  protected descriptionSignal = signal("");
  protected dueDateSignal = signal("");
  protected doneButtonText = "Done";
  private currentTask: Task | null = null;


  public initialize(task: Task) {
    this.currentTask = task;
    this.titleSignal.set(this.currentTask.Title);
    this.descriptionSignal.set(this.currentTask.Description);
    this.dueDateSignal.set(this.currentTask.DueDate.toLocaleDateString("FR-fr"));
  }

  protected onModifyInternalClicked(): void {
    this.OnModify.emit(this);
  }

  protected onDoneInternalClicked(): void {
    this.OnDone.emit(this);
  }
}
