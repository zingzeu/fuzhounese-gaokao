import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[imgPreSize]',
})
export class ImgPreSizeDirective {
  @Input()
  dataSrc = '';

  @Input()
  width = 1;

  @Input()
  height = 1;

  get placeholderSrc() {
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}"%3E%3C/svg%3E`;
  }

  constructor(private el: ElementRef<HTMLImageElement>) {
    const element = el.nativeElement!;

    const newImg = new Image();
    newImg.src = element.src;
    newImg.onload = () => {
      element.src = newImg.src;
    };

    element.src = this.placeholderSrc;
  }
}
