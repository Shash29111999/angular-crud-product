// src/app/shared/components/toast/toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common'; // NgClass for conditional classes
import { ToastService, ToastMessage } from './toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast', // Use this selector in app.component.html
  standalone: true, // This component is standalone
  imports: [CommonModule, NgClass], // Import necessary modules for templates
  template: `
    <div
      *ngIf="isVisible"
      [ngClass]="{
        'bg-green-500': message?.type === 'success',
        'bg-red-500': message?.type === 'error',
        'text-white p-3 rounded-md shadow-lg fixed top-5 right-5 z-50 transition-opacity duration-300': true
      }"
      class="opacity-0"
      [style.opacity]="isVisible ? '1' : '0'"
    >
      {{ message?.message }}
    </div>
  `,
  styles: [
    `
      /* No specific custom CSS needed beyond Tailwind classes for this simple toast */
      /* The transition and fixed positioning are handled by Tailwind classes */
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  message: ToastMessage | null = null;
  isVisible = false;

  private timeoutId: any; // To store the setTimeout ID for clearing
   private subscription: Subscription | null = null; // Subscription to the toast service

  constructor(
    private toastService: ToastService,
   
  ) {}

  ngOnInit() {
    // Subscribe to the toast service to receive messages
    this.subscription = this.toastService.onToast().subscribe((msg) => {
      this.message = msg;
      this.isVisible = true; // Make the toast visible

      // Clear any existing timeout to prevent premature hiding if a new toast comes in quickly
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      // Set a new timeout to hide the toast after 3 seconds
      this.timeoutId = setTimeout(() => {
        this.isVisible = false;
        this.message = null; // Clear the message content after hiding
      }, 3000);
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Clear any pending timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
