import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BackupService } from 'src/app/services/backup.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-backup-ciber',
  templateUrl: './backup-ciber.component.html',
  styleUrls: ['./backup-ciber.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackupCiberComponent implements OnInit {
  constructor(
    public backupService: BackupService,
    public userService: UserService,
    public router: Router,
    public chatService: ChatService,
    private localService: LocalService) { }
    
  public staticContentUrl = environment.STATIC_CONTENT;
  public loading: boolean = false;
  public criticity: string = 'text-info'
  ngOnInit() {
    if (this.backupService.serviceId) {
      if (this.getLocalStorage('currentService') == null) {
        this.router.navigate(['/']);
        return;
      }
      else { // If refresh
        let service = this.getLocalStorage('currentService');
        this.backupService.serviceId = service.id;
        this.backupService.serviceName = service.name;
        this.backupService.serviceIcon = service.icon;
        this.backupService.serviceDesc = service.desc;
        this.backupService.longDesc = service.longDesc;
        this.userService.selSuiteName = localStorage.getItem('suiteName');
      }
    }
    else {
      let service = this.getLocalStorage('currentService');
      this.backupService.serviceId = service.id;
      this.backupService.serviceName = service.name;
      this.backupService.serviceIcon = service.icon;
      this.backupService.serviceDesc = service.desc;
      this.backupService.longDesc = service.longDesc;
      this.userService.selSuiteName = localStorage.getItem('suiteName');
    }
    this.backupService.getBackupData().then(() => { this.getCriticity(); })
  }

  async requestBackupService() {
    this.loading = true;
    await this.backupService.requestBackupService();
    this.loading = false;
  }

  getCriticity() {
    switch (this.backupService.data.sinceLastBackup) {
      case 1: case 2: this.criticity = 'text-info'; break;
      case 3: case 4: case 5: case 6: case 7: this.criticity = 'text-warning'; break;
      default: this.criticity = 'text-danger'; break;
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }
}
