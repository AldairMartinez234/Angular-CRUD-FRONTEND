import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IResponse } from 'src/app/models/iresponse';
import { ISong } from 'src/app/models/isong';
import { ISongsuser } from 'src/app/models/isongsuser';
import { UIService } from 'src/app/services/service.index';

@Component({
  selector: 'app-song-list-user',
  templateUrl: './song-list-user.component.html',
  // styleUrls: ['./song-list-user.component.css']
})
export class SongListUserComponent implements OnInit, OnDestroy {
  songs: ISong[] = [];
  subRef$: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private uiService: UIService,
  ) { }

 /**
  * The ngOnDestroy() function is called when the component is destroyed
  */
  ngOnDestroy(): void {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

/**
 * It gets the user's favorite songs from the database and displays them in the view
 */
  ngOnInit(): void {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

    const user_id = sessionStorage.getItem('user_id');
    const params: ISongsuser = {
      user_id: user_id!,
      song_id: ''
    };

    this.subRef$ = this.http.post<ISong[]>('http://projectbetanet.duckdns.org/api/songs/lista_favoritas', params, { headers: httpHeaders }).subscribe(res => {
      this.songs = res;
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

 /**
  * It deletes a song from the database
  * @param {number} id - number - the id of the song to be deleted
  */
  deleteSong(id: number) {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

    this.subRef$ = this.http.delete<IResponse>('http://projectbetanet.duckdns.org/api/songsuser/' + id, { headers: httpHeaders }).subscribe(res => {
      this.uiService.showToastAlert("success", `${res.message}`);
      this.ngOnInit();
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

}
