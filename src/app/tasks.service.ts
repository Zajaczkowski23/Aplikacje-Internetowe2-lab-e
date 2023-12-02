import { Injectable } from '@angular/core';
import { Task } from './task';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  public index(archived = false): Observable<Task[]> {
    return this.http.get<Task[]>('http://localhost:36703/todos', {
      params: {
        archived: archived,
        _sort: 'id',
        _order: 'desc',
      },
    });
  }

  public post(task: Task): Observable<Task> {
    return this.http.post('http://localhost:36703/todos', task);
  }

  public put(task: Task): Observable<Task> {
    return this.http.put(`http://localhost:36703/todos/${task.id}`, task);
  }

  public delete(task: Task): Observable<any> {
    return this.http.delete(`http://localhost:36703/todos/${task.id}`);
  }
}
