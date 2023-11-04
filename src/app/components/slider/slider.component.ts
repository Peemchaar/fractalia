import { Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { SlideDirective } from './shared/slide.directive';
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  currentPage: number = 1;
  widthToSlider: number = 0;
  content:any;
  wrapper:any;

  pressedSlider = false;
  startSliderX = 0;
  startSliderMobileX = 0;
  xDown = null;
  yDown = null;
  duplicateIsActive = false;
  duplicatePreviusIsActive = false;


  @Input() autoplay = false;

  @ContentChildren(SlideDirective)  slidesEl: QueryList<SlideDirective>;
  slides: SlideDirective[];
  slidesCopy: SlideDirective[];

  clearInterval: any;
  time = 5000;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.content.removeEventListener("mousedown",null);
    this.content.removeEventListener("mouseup",null);
    this.content.removeEventListener("mouseenter",null);
    this.content.removeEventListener("mousemove",null);
    this.content.removeEventListener("touchstart",null);
    this.content.removeEventListener("touchmove",null);
    
  }

  ngAfterContentInit(): void {
    this.content = document.querySelector(".slider-content");
    this.wrapper = document.querySelector(".slider-wrapper");

    window.addEventListener("resize", e => {
      this.widthToSlider =  this.wrapper.clientWidth * this.currentPage;
      this.wrapper.style.transform = `translate3d(-${this.widthToSlider}px, 0px, 0px)`
    });


    this.content.addEventListener('mousedown', (e) => {
      this.pressedSlider = true;
      const getSliderMatrix = this.getMatrix(this.wrapper);
      this.startSliderX = e.screenX - getSliderMatrix.x;
      this.xDown = e.screenX;
      this.content.style.cursor = 'grabbing';
    });

    this.content.addEventListener('mouseup', () => {
      this.pressedSlider = false;
      this.content.style.cursor = 'grab';
      // this.gotoPage(this.currentPage, true)
    })

    this.content.addEventListener('mouseenter', () => {
      this.content.style.cursor = 'grab';
    })

    this.content.addEventListener('mouseleave', () => {
      this.pressedSlider = false;
      this.content.style.cursor = 'grab';
      // this.gotoPage(this.currentPage, true)
    })

    this.content.addEventListener('mousemove', (e) => {
      if(!this.pressedSlider) return;
      e.preventDefault();
      // const x = e.screenX;
      // const result = x - this.startSliderX;
      // this.wrapper.style.cssText += `transition-duration: 0ms; transform: translate3d(${result}px, 0px, 0px);`;
      this.handleMouseMove(e);
      // this.checkResize();
      // this.clearTimer();
    })

    /* MOBILE EVENTS */
    this.content.addEventListener('touchstart', e => {
      // var x2 = e.targetTouches[0].clientX;
      // const getSliderMatrix = this.getMatrix(this.wrapper);
      // this.startSliderMobileX = x2 - getSliderMatrix.x;
      const firstTouch = e.touches[0];
      this.xDown = firstTouch.clientX;
      this.yDown = firstTouch.clientY;
    })

    this.content.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
      // var x = e.targetTouches[0].clientX;
      // const result = x - this.startSliderMobileX;
      // this.wrapper.style.cssText += `transition-duration: 0ms; transform: translate3d(${result}px, 0px, 0px);`;
      // this.checkResize();
      this.clearTimer();
    })

    // this.content.addEventListener('touchleave', (e) => {
    //   // this.gotoPage(this.currentPage, true)
    // })

    // this.content.addEventListener('touchend', (e) => {
    //   // this.gotoPage(this.currentPage, true)
    // })

    this.childrenSlidesInit();

  }

  initializeAutoPlay() {
    this.clearInterval =  setInterval(() => this.nextPage(), this.time);
  }

  clearTimer() {
    if (this.clearInterval) {
      clearInterval(this.clearInterval);
    }
    // this.clearInterval =  setInterval(() => this.nextCarousel(), this.time);
  }

  private childrenSlidesInit() {
    this.slidesChanges(this.slidesEl);
    this.slidesEl.changes.subscribe(this.slidesChanges);
  }

  private slidesChanges = (val: QueryList<SlideDirective>) => {
    this.slides = val.map((slide: SlideDirective, index: number) => {
      slide.slideIndex = index;
      return slide;
    });
    this.slidesCopy =  val.map((slide: SlideDirective, index: number) => {
      slide.slideIndex = index;
      return slide;
    });
    this.slidesCopy.unshift(this.slides[this.slides.length - 1]);
    this.slidesCopy.push(this.slides[0]);
    this.initSlider();

  };

  initSlider() {
    this.currentPage = 1;
    this.widthToSlider =  this.wrapper.clientWidth * this.currentPage;
    this.wrapper.style.transform = `translate3d(-${this.widthToSlider}px, 0px, 0px)`;
    if (this.autoplay) this.initializeAutoPlay();
  }

  previusPage(resetAutoplay?:boolean) {
    this.gotoPage(this.currentPage-1, resetAutoplay);
  }

  gotoPage(page, resetAutoplay?: boolean) {
    const lastPage = this.getLastPage();
    if(page == 0)this.duplicatePreviusIsActive = true;
    if(page > lastPage) page = 1;
    if(page == lastPage) this.duplicateIsActive = true;

    this.currentPage =  page;
    if(this.duplicateIsActive)  this.currentPage = 1;
    if(this.duplicatePreviusIsActive)  this.currentPage = lastPage-1;
    this.widthToSlider = this.wrapper.clientWidth * page;
    this.wrapper.style.transitionDuration = '300ms';
    this.wrapper.style.transform = `translate3d(-${this.widthToSlider}px, 0px, 0px)`;
    setTimeout(() => {
      this.wrapper.style.transitionDuration = '0ms';
      setTimeout(() => {
        if(this.duplicateIsActive) {
          this.widthToSlider = this.wrapper.clientWidth * this.currentPage;
          this.wrapper.style.transform = `translate3d(-${this.widthToSlider}px, 0px, 0px)`;
          this.duplicateIsActive = false;
        }

        if(this.duplicatePreviusIsActive) {
          this.widthToSlider = this.wrapper.clientWidth * this.currentPage;
          this.wrapper.style.transform = `translate3d(-${this.widthToSlider}px, 0px, 0px)`;
          this.duplicatePreviusIsActive = false;
        }
      }, 0)
    }, 300);

    if(resetAutoplay && this.autoplay) this.clearTimer();
  }

  handleTouchMove(evt: any) {
    if (!this.xDown || !this.yDown) return;
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
          this.nextPage()
        } else {
          this.previusPage()
        }
    }
    this.xDown = null;
    this.yDown = null;
  };

  handleMouseMove(evt: any) {
    if (!this.xDown) return;
    var xUp = evt.screenX;
    var xDiff = this.xDown - xUp;
    if ( xDiff > 0 ) {
      this.nextPage()
    } else {
      this.previusPage()
    }
    this.xDown = null;
  };


  nextPage(resetAutoplay?:boolean) {
    this.gotoPage(this.currentPage+1, resetAutoplay);
  }

  getLastPage() {
    return  this.slides.length + 1;
  }


  getMatrix(element) {
    const values = element.style.transform.split(/\w+\(|\);?/);
    const transform = values[1].split(/,\s?/g).map(parseInt);
    return {
      x: isNaN(transform[0]) ? 0 : transform[0],
      y: isNaN(transform[1]) ? 0 : transform[1],
      z: isNaN(transform[2]) ? 0 : transform[2]
    };
  }

  checkResize() {
    const getSliderMatrix = this.getMatrix(this.wrapper);
    if(parseInt(getSliderMatrix.x) > 0) {
      this.wrapper.style.transform = `translate3d(0px, 0px, 0px)`;
    } else {
      const lastPage = this.getLastPage();
      const measureToCompare = (this.wrapper.clientWidth *lastPage) - this.wrapper.clientWidth/2;
      const mathAbs = Math.abs(getSliderMatrix.x);
      if(mathAbs > measureToCompare) {
        this.currentPage = 1;
      } else {
        this.checkCenterResize()
      }
    }
  }

  checkCenterResize() {
    const getSliderMatrix = this.getMatrix(this.wrapper);
    const mathAbs = Math.abs(getSliderMatrix.x);
    const firstMeasure = this.wrapper.clientWidth/2;
    if (this.currentPage == 1) {
      if(mathAbs > firstMeasure) {
        this.currentPage = 2;
      }
    } else {
      const measureToCompare = (this.wrapper.clientWidth * this.currentPage) - this.wrapper.clientWidth/2;
      const previusMeasureToCompare = (this.wrapper.clientWidth * (this.currentPage - 1)) - this.wrapper.clientWidth/2;
      if(mathAbs > measureToCompare) {
        this.currentPage ++;
      } else if (mathAbs < previusMeasureToCompare) {
        this.currentPage --;
      }
    }
  }


}
