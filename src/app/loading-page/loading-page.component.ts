import { Component, EventEmitter, OnInit, Output } from '@angular/core';

const ALL_IMAGES = [
  'assets/apple.png',
  'assets/bg-pattern.png',
  'assets/biba.png',
  'assets/btn_enter.svg',
  'assets/btn_next.svg',
  'assets/btn_prev.svg',
  'assets/btn_share.svg',
  'assets/btn_start.svg',
  'assets/btn_submit.svg',
  'assets/circle.svg',
  'assets/dangan.svg',
  'assets/envelope_bottom.webp',
  'assets/envelope_top.webp',
  'assets/eraser.png',
  'assets/grade_a.svg',
  'assets/grade_b.svg',
  'assets/grade_c.svg',
  'assets/grade_d.svg',
  'assets/grade_stamp_a.svg',
  'assets/grade_stamp_b.svg',
  'assets/grade_stamp_c.svg',
  'assets/grade_stamp_d.svg',
  'assets/huangluoliu.png',
  'assets/hukziu.svg',
  'assets/icon_play.svg',
  'assets/letters.png',
  'assets/liecie.png',
  'assets/logo.svg',
  'assets/ninja.svg',
  'assets/overlay.webp',
  'assets/question_hint.svg',
  'assets/qrcode.png',
  'assets/result_bg.png',
  'assets/result_curve.svg',
  'assets/result_instructions.svg',
  'assets/result_overlay_1.png',
  'assets/result_overlay_2.png',
  'assets/result_overlay_3.png',
  'assets/result_overlay_4.png',
  'assets/result_score.svg',
  'assets/result_score_title.svg',
  'assets/result_subject.svg',
  'assets/result_title.svg',
  'assets/seal.svg',
  'assets/separator.svg',
  'assets/stamp.svg',
  'assets/stamp_2.svg',
  'assets/title.svg',
  'assets/type_listening.svg',
  'assets/type_multichoice.svg',
  'assets/type_translate.svg',
  'assets/type_truefalse.svg',
];

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss'],
})
export class LoadingPageComponent implements OnInit {
  @Output() ready: EventEmitter<any> = new EventEmitter();
  hasEmitted = false;

  private readonly images = new Map<
    string,
    { img: HTMLImageElement; ready: boolean }
  >();
  private readyImages = 0;

  progress = 0;
  constructor() {}

  ngOnInit(): void {
    window.setTimeout(() => {
      if (!this.hasEmitted) {
        this.hasEmitted = true;
        this.ready.emit(null);
      }
    }, 10000);
    ALL_IMAGES.forEach((i) => this.createImage(i));
  }

  createImage(url: string) {
    var img = new Image();
    img.addEventListener('load', () => {
      this.onImageReady(url);
    });
    img.src = url;
    this.images.set(url, { img, ready: false });
  }

  onImageReady(url: string) {
    if (!this.images.get(url)!.ready) {
      this.images.get(url)!.ready = true;
      ++this.readyImages;
      this.progress = Math.floor((100 * this.readyImages) / this.images.size);
      if (this.readyImages >= this.images.size) {
        if (!this.hasEmitted) {
          this.hasEmitted = true;
          this.ready.emit(null);
        }
      }
    }
  }
}
