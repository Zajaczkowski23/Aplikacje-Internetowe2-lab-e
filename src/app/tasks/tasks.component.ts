import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Task } from '../task';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  public tasks: Task[] = [];
  public newTask: Task = {};
  public isProcessing = false;
  constructor(private taskService: TasksService) {}

  ngOnInit(): void {
    this.taskService.index().subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.isProcessing = false;
  }

  addTask(): void {
    if (this.newTask.title === undefined) {
      return;
    }

    this.newTask.completed = false;
    this.newTask.archived = false;

    this.tasks.unshift(this.newTask);

    this.taskService.post(this.newTask).subscribe((task: Task): void => {
      this.newTask = {};
      this.ngOnInit();
    });
  }

  handleChange(task: Task): void {
    this.taskService.put(task).subscribe({
      error: (err) => {
        alert(err);
        this.ngOnInit();
      },
    });
  }

  archiveCompleted(): void {
    const observables: Observable<any>[] = [];
    for (const task of this.tasks) {
      if (!task.completed) {
        continue;
      }

      task.archived = true;
      observables.push(this.taskService.put(task));
    }

    forkJoin(observables).subscribe((): void => {
      this.ngOnInit();
    });
  }

  canAddTask() {
    if (this.isProcessing) {
      return false;
    }

    return !!this.newTask.title;
  }

  canArchiveCompleted() {
    for (const task of this.tasks) {
      if (task.completed) {
        return true;
      }
    }
    return false;
  }
}
