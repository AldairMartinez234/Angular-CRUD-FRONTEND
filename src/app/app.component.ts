import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  IsAuthenticated = false;
  title = 'Angular-FrontEnd';

  constructor() {
    this.authenticate();
  }

  authenticate(): void {
    if (sessionStorage.getItem('token')) {
      this.IsAuthenticated = true;
    } else {
      this.IsAuthenticated = false;
    }
  }
}
