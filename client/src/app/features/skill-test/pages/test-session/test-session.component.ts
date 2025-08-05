import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-test-session',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './test-session.component.html',
  styleUrls: ['./test-session.component.scss']
})
export class TestSessionComponent implements OnInit {
  test: any = null;
  userAnswers: { [questionId: string]: string } = {};
  currentQuestionIndex = 0;
  isLoading = true;
  isFinished = false;
  score: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    const testType = this.route.snapshot.paramMap.get('type');
    if (testType) {
      this.loadTest(testType);
    }
  }

  loadTest(type: string): void {
    this.isLoading = true;
    this.testService.getTest(type).subscribe({
      next: (data: any) => {
        this.test = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load test', err);
        this.isLoading = false;
      }
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.test.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitTest();
    }
  }

  submitTest(): void {
    this.isLoading = true;
    this.testService.submitTest(this.test._id, this.userAnswers).subscribe({
      next: (result: any) => {
        this.score = result.score;
        this.isFinished = true;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to submit test', err);
        this.isLoading = false;
      }
    });
  }

  get currentQuestion() {
    return this.test?.questions[this.currentQuestionIndex];
  }

  get progressValue(): number {
    if (!this.test) return 0;
    return ((this.currentQuestionIndex + 1) / this.test.questions.length) * 100;
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}