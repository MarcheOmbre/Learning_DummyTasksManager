import {Component, OnDestroy, OnInit, viewChild} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {TeamComponent} from './users/team/team.component';
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import DummyUsersService from '../system/DummyUsers/DummyUsers';
import DummyTasksService from '../system/DummyTasks/DummyTasks';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    HeaderComponent,
    TeamComponent,
    TasksListComponent
  ],
  styleUrl: './app.css'
})

export class App implements OnInit, OnDestroy{

  private readonly usersService = new DummyUsersService();
  private readonly tasksService = new DummyTasksService();

  private readonly teamListRef = viewChild.required('team_list', {read: TeamComponent});
  private readonly tasksListRef = viewChild.required('tasks_list', {read: TasksListComponent});

  private onMemberSelectedSubscription !: Subscription;

  ngOnInit(): void {

    const appTeam = this.teamListRef();
    const appTasksList = this.tasksListRef();

    appTeam.initialize(this.usersService);
    appTasksList.initialize(this.tasksService);

    this.onMemberSelectedSubscription = appTeam.OnSelected.subscribe(user => appTasksList.loadTasks(user));

  }

  ngOnDestroy() {

    this.onMemberSelectedSubscription?.unsubscribe();

  }
}
