import { Platform } from '@angular/cdk/platform';
import { Input, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ExamService, GradeClass, Grades, UserData } from '../exam.service';
import { getHowlProps } from '../howler-helper';

declare var Howl: any;

const IMG_LOGO = 'assets/logo.svg';
const IMG_BG = 'assets/result_bg.png';
const IMG_SEAL = 'assets/seal.svg';
const IMG_GRADE_A = 'assets/grade_a.svg';
const IMG_GRADE_B = 'assets/grade_b.svg';
const IMG_GRADE_C = 'assets/grade_c.svg';
const IMG_GRADE_D = 'assets/grade_d.svg';
const IMG_TITLE = 'assets/result_title.svg';
const IMG_SCORE_TITLE = 'assets/result_score_title.svg';
const IMG_TABLE_HEADER_SCORE = 'assets/result_score.svg';
const IMG_TABLE_HEADER_SUBJECT = 'assets/result_subject.svg';
const IMG_SCORE_CURVE = 'assets/result_curve.svg';
const IMG_STAMP_A = 'assets/grade_stamp_a.svg';
const IMG_STAMP_B = 'assets/grade_stamp_b.svg';
const IMG_STAMP_C = 'assets/grade_stamp_c.svg';
const IMG_STAMP_D = 'assets/grade_stamp_d.svg';
const IMG_INSTRUCTIONS = 'assets/result_instructions.svg';
const IMG_OVERLAY_A = 'assets/result_overlay_1.png';
const IMG_OVERLAY_B = 'assets/result_overlay_2.png';
const IMG_OVERLAY_C = 'assets/result_overlay_3.png';
const IMG_OVERLAY_D = 'assets/result_overlay_4.png';
const QR_CODE = 'assets/qrcode.png';
@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('div', { static: true })
  fillDiv?: ElementRef<HTMLDivElement>;

  @ViewChild('img', { static: true })
  outputImg?: ElementRef<HTMLImageElement>;

  @Input()
  grades: Grades = {
    total: 100,
    grade: GradeClass.A,
    breakdown: [
      { type: '判断', score: 0 },
      { type: '选择', score: 0 },
      { type: '翻译', score: 0 },
      { type: '听力', score: 0 },
    ],
  };

  isLoading = true;

  userData?: UserData;

  private ctx?: CanvasRenderingContext2D;

  get canvasW() {
    return this.canvas?.nativeElement?.getBoundingClientRect().width ?? 0;
  }
  get canvasH() {
    return this.canvas?.nativeElement?.getBoundingClientRect().height ?? 0;
  }

  private readonly images = new Map<
    string,
    { img: HTMLImageElement; ready: boolean }
  >();
  private readyImages = 0;

  constructor(private examService: ExamService, private platform: Platform) {}

  ngOnInit(): void {
    this.grades = this.examService.grade();
    this.userData = this.examService.getUserData();

    this.createImage(IMG_LOGO);
    this.createImage(IMG_BG);
    this.createImage(IMG_SCORE_CURVE);
    this.createImage(getOverlayImg(this.grades.grade));
    this.createImage(IMG_TABLE_HEADER_SCORE);
    this.createImage(IMG_SCORE_TITLE);
    this.createImage(IMG_TABLE_HEADER_SUBJECT);
    this.createImage(IMG_TITLE);
    this.createImage(IMG_SEAL);
    this.createImage(getGradeImg(this.grades.grade));
    this.createImage(getStampImg(this.grades.grade));
    this.createImage(IMG_INSTRUCTIONS);
    this.createImage(QR_CODE);
    if (this.userData) {
      this.createImage(this.userData.avatarUrl);
    }
  }

  createImage(url: string) {
    var img = new Image();
    img.addEventListener('load', () => {
      this.onImageReady(url);
    });
    img.crossOrigin = 'anonymous';
    img.src = url;
    this.images.set(url, { img, ready: false });
  }

  onImageReady(url: string) {
    if (!this.images.get(url)!.ready) {
      this.images.get(url)!.ready = true;
      ++this.readyImages;
      if (this.readyImages == this.images.size) {
        const containerHeight =
          this.fillDiv!.nativeElement.getBoundingClientRect().height;
        const containerWidth =
          this.fillDiv!.nativeElement.getBoundingClientRect().width;

        this.ctx = this.canvas!.nativeElement.getContext('2d') ?? undefined;
        this.canvas!.nativeElement.height = 4 * containerHeight;
        this.canvas!.nativeElement.width =
          4 * Math.min((containerHeight / 16) * 9, containerWidth);

        this.draw();
        this.outputImg!.nativeElement.src =
          this.canvas!.nativeElement.toDataURL();
        this.outputImg!.nativeElement.style.display = '';

        this.isLoading = false;

        this.playSound();
      }
    }
  }

  playSound() {
    let _howler = new Howl({
      ...getHowlProps(this.platform.IOS),
      src: [getSound(this.grades.grade)],
      onload: () => {
        _howler.play();
      },
    });
  }

  draw() {
    const ctx = this.ctx!;
    const canvas = this.canvas?.nativeElement!;
    const canvasW = this.canvas!.nativeElement.width;
    const canvasH = this.canvas!.nativeElement.height;

    console.log(canvasH, canvasW);
    const imgBg = this.getReadyImage(IMG_BG);

    // bg
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(
      this.getReadyImage(getOverlayImg(this.grades.grade)),
      0,
      0,
      canvasW,
      canvasH
    );

    ctx.fillStyle = 'rgb(197, 23, 43)';
    ctx.strokeStyle = 'rgb(197, 23, 43)';
    ctx.lineWidth = 1;

    // rotate bg
    ctx.rotate((10 * Math.PI) / 180);
    ctx.translate(
      canvasW * 0.2,
      ((-canvasW * imgBg.height) / imgBg.width) * 0.15
    );
    const bgRect = this.drawImage(
      ctx,
      IMG_BG,
      0,
      -canvasW * 0.4,
      /*width=*/ canvasW * 1
    );

    const drawOnBg = (
      url: string,
      relativeX: number,
      relativeY: number,
      relativeWidth: number
    ) => {
      return this.drawImage(
        ctx,
        url,
        bgRect.sx + bgRect.width * relativeX,
        bgRect.sy + bgRect.height * relativeY,
        bgRect.width * relativeWidth
      );
    };
    const drawOnBgByHeight = (
      url: string,
      relativeX: number,
      relativeY: number,
      relativeHeight: number
    ) => {
      return this.drawImageByHeight(
        ctx,
        url,
        bgRect.sx + bgRect.width * relativeX,
        bgRect.sy + bgRect.height * relativeY,
        bgRect.height * relativeHeight
      );
    };

    // Logo
    ctx.rotate((4 * Math.PI) / 180);
    drawOnBg(IMG_LOGO, 0.08, 0.33, 0.25);
    ctx.rotate((-4 * Math.PI) / 180);

    // 第一届福州话高考成绩单
    drawOnBg(getGradeImg(this.grades.grade), 0.17, 0.44, 0.5);
    const resultTitleRect = drawOnBg(IMG_TITLE, 0.17, 0.52, 0.4);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(
      resultTitleRect.sx - 8,
      resultTitleRect.sy - 8,
      resultTitleRect.width + 16,
      resultTitleRect.height + 16
    );
    drawOnBg(IMG_TITLE, 0.17, 0.52, 0.4);
    ctx.strokeRect(
      resultTitleRect.sx - 8,
      resultTitleRect.sy - 8,
      resultTitleRect.width + 16,
      resultTitleRect.height + 16
    );

    //

    ctx.fillStyle = 'rgb(197, 23, 43)';
    const fontSize = bgRect.height * 0.013;
    const nameRect = this.drawText(
      ctx,
      '姓　　名',
      bgRect.sx + bgRect.width * 0.17,
      bgRect.sy + bgRect.height * 0.58,
      fontSize
    );
    const idRect = this.drawText(
      ctx,
      '准考证号',
      nameRect.sx,
      nameRect.sy + nameRect.height * 3,
      fontSize
    );

    // 姓名下划线
    var lineY = nameRect.sy + nameRect.height * 1.4;
    ctx.moveTo(nameRect.sx + nameRect.width * 1.02 + 4, lineY);
    ctx.lineTo(
      nameRect.sx + nameRect.width * 1.02 + bgRect.width * 0.25,
      lineY
    );
    ctx.stroke();

    ctx.fillStyle = 'rgb(0,0,0)';
    if (this.userData || this.examService.userProvidedName) {
      this.drawText(
        ctx,
        this.userData?.nickname ?? this.examService.userProvidedName!,
        nameRect.sx + nameRect.width * 1.2,
        nameRect.sy - nameRect.height * 0.2,
        fontSize * 1.2
      );
    }

    // 准考证号
    const idBaseX = idRect.sx + idRect.width * 1.02 + 4;
    const idBaseY = idRect.sy - idRect.height * 0.35;
    const idBoxWidth = idRect.height * 1.5;
    const idBoxHeight = idRect.height * 2;
    const idBoxGap = idRect.height * 0.4;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.strokeStyle = 'rgb(197, 23, 43)';
    for (let i = 0; i < 6; ++i) {
      ctx.fillRect(
        idBaseX + i * (idBoxWidth + idBoxGap),
        idBaseY,
        idBoxWidth,
        idBoxHeight
      );
      ctx.strokeRect(
        idBaseX + i * (idBoxWidth + idBoxGap),
        idBaseY,
        idBoxWidth,
        idBoxHeight
      );
    }
    ctx.fillStyle = 'rgb(0,0,0)';
    if (this.userData) {
      for (let i = 0; i < 6; ++i) {
        this.drawText(
          ctx,
          this.userData.id[i],
          idBaseX + i * (idBoxWidth + idBoxGap) + 0.1 * idBoxWidth,
          idBaseY,
          idBoxHeight * 0.8
        );
      }
    }

    // 头像
    const avatarX = bgRect.sx + bgRect.width * 0.66;
    const avatarWidth = bgRect.width * 0.16;
    const avatarY = idBaseY + idBoxHeight - avatarWidth;
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.strokeStyle = 'rgb(197, 23, 43)';
    ctx.fillRect(avatarX, avatarY, avatarWidth, avatarWidth);
    ctx.strokeRect(avatarX, avatarY, avatarWidth, avatarWidth);
    ctx.strokeRect(
      avatarX + 16,
      avatarY + 16,
      avatarWidth - 32,
      avatarWidth - 32
    );
    if (this.userData) {
      ctx.drawImage(
        this.getReadyImage(this.userData.avatarUrl),
        avatarX + 16,
        avatarY + 16,
        avatarWidth - 32,
        avatarWidth - 32
      );
    }

    // dotted line
    var lineY = avatarY + avatarWidth + bgRect.height * 0.02;
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(197, 23, 43)';
    ctx.setLineDash([4, 4]);
    ctx.moveTo(bgRect.sx + bgRect.width * 0.17, lineY);
    ctx.lineTo(bgRect.sx + bgRect.width * 0.85, lineY);
    ctx.stroke();

    // 综合成绩为
    const scoreHeaderRect = drawOnBg(IMG_SCORE_TITLE, 0.25, 0.69, 0.3);
    ctx.fillStyle = 'rgb(197, 23, 43)';
    const scoreRect = this.drawText(
      ctx,
      this.grades!.total.toString(),
      scoreHeaderRect.sx + scoreHeaderRect.width + scoreHeaderRect.width * 0.2,
      scoreHeaderRect.sy - scoreHeaderRect.height * 0.6,
      scoreHeaderRect.height * 1.5,
      100
    );
    this.drawImage(
      ctx,
      IMG_SCORE_CURVE,
      scoreRect.sx,
      scoreRect.sy + scoreRect.height * 1.2,
      /*width=*/ canvasW * 0.14
    );

    // score board
    const tableX = bgRect.sx + bgRect.width * 0.25;
    const tableY = bgRect.sy + bgRect.height * 0.74;
    const tableCellWidth = bgRect.width * 0.16;
    const tableCellHeight = bgRect.height * 0.025;
    const tableRowCount = 5;
    const tableColumnCount = 2;
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(
      tableX,
      tableY,
      tableCellWidth * tableColumnCount,
      tableCellHeight * tableRowCount
    );
    ctx.strokeStyle = 'rgb(197, 23, 43)';
    ctx.setLineDash([]);
    // draw rows
    for (let i = 0; i <= tableRowCount; ++i) {
      ctx.beginPath();
      ctx.moveTo(tableX, tableY + i * tableCellHeight);
      ctx.lineTo(
        tableX + tableColumnCount * tableCellWidth,
        tableY + i * tableCellHeight
      );
      ctx.stroke();
    }
    // draw columns
    for (let i = 0; i <= tableColumnCount; ++i) {
      ctx.beginPath();
      ctx.moveTo(tableX + i * tableCellWidth, tableY);
      ctx.lineTo(
        tableX + i * tableCellWidth,
        tableY + tableRowCount * tableCellHeight
      );
      ctx.stroke();
    }
    this.drawImageByHeight(
      ctx,
      IMG_TABLE_HEADER_SUBJECT,
      tableX + tableCellWidth * 0.3,
      tableY + tableCellHeight * 0.2,
      /*height=*/ tableCellHeight * 0.6
    );
    this.drawImageByHeight(
      ctx,
      IMG_TABLE_HEADER_SCORE,
      tableX + tableCellWidth * 1.3,
      tableY + tableCellHeight * 0.2,
      /*height=*/ tableCellHeight * 0.6
    );
    ctx.fillStyle = 'rgb(0,0,0)';
    for (let i = 1; i <= this.grades.breakdown.length; ++i) {
      this.drawText(
        ctx,
        this.grades.breakdown[i - 1].type,
        tableX + tableCellWidth * 0.3,
        tableY + tableCellHeight * (i + 0.2),
        tableCellHeight * 0.54
      );
    }
    for (let i = 1; i <= this.grades.breakdown.length; ++i) {
      this.drawText(
        ctx,
        this.grades.breakdown[i - 1].score.toString(),
        tableX + tableCellWidth * 1.35,
        tableY + tableCellHeight * (i + 0.2),
        tableCellHeight * 0.54
      );
    }

    //　盖章
    drawOnBgByHeight(getStampImg(this.grades.grade), 0.57, 0.82, 0.13);

    // 装订线
    drawOnBgByHeight(IMG_SEAL, 0.104, 0.41, 0.45);

    ctx.resetTransform();
    const imgInstructions = this.getReadyImage(IMG_INSTRUCTIONS);
    const instructionsWidth = canvasW * 0.7;
    const instructionsRect = this.drawImage(
      ctx,
      IMG_INSTRUCTIONS,
      canvasW * 0.26,
      canvasH * 0.96 -
        (imgInstructions.height / imgInstructions.width) * instructionsWidth,
      instructionsWidth
    );
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(
      canvasW * 0.04,
      instructionsRect.sy,
      canvasW * 0.2,
      canvasW * 0.2
    );
    ctx.drawImage(
      this.getReadyImage(QR_CODE),
      canvasW * 0.04,
      instructionsRect.sy,
      canvasW * 0.2,
      canvasW * 0.2
    );
  }

  getReadyImage(url: string): HTMLImageElement {
    const img = this.images.get(url)!;

    if (!img.ready) {
      throw new Error(`Image ${url} is not ready`);
    }

    return img.img;
  }

  drawImageByHeight(
    ctx: CanvasRenderingContext2D,
    url: string,
    sx: number,
    sy: number,
    height: number
  ): Rect {
    const img = this.getReadyImage(url);
    ctx.drawImage(img, sx, sy, (height * img.width) / img.height, height);
    return { sx, sy, width: (height * img.width) / img.height, height };
  }

  drawImage(
    ctx: CanvasRenderingContext2D,
    url: string,
    sx: number,
    sy: number,
    width: number
  ): Rect {
    const img = this.getReadyImage(url);
    ctx.drawImage(img, sx, sy, width, (width * img.height) / img.width);
    return { sx, sy, width, height: (width * img.height) / img.width };
  }

  drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    sx: number,
    sy: number,
    height: number,
    weight: number = 200
  ): Rect {
    ctx.font = `${weight} ${height}px sans-serif`;
    const metrics = ctx.measureText(text);
    ctx.fillText(text, sx, sy + height);
    return { sx, sy: sy, width: metrics.width, height };
  }
}

interface Rect {
  sx: number;
  sy: number;
  width: number;
  height: number;
}

function getGradeImg(grade: GradeClass) {
  switch (grade) {
    case GradeClass.A:
      return IMG_GRADE_A;
    case GradeClass.B:
      return IMG_GRADE_B;
    case GradeClass.C:
      return IMG_GRADE_C;
    case GradeClass.D:
      return IMG_GRADE_D;
  }
}

function getStampImg(grade: GradeClass) {
  switch (grade) {
    case GradeClass.A:
      return IMG_STAMP_A;
    case GradeClass.B:
      return IMG_STAMP_B;
    case GradeClass.C:
      return IMG_STAMP_C;
    case GradeClass.D:
      return IMG_STAMP_D;
  }
}

function getOverlayImg(grade: GradeClass) {
  switch (grade) {
    case GradeClass.A:
      return IMG_OVERLAY_A;
    case GradeClass.B:
      return IMG_OVERLAY_B;
    case GradeClass.C:
      return IMG_OVERLAY_C;
    case GradeClass.D:
      return IMG_OVERLAY_D;
  }
}

function getSound(grade: GradeClass) {
  switch (grade) {
    case GradeClass.A:
      return ['assets/audio/a1.mp3', 'assets/audio/a2.mp3'][randint(2)];
    case GradeClass.B:
      return ['assets/audio/b1.mp3', 'assets/audio/b2.mp3'][randint(2)];
    case GradeClass.C:
      return ['assets/audio/c1.mp3', 'assets/audio/c2.mp3'][randint(2)];
    case GradeClass.D:
      return ['assets/audio/d1.mp3', 'assets/audio/d2.mp3'][randint(2)];
  }
}

function randint(max: number) {
  return Math.floor(Math.random() * max);
}
