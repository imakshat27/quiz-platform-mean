import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../services/result.service';
import { RouterModule } from '@angular/router';
import { Result } from '../../models/result.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2 class="mb-4">My Quiz Results</h2>
      
      <div class="row" *ngIf="results.length > 0">
        <div class="col-md-6 mb-4" *ngFor="let result of results">
          <div class="card shadow-sm h-100 border-start border-4" 
               [ngClass]="getScorePercentage(result) >= 50 ? 'border-success' : 'border-danger'">
            <div class="card-body">
              <h5 class="card-title">{{ result.quizId?.title || 'Deleted Quiz' }}</h5>
              <p class="text-muted"><small>Submitted: {{ result.submittedAt | date:'medium' }}</small></p>
              
              <div class="d-flex justify-content-between align-items-center mt-4">
                 <span class="h1 mb-0" [ngClass]="getScorePercentage(result) >= 50 ? 'text-success' : 'text-danger'">
                   {{ getScorePercentage(result) }}%
                 </span>
                 <div class="text-end">
                    <div class="fs-5">Score: <strong>{{ result.score }} / {{ result.totalQuestions }}</strong></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="alert alert-info shadow-sm border-0" *ngIf="results.length === 0">
         You haven't attempted any quizzes yet. <a routerLink="/dashboard" class="alert-link">Explore quizzes</a>.
      </div>
    </div>
  `
})
export class ResultComponent implements OnInit {
  results: Result[] = [];

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    this.resultService.getMyResults().subscribe({
       next: (data) => this.results = data,
       error: (err) => console.error(err)
    });
  }
  
  getScorePercentage(result: Result): number {
    if (result.totalQuestions === 0) return 0;
    return Math.round((result.score / result.totalQuestions) * 100);
  }
}
