import { Injectable } from '@angular/core';
import {
  ImageListeningQuestion,
  ListeningQuestion,
  MultiChoiceQuestion,
  questions as AllQuestions,
  questions,
  TranslateQuestion,
  TrueFalseQuestion,
} from './questions';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor() {}

  questions = AllQuestions;
  answersMap = new Map<number, any>();

  userProvidedName?: string = undefined;

  updateName(name: string) {
    this.userProvidedName = name;
  }

  updateAnswer(questionIndex: number, answer: any) {
    this.answersMap.set(questionIndex, answer);
  }

  clearAnswer(questionIndex: number) {
    this.answersMap.delete(questionIndex);
  }

  getAnswer(questionIndex: number) {
    return this.answersMap.get(questionIndex);
  }

  getQuestion(i: number) {
    return this.questions[i];
  }

  getUserData(): UserData | undefined {
    if ((window as any).wxUserData) {
      return (window as any).wxUserData;
    }
    return undefined;
  }

  grade(): Grades {
    let panduan = 0,
      xuanze = 0,
      fanyi = 0,
      tingli = 0;
    for (let i = 0; i < questions.length; ++i) {
      let question = questions[i];
      if (this.answersMap.has(i)) {
        if (question instanceof ImageListeningQuestion) {
          let imageQuestion = question as ImageListeningQuestion;
          let score = 0;
          let correctCount = 0;
          let incorrectCount = 0;
          let userChoices = this.answersMap.get(i) as number[];
          userChoices.forEach((choice) => {
            if (imageQuestion.choices[choice].isAnswer) {
              correctCount += 1;
            } else {
              incorrectCount += 1;
            }
          });
          // TODO: remove hard coded
          score = incorrectCount > 0 ? 0 : correctCount == 3 ? 10 : 5;
          tingli += score;
        }

        if (question instanceof MultiChoiceQuestion) {
          let multiChoiceQuestion = question as MultiChoiceQuestion;
          let score = 0;
          let userChoice = this.answersMap.get(i) as number;
          score =
            userChoice == multiChoiceQuestion.answerIndex
              ? multiChoiceQuestion.score
              : 0;

          if (question instanceof ListeningQuestion) {
            tingli += score;
          } else if (question instanceof TranslateQuestion) {
            fanyi += score;
          } else {
            xuanze += score;
          }
        }

        if (question instanceof TrueFalseQuestion) {
          let trueFalseQuestion = question as TrueFalseQuestion;
          let score = 0;
          let userChoice = this.answersMap.get(i) as boolean;
          score =
            userChoice == trueFalseQuestion.answer
              ? trueFalseQuestion.score
              : 0;
          panduan += score;
        }
      }
    }

    const total = panduan + xuanze + fanyi + tingli;
    let grade: GradeClass;
    if (total >= 85) {
      grade = GradeClass.A;
    } else if (total >= 70) {
      grade = GradeClass.B;
    } else if (total >= 50) {
      grade = GradeClass.C;
    } else {
      grade = GradeClass.D;
    }

    return {
      total,
      grade,
      breakdown: [
        { type: '判断', score: panduan },
        { type: '选择', score: xuanze },
        { type: '翻译', score: fanyi },
        { type: '听力', score: tingli },
      ],
    };
  }
}
export interface Grades {
  total: number;
  grade: GradeClass;
  breakdown: { type: string; score: number }[];
}

export enum GradeClass {
  A,
  B,
  C,
  D,
}

export interface UserData {
  nickname: string;
  id: string;
  avatarUrl: string;
}
