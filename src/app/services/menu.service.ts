import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { MenuItem } from '../models/menuItem';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menu: MenuItem[];
  public selected = "ADA";
  
  constructor(private http: HttpClient, 
    private userService: UserService) { }
  
  public async loadMenu()
  {
    return this.http.get<MenuItem[]>(environment.apiEndpoint + "api/menu?roleId=" + this.userService.currentUserValue.roleId).toPromise().then(result => {this.menu = result});
  }
}