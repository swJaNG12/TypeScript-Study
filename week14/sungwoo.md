# 스터디 14주차

> 이 내용은 조현영(제로초)님이 쓰신 <span style="color: yellow">타입스크립트 교과서</span>로 스터디를 한 내용을 바탕으로 작성되었습니다.
> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121208343" >타입스크립트 교과서(종이책: yes24)</a> <br /> > <a target="_blank" href="https://www.yes24.com/Product/Goods/121811365" >타입스크립트 교과서(ebook: yes24)</a> <br /> > <a target="_blank" href="https://github.com/gilbutITbook/080369" >길벗출판사 GitHub</a> <br /> > <a target="_blank" href="https://www.zerocho.com/books" >저자 블로그</a> <br /> > <a target="_blank" href="https://github.com/ZeroCho" >저자 GitHub</a>

<br>

## 14주차 스터디 목차

- [9. Express 타입 분석하기](#9-express-타입-분석하기)
- [9.1 req, res, next 타입 분석 및 타이핑하기](#91-req-res-next-타입-분석-및-타이핑하기)
- [9.2 Express 직접 타이핑하기](#92-express-직접-타이핑하기)
  - [9.2.1 express와 cookie-parser, passport, connect-flash 미들웨어 타이핑](#921-express와-cookie-parser-passport-connect-flash-미들웨어-타이핑)

<br>

# 9. Express 타입 분석하기

이번에는 Node.js의 서버 프레임워크인 Express 프레임워크의 타입을 분석합니다.

```shell
npm i express@4.18.2 @types/express@4.17.17
```

@types/express 패키지의 package.json 에서 진입점 파일을 확인합니다.

```json
"types": "index.d.ts",
```

express 폴더안에 test.ts에 아래 코드를 작성합니다.

```ts
import cookieParser from "cookie-parser";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
app.use(cookieParser("SECRET"));
app.use(
  session({
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 미들웨어는 RequestHandler 타입이다.
const middleware: RequestHandler = (req, res, next) => {
  req.params.paramType;
  req.body.bodyType;
  req.query.queryType;
  res.locals.localType;
  res.json({
    message: "hello",
  });

  req.flash("플래시메시지");
  req.flash("1회성", "플래시메시지");
  req.flash();

  req.session;
  req.user?.zerocho;
};
app.get("/", middleware);

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.status);
};
app.use(errorMiddleware);

app.listen(8080, () => {
  console.log("8080 포트에서 서버 실행 중");
});
```

cookie-parser, express-session, passport, connect-flash를 import 하는 부분에서 에러가 발생합니다. 패키지를 설치하지 않아서 발생하는 것이니 각각의 패키지와 커뮤니티 타입을 설치합니다.

```shell
npm i cookie-parser@1.4.6 express-session@1.17.3 passport@0.6.0 connect-flash@0.1.
npm i @types/cookie-parser@1.4.3 @types/express-session@1.17.7 @types/passport@1.0.12 @t
ypes/connect-flash@0.0.37
```

먼저 `express`의 타입을 살펴보겠습니다.

node_modules/@types/express/index.d.ts

```ts
declare function e(): core.Express;

declare namespace e {
	...
}

export = e
```

express는 declare function e로 선언되어있습니다.

`express.json()의 json`의 타입을 살펴보겠습니다.

node_modules/@types/body-parser/index.d.ts

```ts
declare namespace bodyParser {
	interface BodyParser {
		...
		json(options?: OptionsJson): NextHandleFunction;
	}
}

declare const bodyParser: bodyParser.BodyParser;

export = bodyParser;
```

node_modules/@types/express/index.d.ts

```ts
declare namespace e {
  var json: typeof bodyParser.json;
}
export = e;
```

express.json()의 json은 namespace e 내부의 json이고, 이것은 다시 bodyParser 인터페이스의 json입니다.

express 함수 자체는 declare function으로 선언되어 있고, express의 속성과 메서드들은 declare namespace e로 선언되어 있음을 확인했습니다. 함수가 속성을 가질 수 있기 때문에 이런 식의 선언이 자주 사용됩니다.

<br>

`app.use`의 타입을 살펴보겠습니다. 먼저 express() 반환값인 app의 타입을 보겠습니다.

```ts
declare function e(): core.Express;
```

app의 타입은 core.Express 입니다. core는 express-serve-static-core에서 불러옵니다.

node_modules/@types/express/index.d.ts

```ts
import * as core from "express-serve-static-core";
```

core.Express에서 Express는 express-serve-static-core의 인터페이스이고 Application을 상속받습니다.

```ts
export interface Application<
  LocalsObj extends Record<string, any> = Record<string, any>
> extends EventEmitter,
    IRouter,
    Express.Application {
  listen(
    port: number,
    hostname: string,
    backlog: number,
    callback?: () => void
  ): http.Server;
  listen(port: number, hostname: string, callback?: () => void): http.Server;
  listen(port: number, callback?: () => void): http.Server;
  listen(callback?: () => void): http.Server;
  listen(path: string, callback?: () => void): http.Server;
  listen(handle: any, listeningListener?: () => void): http.Server;

  use: ApplicationRequestHandler<this>;
}

export interface Express extends Application {
  request: Request;
  response: Response;
}
```

Application 인터페이스에 use, listen 메서드가 모두 있습니다.

use메서드의 타입은 `ApplictionRequestHandler<this>`입니다. ApplictionRequestHandler를 보겠습니다.

```ts
export type ApplictionRequestHandler<T> = IRouterHandler<T> &
  IRouterMathcer<T> &
  ((...handlers: RequsetHandlerParams[]) => T);
```

IRouterHandler부터 보겠습니다.

```ts
export interface IRouterHandler<T, Route extends string = string> {
  (...handlers: Array<RequestHandler<RouteParameters<Route>>>): T;
  (...handlers: Array<RequestHandlerParams<RouteParameters<Route>>>): T;
  <
    P = RouteParameters<Route>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    // (This generic is meant to be passed explicitly.)
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
  ): T;
  <
    P = RouteParameters<Route>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    // (This generic is meant to be passed explicitly.)
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    ...handlers: Array<
      RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ): T;
  <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    // (This generic is meant to be passed explicitly.)
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>>
  ): T;
  <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    // (This generic is meant to be passed explicitly.)
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    ...handlers: Array<
      RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ): T;
}
```

app.use에는 RequestHandler, RequestHandlerParams 가 들어갈 수 있는것을 알 수 있습니다.

RequestHandler, RequestHandlerParams를 확인해보겠습니다.

```ts
export interface RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>
> {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2)
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
    res: Response<ResBody, LocalsObj>,
    next: NextFunction
  ): void;
}

export type RequestHandlerParams<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>
> =
  | RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
  | ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
  | Array<RequestHandler<P> | ErrorRequestHandler<P>>;
```

RequestHandlerParams는 RequestHandler, ErrorRequestHandler 그리고 이 둘의 유니언 배열 `Array<RequestHandler<P> | ErrorRequestHandler<P>>`입니다.

RequestHandler는 (req, res, next) => {} 함수입니다. 이것이 익스프레스 미들웨어의 전형적인 형태입니다. app.use에는 이런 미들웨러를 여러 개 장착할 수 있습니다.

<br>

## 9.1 req, res, next 타입 분석 및 타이핑하기

미들웨어 구성요소인 req,res, next는 각각 Request, Response, NextFunction입니다.

```ts
export interface RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>
> {
  // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2)
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
    res: Response<ResBody, LocalsObj>,
    next: NextFunction
  ): void;
}
```

NextFunction의 타입을 알아보겠습니다.

```ts
export interface NextFunction {
  (err?: any): void;
  /**
   * "Break-out" of a router by calling {next('router')};
   * @see {https://expressjs.com/en/guide/using-middleware.html#middleware.router}
   */
  (deferToNext: "router"): void;
  /**
   * "Break-out" of a route by calling {next('route')};
   * @see {https://expressjs.com/en/guide/using-middleware.html#middleware.application}
   */
  (deferToNext: "route"): void;
}
```

NextFunction은 next(), next('router'), next('route') 세 가지 방법으로 사용할 수 있습니다.

Request, Response의 타입을 보겠습니다.

```ts
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>
> extends http.IncomingMessage,
    Express.Request {}
export interface Response<
  ResBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  StatusCode extends number = number
> extends http.ServerResponse,
    Express.Response {
  send: Send<ResBody, this>;
  json: Send<ResBody, this>;
  locals: LocalsObj & Locals;
}

export interface Locals extends Express.Locals {}

export type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;
```

req 객체 안에는 기본적으로 데이터를 넣을 수 있는 공간이 3가지 있습니다.

- req.params
- req.body
- req.query

req.flash, req.session, req.user는 각각 connect-flash, express-session, passport에서 추가한 객체입니다.

res 객체 안에 데이터를 넣을 수 있는 공간은 res.locals 입니다. 응답을 보낼 데이터를 res.send, res.json 같은 res 객체의 메서드를 통해 보내는데, 이때 보내는 데이터도 타이핑할 수 있습니다.

res.json({message: 'hello'})이 므로 ResBody는 {message: string}으로 타이핑하면 됩니다.

Locals는 Express.Locals를 상속하고 있습니다.

```ts
declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    interface Request {}
    interface Response {}
    interface Locals {}
    interface Application {}
  }
}
```

- declare global로 전역에서 사용할 수 있습니다.
- Express 네임스페이스 아래 Request, Response, Locals, Application 인터페이스가 있는데 이 덕분에 인터페이스를 병합할 수 있습니다.

<br>

이번에는 다시 Request의 타입을 살펴보겠습니다.

```ts
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>
> extends http.IncomingMessage,
    Express.Request {
  body: ReqBody;
  cookies: any;
  method: string;
  params: P;
  query: ReqQuery;
}
```

req.body, req.params, req.query의 타입인 ReqBody, P, ReqQuery는 타입 매개변수라서 직접 값을 넣을 수 있습니다.

이제 test.ts에 middleware 함수에 직접 타이핑하겠습니다. 타입 매개변수 자리에 맞춰 타이핑합니다.

먼저 req입니다.

```ts
req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
```

ReqBody는 응답 데이터의 타입이므로, {messgae: string}으로 타이핑합니다.
<br>

res입니다.

```ts
res: Response<ResBody, LocalsObj>,
```

<br>
next는 NextFunction입니다.
```ts
next: NextFunction
```

```ts
const middleware: RequestHandler = (
  req: Request<
    { paramType: string },
    { message: string },
    { bodyType: symbol },
    { queryType: boolean },
    { localType: number }
  >,
  res: Response<{ message: string }, { localType: number }>,
  next: NextFunction
) => {
  req.params.paramType;
  req.body.bodyType;
  req.query.queryType;
  res.locals.localType;
  res.json({
    message: "hello",
  });

  req.flash("플래시메시지");
  req.flash("1회성", "플래시메시지");
  req.flash();

  req.session;
  req.user?.zerocho;
};
```

각가 타이핑하는 방법 말고도 RequestHAndler를 활용할 수도 있습니다.

```ts
export interface RequestHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, any> = Record<string, any>,
> {
```

Requset와 타입 매개변수가 동일하므로 아래처럼 작성할 수도 있습니다.

```ts
const middleware: RequestHandler<
  { paramType: string },
  { message: string },
  { bodyType: symbol },
  { queryType: boolean },
  { localType: number }
> = (req, res, next) => {
  req.params.paramType;
  req.body.bodyType;
  req.query.queryType;
  res.locals.localType;
  res.json({
    message: "hello",
  });

  req.flash("플래시메시지");
  req.flash("1회성", "플래시메시지");
  req.flash();

  req.session;
  req.user?.zerocho;
};
```

req.flash, req.session, req.user 타입을 보겠습니다. Express에는 없었고 별도 라이브러리를 추가해서 추가된 객체입니다. Express와 별개의 라이브러인데 어떻게 Exrpess의 req 객체가 변경되었는지 알아보겠습니다.

req.flash에서 flash의 타입을 보겠습니다.

```ts
/// <reference types="express" />

declare namespace Express {
  export interface Request {
    flash(): { [key: string]: string[] };
    flash(message: string): string[];
    flash(type: string, message: string[] | string): number;
    flash(type: string, format: string, ...args: any[]): number;
  }
}

declare module "connect-flash" {
  import express = require("express");
  interface IConnectFlashOptions {
    unsafe?: boolean | undefined;
  }
  function e(options?: IConnectFlashOptions): express.RequestHandler;
  export = e;
}
```

동일한 이름의 네임스페이스, 인터페이스는 서로 합쳐집니다. declare namespace Express와 아래 네임스페이스가 서로 합쳐집니다. 최상위 import, export 없는 스크립트 파일이므로 delcare global하지 않아도 declare global 처럼 동작합니다.

```ts
declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    interface Request {}
    interface Response {}
    interface Locals {}
    interface Application {}
  }
}
```

req.session, req.user의 타입을 보겠습니다.

node_module/@types/express-session/index.d.ts

```ts
declare global {
  namespace Express {
    type SessionStore = session.Store & { generate: (req: Request) => void };

    // Inject additional properties on express.Request
    interface Request {
      /**
       * This request's `Session` object.
       * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
       * [Declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) can be used to add your own properties.
       *
       * @see SessionData
       */
      session: session.Session & Partial<session.SessionData>;

      /**
       * This request's session ID.
       * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
       */
      sessionID: string;

      /**
       * The Store in use.
       * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
       * The function `generate` is added by express-session
       */
      sessionStore: SessionStore;
    }
  }
}

export = session;

declare namespace session {
  interface SessionData {
    cookie: Cookie;
  }
}
```

node_module/@types/passport/index.d.ts

```ts
declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface AuthInfo {}
    // tslint:disable-next-line:no-empty-interface
    interface User {}

    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;
    }
    interface AuthenticatedRequest extends Request {
      user: User;
    }

    interface UnauthenticatedRequest extends Request {
      user?: undefined;
    }
  }
}
```

req.session, req.user 모두 req.flash 처럼 Express 네임스페이스의 Request 객체를 병합하고 있습니다. req.session은 session 네임스페이스의 SessionData 상속하고, req.user는 Express 네임스페이스의 User 인터페이스이므로 직접 병합할 수 있습니다.

```ts
declare global {
  namespace Express {
    interface User {
      zerocho: string;
    }
  }
}
declare module "express-session" {
  interface SessionData {
    sessionData: string;
  }
}
```

<br>

## 9.2 Express 직접 타이핑하기

이제 Express 패키지를 직접 타이핑해보겠습니다.

zexpress.ts

```ts
interface ZExpress {}
interface CookieParser {}
interface Session {}
interface Flash {}
interface Passport {}
interface RequestHandler {}
interface ErrorRequestHandler {}
declare const express: ZExpress;
declare const cookieParser: CookieParser;
declare const falsh: Flash;
declare const session: Session;
declare const passport: Passport;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
app.use(cookieParser("SECRET"));
app.use(
  session({
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(falsh());

const middleware: RequestHandle = (req, res, next) => {
  req.params.paramType;
  req.body.bodyType;
  req.query.queryType;
  res.locals.hello = "world";
  req.session.sessionData;
  req.user?.zerocho;

  req.flash("플래시메시지");
  req.flash("1회성", "플래시메시지");
  req.flash();

  res.json({
    messgage: "hello",
  });
};
app.get(
  "/",
  (req, res, next) => {
    req.locals.hello;
    next("route");
  },
  middleware
);

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.status);
};

app.use(errorMiddleware);

app.listen(8080, () => {
  console.log("8080 포트에서 서버 실행 중");
});
```

### 9.2.1 express와 cookie-parser, passport, connect-flash 미들웨어 타이핑

```ts
interface Application {}
interface ZExpress {
  (): Application;
  json(): RequestHandler;
  urlencoded({ extended }: { extended: boolean }): RequestHandler;
  static(path: string): RequestHandler;
}
interface CookieParser {
  (secret: string): RequestHandler;
}
interface Session {
  ({ secret }: { secret: string }): RequestHandler;
}
interface Flash {
  (): RequestHandler;
}
interface Passport {
  initialize(): RequestHandler;
  session(): RequestHandler;
}
```

express()의 결과인 app은 Application입니다. Application 인터페이스는 아직 비어있기 때문에 app 부분에서 에서가 발생하므로 Application 인터페이스를 타이핑합니다.

```ts
interface Application {
  use(middleware: RequestHandler | ErrorRequestHandler): void;
  use(path: string, middleware: RequestHandler | ErrorRequestHandler): void;
  get(path: string, ...middlewares: RequestHandler[]): void;
  listen(port: number, callback: () => void): void;
}
```

use메서드는 path가 들어오는 경우와 없는 경우로 나눠지므로 오버로딩을 적용합니다.<br>
get 메서드는 인수로 메들웨어가 하나 이상 올 수 있기 때문에 rest 문법을 사용했습니다.

### 9.2.2 RequestHandler 타이핑

RequestHandler를 타이핑하겠습니다.

```ts
interface ZRequest<Param, Query, ReqBody> {}
interface ZResponse<ResBody, Locals> {}
interface NextFunction {}
}
interface RequestHandler<
  Param = any,
  Query = any,
  ReqBody = any,
  ResBody = any,
  Locals = any
> {
  (
    req: ZRequest<Param, Query, ReqBody>,
    res: ZResponse<ResBody, Locals>,
    next: NextFunction): void;
}
```

ZRequest, ZResponse, NextFunction도 타이핑해줍니다. NextFunction은 문자열을 받을 수도 있고 받지않을 수도 있는 to를 타이핑해줍니다.

```ts
interface ZRequest<Param, Query, ReqBody> {
  params: Param;
  query: Query;
  body: ReqBody;
}
interface ZResponse<ResBody, Locals> {
  locals: Locals;
  json(data: ResBody): void;
}
interface NextFunction {
  (to?: string): void;
}
interface RequestHandler<
  Param = any,
  Query = any,
  ReqBody = any,
  ResBody = any,
  Locals = any
> {
  (
    req: ZRequest<Param, Query, ReqBody>,
    res: ZResponse<ResBody, Locals>,
    next: NextFunction
  ): void;
}
```

이어서 ErrorRequestHandler도 타이핑해줍니다. RequestHandler에서 err만 추가하면 됩니다.

```ts
interface ErrorRequestHandler<
  Param = any,
  Query = any,
  ReqBody = any,
  ResBody = any,
  Locals = any
> {
  (
    err: Error,
    req: ZRequest<Param, Query, ReqBody>,
    res: ZResponse<ResBody, Locals>,
    next: NextFunction
  ): void;
}
```

아래 코드에서 RequestHandler타입인 middleware에 타입 매개변수를 넣어줍니다.

```ts
const middleware: RequestHandler = (req, res, next) => {
  req.params.paramType;
  req.body.bodyType;
  req.query.queryType;
  res.locals.hello = "world";
  req.session.sessionData;
  req.user?.zerocho;

  req.flash("플래시메시지");
  req.flash("1회성", "플래시메시지");
  req.flash();

  res.json({
    message: "hello",
  });
};
app.get(
  "/",
  (req, res, next) => {
    res.locals.hello;
    next("route");
  },
  middleware
);
```

이제 req.session, req.user, req.flash에 에러가 있습니다. ZRequest 인터페이스에서 직접 타이핑 해줘도 되지만 Express와는 별도의 라이브러리에서 추가한 속성이라는 특성을 살려 별도의 네임스페이스와 인터페이스로 합치겠습니다.

```ts
declare namespace ZExpress {
  interface Request {
    session: {
      sessionData: string;
    };
    user?: {
      zerocho: string;
    };
    flash: {
      (key?: string, value?: string): void;
    };
  }
}
interface ZRequest<Param, Query, ReqBody> extends ZExpress.Request {
  params: Param;
  query: Query;
  body: ReqBody;
}
```

아래 코드에서 res.locals.hello가 다른 미들웨어에서 any인 것을 해결합니다. ZExpress에 Locals 인터페이스를 추가합니다.

```ts
declare namespace ZExpress {
  interface Request {
    session: {
      sessionData: string;
    };
    user?: {
      zerocho: string;
    };
    flash: {
      (key?: string, value?: string): void;
    };
  }
  interface Locals {
    hello: string;
  }
}
interface ZResponse<ResBody, Locals> {
  locals: Locals & ZExpress.Locals;
  json(data: ResBody): void;
}
interface RequestHandler<
  Param = any,
  Query = any,
  ReqBody = any,
  ResBody = any,
  Locals = ZExpress.Locals
> {
  (
    req: ZRequest<Param, Query, ReqBody>,
    res: ZResponse<ResBody, Locals>,
    next: NextFunction
  ): void;
}
interface ErrorRequestHandler<
  Param = any,
  Query = any,
  ReqBody = any,
  ResBody = any,
  Locals = ZExpress.Locals
> {
  (
    err: Error,
    req: ZRequest<Param, Query, ReqBody>,
    res: ZResponse<ResBody, Locals>,
    next: NextFunction
  ): void;
}
```

err.status에서 발생하는 에러는 Error 인터페이스를 따로 추가해서 해결합니다

```ts
interface Error {
  status: string;
}
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.status);
};
```
