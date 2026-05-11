import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications() {
    return this.http.get(this.apiUrl);
  }

  getUnreadCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.apiUrl}/read/${id}`, {});
  }

  markAllAsRead() {
    return this.http.put(`${this.apiUrl}/read-all`, {});
  }
}
