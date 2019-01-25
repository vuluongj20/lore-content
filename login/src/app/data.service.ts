import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  post(link: string, data) {
    return this.http.post('/api/users/' + link, data);
  }
}
