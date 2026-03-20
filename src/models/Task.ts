class Task {

  private readonly userId: number;
  private title: string;
  private description: string;
  private dueDate: Date;

  get UserID(): number {
    return this.userId;
  }

  get Title(): string {
    return this.title;
  }

  set Title(value: string) {
    this.title = value;
  }

  get Description(): string {
    return this.description;
  }

  set Description(value: string) {
    this.description = value;
  }

  get DueDate(): Date {
    return this.dueDate;
  }

  set DueDate(value: Date) {
    this.dueDate = value;
  }

  constructor(userId: number, name: string, description: string, dueDate: Date) {
    this.userId = userId;
    this.title = name;
    this.description = description;
    this.dueDate = dueDate;
  }
}

export default Task;
