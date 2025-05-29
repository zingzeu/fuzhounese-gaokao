export abstract class Question {
  prompt: string = '';
  abstract score: number;
}

export class TrueFalseQuestion extends Question {
  answer: boolean = true;
  score = 0;
}

export class MultiChoiceQuestion extends Question {
  choices: string[] = [];
  answerIndex: number = 0;
  score = 0;
}

export class TranslateQuestion extends MultiChoiceQuestion {}

export class ListeningQuestion extends MultiChoiceQuestion {
  audioSrcs: string[] = [];
  score = 0;
}

class Choice {
  imageSrc: string = '';
  caption: string = '';
  isAnswer: boolean = false;
  score: number = 0;
}

export class ImageListeningQuestion extends Question {
  audioSrcs: string[] = [];
  choices: Choice[] = [];
  get score() {
    return this.choices
      .map((choice) => choice.score)
      .reduce((previous, current) => previous + current);
  }
}

export const questions: Question[] = [
  Object.assign(new TrueFalseQuestion(), {
    prompt: '溪猪是福州特有的一种猪的品种。',
    answer: false,
    score: 5,
  }),
  Object.assign(new TrueFalseQuestion(), {
    prompt: '礼饼瘌指的是一小块礼饼。',
    answer: false,
    score: 5,
  }),
  Object.assign(new TrueFalseQuestion(), {
    prompt: '侬家(nang a)、我各侬(nguai go neoyng)的意思相同。',
    answer: false,
    score: 5,
  }),
  Object.assign(new TrueFalseQuestion(), {
    prompt: '俗语“七遛八遛，无拆福州”的意思就是东逛西逛，不要把福州拆了。',
    answer: false,
    score: 5,
  }),
  Object.assign(new MultiChoiceQuestion(), {
    prompt: '以下量词在福州话中用法正确的是？ ',
    choices: ['一只猪', '一把笔', '一个人', '一颗西瓜'],
    answerIndex: 1,
    score: 10,
  }),
  Object.assign(new MultiChoiceQuestion(), {
    prompt: '福州人听到《See you again》会想到？',
    choices: ['白糖很甜', '虾油很咸', '冰糖很甜', '酱油很咸'],
    answerIndex: 3,
    score: 10,
  }),
  Object.assign(new MultiChoiceQuestion(), {
    prompt: '福州话在民间的称呼不包括：',
    choices: ['福州话', '平话', '闽东语', '白话'],
    answerIndex: 3,
    score: 10,
  }),
  Object.assign(new TranslateQuestion(), {
    prompt: '福州人常说的“汝无切K我”的意思是：',
    choices: [
      '你不要夺我的王牌（King）',
      '你不要取笑我',
      '你不要调戏我',
      '你没有K金送我',
    ],
    answerIndex: 1,
    score: 10,
  }),
  Object.assign(new TranslateQuestion(), {
    prompt: '自行车（“卡拉掐”）用福州话汉字正确的写法为：',
    choices: ['卡达车', '脚踏车', '骹踏车', '骹搭车'],
    answerIndex: 2,
    score: 10,
  }),
  Object.assign(new TranslateQuestion(), {
    prompt: '福州话“七拱八听”是什么意思？',
    choices: ['胡说八道', '七嘴八舌', '吹牛、说大话', '形容消息传播快'],
    answerIndex: 0,
    score: 10,
  }),
  // 听力
  Object.assign(new ListeningQuestion(), {
    prompt: '问：顾客总共花了多少钱？',
    choices: ['100 元', '9.15 元', '91.5 元', '191.5 元'],
    answerIndex: 1,
    score: 5,
    audioSrcs: ['assets/audio/price.mp3'],
  }),
  Object.assign(new ListeningQuestion(), {
    prompt: '问：现在几点了？',
    choices: ['15:00', '15:05', '15:30', '15:50'],
    answerIndex: 2,
    score: 5,
    audioSrcs: ['assets/audio/time.mp3'],
  }),
  Object.assign(new ImageListeningQuestion(), {
    prompt: '选择你听到的果子的图片（多选）',
    choices: [
      {
        caption: '苹果',
        imageSrc: 'assets/apple.png',
        score: 5,
      } as Choice,
      {
        caption: '枇杷',
        imageSrc: 'assets/biba.png',
        score: 5,
        isAnswer: true,
      } as Choice,
      {
        caption: '荔枝',
        imageSrc: 'assets/liecie.png',
        score: 5,
        isAnswer: true,
      } as Choice,
      {
        caption: '番石榴',
        imageSrc: 'assets/huangluoliu.png',
        score: 5,
        isAnswer: true,
      } as Choice,
    ],
    audioSrcs: ['assets/audio/guozi.mp3'],
  }),
];
