import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  createQuiz(quiz: {title: string, description: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/quiz/create-quiz`, quiz);
  }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quiz/quizzes`);
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quiz/quiz/${id}`);
  }

  addQuestion(question: Question): Observable<any> {
    return this.http.post(`${this.apiUrl}/question/add-question`, question);
  }

  getQuestionsByQuizId(quizId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/question/questions/${quizId}`);
  }
}
