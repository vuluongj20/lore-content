import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  getData(link: string) {
    return this.http.get('/api/' + link);
  }
  getFile(link: string) {
    return this.http.get('/api/files/' + link, { responseType : 'blob' });
  }
  postData(link: string, data) {
    return this.http.post('/api/' + link, data);
  }
}
