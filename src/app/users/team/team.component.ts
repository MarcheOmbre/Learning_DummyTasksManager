import {Component, EventEmitter, OnDestroy, Output, viewChild, ViewContainerRef} from '@angular/core';
import UserComponent from '../user/user.component';
import IUsersService from '../../../services/IUsersService';
import User from '../../../models/User';
import {Subscription} from 'rxjs';

@Component({
  selector: 'team-list',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  imports: [],
})

export class TeamComponent implements OnDestroy {

  @Output() OnSelected = new EventEmitter<User | null>();


  protected readonly title = 'Team';

  private readonly viewContainerRef = viewChild.required('users', {read: ViewContainerRef});

  private onUserClickedSubscriptions = new Array<Subscription>();
  private selectedUserComponent: UserComponent | null = null;


  public initialize(usersService: IUsersService) {

    this.clear();

    usersService.GetAllUsers().forEach(user =>
    {
      const component = this.viewContainerRef().createComponent(UserComponent).instance;
      component.initialize(user);
      this.onUserClickedSubscriptions.push(component.OnClicked.subscribe(userComponent => TeamComponent.onUserComponentSelected(this, userComponent)));
    });

  }

  ngOnDestroy() {

    this.clear();

  }

  private static onUserComponentSelected(teamComponent : TeamComponent, userComponent: UserComponent | null): void {

    if(teamComponent.selectedUserComponent == userComponent)
      return;

    if(teamComponent.selectedUserComponent != undefined)
      teamComponent.selectedUserComponent.Selected = false;

    teamComponent.selectedUserComponent = userComponent;

    if(teamComponent.selectedUserComponent)
      teamComponent.selectedUserComponent.Selected = true;

    teamComponent.OnSelected.emit(teamComponent.selectedUserComponent?.User ?? null);

  }

  private clear(): void {

    this.selectedUserComponent = null;
    this.OnSelected.emit(null);

    this.viewContainerRef().clear();

    this.onUserClickedSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.onUserClickedSubscriptions.length = 0;

  }
}
