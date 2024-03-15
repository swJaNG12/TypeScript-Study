# 스터디 10주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 10주차 스터디 목차

- [6. Axios 타입 분석하기](#6-axios-타입-분석하기)
  - [get 메서드 타입 분석](#get-메서드-타입-분석)
  - [post 메서드 타입 분석](#post-메서드-타입-분석)
  - [6.1 Axios 직접 타이핑하기](#61-axios-직접-타이핑하기)
  - [6.2 다양한 모듈 형식으로 js 파일 생성하기](#62-다양한-모듈-형식으로-js-파일-생성하기)
  - [6.3 axios의 타입을 어떻게 찾았는지 이해하기](#63-axios의-타입을-어떻게-찾았는지-이해하기)

# 6. Axios 타입 분석하기

axios 라이브러리의 타입을 분석해보겠습니다.

```ts
import axios from "axios";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

(async () => {
  try {
    const res = await axios.get<Post>(
      "http://jsonplaceholder.typicode.com/posts/1"
    );
    console.log(res.data.userId);
    const res2 = await axios.post<Post>(
      "http://jsonplaceholder.typicode.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );
    console.log(res2.data.id);
  } catch (error) {
    if (axios.isAxiosError<{ message: string }>(error)) {
      console.log(error.response?.data.message);
    }
  }
})();
```

import 되어 있는 axios 변수가 어떻게 타이핑되어 있는지 확인하겠습니다.

node_modules/axios/index.d.ts

```ts
// TypeScript Version: 4.7
declare const axios: AxiosStatic;

esport default axios;
```

이 파일은 axios 타입 선언의 진입점입니다. 따라서 이 파일에서부터 타입 분석을 해나가면 됩니다.

### get 메서드 타입 분석

어떻게 axios.get 메서드 호출이 가능한지, `<Post>` 제네릭은 무엇인지 알아보겠습니다.<br>
axios 변수의 타입이 AxiosStatic 이므로 AxiosStatic을 살펴보겠습니다.

Axios 변수는 AxiosStatic 타입이고, AxiosStatic 타입은 AxiosInstance를 상속받고, AxiosInstance는 Axios의 상속을 받습니다.

```ts
export interface AxiosStatic extends AxiosInstance {
  ...
}
```

```ts
export interface AxiosInstance extends Axios {
  ...
}
```

```ts
export class Axios {
  constructor(config?: AxiosRequestConfig);
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}
```

axios.get의 현재 타입 매개변수

- T : Post 인터페이스
- R : 기본값 `AxiosResponse<T>`
- D : 기본값 any

axios.get의 현재 매개변수

- url : "http://jsonplaceholder.typicode.com/posts/1"
- config : 옵셔널, 제공 x

T,R,D를 따로 타이핑했는지, `<Post>`로 명시적으로 제공하는 이유는 무엇인지 알아보겠습니다.

R의 타입인 AxiosResponse를 보겠습니다.

```ts
export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosREsponseHeaders | AxiosResponseHeader;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}
```

T는 data입니다. get메서드의 반환값 타입이 `Promise<R>`이므로 get메서드의 반환값을 받는 res의 타입은 `const res: AxiosResponse<Post, any>` 입니다. 그래서 res.data는 Post가 된다는 것을 알 수 있습니다. 또 응답에는 data 말고도, status, statusText, headers, config, request 등이 있다는 것을 알 수 있습니다.

config는 AxiosRequestConfig, InternalAxiosRequest 를 보면됩니다.

```ts
export interface AxiosRequestConfig<D = any> {
	...
  headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
  data?: D;
	...
}

export type RawAxiosRequestConfig<D = any> = AxiosRequestConfig<D>;

export interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders;
}

export type AxiosRequestHeaders = RawAxiosRequestHeaders & AxiosHeaders;
```

- T : 서버로부터 오는 응답 본문 데이터
- D : 서버로 보내는 요청 본문 데이터

get 요청시에는 서버로 보내는 요청 본문이 없으므로 D를 사용할 일이 없습니다.

<br>

### post 메서드 타입 분석

```ts
const res2 = await axios.post<Post>(
  "http://jsonplaceholder.typicode.com/posts",
  {
    title: "foo",
    body: "bar",
    userId: 1,
  }
);
console.log(res2.data.id);
```

```ts
export class Axios {
	...
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
	...
}
```

<br>

## 6.1 Axios 직접 타이핑하기

---

```ts
interface Zaxios {}
declare const zaxios: Zaxios;

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

(async () => {
  try {
    const res = await zaxios.get<Post>(
      "http://jsonplaceholder.typicode.com/posts/1"
    );
    console.log(res.data.userId);
    const res2 = await zaxios.post<Post>(
      "http://jsonplaceholder.typicode.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );
    console.log(res2.data.id);
  } catch (error) {
    if (zaxios.isAxiosError<{ message: string }>(error)) {
      console.log(error.response?.data.message);
    }
  }
})();

// Axios
new zaxios().get("www.gitbut.co.kt");

// AxiosInstance
zaxios({ url: "wwww.gitbut.co.kr", method: "get" });

// AxiosStatic
zaxios.create().get("wwww.gitbut.co.kr");
```

```ts
interface ZaxiosError<ResponseData> {
  response?: ZaxiosResponse<ResponseData>;
}

interface ZaxiosResponse<ResponseData> {
  data: ResponseData;
}

interface Config {
  url: string;
  method: string;
}

declare class ZAxios {
  constructor();
  get<ResponseData>(url: string): ZaxiosResponse<ResponseData>;
  post<ResponseData>(
    url: string,
    requestData: unknown
  ): ZaxiosResponse<ResponseData>;
}

interface Zaxios extends ZAxios {
  <ResponseData>(Config: Config): ZaxiosResponse<ResponseData>;
  isAxiosError<ResponseData>(
    error: unknown
  ): error is ZaxiosError<ResponseData>;
  create(): Zaxios;
}
declare const zaxios: Zaxios;
```

- get, post,반환값은 ZaxiosResponse, isAxiosError의 반환값은 타입 서술로 error 타입을 ZaxiosError로 만듭니다.
- create의 반환값은 Zaxios입니다.
- post 메서드에서 데이터를 전달하는 requestData의 타입은 어떤 데이터를 보낼지 알 수 없기 때문에 unknown입니다.

<br>

## 6.2 다양한 모듈 형식으로 js 파일 생성하기

---

아래 타입스크립트 코드를 tsconfig의 설정을 바꿔가면서 어떻게 컴파일 되는지 알아보겠습니다.

### 6.2.1 target: 'es2016', CommonJS

```ts
"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const res = yield axios_1.default.get(
        "http://jsonplaceholder.typicode.com/posts/1"
      );
      console.log(res.data.userId);
      const res2 = yield axios_1.default.post(
        "http://jsonplaceholder.typicode.com/posts",
        {
          title: "foo",
          body: "bar",
          userId: 1,
        }
      );
      console.log(res2.data.id);
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        console.log(
          (_a = error.response) === null || _a === void 0
            ? void 0
            : _a.data.message
        );
      }
    }
  }))();
```

### 6.2.2 target: 'es2022', CommonJS

```ts
"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
(async () => {
  try {
    const res = await axios_1.default.get(
      "http://jsonplaceholder.typicode.com/posts/1"
    );
    console.log(res.data.userId);
    const res2 = await axios_1.default.post(
      "http://jsonplaceholder.typicode.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );
    console.log(res2.data.id);
  } catch (error) {
    if (axios_1.default.isAxiosError(error)) {
      console.log(error.response?.data.message);
    }
  }
})();
```

### 6.2.3 target: 'es2022', ES2015

```ts
import axios from "axios";
(async () => {
  try {
    const res = await axios.get("http://jsonplaceholder.typicode.com/posts/1");
    console.log(res.data.userId);
    const res2 = await axios.post("http://jsonplaceholder.typicode.com/posts", {
      title: "foo",
      body: "bar",
      userId: 1,
    });
    console.log(res2.data.id);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.message);
    }
  }
})();
```

### 6.2.4 target: 'es2022', UMD

```ts
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "axios"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  const axios_1 = __importDefault(require("axios"));
  (async () => {
    try {
      const res = await axios_1.default.get(
        "http://jsonplaceholder.typicode.com/posts/1"
      );
      console.log(res.data.userId);
      const res2 = await axios_1.default.post(
        "http://jsonplaceholder.typicode.com/posts",
        {
          title: "foo",
          body: "bar",
          userId: 1,
        }
      );
      console.log(res2.data.id);
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  })();
});
```

UMD 모듈은 CommonJS와 AMD 모듈 시스템, 모두 호환되는 통합형 모듈입니다.<br>
UMD, AMD 모두 잘 사용하지 않습니다.

<br>

## 6.3 axios의 타입을 어떻게 찾았는지 이해하기

---

타입스크립트는 패키지를 import해서 사용할 때 패키지가 자체적으로 타입을 지원하는지 아니면 커뮤니티 타입을 지원하는지 알아야 합니다.<br>

- 자체적으로 타입을 지원하는 경우(axios)<br>
  node_moudles/axios의 package.json 파일의 types 속성 확인
- 커뮤니티 타입을 지원하는 경우(jQuery)<br>
  node_modlues/@types/jquery의 package.json 파일의 types 속성 확인

### 6.3.1 타입스크립트가 모듈을 찾는 순서

1. `현재 ts 파일이 있는 폴더에서 node_modules가 있는지 확인`<br>

   - 있으면 2번부터 12번까지 순차적으로 해당 파일을 찾을 떄까지 수행<br>
   - 없으면 부모 폴더로 올라가서 다시 1번 수행

2. `node_modules/module.ts`
3. `node_modules/module.tsx`
4. `node_modules/module.d.ts`
5. `node_modules/module/package.json` 속성 찾기
   - typesVersions, typings, types, main 속성을 순서대로 찾기
6. `node_modules/module/index.ts`
7. `node_modules/module/index.tsx`
8. `node_modules/module/index.d.ts`
9. `node_modules/@types/module/package.json 속성 찾기`
10. `node_modules/@types/module.d.ts`
11. `node_modules/@types/module/index.d.ts`
12. 2 ~ 11 번까지 모두 못 찾았으면 부모 폴더로 올라가서 1번을 수행
13. 최상위 폴더까지 갔는데도 못 찾으면 에러

### 6.3.2 실제 axios의 타입을 찾는 과정

현재 폴더 최상위 ts-book에 node_modules, Axios 폴더가 있고, Axios 폴더안에 test.ts 파일이 있다고 가정하겠습니다.

```
📦node_modules
 ┣ 📂.bin
 ┣ 📂@types
 ┃ ┣ 📂jquery
 ┃ ┃ ┣ 📂dist
 ┃ ┃ ┃ ┗ 📜jquery.slim.d.ts
 ┃ ┃ ┣ 📜JQuery.d.ts
 ┃ ┃ ┣ 📜JQueryStatic.d.ts
 ┃ ┃ ┣ 📜LICENSE
 ┃ ┃ ┣ 📜README.md
 ┃ ┃ ┣ 📜index.d.ts
 ┃ ┃ ┣ 📜legacy.d.ts
 ┃ ┃ ┣ 📜misc.d.ts
 ┃ ┃ ┗ 📜package.json
 ┣ 📂axios
 ┃ ┣ 📜SECURITY.md
 ┃ ┣ 📜index.d.cts
 ┃ ┣ 📜index.d.ts
 ┃ ┣ 📜index.js
 ┃ ┗ 📜package.json
 ┗ 📜.package-lock.json
```

1. test.ts 가 있는 Axios 폴더에서 node_modules 가 있는지 확인, 없으니 부모 폴더 ts-book으로 올라가서 다시 1번 수행 (1번 과정)
2. ts-book 폴더에 node_modules 폴더가 있으니 `node_modules` 폴더안에서 `axios.ts, axios.tsx, axios.d.ts` 가 있는지 확인, 없다면 node_modules/axios/package.json 파일을 찾습니다.(2,3,4번 과정)
3. `node_modules/axios/package.json` 파일에서 `typesVersion, typings, types, main` 속성을 찾습니다.<br> (5번 과정)
   이 속성들을 찾았다면, 여기서 이 속성이 가리키고 있는 파일 index.d.ts를 타입스크립트는 axios에 대한 타입으로 인식합니다.<br>

   만약 `node_modules/axios/package.json` 파일에서 타입 파일을 찾지 못했다면 node_modules/axios/ 폴더 안에서 다시 index.ts, index.tsc, index.d.ts를 찾습니다.(6,7,8번 과정)

   아직도 찾지 못했다면 node_modules/@types/axios 폴더의 package.json 에서 타입 속성을 확인합니다.

타입 파일을 만들때 b.ts, b.d.ts, b/index.ts 중 여러개가 있다면 우선순위가 높은 파일만 선택하고 나머지는 무시합니다. 따라서 b.ts, b.d.ts, b/index.ts 등의 파일을 동시에 만들지말고 1개 만들어서 우선순위를 신경쓰지 않게 구성하는 것이 좋습니다.
