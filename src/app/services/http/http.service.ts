import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    "basic": environment.basic
  }),
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  get(url, data?) {
    return this.http.get<any>(environment.adminURL + url,  httpOptions);
  }

  post(url, data, formData = false) {
    if(!formData) {
      data = new HttpParams({
        fromObject: data
      });
    }
    return this.http.post<any>(environment.adminURL + url, data, httpOptions);
  }

  put(url, data, formData = false) {
    if(!formData) {
      data = new HttpParams({
        fromObject: data
      });
    }
    return this.http.put<any>(environment.adminURL + url, data, httpOptions);
  }

  patch(url, data, formData = false) {
    if(!formData) {
      data = new HttpParams({
        fromObject: data
      });
    }
    return this.http.patch<any>(environment.serverBaseUrl + url, data);
  }

  delete(url) {
    return this.http.delete<any>(environment.serverBaseUrl + url);
  }

  lastValueFrom(value: Observable<any>) {
    return lastValueFrom(value);
  }
}
