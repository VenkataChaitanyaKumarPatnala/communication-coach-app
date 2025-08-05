import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:3000/api/interviews';

  constructor(private http: HttpClient) { }

  getInterviewHistory(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  startInterview(difficulty: string): Observable<any> {
    return this.http.post(this.apiUrl, { difficulty });
  }

  getNextQuestion(interviewId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${interviewId}/next-question`, {});
  }

  submitAnswer(interviewId: string, questionId: string, answer: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${interviewId}/questions/${questionId}/answer`, { answer });
  }
}