import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-4">Create a New Quiz</h3>
              <div *ngIf="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
              
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Quiz Title</label>
                  <input type="text" class="form-control" [(ngModel)]="quiz.title" name="title" required placeholder="e.g., Angular Basics">
                </div>
                
                <div class="mb-4">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="quiz.description" name="description" rows="3" required placeholder="Brief description of what this quiz is about..."></textarea>
                </div>
                
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Create Quiz</button>
                  <button type="button" class="btn btn-outline-secondary" routerLink="/dashboard">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateQuizComponent {
  quiz = { title: '', description: '' };
  errorMessage = '';

  constructor(private quizService: QuizService, private router: Router) {}

  onSubmit() {
    this.quizService.createQuiz(this.quiz).subscribe({
      next: (response) => {
        // Redirect to add questions
        this.router.navigate(['/add-question', response.quiz._id]);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to create quiz';
      }
    });
  }
}
