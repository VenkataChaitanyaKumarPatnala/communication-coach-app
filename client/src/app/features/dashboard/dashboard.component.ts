import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterviewService } from '../interview/services/interview.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  showDifficultyButtons = false;
  interviewHistory: any[] = [];
  activeView: 'progress' | 'history' = 'progress';

  constructor(
    private interviewService: InterviewService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.interviewService.getInterviewHistory().subscribe({
      next: (history) => {
        this.interviewHistory = history;
      },
      error: (err) => console.error('Failed to load history', err)
    });
  }

  startNewInterview(difficulty: string) {
    this.interviewService.startInterview(difficulty).subscribe({
      next: (interviewSession) => {
        console.log(`Started new ${difficulty} interview:`, interviewSession);
        this.router.navigate(['/interview', interviewSession._id]);
      },
      error: (err) => console.error('Failed to start interview', err)
    });
  }

  startTest(type: string) {
    this.router.navigate(['/test', type]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}