import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserData } from '../models/user-data.model';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = '/api/data';

    constructor(private http: HttpClient) { }

    fetchData(searchTerm?: string, filters?: any, page?: number, pageSize?: number): Observable<any> {
        return this.http.post<UserData[]>(this.apiUrl, { search: searchTerm, filters, page, pageSize })
            .pipe(
                catchError(error => {
                    console.error('Error fetching data:', error);
                    return throwError('Something went wrong');
                })
            );
    }
}


