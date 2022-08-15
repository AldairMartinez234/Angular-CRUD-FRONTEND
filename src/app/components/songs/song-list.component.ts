import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IResponse } from 'src/app/models/iresponse';
import { ISong } from 'src/app/models/isong';
import { ISongsuser } from 'src/app/models/isongsuser';
import { UIService } from 'src/app/services/service.index';

@Component({
  selector: 'app-song-list-user',
  templateUrl: './song-list.component.html',
  //styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {
  songs: ISong[] = [];
  subRef$: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private uiService: UIService,
  ) { }

/**
 * If the subscription reference is not null, then unsubscribe from it.
 */
  ngOnDestroy(): void {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

  /**
   * I'm trying to get a list of songs from an API, and then I'm trying to display them in a table
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

    this.subRef$ = this.http.post<ISong[]>('http://projectbetanet.duckdns.org/api/songs/lista_disponible', params, { headers: httpHeaders}).subscribe(res => {
      this.songs = res;
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

  /**
   * It takes the id of a song and adds it to the user's playlist.
   * @param {number} id - number - the id of the song that is being added to the user's playlist
   */
  addSong(id: number){
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const user_id = sessionStorage.getItem('user_id');
    const body: ISongsuser = {
      user_id: user_id!,
      song_id: id.toString()
    }
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

    this.subRef$ = this.http.post<IResponse>('http://projectbetanet.duckdns.org/api/songsuser', body,{ headers: httpHeaders}).subscribe(res => {
      this.uiService.showToastAlert("success", `${res.message}`);
     this.ngOnInit();
    }, errResponse => {
      this.uiService.showToastAlert("error", errResponse.error.body.message);
    });
  }

}
