// src/app/shared/components/toast/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root', // Makes the service a singleton available throughout the app
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>(); // Subject to emit toast messages

  /**
   * Shows a toast message.
   * @param message The message to display.
   * @param type The type of toast ('success' or 'error'), which determines the background color.
   */
  show(message: string, type: 'success' | 'error') {
    this.toastSubject.next({ message, type });
  }

  /**
   * Returns an Observable that components can subscribe to, to receive toast messages.
   */
  onToast(): Observable<ToastMessage> {
    return this.toastSubject.asObservable();
  }
}
