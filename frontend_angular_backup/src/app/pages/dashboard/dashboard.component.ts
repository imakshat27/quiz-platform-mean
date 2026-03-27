import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { RouterModule, Router } from '@angular/router';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Quizzes</h2>
        <button class="btn btn-primary" routerLink="/create-quiz">+ Create Quiz</button>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let quiz of quizzes">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ quiz.title }}</h5>
              <p class="card-text text-muted">{{ quiz.description }}</p>
              <p class="card-text"><small>By: {{ quiz.createdBy?.name || 'Unknown' }}</small></p>
            </div>
            <div class="card-footer bg-white border-top-0 d-flex gap-2">
              <button class="btn btn-outline-success w-100" (click)="attemptQuiz(quiz)">Attempt</button>
              <button class="btn btn-outline-secondary w-100" (click)="addQuestions(quiz)">Add Questions</button>
            </div>
          </div>
        </div>
        
        <div class="col-12" *ngIf="quizzes.length === 0">
          <div class="alert alert-info border-0 shadow-sm">
            No quizzes available yet. Be the first to create one!
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.quizService.getQuizzes().subscribe({
      next: (data) => this.quizzes = data,
      error: (err) => console.error(err)
    });
  }

  attemptQuiz(quiz: Quiz) {
    this.router.navigate(['/attempt-quiz', quiz._id]);
  }

  addQuestions(quiz: Quiz) {
    this.router.navigate(['/add-question', quiz._id]);
  }
}
