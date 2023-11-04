import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { MessageService } from 'src/app/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class SingleSignonService {

public FacebookStatus  : fb.StatusResponse;
public FacebookUser : any;
public gapiSetup: boolean = false; // marks if the gapi library has been loaded
public authInstance: gapi.auth2.GoogleAuth;
public error: string;
public GoogleUser: gapi.auth2.GoogleUser;
public GoogleStatus:string;

constructor(private messageService:MessageService,
  private translate: TranslateService){

}

GoogleInit(){
  let js, id = 'google-platformjs', ref = document.getElementsByTagName('script')[0];
    if (document.getElementById(id)) {return;}
    js = document.createElement('script');
    js.id = id;
    js.async = true;
    js.anon
    js.src = "https://apis.google.com/js/platform.js";
    // js.src = "https://apis.google.com/js/api.js";
    ref.parentNode.insertBefore(js, ref);
}

async GoogleAuthentication(){
  const pload = new Promise((resolve) => {
    gapi.load('auth2', resolve);
  });

  return pload.then(() => {
      gapi.auth2
      .init(
        {
          client_id: environment.GOOGLE_APP_ID,
          cookie_policy:"none"
        })
      .then(
        auth => {
        this.authInstance = auth;
        if(this.authInstance.isSignedIn.get()){
          this.authInstance.currentUser.get().disconnect();
        }
        },err => {
          this.messageService.add(this.translate.instant("SINGLE_SIGN_ON.THIRD_PARTY_COOKIES"), "error");
        })
    });
}


async GoogleLogin(){
  if(this.authInstance.isSignedIn.get()){
    this.authInstance.currentUser.get().disconnect();
  }
  // let options = new gapi.auth2.SigninOptionsBuilder();
  // options.setAppPackageName("http://localhost:4200");
  // options.setFetchBasicProfile(true);
  // options.setPrompt('select_account');
  // options.setScope('profile').setScope('email');
  // this.authInstance.signIn(options);

  return new Promise<void>((resolve) => {
    this.authInstance.signIn().then(
      user=>{
        this.GoogleUser = user;
        resolve();
      },
      error=>{
        console.log("error logeado : " , error);
      });
  })
}


GoogleAuthorize(){

  gapi.auth2.authorize(
    {
      client_id: environment.GOOGLE_APP_ID ,
      scope:"email",
      prompt:"select_account"
      // response_type: 'permission'
    },
    function(response){
      if(response.error) console.log(response.error);
      else{
        gapi.client.load("oauth2","v2").then(
          (response:any)=>
          {
            if (response && response.hasOwnProperty('error')) {
              console.log('error', response);
              return;
            }
            else {
              // var request = gapi.client.oauth2.userinfo.get();
              // var opt : gapi.client.RequestOptions;
              // opt.
              // var request = gapi.client.request()
              // request.execute(function (obj) {
              //   var user = {
              //     email: obj.email,
              //     firstName: obj.given_name,
              //     lastName: obj.family_name,
              //   };
              // });

            }
            // var request = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
            var r = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
            var request = gapi.client.request({"path":""})
          },error=>{console.log(error)})
      }
    });
}


FacebookInit(){
(window as any).fbAsyncInit = function() {
  FB.init({
    appId      : environment.FB_APP_ID,
    cookie     : true,
    xfbml      : true,
    version    : 'v10.0'
  });

  FB.AppEvents.logPageView();

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

}

async FacebookGetStatus(){
  await new Promise((resolve)=>{
    FB.getLoginStatus((response)=>{
      if(response.status==='connected'){
        FB.logout();
      }
      resolve(response);
    })
  })

}

async FacebookLogin(){
  return new Promise<void>((resolve)=>{
    FB.login( (response : fb.StatusResponse)=>{
      this.FacebookStatus = response;
       resolve();
    },
    {scope:'email'});
  })
}

async FacebookGetEmail(){
  return new Promise<void>(resolve=>{
      FB.api('/me',  { fields: ['email'] }, responseUser => {
        this.FacebookUser = responseUser;
        FB.logout();
        resolve();
    })
  })
}

}
