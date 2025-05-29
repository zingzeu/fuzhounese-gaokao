import { Platform } from '@angular/cdk/platform';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { getHowlProps } from '../howler-helper';

declare var Howl: any;

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input()
  audioSrcs: string[] = [];

  @Output() finished: EventEmitter<any> = new EventEmitter();

  progress: number = 2;

  isPlaying = false;

  private _howler?: any;

  constructor(private platform: Platform) {}

  ngOnInit(): void {
    this._howler = new Howl({
      src: this.audioSrcs,
      ...getHowlProps(this.platform.IOS),
      onplay: () => {
        this.isPlaying = true;
        this.progress = 2;
        requestAnimationFrame(() => this.onUpdate());
      },
      onend: () => {
        this.isPlaying = false;
        this.progress = 2;
        this.finished.emit(null);
      },
      onpause: () => {},
    });
  }

  ngOnDestroy(): void {
    this._howler?.stop();
  }

  onUpdate() {
    let seek = this._howler.seek() || 0;
    let duration = this._howler.duration();
    let percentage = seek / duration || 0;
    if (seek > 0) {
      this.progress = percentage * 96 + 2;
    }
    if (this._howler.playing()) {
      requestAnimationFrame(() => this.onUpdate());
    }
  }

  onTriggerPlay() {
    if (this.isPlaying) {
      return;
    }
    this._howler?.play();
  }
}
