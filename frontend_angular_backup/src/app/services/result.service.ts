import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = 'http://localhost:3000/api/result';

  constructor(private http: HttpClient) { }

  submitQuiz(submission: {quizId: string, answers: (number|null)[]}): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-quiz`, submission);
  }

  getMyResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/my-results`);
  }
}
