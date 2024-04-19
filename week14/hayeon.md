# 스터디 14주차

### 📝 14주차 스터디 목차

- [9. Express 타입 분석하기](#9express-타입-분석하기)
  - [9.1 req, res, next 타입 분석 및 타이핑하기](#91-req-res-next-타입-분석-및-타이핑하기)
  - [9.2 Express 직접 타이핑 하기 ](#92-express-직접-타이핑-하기)

# 9.Express 타입 분석하기

- 기본 세팅

```bash
npm i express@4.18.2 @typ
es/express@4.17.17
```

```bash
 npx tsc --init
```

- 진입점 파일부터 분석

```ts
import * as bodyParser from "body-parser";
import * as serveStatic from "serve-static";
import * as core from "express-serve-static-core";
import * as qs from "qs";

/**
 * Creates an Express application. The express() function is a top-level function exported by the express module.
 */
declare function e(): core.Express;

declare namespace e {
  var json: typeof bodyParser.json;

  var raw: typeof bodyParser.raw;

  var text: typeof bodyParser.text;

  //....export = e;
}
export = e;
```

index.d.ts 파일을 확인해보면 body-parser,serve-static,express-serve-static-core,qs 패키지 타입을 import 하고, e 라는 함수이자 네임스페이스를 export하고 있다.

## 예제코드 분석

- 필요한 패키지 및 커뮤니티 타입 설치

```bash
npm i cookie-parser@1.4.6  express-session@1/17/3 passport@0.6.0 connect-flash@0.1.1
```

```bash
 npm i @types/cookie-parser@1.4.3 @types/express-session@1.17.1 @types/passport@1.0.12 @types/connect-flash@0.0.37
```

```ts
import cookieParser from "cookie-parser";
import express, {
  Request,
  RequestHandler,
  ErrorRequestHandler,
  Response,
  NextFunction,
} from "express";
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
const middleware: RequestHandler<
  { paramType: string },
  { message: string },
  { bodyType: number },
  { queryType: boolean },
  { localType: unknown }
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
  req.user?.zerocho; // Error: 'User' 형식에 'zerocho' 속성이 없습니다.ts(2339)
};
app.get("/", middleware);

const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res,
  next: express.NextFunction
) => {
  console.log(err.status); // Error: 'Error' 형식에 'status' 속성이 없습니다.ts(2339)
};
app.use(errorMiddleware);

app.listen(8080, () => {});
```

## express 타입 분석

```ts
declare function e(): core.Express; // express() 반환값

declare namespace e {
  ///....
}

export = e;
```

function e()이동하기 때문에 express()로 호출이 가능했던 것이다.

이번에는 express.json()의 json을 살펴보자.

## express.json()

json은 아래와 같은 두 개의 선언이 표시된다.

```ts
declare namespace bodyParser {
  interface BodyParser {
    //..
    json(options?: OptionsJson): NextHandleFunction;
    //..
    urlencoded(options?: OptionsUrlencoded): NextHandleFunction;
  }
}
//...
declare const bodyParser: bodyParser.BodyParser;

export = bodyParser;
```

```ts
declare function e(): core.Express;

declare namespace e {
  //json은 namespace 내부의 json
  var json: typeof bodyParser.json;
}
```

express.json()의 json은 namespace 내부의 json이고, 이것은 다시 bodyParser 인터페이스의 json이다.

express 함수 자체는 `declare function`으로 선언되어 있고, express의 속성과 메서드들은 `declare namespace`로 선언되어 있다.
자바스크립트에서 함수가 속성을 가질 수 있기에 이런 식의 선언이 자주 사용된다.

## core.Express

express() 반환값 타입인 core.Express를 알아보자.

```ts
export interface Express extends Application {
  request: Request;
  response: Response;
}
```

## Application

```ts
export interface Application<
  LocalsObj extends Record<string, any> = Record<string, any>
> extends EventEmitter,
    IRouter,
    Express.Application {
  /**
   * Express instance itself is a request handler, which could be invoked without
   * third argument.
   */
  (
    req: Request | http.IncomingMessage,
    res: Response | http.ServerResponse
  ): any;

  /**
   * Initialize the server.
   *
   *   - setup default configuration
   *   - setup default middleware
   *   - setup route reflection methods
   */
  init(): void;

  /**
   * Initialize application configuration.
   */
  defaultConfiguration(): void;

  engine(
    ext: string,
    fn: (
      path: string,
      options: object,
      callback: (e: any, rendered?: string) => void
    ) => void
  ): this;

  set(setting: string, val: any): this;
  get: ((name: string) => any) & IRouterMatcher<this>;

  param(name: string | string[], handler: RequestParamHandler): this;

  /**
   * Alternatively, you can pass only a callback, in which case you have the opportunity to alter the app.param()
   *
   * @deprecated since version 4.11
   */
  param(callback: (name: string, matcher: RegExp) => RequestParamHandler): this;

  /**
   * Return the app's absolute pathname
   * based on the parent(s) that have
   * mounted it.
   *
   * For example if the application was
   * mounted as "/admin", which itself
   * was mounted as "/blog" then the
   * return value would be "/blog/admin".
   */
  path(): string;

  /**
   * Check if `setting` is enabled (truthy).
   *
   *    app.enabled('foo')
   *    // => false
   *
   *    app.enable('foo')
   *    app.enabled('foo')
   *    // => true
   */
  enabled(setting: string): boolean;

  /**
   * Check if `setting` is disabled.
   *
   *    app.disabled('foo')
   *    // => true
   *
   *    app.enable('foo')
   *    app.disabled('foo')
   *    // => false
   */
  disabled(setting: string): boolean;

  /** Enable `setting`. */
  enable(setting: string): this;

  /** Disable `setting`. */
  disable(setting: string): this;

  /**
   * Render the given view `name` name with `options`
   * and a callback accepting an error and the
   * rendered template string.
   *
   * Example:
   *
   *    app.render('email', { name: 'Tobi' }, function(err, html){
   *      // ...
   *    })
   */
  render(
    name: string,
    options?: object,
    callback?: (err: Error, html: string) => void
  ): void;
  render(name: string, callback: (err: Error, html: string) => void): void;

  /**
   * Listen for connections.
   *
   * A node `http.Server` is returned, with this
   * application (which is a `Function`) as its
   * callback. If you wish to create both an HTTP
   * and HTTPS server you may do so with the "http"
   * and "https" modules as shown here:
   *
   *    var http = require('http')
   *      , https = require('https')
   *      , express = require('express')
   *      , app = express();
   *
   *    http.createServer(app).listen(80);
   *    https.createServer({ ... }, app).listen(443);
   */
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

  router: string;

  settings: any;

  resource: any;

  map: any;

  locals: LocalsObj & Locals;

  routes: any;

  /**
   * Used to get all registered routes in Express Application
   */
  _router: any;

  use: ApplicationRequestHandler<this>;

  on: (event: string, callback: (parent: Application) => void) => this;

  mountpath: string | string[];
}

export interface Express extends Application {
  request: Request;
  response: Response;
}
```

use 메서드는 ApplicationRequestHandler로 되어 있다. 그럼 ApplicationRequestHandler도 확인 해보자.

## ApplicationRequestHandler

```ts
export type ApplicationRequestHandler<T> = IRouterHandler<T> &
  IRouterMatcher<T> &
  ((...handlers: RequestHandlerParams[]) => T);
```

## IRouterMatcher

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

계속 들어가다 보면 app.use는 ApplicationRequestHandler이고, ApplicationRequestHandler는 IRouterHandler라는 것을 알수 있다.
app.use 에는RequestHandler나 RequestHandlerParams가 들어갈 수 있다.

## RequestHandlerParams

```ts
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

type RemoveTail<
  S extends string,
  Tail extends string
> = S extends `${infer P}${Tail}` ? P : S;
type GetRouteParameter<S extends string> = RemoveTail<
  RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
  `.${string}`
>;
```

RequestHandlerParams은 RequestHandler와 ErrorRequestHandler 그리고 이 둘의 배열로 구성되어 있다.

## RequestHandler

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

RequestHandler는 (req, res , next) => {} 꼴의 함수이다.
이것이 익스프레스 미들웨어의 전형적인 형태이다.
익스프레스 미들웨어의 타입이 RequestHandler임을 확인했다.
따라서 app.use 에는 이러한 미들웨어를 여러개 장착할 수 있다.

이제 미들웨어의 구성요소인 req, res, next 의 타입을 분석해보자.

# 9.1 req, res, next 타입 분석 및 타이핑하기

req는 Request,res는 Response, next는 NextFunction이다.

```ts
// Request
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>
> extends http.IncomingMessage,
    Express.Request {
  ///...
  get(name: "set-cookie"): string[] | undefined;
  get(name: string): string | undefined;

  header(name: "set-cookie"): string[] | undefined;
  header(name: string): string | undefined;
}

// Response
export interface Response<
  ResBody = any,
  LocalsObj extends Record<string, any> = Record<string, any>,
  StatusCode extends number = number
> extends http.ServerResponse,
    Express.Response {
  /**
   * Set status `code`.
   */
  status(code: StatusCode): this;
  ///..
  sendStatus(code: StatusCode): this;

  send: Send<ResBody, this>;

  /**
   * Send JSON response.
   *
   * Examples:
   *
   *     res.json(null);
   *     res.json({ user: 'tj' });
   *     res.status(500).json('oh noes!');
   *     res.status(404).json('I dont have that');
   */

  /**
   * Send JSON response with JSONP callback support.
   *
   * Examples:
   *
   *     res.jsonp(null);
   *     res.jsonp({ user: 'tj' });
   *     res.status(500).jsonp('oh noes!');
   *     res.status(404).jsonp('I dont have that');
   */
  locals: LocalsObj & Locals;
}

// NextFunction
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

`NextFunction`은 next(), next('router')
, next('route')라는 세 가지 방법으로 사용할 수 있다는 것을 알 수 있다.
Response와 Request는 다양한 타입의 매개변수가 존재한다.

`req` 객체 안에 데이터를 넣을 수 있는 공간은 기본적으로 req.params, req.body, req.query 이 세 가지이다. req.flash, req.session은 Express가 아니라 각각 패키지에서 추가한 객체이다.

`res` 객체 안에 넣을 수 있는 공간은 res.locals이다. 클라이언트로 응답을 보낼 데이터도 res.send나 res.json 같은 res 객체의 메서드를 통해서 보내는데, 이때 보내는 데이터도 타이핑 할 수 있다.
`send`는 <ResBody, this/>로 LocalsObj, ResBBody는 타입 매개변수이므로 Send와 Locals 타입만 확인하면 된다.

## Send

```ts
export type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;
```

Send는 Send<ResBod,this/> 함수로 , 매개변수는 ResBody를 받고 this를 반환한다.
ResBody는 {message : string}으로 타이핑하면 된다.
