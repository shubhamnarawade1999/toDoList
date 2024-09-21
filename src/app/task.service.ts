import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: any[] = [];

  constructor(private http: HttpClient) {
   
    const savedTasks = localStorage.getItem('taskArray');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }


  getTasks(): any[] {
    return this.tasks;
  }

  addTask(task: any): void {
    this.tasks.push(task);
    this.updateLocalStorage();
  }


  editTask(index: number, updatedTask: any): void {
    this.tasks[index] = updatedTask;
    this.updateLocalStorage();
  }

  
  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.updateLocalStorage();
  }


  clearTasks(): void {
    this.tasks = [];
    localStorage.removeItem('taskArray');
  }

 
  private updateLocalStorage(): void {
    localStorage.setItem('taskArray', JSON.stringify(this.tasks));
  }
}
