import {Component, effect, ElementRef, EventEmitter, OnDestroy, OnInit, Output, signal, viewChild} from '@angular/core';
import Task from '../../../models/Task';

@Component({
  selector: 'task-editor-modal',
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.css',
})
export class TaskEditorComponent implements OnInit, OnDestroy {

  private static readonly ModifyButtonText = "Modify";
  private static readonly AddButtonText = "Add";


  @Output() OnConfirm = new EventEmitter<Task>();


  protected readonly title = "New Task";
  protected readonly nameLabel = "Name";
  protected readonly descriptionLabel = "Description";
  protected readonly dueDateLabel = "Due Date";
  protected readonly cancelButtonText = "Cancel";

  protected readonly nameInputSignal = signal("");
  protected readonly descriptionInputSignal = signal("");
  protected readonly dueDateInputSignal = signal(new Date());
  protected readonly confirmButtonTextSignal = signal("")

  private readonly elementReference: ElementRef;
  private readonly confirmButtonRef = viewChild.required('confirm_button', {read: ElementRef<HTMLButtonElement>});
  private task?: Task | null = null;


  constructor(elementReference: ElementRef) {

    this.elementReference = elementReference;

    // Update name
    effect(() => {
      console.log(this.nameInputSignal());
      this.confirmButtonRef().nativeElement.disabled = this.nameInputSignal().trim() == "";
    });
  }

  ngOnInit(): void {

    this.confirmButtonRef().nativeElement.disabled = true;
    this.confirmButtonRef().nativeElement.onclick = () => this.onConfirmButtonClicked();
  }

  ngOnDestroy(): void {
    this.clear();
  }


  public openToCreate(task: Task): void {
    this.openToModify(task);
    this.confirmButtonTextSignal.set(TaskEditorComponent.AddButtonText);
  }

  public openToModify(task: Task): void {

    if(task == null)
      throw new Error("No task to edit");

    this.task = task;

    // Set the UI
    this.elementReference.nativeElement.style.display = "block";

    // Set the values
    this.nameInputSignal.set(this.task.Title ?? "");
    console.log(this.task.Description);
    this.descriptionInputSignal.set(this.task.Description ?? "");
    this.dueDateInputSignal.set(this.task.DueDate);
    this.confirmButtonTextSignal.set(TaskEditorComponent.ModifyButtonText);
  }

  public close(): void {

    this.clear();

    // Set the UI
    this.elementReference.nativeElement.style.display = "none";
  }

  protected onConfirmButtonClicked(): void {
    if (this.task == null)
      throw new Error("No user selected");

    const nameValue = this.nameInputSignal();
    if (nameValue.trim() == "")
      throw new Error("No name set");

    this.task.Title = nameValue;
    this.task.Description = this.descriptionInputSignal();
    this.task.DueDate = new Date(this.dueDateInputSignal());
    this.OnConfirm.emit(this.task);
    this.close();
  }

  protected onNameChanged(event: Event): void {
    this.nameInputSignal.set((event.target as HTMLInputElement).value);
  }

  protected onDescriptionChanged(event: Event): void {
    this.descriptionInputSignal.set((event.target as HTMLInputElement).value);
  }

  protected onDueDateChanged(event: Event): void{
    this.dueDateInputSignal.set((event.target as HTMLInputElement).valueAsDate ?? new Date());
  }

  private clear(): void {

    this.task = null;

    this.nameInputSignal.set("");
    this.descriptionInputSignal.set("");
    this.dueDateInputSignal.set(new Date());
  }
}
