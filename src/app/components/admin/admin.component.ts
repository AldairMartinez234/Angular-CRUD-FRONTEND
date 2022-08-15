import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IResponse } from 'src/app/models/iresponse';
import { ISong } from 'src/app/models/isong';
import { UIService } from 'src/app/services/service.index';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  //styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  songs: ISong[] = [];
  subRef$: Subscription | undefined;
  formMulti: FormGroup;
  option: any;
  id_song: any;

  constructor(
    formBuilder: FormBuilder,
    private http: HttpClient,
    private uiService: UIService,
  ) {
    /* Creating a form group with the name formMulti, and it is creating 4 controls, title, group, year
    and gender, and it is setting the validators to required. */
    this.formMulti = formBuilder.group({
      title: ['', Validators.required],
      group: ['', Validators.required],
      year: ['', Validators.required],
      gender: ['', Validators.required],
    });
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
   * A function that is called when the component is initialized. It is used to get the list of songs
   * from the API.
   */
  ngOnInit(): void {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

    this.subRef$ = this.http.get<ISong[]>('http://projectbetanet.duckdns.org/api/songs/lista_general', { headers: httpHeaders }).subscribe(res => {
      this.songs = res;
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

  /**
   * It takes the id of the song to be edited, and then it gets the song from the songs array, and then
   * it sets the option to edit, and then it sets the id_song to the id of the song, and then it sets
   * the values of the form to the values of the song
   * @param {number} id - number
   */
  editSong(id: number) {
    this.option = 'edit';
    const song = this.songs[id];
    this.id_song = song.id;
    this.formMulti.patchValue({
      title: song.title,
      group: song.group,
      year: song.year,
      gender: song.gender,
    });
  }

 /**
  * The function resets the form
  */
  addSong() {
    this.formMulti.reset();
  }

  /**
   * It deletes a song from the database
   * @param {number} id - number - the id of the song to be deleted
   */
  deleteSong(id: number) {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

    this.subRef$ = this.http.delete<IResponse>('http://projectbetanet.duckdns.org/api/songs/' + id, { headers: httpHeaders }).subscribe(res => {
      this.uiService.showToastAlert("success", `${res.message}`);
      this.ngOnInit();
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

  /**
   * It's a function that allows you to add or edit a song
   * @returns the song that was added or edited.
   */
  options() {
    if (this.formMulti.invalid) return;

    if (this.option == 'edit') {
      let httpHeaders: HttpHeaders = new HttpHeaders();
      const token = sessionStorage.getItem('token');
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

      const params: ISong = {
        id: this.id_song,
        title: this.formMulti.value.title,
        group: this.formMulti.value.group,
        year: this.formMulti.value.year,
        gender: this.formMulti.value.gender,
        id_favorite: 0
      };

      this.subRef$ = this.http.put<IResponse>('http://projectbetanet.duckdns.org/api/songs', params, { headers: httpHeaders }).subscribe(res => {


        this.uiService.showToastAlert("success", `${res.message}`);
        this.ngOnInit();
      }, errResponse => {
        this.uiService.showToastAlert("error", errResponse.error.body.message);
      });

    } else {
      let httpHeaders: HttpHeaders = new HttpHeaders();
      const token = sessionStorage.getItem('token');
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

      const params: ISong = {
        id: 0,
        title: this.formMulti.value.title,
        group: this.formMulti.value.group,
        year: this.formMulti.value.year.toString(),
        gender: this.formMulti.value.gender,
        id_favorite: 0
      };

      this.subRef$ = this.http.post<IResponse>('http://projectbetanet.duckdns.org/api/songs/addSong', params, { headers: httpHeaders }).subscribe(res => {
        this.uiService.showToastAlert("success", `${res.message}`);
        this.ngOnInit();
      }, errResponse => {
        this.uiService.showToastAlert("error", errResponse.error.body.message);
      });
    }
  }

}
