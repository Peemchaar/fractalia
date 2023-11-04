import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  constructor(
    private router: Router,
    private userService: UserService
) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.userService.currentUserValue;
    if (currentUser) {
        if(state.url!="/profile" && currentUser.role == "BAS" && (!currentUser.checkTermsAcceptDate || !currentUser.inJira || !currentUser.passwordChanged)){
          this.router.navigate(['/profile']);
          return false;
        }
        else return true;
    }
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
