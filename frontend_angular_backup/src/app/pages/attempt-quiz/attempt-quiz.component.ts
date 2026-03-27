import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { ResultService } from '../../services/result.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-attempt-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div *ngIf="loading" class="text-center">
         <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
         </div>
      </div>

      <div *ngIf="!loading && error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="!loading && quiz && questions.length === 0" class="alert alert-warning">
         This quiz doesn't have any questions yet.
         <a routerLink="/dashboard">Go back</a>
      </div>

      <div *ngIf="!loading && quiz && questions.length > 0 && !submitted" class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm mb-4">
            <div class="card-body bg-light">
              <h2 class="card-title">{{ quiz.title }}</h2>
              <p class="card-text">{{ quiz.description }}</p>
              <span class="badge bg-secondary">Total Questions: {{ questions.length }}</span>
            </div>
          </div>

          <form (ngSubmit)="submitQuiz()">
             <div class="card shadow-sm mb-4" *ngFor="let q of questions; let i = index">
               <div class="card-header fw-bold bg-white">
                 Question {{ i + 1 }}: {{ q.questionText }}
               </div>
               <div class="card-body p-4">
                 <div class="form-check p-2 rounded" 
                      *ngFor="let option of q.options; let optIndex = index"
                      (click)="selectAnswer(i, optIndex)"
                      [ngClass]="{'bg-primary text-white': userAnswers[i] === optIndex}">
                   <input class="form-check-input ms-0 me-2" type="radio" 
                          [name]="'question' + i" 
                          [value]="optIndex" 
                          [checked]="userAnswers[i] === optIndex"
                          style="pointer-events: none;">
                   <label class="form-check-label ps-1" style="cursor: pointer; display: block; width: 100%;">
                     {{ option }}
                   </label>
                 </div>
               </div>
             </div>
             
             <div class="d-grid mb-5">
               <button type="submit" class="btn btn-primary btn-lg" [disabled]="submitting">
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  Submit Quiz
               </button>
             </div>
          </form>
        </div>
      </div>
      
      <!-- Result view after submitting -->
      <div *ngIf="submitted && result" class="row justify-content-center">
        <div class="col-md-6">
           <div class="card shadow-sm border-0 text-center py-5" [ngClass]="getScorePercentage() >= 50 ? 'bg-success-subtle' : 'bg-danger-subtle'">
              <div class="card-body">
                 <h1 class="display-1 mb-3" [ngClass]="getScorePercentage() >= 50 ? 'text-success' : 'text-danger'">
                    {{ getScorePercentage() }}%
                 </h1>
                 <h3>Score: {{ result.score }} / {{ result.totalQuestions }}</h3>
                 <p class="lead mt-4">{{ getFeedbackMessage() }}</p>
                 <button class="btn btn-primary mt-3" routerLink="/dashboard">Back to Dashboard</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AttemptQuizComponent implements OnInit {
  quizId: string = '';
  quiz: any = null;
  questions: any[] = [];
  userAnswers: (number | null)[] = [];
  
  loading: boolean = true;
  submitting: boolean = false;
  submitted: boolean = false;
  error: string = '';
  result: any = null;

  constructor(
    private quizService: QuizService,
    private resultService: ResultService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizId = params['id'];
      if (!this.quizId) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loadQuizData();
      }
    });
  }

  loadQuizData() {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quizData) => {
        this.quiz = quizData;
        this.loadQuestions();
      },
      error: (err) => {
        this.error = 'Failed to load quiz metadata.';
        this.loading = false;
      }
    });
  }

  loadQuestions() {
    this.quizService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (qs) => {
        this.questions = qs;
        // Initialize user answers with null
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load questions.';
        this.loading = false;
      }
    });
  }

  selectAnswer(questionIndex: number, optionIndex: number) {
    if (!this.submitted) {
      this.userAnswers[questionIndex] = optionIndex;
    }
  }

  submitQuiz() {
    if (this.submitting) return;
    this.submitting = true;

    // We can also allow nulls if they didn't answer some questions
    const submission = {
      quizId: this.quizId,
      answers: this.userAnswers
    };

    this.resultService.submitQuiz(submission).subscribe({
      next: (res) => {
        this.submitting = false;
        this.submitted = true;
        this.result = res.result;
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error.message || 'Error submitting quiz.');
      }
    });
  }
  
  getScorePercentage(): number {
    if (!this.result || this.result.totalQuestions === 0) return 0;
    return Math.round((this.result.score / this.result.totalQuestions) * 100);
  }
  
  getFeedbackMessage(): string {
     const pct = this.getScorePercentage();
     if (pct === 100) return "Perfect score! Outstanding work!";
     if (pct >= 80) return "Excellent job!";
     if (pct >= 50) return "Good effort, but you can do better.";
     return "You might need to study more and try again.";
  }
}
