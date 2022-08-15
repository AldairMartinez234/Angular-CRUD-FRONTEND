import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  //styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent {
  user_id: any;
  constructor(
    private router: Router,
  ) {
     this.user_id = sessionStorage.getItem('user_id');
   }

  /**
   * It navigates to the home page.
   */
  LogOut() {
    sessionStorage.clear();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

}
