import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'toDoList';
  areButtonsVisible = false;
  taskForm!: FormGroup;
  inputData: any;
  savedTasks: any[] = [];
  expandedRowIndex: number | null = null;
  savedTaskslength: number = 0;
  visibleTasks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  selectAll: boolean = false;
  editIndex: number | null = null;
  isUpdate: boolean = false;
  searchQuery: string = '';
  constructor(private modalService: NgbModal, private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.taskForm = this.formbuilder.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: [''],
      priority: ['', Validators.required],
      description: ['']
    });

    const savedData = localStorage.getItem('taskArray');
    if (savedData) {
      this.savedTasks = JSON.parse(savedData);
    }
    this.updatePagination();
  }

  openModel(content: any, isNewTask: boolean) {
    this.modalService.open(content);
    if (isNewTask) {
      this.taskForm.reset();
    }

  }

  save() {
    if (this.taskForm.valid) {
      if (this.editIndex !== null) {
        this.savedTasks[this.editIndex] = this.taskForm.value;
        this.editIndex = null;
      } else {
        this.savedTasks.push(this.taskForm.value);
      }

      localStorage.setItem('taskArray', JSON.stringify(this.savedTasks));
      this.taskForm.reset();
      this.modalService.dismissAll();
      this.updatePagination();
    } else {
      console.log('Form is invalid');
    }
  }
  cancel() {
    this.taskForm.reset();
    this.editIndex = null;
  }
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.savedTasks.forEach(task => task.selected = this.selectAll);
  }
  toggleButtons(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }
  onEdit(index: number, content: any) {
    this.editIndex = index;
    const task = this.savedTasks[index];
    this.taskForm.patchValue(task);
    this.openModel(content, false);

    if (task.status === "Completed") {
      this.isUpdate = true;
    }
  }
 
 
  onDelete(index: number) {
    this.savedTasks.splice(index, 1);
    localStorage.setItem('taskArray', JSON.stringify(this.savedTasks));
    alert('Task deleted successfully!');
 
    this.updatePagination();
  }

  updatePagination() {
    // this.totalPages = Math.ceil(this.savedTasks.length / this.itemsPerPage);
    // this.currentPage = Math.min(this.currentPage, this.totalPages);
    // const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    // const endIndex = startIndex + this.itemsPerPage;
    // this.visibleTasks = this.savedTasks.slice(startIndex, endIndex);

    this.totalPages = Math.ceil(this.savedTasks.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleTasks = this.savedTasks.slice(startIndex, endIndex);
  
    console.log('Visible Tasks:', this.visibleTasks);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = +event.target.value;
    this.updatePagination();
  }

  firstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  lastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  refresh() {
    this.savedTasks = [];
    localStorage.removeItem('taskArray');
    this.updatePagination();
    alert('All tasks deleted successfully!');
  }
 
  filterTasks() {
    if (this.searchQuery) {
      this.visibleTasks = this.savedTasks.filter(task => 
        task.assignedTo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.priority.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (task.dueDate && task.dueDate.includes(this.searchQuery)) // You can adjust this for specific date formats
      );
    } else {
      this.updatePagination(); // Reset if the search query is empty
    }
  }
}
