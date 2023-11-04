import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../services/message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: UserService,
        private router: Router,
        private translate: TranslateService,
        private messageService: MessageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 403 || err.status === 401) {
                
                this.translate.get('SESSION_EXPIRED').subscribe(res => this.messageService.add(res, "error"));
                this.authenticationService.localLogout();
            }
            else if(err.status === 404)
            {
                return throwError(err);
            }
            else if(err.status === 501) // User exists in DB
            {
                this.messageService.add("No se ha podido crear usuario (previamente creado en BBDD)", "error");
            }
            else if(err.status === 502) // User needs eid
            {
                this.messageService.add("No se ha podido crear usuario (External ID necesario para este partner)", "error");
            }
            else if(err.status === 504) // Timeout
            {
                this.messageService.add("La operación se está demorando. Espere un momento.", "ok");
            }
            else
            {
                this.router.navigate(['/offline']);
            }
        }))
    }
}