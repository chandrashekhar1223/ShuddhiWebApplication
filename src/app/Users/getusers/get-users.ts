import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-get-users',
  imports: [],
  templateUrl: './get-users.html',
  styleUrl: './get-users.css',
})
export class GetUsers {
  totalUsers = 250;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<any[]>('https://your-api-url/api/users')
      .subscribe({
        next: (res) => {
          this.totalUsers = res.length;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

}
