import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppInstallerService {

  public showDownloadBox = false;
  public osName = '';
  public browser = '';
  public promptEvent: any;
  public standalone = false;
  constructor() { }

  public async registerServiceWorker() {
    this.getNavigator();
    localStorage.setItem('swLoaded', 'false')
    if ('serviceWorker' in navigator) {
      // Register a service worker hosted at the root of the
      // site using the default scope.
      navigator.serviceWorker.register('sw.js', { scope: '/suite/' }).then(function (registration) {
        
        if (registration.installing) {
          const sw = registration.installing || registration.waiting;
          sw.onstatechange = function () {
            if (sw.state === 'installed') {
              // SW installed.  Refresh page so SW can respond with SW-enabled page.
              localStorage.setItem('swLoaded', 'true')
            }
          };
        }
        localStorage.setItem('swLoaded', 'true')
      }).catch(function (error) {
        
        localStorage.setItem('swLoaded', 'true')
      })
    } else {
      
      localStorage.setItem('swLoaded', 'true')
    }
  }
  public showInstallerAuto() { // Initial installer show -> its mandatory user gesture to activate
    // Customized A2HS  
    if (!this.isStandalone()) {
      window.addEventListener('beforeinstallprompt', this.handlerPrompt, true)
    }
    //document.addEventListener('mousedown', handler, true)
  }

  public async showInstallBox() {
    // Customized A2HS   
    var handler = () => {
      this.showPrompt()
    }
    var button = document.getElementById('download-pwa')
    while (!button) {
      await this.delay(200)
      button = document.getElementById('download-pwa')
    }
    button.addEventListener('click', handler, true)
  }

  private handlerPrompt = (event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();
    // Stash the event so it can be triggered later.
    this.promptEvent = event;
    this.showDownloadBox = true
  }

  private showPrompt() {
    if (this.promptEvent) {
      this.promptEvent.prompt();
      this.promptEvent.userChoice.then(result => {
        if (result.outcome === 'accepted') {
          window.removeEventListener('beforeinstallprompt', this.handlerPrompt, true)
          this.showDownloadBox = false
          
          this.promptEvent = undefined;
        }
      });
    }
  }

  private getNavigator() {
    var usrAg = navigator.userAgent

    // Browser
    if (usrAg.indexOf("Chrome") > -1) {
      this.browser = "Google Chrome";
    } else if (usrAg.indexOf("Safari") > -1 && usrAg.indexOf("CriOS") === -1) {
      this.browser = "Apple Safari";
    } else if (usrAg.indexOf("Firefox") > -1) {
      this.browser = "Mozilla Firefox";
    } else if (usrAg.indexOf("MSIE") > -1) {
      this.browser = "Microsoft Internet Explorer";
    }

    // Platform
    if (usrAg.indexOf("Windows") != -1) this.osName = "Windows";
    if (usrAg.indexOf("Mac") != -1) this.osName = "Mac";
    if (usrAg.indexOf("Linux") != -1) this.osName = "Linux";
    if (/Android/i.test(navigator.userAgent)) this.osName = "Android"
    if (/iPhone|iPad/i.test(navigator.userAgent)) this.osName = "iOS"

    // Standalone or not - app installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.standalone = true;
    }
  }

  public isChrome(): boolean {
    return this.browser.indexOf("Chrome") != -1;
  }
  public isSafari(): boolean {
    return this.browser.indexOf("Safari") != -1;
  }
  public isFirefox(): boolean {
    return this.browser.indexOf("Firefox") != -1;
  }
  public isWindows(): boolean {
    return this.osName.indexOf("Windows") != -1
  }
  public isAndroid(): boolean {
    return this.osName.indexOf("Android") != -1
  }
  public isIos(): boolean {
    return this.osName.indexOf("iOS") != -1
  }
  public isStandalone(): boolean {
    return this.standalone
  }

  delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
}
