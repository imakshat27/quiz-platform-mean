import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm mb-4" *ngIf="successMessage">
             <div class="card-body bg-success text-white rounded">
                {{ successMessage }}
             </div>
          </div>
          
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title mb-4">Add Question to Quiz</h3>
              <div *ngIf="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
              
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Question Text</label>
                  <input type="text" class="form-control" [(ngModel)]="question.questionText" name="questionText" required>
                </div>
                
                <h5 class="mt-4 mb-3">Options</h5>
                <div class="mb-3 row" *ngFor="let option of question.options; let i = index; trackBy: trackByIndex">
                  <label class="col-sm-2 col-form-label">Option {{i + 1}}</label>
                  <div class="col-sm-8">
                    <input type="text" class="form-control" [(ngModel)]="question.options[i]" name="option{{i}}" required>
                  </div>
                  <div class="col-sm-2 d-flex align-items-center">
                     <div class="form-check">
                      <input class="form-check-input" type="radio" name="correctAnswer" [value]="i" [(ngModel)]="question.correctAnswer" required>
                      <label class="form-check-label">Correct</label>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between mt-4 border-top pt-3">
                  <button type="submit" class="btn btn-primary">Add Question</button>
                  <button type="button" class="btn btn-success" routerLink="/dashboard">Finish Quiz Setup</button>
                </div>
              </form>
            </div>
          </div>
          
          <div class="mt-4" *ngIf="addedQuestions.length > 0">
             <h4>Questions Added ({{addedQuestions.length}})</h4>
             <ul class="list-group">
                <li class="list-group-item" *ngFor="let q of addedQuestions; let i = index">
                   <strong>Q{{i + 1}}:</strong> {{q.questionText}}
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddQuestionComponent implements OnInit {
  quizId: string = '';
  question: any = { questionText: '', options: ['', '', '', ''], correctAnswer: null };
  errorMessage = '';
  successMessage = '';
  addedQuestions: any[] = [];

  constructor(
    private quizService: QuizService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizId = params['id'];
      if (!this.quizId) {
        this.router.navigate(['/dashboard']);
      }
      this.loadExistingQuestions();
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  loadExistingQuestions() {
    this.quizService.getQuestionsByQuizId(this.quizId).subscribe(data => {
      this.addedQuestions = data;
    });
  }

  onSubmit() {
    if (this.question.correctAnswer === null) {
       this.errorMessage = "Please select a correct answer.";
       return;
    }
    
    // Validate options are not empty
    if (this.question.options.some((opt: string) => opt.trim() === '')) {
       this.errorMessage = "All options must be filled out.";
       return;
    }

    const newQuestion = {
       quizId: this.quizId,
       questionText: this.question.questionText,
       options: [...this.question.options],
       correctAnswer: Number(this.question.correctAnswer)
    };

    this.quizService.addQuestion(newQuestion).subscribe({
      next: (response) => {
        this.successMessage = "Question added successfully!";
        this.errorMessage = '';
        this.addedQuestions.push(newQuestion);
        
        // Reset form for next question
        this.question = { questionText: '', options: ['', '', '', ''], correctAnswer: null };
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to add question';
      }
    });
  }
}
