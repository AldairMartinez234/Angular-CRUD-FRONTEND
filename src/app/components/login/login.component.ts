import { Component, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILogin } from 'src/app/models/ilogin';
import { IResponse } from 'src/app/models/iresponse';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/services/service.index';
import { IRegister } from 'src/app/models/iregister';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  uiRegister = false;
  formLogin: FormGroup;
  formRegister: FormGroup;
  subRef$: Subscription | undefined;
  public utils: Utils = new Utils();
  constructor(
    formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private uiService: UIService,
  ) {
    /* Creating a form group with the fields email and password. */
    this.formLogin = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

   /* Creating a form group with the fields email, password and name. It is also adding a control to
   the form group called re-password. */
    this.formRegister = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.formRegister.addControl('re-password', formBuilder.control('', [Validators.required, this.utils.equalsFieldsValidator('password')]));
  }

  /**
   * The ngOnDestroy() function is called when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

 /**
  * The function takes the email and password from the form and sends it to the backend to authenticate
  * the user
  */
  Login() {
    const Login: ILogin = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    }
    this.subRef$ = this.http.post<IResponse>('http://projectbetanet.duckdns.org/users/authenticate', Login).subscribe(res => {
      if (res.status == 1) {
        sessionStorage.setItem('token', res.response.token);
        sessionStorage.setItem('user_id', res.response.id);
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }else{
        this.uiService.showToastAlert("error", `${res.message}`);
      }
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

  /**
   * The function is called when the user clicks the register button. It checks if the form is valid,
   * if it is, it creates a new object of type IRegister and assigns the values of the form to it. Then
   * it sends the object to the server and if the server responds with a status of 1, it navigates to
   * the login page and shows a success message. If the server responds with a status of 0, it shows an
   * error message. If the server responds with an error, it shows the error message
   * @returns The response from the server.
   */
  Register() {
    if(this.formRegister.invalid) return;

    const Register: IRegister = {
      email: this.formRegister.value.email,
      password: this.formRegister.value.password,
      name: this.formRegister.value.name
    }
    this.subRef$ = this.http.post<IResponse>('http://projectbetanet.duckdns.org/users/register', Register).subscribe(res => {
      if (res.status == 1) {
        this.router.navigate(['/login']).then(() => {
          this.uiService.showToastAlert("success", `${res.message}`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }else{
        this.uiService.showToastAlert("error", `${res.message}`);
      }
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }
}
