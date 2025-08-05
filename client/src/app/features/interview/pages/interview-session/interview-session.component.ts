import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from '../../services/interview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-interview-session',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './interview-session.component.html',
  styleUrls: ['./interview-session.component.scss']
})
export class InterviewSessionComponent implements OnInit {
  interviewId: string | null = null;
  currentQuestion: any = null;
  userAnswer = '';
  feedback = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interviewId = this.route.snapshot.paramMap.get('id');
    this.fetchNextQuestion();
  }

  fetchNextQuestion(): void {
    if (!this.interviewId) return;
    this.isLoading = true;
    this.currentQuestion = null;
    this.userAnswer = '';
    this.feedback = '';

    this.interviewService.getNextQuestion(this.interviewId).subscribe({
      next: (interviewSession) => {
        this.currentQuestion = interviewSession.questionsAndAnswers.slice(-1)[0];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to get next question', err);
        this.isLoading = false;
      }
    });
  }

  submitAnswer(): void {
    if (!this.interviewId || !this.currentQuestion._id || !this.userAnswer) return;
    this.isLoading = true;

    this.interviewService.submitAnswer(this.interviewId, this.currentQuestion._id, this.userAnswer).subscribe({
      next: (response) => {
        this.feedback = response.feedback;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to submit answer', err);
        this.isLoading = false;
      }
    });
  }
}