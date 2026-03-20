import {Component, ElementRef, EventEmitter, Output, signal, viewChild} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import User from '../../../models/User';

@Component({
  selector: 'user-item',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

class UserComponent {

  @Output() OnClicked = new EventEmitter<UserComponent | null>();


  get User(): User | null {

    return this.currentUser;

  }

  set Selected(value: boolean) {

    this.button().nativeElement.classList.toggle("selected", value);

  }


  protected nameSignal = signal("")
  protected avatarSignal = signal("")

  private button = viewChild.required('button', {read: ElementRef<HTMLButtonElement>});

  private currentUser: User | null = null;


  public initialize(user: User) {

    this.currentUser = user;

    this.nameSignal.set(this.currentUser.Name);
    this.avatarSignal.set(this.currentUser.Avatar);

  }

  protected onInternalClicked(): void {

    this.OnClicked.emit(this);

  }
}

export default UserComponent
