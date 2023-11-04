import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
      selector: 'app-password-strength',
      templateUrl: './password-strength.component.html',
      styleUrls: ['./password-strength.component.css']
})

export class PasswordStrengthComponent implements OnChanges {

      @Input() passwordToCheck: string;
      @Input() barLabel: string;
      @Output() validpass: EventEmitter<boolean> = new EventEmitter<boolean>();
      bar0: string;
      bar1: string;
      bar2: string;
      bar3: string;
      bar4: string;
      result:boolean;

      public colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];

      public static measureStrength(pass: string) {
            // console.log("measureStrength "+pass);
            let score = 0;
            // award every unique letter until 5 repetitions  
            // let letters = {};
            // for (let i = 0; i < pass.length; i++) {
            //       console.log("letters pass i: "+letters[pass[i]]);
            //       letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            //       score += 5.0 / letters[pass[i]];
            //       console.log("score: "+score);
            // }
            score += pass.length * 5;//minimo 8 caracteres * 5 = 40 puntos
            // console.log("Puntos por longitud: "+score);
            if(score > 40)
                  score = 40;
            // console.log("Puntos por longitud después de control máximo: "+score);

            // bonus points for mixing it up  
            let variations = {
                  digits: /\d/.test(pass),
                  lower: /[a-z]/.test(pass),
                  upper: /[A-Z]/.test(pass),
                  nonWords:/[^A-Za-z0-9]/.test(pass),
                  // nonWords: /\W/.test(pass),
            };
            let variationCount = 0;
            for (let check in variations) {
                  // console.log(check +" - "+ variations[check]);
                  variationCount += (variations[check]) ? 1 : 0;
            }
            // score += (variationCount - 1) * 10;
            score += variationCount * 15;

            //Controlamos minimos de seguridad y rebajamos el score para que no cumpla requisitos
            if(score >= 85 && (variationCount < 3 || pass.length < 8))
                  score = 80;

            var result = Math.trunc(score);
            // console.log("result - measureStrength: "+result);
            return result;
      }

      public getColor(score: number) {
            // console.log("getColor "+score);
            let idx = 0;
            if (score > 85) {
                  idx = 4;
            }else if (score >= 80) {
                  idx = 3;
            } else if (score >= 60) {
                  idx = 2;
            } else if (score >= 40) {
                  idx = 1;
            } else if (score < 20) {
                  idx = 0;
            }
            // console.log("getColor "+(idx + 1));
            // console.log("getColor "+this.colors[idx]);
            return {
                  idx: idx + 1,
                  col: this.colors[idx]
            };
      }

      ngOnChanges(changes: SimpleChanges): void {
            // console.log("ngOnChanges");
            // console.log(changes);
            var password = changes['passwordToCheck'].currentValue;
            this.setBarColors(5, '#DDD');
            if (password) {
                  let c = this.getColor(PasswordStrengthComponent.measureStrength(password));
                  this.setBarColors(c.idx, c.col);
                  if (c.idx == 5 || c.idx == 4) //nivel de fuerza 4 o 5 es aceptable
                  { 
                        this.result = true;
                  } 
                  else
                  { 
                        this.result = false;
                  }
                  this.checkpass();
            }
      }

      public checkpass() {
            // console.log("checkpass: "+this.result);
            this.validpass.emit(this.result);
      }

      public setBarColors(count, col) {  
            // console.log("setBarColors "+count);
            // console.log("setBarColors "+col);
            for (let _n = 0; _n < count; _n++) {  
                  this['bar' + _n] = col;  
            }  
      } 

}
