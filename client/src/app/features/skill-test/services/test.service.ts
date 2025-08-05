import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:3000/api/tests';

  constructor(private http: HttpClient) { }

  getTestResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/results`);
  }

  getTest(testType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${testType}`);
  }

  submitTest(testId: string, userAnswers: { [questionId: string]: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, { testId, userAnswers });
  }
}