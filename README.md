# Fuzhounese Gaokao (福州话高考) source code

This is the source code of a web app that ran as a successful Internet campaign to promote awareness for Fuzhounese. Gaokao (or college entrance exam) is an important thing that students in China have to go through. Obviously Fuzhounese is not part of the real Gaokao. But by making a mock version of it, we showed netizens a glimpse of an alternate world.

![Screenshots](cover.png)

Try a live demo: https://ztl8702.github.io/fuzhounese-gaokao

## Technical stuff

This web app was originally written with Angular 12.0.3, which is really really old by now. Things will break due to the fragility of the JavaScript ecosystem. There is really nothing special that Angular brought to this project, it was just familiar to the author at the time. You can achieve the same with any framework or without framework.

Anyway, to run locally, you can try:
```
export NODE_OPTIONS="--openssl-legacy-provider" # because our webpack version is too old
yarn ng serve
```

To build a distribution bundle, run:

```
export NODE_OPTIONS="--openssl-legacy-provider" # because our webpack version is too old
yarn ng build --base-href /fuzhounese-gaokao/
```

## Credits and licensing

Graphic design by 谢大秀. Programming by @ztl8702. Many folks from "真鸟囝天团" contributed content and ideas to this web app.

The authors do not reserve any rights, nor is there any warranty. Use it however you like.
