import { Component, ViewEncapsulation } from '@angular/core';
import { DigitalContact } from 'src/app/models/digitalContact';
import { PartnerService } from 'src/app/services/partner.service';
import { FormService } from 'src/app/services/form.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ServicesService } from 'src/app/services/services.service'
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TruncateService } from 'src/app/services/truncate.service';
import { UserValidator } from 'src/app/validators/user.validator';
import { LocalService } from 'src/app/services/local.service';
import { environment } from 'src/environments/environment';
import { element } from 'protractor';
import { Service } from 'src/app/models/service';

@Component({
  selector: 'app-digital-contact',
  templateUrl: './digitalcontact.component.html',
  styleUrls: ['./digitalcontact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DigitalContactComponent {
  public data: DigitalContact = new  DigitalContact;
  public staticContentUrl = environment.STATIC_CONTENT;
  postError = false;
  submitted = false;
  loading = false;
  success = false;
  fileName: string[] = [];
  lastFileName: string;
  category: string;
  public showMessage: boolean = false;
  public message: string = "";
  public services: Service[] = [];

  

  constructor(public partnerService: PartnerService,
    public formService: FormService,
    public servicesService: ServicesService,
    public userService: UserService,
    private messageService: MessageService,
    private router: Router,
    public truncateService: TruncateService,
    private translate: TranslateService,
    public activeModal: NgbActiveModal,
    private localService: LocalService) {
      if(formService.serviceName)
      {
        if(this.getLocalStorage('currentService') == null){
          this.router.navigate(['/']);
          return;
        }
        else{ // If refresh
          let service = this.getLocalStorage('currentService');
          formService.serviceId = service.id;
          formService.serviceName = service.name;
          formService.serviceIcon = service.icon;
          formService.serviceDesc = service.desc;
          formService.longDesc= service.longDesc;
          this.data.Name = userService.currentUserValue.name;
          this.data.Email = userService.currentUserValue.email;
          this.data.Phone = userService.currentUserValue.phone;
          this.data.AttachedFiles = [];
          this.getCategory();
        }
      }
    }

  change = () =>{
    this.loading = !this.loading;
  }

  onSubmit(){
    this.loading = true;
    this.servicesService.postContactForm(this.data).then(result => {
      this.loading = false
      if(result == true){
       this.success = true;
      }
    })
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onChangeFile($event: any) {
    const target = $event.target;
    if (target.files != null) {
      if (target.files.length > 0) {
        const file = target.files[0];
        const value = target.value.toLowerCase();
        const ext = value.split('.').pop();
        
        let exts = ["png", "jpg", "jpeg","pdf"];
        if (exts.indexOf(ext) != -1) {
          this.getBase64(file).then(result => {
            this.data.AttachedFiles.push(result.toString())
            this.fileName.push(target.files[0].name)
            this.lastFileName = target.files[0].name
          });
        }
      }
    }
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);    
  }

  getCategory(){
    this.servicesService.userCategories.forEach(element => {
      element.code == "KIT"? this.getServices(element.id) : null;
    });
    
  }

  getServices(category: number){
    this.servicesService.userServices.forEach(element => {
      if(element.categoryId == category && element.code != 'FSK' && element.code != 'ELE'){
        this.services.push(element)
      }
    })
  }
}
