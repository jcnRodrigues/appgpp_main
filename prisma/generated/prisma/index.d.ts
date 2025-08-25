
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model tbUser
 * 
 */
export type tbUser = $Result.DefaultSelection<Prisma.$tbUserPayload>
/**
 * Model tbFuncionario
 * 
 */
export type tbFuncionario = $Result.DefaultSelection<Prisma.$tbFuncionarioPayload>
/**
 * Model tbStatusFun
 * 
 */
export type tbStatusFun = $Result.DefaultSelection<Prisma.$tbStatusFunPayload>
/**
 * Model tbFuncao
 * 
 */
export type tbFuncao = $Result.DefaultSelection<Prisma.$tbFuncaoPayload>
/**
 * Model tbPatrimonio
 * 
 */
export type tbPatrimonio = $Result.DefaultSelection<Prisma.$tbPatrimonioPayload>
/**
 * Model tbTipoPat
 * 
 */
export type tbTipoPat = $Result.DefaultSelection<Prisma.$tbTipoPatPayload>
/**
 * Model tbStatusPat
 * 
 */
export type tbStatusPat = $Result.DefaultSelection<Prisma.$tbStatusPatPayload>
/**
 * Model tbEmpresa
 * 
 */
export type tbEmpresa = $Result.DefaultSelection<Prisma.$tbEmpresaPayload>
/**
 * Model tbCCusto
 * 
 */
export type tbCCusto = $Result.DefaultSelection<Prisma.$tbCCustoPayload>
/**
 * Model tbCadastro
 * 
 */
export type tbCadastro = $Result.DefaultSelection<Prisma.$tbCadastroPayload>
/**
 * Model tbAccont
 * 
 */
export type tbAccont = $Result.DefaultSelection<Prisma.$tbAccontPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TbUsers
 * const tbUsers = await prisma.tbUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TbUsers
   * const tbUsers = await prisma.tbUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tbUser`: Exposes CRUD operations for the **tbUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbUsers
    * const tbUsers = await prisma.tbUser.findMany()
    * ```
    */
  get tbUser(): Prisma.tbUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbFuncionario`: Exposes CRUD operations for the **tbFuncionario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbFuncionarios
    * const tbFuncionarios = await prisma.tbFuncionario.findMany()
    * ```
    */
  get tbFuncionario(): Prisma.tbFuncionarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbStatusFun`: Exposes CRUD operations for the **tbStatusFun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbStatusFuns
    * const tbStatusFuns = await prisma.tbStatusFun.findMany()
    * ```
    */
  get tbStatusFun(): Prisma.tbStatusFunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbFuncao`: Exposes CRUD operations for the **tbFuncao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbFuncaos
    * const tbFuncaos = await prisma.tbFuncao.findMany()
    * ```
    */
  get tbFuncao(): Prisma.tbFuncaoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbPatrimonio`: Exposes CRUD operations for the **tbPatrimonio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbPatrimonios
    * const tbPatrimonios = await prisma.tbPatrimonio.findMany()
    * ```
    */
  get tbPatrimonio(): Prisma.tbPatrimonioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbTipoPat`: Exposes CRUD operations for the **tbTipoPat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbTipoPats
    * const tbTipoPats = await prisma.tbTipoPat.findMany()
    * ```
    */
  get tbTipoPat(): Prisma.tbTipoPatDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbStatusPat`: Exposes CRUD operations for the **tbStatusPat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbStatusPats
    * const tbStatusPats = await prisma.tbStatusPat.findMany()
    * ```
    */
  get tbStatusPat(): Prisma.tbStatusPatDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbEmpresa`: Exposes CRUD operations for the **tbEmpresa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbEmpresas
    * const tbEmpresas = await prisma.tbEmpresa.findMany()
    * ```
    */
  get tbEmpresa(): Prisma.tbEmpresaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbCCusto`: Exposes CRUD operations for the **tbCCusto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbCCustos
    * const tbCCustos = await prisma.tbCCusto.findMany()
    * ```
    */
  get tbCCusto(): Prisma.tbCCustoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbCadastro`: Exposes CRUD operations for the **tbCadastro** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbCadastros
    * const tbCadastros = await prisma.tbCadastro.findMany()
    * ```
    */
  get tbCadastro(): Prisma.tbCadastroDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbAccont`: Exposes CRUD operations for the **tbAccont** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbAcconts
    * const tbAcconts = await prisma.tbAccont.findMany()
    * ```
    */
  get tbAccont(): Prisma.tbAccontDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    tbUser: 'tbUser',
    tbFuncionario: 'tbFuncionario',
    tbStatusFun: 'tbStatusFun',
    tbFuncao: 'tbFuncao',
    tbPatrimonio: 'tbPatrimonio',
    tbTipoPat: 'tbTipoPat',
    tbStatusPat: 'tbStatusPat',
    tbEmpresa: 'tbEmpresa',
    tbCCusto: 'tbCCusto',
    tbCadastro: 'tbCadastro',
    tbAccont: 'tbAccont',
    Session: 'Session',
    VerificationToken: 'VerificationToken'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tbUser" | "tbFuncionario" | "tbStatusFun" | "tbFuncao" | "tbPatrimonio" | "tbTipoPat" | "tbStatusPat" | "tbEmpresa" | "tbCCusto" | "tbCadastro" | "tbAccont" | "session" | "verificationToken"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      tbUser: {
        payload: Prisma.$tbUserPayload<ExtArgs>
        fields: Prisma.tbUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>
          }
          findFirst: {
            args: Prisma.tbUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>
          }
          findMany: {
            args: Prisma.tbUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>[]
          }
          create: {
            args: Prisma.tbUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>
          }
          createMany: {
            args: Prisma.tbUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>[]
          }
          delete: {
            args: Prisma.tbUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>
          }
          update: {
            args: Prisma.tbUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>
          }
          deleteMany: {
            args: Prisma.tbUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>[]
          }
          upsert: {
            args: Prisma.tbUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbUserPayload>
          }
          aggregate: {
            args: Prisma.TbUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbUser>
          }
          groupBy: {
            args: Prisma.tbUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbUserCountArgs<ExtArgs>
            result: $Utils.Optional<TbUserCountAggregateOutputType> | number
          }
        }
      }
      tbFuncionario: {
        payload: Prisma.$tbFuncionarioPayload<ExtArgs>
        fields: Prisma.tbFuncionarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbFuncionarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbFuncionarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>
          }
          findFirst: {
            args: Prisma.tbFuncionarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbFuncionarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>
          }
          findMany: {
            args: Prisma.tbFuncionarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>[]
          }
          create: {
            args: Prisma.tbFuncionarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>
          }
          createMany: {
            args: Prisma.tbFuncionarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbFuncionarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>[]
          }
          delete: {
            args: Prisma.tbFuncionarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>
          }
          update: {
            args: Prisma.tbFuncionarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>
          }
          deleteMany: {
            args: Prisma.tbFuncionarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbFuncionarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbFuncionarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>[]
          }
          upsert: {
            args: Prisma.tbFuncionarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncionarioPayload>
          }
          aggregate: {
            args: Prisma.TbFuncionarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbFuncionario>
          }
          groupBy: {
            args: Prisma.tbFuncionarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbFuncionarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbFuncionarioCountArgs<ExtArgs>
            result: $Utils.Optional<TbFuncionarioCountAggregateOutputType> | number
          }
        }
      }
      tbStatusFun: {
        payload: Prisma.$tbStatusFunPayload<ExtArgs>
        fields: Prisma.tbStatusFunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbStatusFunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbStatusFunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>
          }
          findFirst: {
            args: Prisma.tbStatusFunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbStatusFunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>
          }
          findMany: {
            args: Prisma.tbStatusFunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>[]
          }
          create: {
            args: Prisma.tbStatusFunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>
          }
          createMany: {
            args: Prisma.tbStatusFunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbStatusFunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>[]
          }
          delete: {
            args: Prisma.tbStatusFunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>
          }
          update: {
            args: Prisma.tbStatusFunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>
          }
          deleteMany: {
            args: Prisma.tbStatusFunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbStatusFunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbStatusFunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>[]
          }
          upsert: {
            args: Prisma.tbStatusFunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusFunPayload>
          }
          aggregate: {
            args: Prisma.TbStatusFunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbStatusFun>
          }
          groupBy: {
            args: Prisma.tbStatusFunGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbStatusFunGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbStatusFunCountArgs<ExtArgs>
            result: $Utils.Optional<TbStatusFunCountAggregateOutputType> | number
          }
        }
      }
      tbFuncao: {
        payload: Prisma.$tbFuncaoPayload<ExtArgs>
        fields: Prisma.tbFuncaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbFuncaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbFuncaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>
          }
          findFirst: {
            args: Prisma.tbFuncaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbFuncaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>
          }
          findMany: {
            args: Prisma.tbFuncaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>[]
          }
          create: {
            args: Prisma.tbFuncaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>
          }
          createMany: {
            args: Prisma.tbFuncaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbFuncaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>[]
          }
          delete: {
            args: Prisma.tbFuncaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>
          }
          update: {
            args: Prisma.tbFuncaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>
          }
          deleteMany: {
            args: Prisma.tbFuncaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbFuncaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbFuncaoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>[]
          }
          upsert: {
            args: Prisma.tbFuncaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbFuncaoPayload>
          }
          aggregate: {
            args: Prisma.TbFuncaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbFuncao>
          }
          groupBy: {
            args: Prisma.tbFuncaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbFuncaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbFuncaoCountArgs<ExtArgs>
            result: $Utils.Optional<TbFuncaoCountAggregateOutputType> | number
          }
        }
      }
      tbPatrimonio: {
        payload: Prisma.$tbPatrimonioPayload<ExtArgs>
        fields: Prisma.tbPatrimonioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbPatrimonioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbPatrimonioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>
          }
          findFirst: {
            args: Prisma.tbPatrimonioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbPatrimonioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>
          }
          findMany: {
            args: Prisma.tbPatrimonioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>[]
          }
          create: {
            args: Prisma.tbPatrimonioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>
          }
          createMany: {
            args: Prisma.tbPatrimonioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbPatrimonioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>[]
          }
          delete: {
            args: Prisma.tbPatrimonioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>
          }
          update: {
            args: Prisma.tbPatrimonioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>
          }
          deleteMany: {
            args: Prisma.tbPatrimonioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbPatrimonioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbPatrimonioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>[]
          }
          upsert: {
            args: Prisma.tbPatrimonioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbPatrimonioPayload>
          }
          aggregate: {
            args: Prisma.TbPatrimonioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbPatrimonio>
          }
          groupBy: {
            args: Prisma.tbPatrimonioGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbPatrimonioGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbPatrimonioCountArgs<ExtArgs>
            result: $Utils.Optional<TbPatrimonioCountAggregateOutputType> | number
          }
        }
      }
      tbTipoPat: {
        payload: Prisma.$tbTipoPatPayload<ExtArgs>
        fields: Prisma.tbTipoPatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbTipoPatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbTipoPatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>
          }
          findFirst: {
            args: Prisma.tbTipoPatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbTipoPatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>
          }
          findMany: {
            args: Prisma.tbTipoPatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>[]
          }
          create: {
            args: Prisma.tbTipoPatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>
          }
          createMany: {
            args: Prisma.tbTipoPatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbTipoPatCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>[]
          }
          delete: {
            args: Prisma.tbTipoPatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>
          }
          update: {
            args: Prisma.tbTipoPatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>
          }
          deleteMany: {
            args: Prisma.tbTipoPatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbTipoPatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbTipoPatUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>[]
          }
          upsert: {
            args: Prisma.tbTipoPatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbTipoPatPayload>
          }
          aggregate: {
            args: Prisma.TbTipoPatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbTipoPat>
          }
          groupBy: {
            args: Prisma.tbTipoPatGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbTipoPatGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbTipoPatCountArgs<ExtArgs>
            result: $Utils.Optional<TbTipoPatCountAggregateOutputType> | number
          }
        }
      }
      tbStatusPat: {
        payload: Prisma.$tbStatusPatPayload<ExtArgs>
        fields: Prisma.tbStatusPatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbStatusPatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbStatusPatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>
          }
          findFirst: {
            args: Prisma.tbStatusPatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbStatusPatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>
          }
          findMany: {
            args: Prisma.tbStatusPatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>[]
          }
          create: {
            args: Prisma.tbStatusPatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>
          }
          createMany: {
            args: Prisma.tbStatusPatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbStatusPatCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>[]
          }
          delete: {
            args: Prisma.tbStatusPatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>
          }
          update: {
            args: Prisma.tbStatusPatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>
          }
          deleteMany: {
            args: Prisma.tbStatusPatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbStatusPatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbStatusPatUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>[]
          }
          upsert: {
            args: Prisma.tbStatusPatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbStatusPatPayload>
          }
          aggregate: {
            args: Prisma.TbStatusPatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbStatusPat>
          }
          groupBy: {
            args: Prisma.tbStatusPatGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbStatusPatGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbStatusPatCountArgs<ExtArgs>
            result: $Utils.Optional<TbStatusPatCountAggregateOutputType> | number
          }
        }
      }
      tbEmpresa: {
        payload: Prisma.$tbEmpresaPayload<ExtArgs>
        fields: Prisma.tbEmpresaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbEmpresaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbEmpresaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>
          }
          findFirst: {
            args: Prisma.tbEmpresaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbEmpresaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>
          }
          findMany: {
            args: Prisma.tbEmpresaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>[]
          }
          create: {
            args: Prisma.tbEmpresaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>
          }
          createMany: {
            args: Prisma.tbEmpresaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbEmpresaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>[]
          }
          delete: {
            args: Prisma.tbEmpresaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>
          }
          update: {
            args: Prisma.tbEmpresaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>
          }
          deleteMany: {
            args: Prisma.tbEmpresaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbEmpresaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbEmpresaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>[]
          }
          upsert: {
            args: Prisma.tbEmpresaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbEmpresaPayload>
          }
          aggregate: {
            args: Prisma.TbEmpresaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbEmpresa>
          }
          groupBy: {
            args: Prisma.tbEmpresaGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbEmpresaGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbEmpresaCountArgs<ExtArgs>
            result: $Utils.Optional<TbEmpresaCountAggregateOutputType> | number
          }
        }
      }
      tbCCusto: {
        payload: Prisma.$tbCCustoPayload<ExtArgs>
        fields: Prisma.tbCCustoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbCCustoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbCCustoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>
          }
          findFirst: {
            args: Prisma.tbCCustoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbCCustoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>
          }
          findMany: {
            args: Prisma.tbCCustoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>[]
          }
          create: {
            args: Prisma.tbCCustoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>
          }
          createMany: {
            args: Prisma.tbCCustoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbCCustoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>[]
          }
          delete: {
            args: Prisma.tbCCustoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>
          }
          update: {
            args: Prisma.tbCCustoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>
          }
          deleteMany: {
            args: Prisma.tbCCustoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbCCustoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbCCustoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>[]
          }
          upsert: {
            args: Prisma.tbCCustoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCCustoPayload>
          }
          aggregate: {
            args: Prisma.TbCCustoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbCCusto>
          }
          groupBy: {
            args: Prisma.tbCCustoGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbCCustoGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbCCustoCountArgs<ExtArgs>
            result: $Utils.Optional<TbCCustoCountAggregateOutputType> | number
          }
        }
      }
      tbCadastro: {
        payload: Prisma.$tbCadastroPayload<ExtArgs>
        fields: Prisma.tbCadastroFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbCadastroFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbCadastroFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>
          }
          findFirst: {
            args: Prisma.tbCadastroFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbCadastroFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>
          }
          findMany: {
            args: Prisma.tbCadastroFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>[]
          }
          create: {
            args: Prisma.tbCadastroCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>
          }
          createMany: {
            args: Prisma.tbCadastroCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbCadastroCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>[]
          }
          delete: {
            args: Prisma.tbCadastroDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>
          }
          update: {
            args: Prisma.tbCadastroUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>
          }
          deleteMany: {
            args: Prisma.tbCadastroDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbCadastroUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbCadastroUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>[]
          }
          upsert: {
            args: Prisma.tbCadastroUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbCadastroPayload>
          }
          aggregate: {
            args: Prisma.TbCadastroAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbCadastro>
          }
          groupBy: {
            args: Prisma.tbCadastroGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbCadastroGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbCadastroCountArgs<ExtArgs>
            result: $Utils.Optional<TbCadastroCountAggregateOutputType> | number
          }
        }
      }
      tbAccont: {
        payload: Prisma.$tbAccontPayload<ExtArgs>
        fields: Prisma.tbAccontFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tbAccontFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tbAccontFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>
          }
          findFirst: {
            args: Prisma.tbAccontFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tbAccontFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>
          }
          findMany: {
            args: Prisma.tbAccontFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>[]
          }
          create: {
            args: Prisma.tbAccontCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>
          }
          createMany: {
            args: Prisma.tbAccontCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tbAccontCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>[]
          }
          delete: {
            args: Prisma.tbAccontDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>
          }
          update: {
            args: Prisma.tbAccontUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>
          }
          deleteMany: {
            args: Prisma.tbAccontDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tbAccontUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tbAccontUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>[]
          }
          upsert: {
            args: Prisma.tbAccontUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tbAccontPayload>
          }
          aggregate: {
            args: Prisma.TbAccontAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbAccont>
          }
          groupBy: {
            args: Prisma.tbAccontGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbAccontGroupByOutputType>[]
          }
          count: {
            args: Prisma.tbAccontCountArgs<ExtArgs>
            result: $Utils.Optional<TbAccontCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tbUser?: tbUserOmit
    tbFuncionario?: tbFuncionarioOmit
    tbStatusFun?: tbStatusFunOmit
    tbFuncao?: tbFuncaoOmit
    tbPatrimonio?: tbPatrimonioOmit
    tbTipoPat?: tbTipoPatOmit
    tbStatusPat?: tbStatusPatOmit
    tbEmpresa?: tbEmpresaOmit
    tbCCusto?: tbCCustoOmit
    tbCadastro?: tbCadastroOmit
    tbAccont?: tbAccontOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TbUserCountOutputType
   */

  export type TbUserCountOutputType = {
    tbFuncioanrio: number
    tbAcconts: number
    Session: number
  }

  export type TbUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbFuncioanrio?: boolean | TbUserCountOutputTypeCountTbFuncioanrioArgs
    tbAcconts?: boolean | TbUserCountOutputTypeCountTbAccontsArgs
    Session?: boolean | TbUserCountOutputTypeCountSessionArgs
  }

  // Custom InputTypes
  /**
   * TbUserCountOutputType without action
   */
  export type TbUserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbUserCountOutputType
     */
    select?: TbUserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbUserCountOutputType without action
   */
  export type TbUserCountOutputTypeCountTbFuncioanrioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbFuncionarioWhereInput
  }

  /**
   * TbUserCountOutputType without action
   */
  export type TbUserCountOutputTypeCountTbAccontsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbAccontWhereInput
  }

  /**
   * TbUserCountOutputType without action
   */
  export type TbUserCountOutputTypeCountSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type TbFuncionarioCountOutputType
   */

  export type TbFuncionarioCountOutputType = {
    tbCadastro: number
  }

  export type TbFuncionarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbCadastro?: boolean | TbFuncionarioCountOutputTypeCountTbCadastroArgs
  }

  // Custom InputTypes
  /**
   * TbFuncionarioCountOutputType without action
   */
  export type TbFuncionarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbFuncionarioCountOutputType
     */
    select?: TbFuncionarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbFuncionarioCountOutputType without action
   */
  export type TbFuncionarioCountOutputTypeCountTbCadastroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbCadastroWhereInput
  }


  /**
   * Count Type TbStatusFunCountOutputType
   */

  export type TbStatusFunCountOutputType = {
    tbFuncionario: number
  }

  export type TbStatusFunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbFuncionario?: boolean | TbStatusFunCountOutputTypeCountTbFuncionarioArgs
  }

  // Custom InputTypes
  /**
   * TbStatusFunCountOutputType without action
   */
  export type TbStatusFunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbStatusFunCountOutputType
     */
    select?: TbStatusFunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbStatusFunCountOutputType without action
   */
  export type TbStatusFunCountOutputTypeCountTbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbFuncionarioWhereInput
  }


  /**
   * Count Type TbFuncaoCountOutputType
   */

  export type TbFuncaoCountOutputType = {
    tbFuncionario: number
  }

  export type TbFuncaoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbFuncionario?: boolean | TbFuncaoCountOutputTypeCountTbFuncionarioArgs
  }

  // Custom InputTypes
  /**
   * TbFuncaoCountOutputType without action
   */
  export type TbFuncaoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbFuncaoCountOutputType
     */
    select?: TbFuncaoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbFuncaoCountOutputType without action
   */
  export type TbFuncaoCountOutputTypeCountTbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbFuncionarioWhereInput
  }


  /**
   * Count Type TbPatrimonioCountOutputType
   */

  export type TbPatrimonioCountOutputType = {
    tbCadastro: number
  }

  export type TbPatrimonioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbCadastro?: boolean | TbPatrimonioCountOutputTypeCountTbCadastroArgs
  }

  // Custom InputTypes
  /**
   * TbPatrimonioCountOutputType without action
   */
  export type TbPatrimonioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbPatrimonioCountOutputType
     */
    select?: TbPatrimonioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbPatrimonioCountOutputType without action
   */
  export type TbPatrimonioCountOutputTypeCountTbCadastroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbCadastroWhereInput
  }


  /**
   * Count Type TbTipoPatCountOutputType
   */

  export type TbTipoPatCountOutputType = {
    tbPatrimonio: number
  }

  export type TbTipoPatCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | TbTipoPatCountOutputTypeCountTbPatrimonioArgs
  }

  // Custom InputTypes
  /**
   * TbTipoPatCountOutputType without action
   */
  export type TbTipoPatCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbTipoPatCountOutputType
     */
    select?: TbTipoPatCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbTipoPatCountOutputType without action
   */
  export type TbTipoPatCountOutputTypeCountTbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbPatrimonioWhereInput
  }


  /**
   * Count Type TbStatusPatCountOutputType
   */

  export type TbStatusPatCountOutputType = {
    tbPatrimonio: number
  }

  export type TbStatusPatCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | TbStatusPatCountOutputTypeCountTbPatrimonioArgs
  }

  // Custom InputTypes
  /**
   * TbStatusPatCountOutputType without action
   */
  export type TbStatusPatCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbStatusPatCountOutputType
     */
    select?: TbStatusPatCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbStatusPatCountOutputType without action
   */
  export type TbStatusPatCountOutputTypeCountTbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbPatrimonioWhereInput
  }


  /**
   * Count Type TbEmpresaCountOutputType
   */

  export type TbEmpresaCountOutputType = {
    tbCCusto: number
  }

  export type TbEmpresaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbCCusto?: boolean | TbEmpresaCountOutputTypeCountTbCCustoArgs
  }

  // Custom InputTypes
  /**
   * TbEmpresaCountOutputType without action
   */
  export type TbEmpresaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbEmpresaCountOutputType
     */
    select?: TbEmpresaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbEmpresaCountOutputType without action
   */
  export type TbEmpresaCountOutputTypeCountTbCCustoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbCCustoWhereInput
  }


  /**
   * Count Type TbCCustoCountOutputType
   */

  export type TbCCustoCountOutputType = {
    tbPatrimonio: number
    tbFuncionario: number
  }

  export type TbCCustoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | TbCCustoCountOutputTypeCountTbPatrimonioArgs
    tbFuncionario?: boolean | TbCCustoCountOutputTypeCountTbFuncionarioArgs
  }

  // Custom InputTypes
  /**
   * TbCCustoCountOutputType without action
   */
  export type TbCCustoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCCustoCountOutputType
     */
    select?: TbCCustoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TbCCustoCountOutputType without action
   */
  export type TbCCustoCountOutputTypeCountTbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbPatrimonioWhereInput
  }

  /**
   * TbCCustoCountOutputType without action
   */
  export type TbCCustoCountOutputTypeCountTbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbFuncionarioWhereInput
  }


  /**
   * Models
   */

  /**
   * Model tbUser
   */

  export type AggregateTbUser = {
    _count: TbUserCountAggregateOutputType | null
    _min: TbUserMinAggregateOutputType | null
    _max: TbUserMaxAggregateOutputType | null
  }

  export type TbUserMinAggregateOutputType = {
    idU: string | null
    idUser: string | null
    nomeUser: string | null
    emailUser: string | null
    senhaUser: string | null
    avatarUser: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TbUserMaxAggregateOutputType = {
    idU: string | null
    idUser: string | null
    nomeUser: string | null
    emailUser: string | null
    senhaUser: string | null
    avatarUser: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TbUserCountAggregateOutputType = {
    idU: number
    idUser: number
    nomeUser: number
    emailUser: number
    senhaUser: number
    avatarUser: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TbUserMinAggregateInputType = {
    idU?: true
    idUser?: true
    nomeUser?: true
    emailUser?: true
    senhaUser?: true
    avatarUser?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TbUserMaxAggregateInputType = {
    idU?: true
    idUser?: true
    nomeUser?: true
    emailUser?: true
    senhaUser?: true
    avatarUser?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TbUserCountAggregateInputType = {
    idU?: true
    idUser?: true
    nomeUser?: true
    emailUser?: true
    senhaUser?: true
    avatarUser?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TbUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbUser to aggregate.
     */
    where?: tbUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbUsers to fetch.
     */
    orderBy?: tbUserOrderByWithRelationInput | tbUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbUsers
    **/
    _count?: true | TbUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbUserMaxAggregateInputType
  }

  export type GetTbUserAggregateType<T extends TbUserAggregateArgs> = {
        [P in keyof T & keyof AggregateTbUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbUser[P]>
      : GetScalarType<T[P], AggregateTbUser[P]>
  }




  export type tbUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbUserWhereInput
    orderBy?: tbUserOrderByWithAggregationInput | tbUserOrderByWithAggregationInput[]
    by: TbUserScalarFieldEnum[] | TbUserScalarFieldEnum
    having?: tbUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbUserCountAggregateInputType | true
    _min?: TbUserMinAggregateInputType
    _max?: TbUserMaxAggregateInputType
  }

  export type TbUserGroupByOutputType = {
    idU: string
    idUser: string | null
    nomeUser: string | null
    emailUser: string | null
    senhaUser: string | null
    avatarUser: string | null
    createdAt: Date
    updatedAt: Date
    _count: TbUserCountAggregateOutputType | null
    _min: TbUserMinAggregateOutputType | null
    _max: TbUserMaxAggregateOutputType | null
  }

  type GetTbUserGroupByPayload<T extends tbUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbUserGroupByOutputType[P]>
            : GetScalarType<T[P], TbUserGroupByOutputType[P]>
        }
      >
    >


  export type tbUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idU?: boolean
    idUser?: boolean
    nomeUser?: boolean
    emailUser?: boolean
    senhaUser?: boolean
    avatarUser?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tbFuncioanrio?: boolean | tbUser$tbFuncioanrioArgs<ExtArgs>
    tbAcconts?: boolean | tbUser$tbAccontsArgs<ExtArgs>
    Session?: boolean | tbUser$SessionArgs<ExtArgs>
    _count?: boolean | TbUserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbUser"]>

  export type tbUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idU?: boolean
    idUser?: boolean
    nomeUser?: boolean
    emailUser?: boolean
    senhaUser?: boolean
    avatarUser?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tbUser"]>

  export type tbUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idU?: boolean
    idUser?: boolean
    nomeUser?: boolean
    emailUser?: boolean
    senhaUser?: boolean
    avatarUser?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tbUser"]>

  export type tbUserSelectScalar = {
    idU?: boolean
    idUser?: boolean
    nomeUser?: boolean
    emailUser?: boolean
    senhaUser?: boolean
    avatarUser?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type tbUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idU" | "idUser" | "nomeUser" | "emailUser" | "senhaUser" | "avatarUser" | "createdAt" | "updatedAt", ExtArgs["result"]["tbUser"]>
  export type tbUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbFuncioanrio?: boolean | tbUser$tbFuncioanrioArgs<ExtArgs>
    tbAcconts?: boolean | tbUser$tbAccontsArgs<ExtArgs>
    Session?: boolean | tbUser$SessionArgs<ExtArgs>
    _count?: boolean | TbUserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type tbUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $tbUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbUser"
    objects: {
      tbFuncioanrio: Prisma.$tbFuncionarioPayload<ExtArgs>[]
      tbAcconts: Prisma.$tbAccontPayload<ExtArgs>[]
      Session: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idU: string
      idUser: string | null
      nomeUser: string | null
      emailUser: string | null
      senhaUser: string | null
      avatarUser: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tbUser"]>
    composites: {}
  }

  type tbUserGetPayload<S extends boolean | null | undefined | tbUserDefaultArgs> = $Result.GetResult<Prisma.$tbUserPayload, S>

  type tbUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbUserCountAggregateInputType | true
    }

  export interface tbUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbUser'], meta: { name: 'tbUser' } }
    /**
     * Find zero or one TbUser that matches the filter.
     * @param {tbUserFindUniqueArgs} args - Arguments to find a TbUser
     * @example
     * // Get one TbUser
     * const tbUser = await prisma.tbUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbUserFindUniqueArgs>(args: SelectSubset<T, tbUserFindUniqueArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbUserFindUniqueOrThrowArgs} args - Arguments to find a TbUser
     * @example
     * // Get one TbUser
     * const tbUser = await prisma.tbUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbUserFindUniqueOrThrowArgs>(args: SelectSubset<T, tbUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbUserFindFirstArgs} args - Arguments to find a TbUser
     * @example
     * // Get one TbUser
     * const tbUser = await prisma.tbUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbUserFindFirstArgs>(args?: SelectSubset<T, tbUserFindFirstArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbUserFindFirstOrThrowArgs} args - Arguments to find a TbUser
     * @example
     * // Get one TbUser
     * const tbUser = await prisma.tbUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbUserFindFirstOrThrowArgs>(args?: SelectSubset<T, tbUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbUsers
     * const tbUsers = await prisma.tbUser.findMany()
     * 
     * // Get first 10 TbUsers
     * const tbUsers = await prisma.tbUser.findMany({ take: 10 })
     * 
     * // Only select the `idU`
     * const tbUserWithIdUOnly = await prisma.tbUser.findMany({ select: { idU: true } })
     * 
     */
    findMany<T extends tbUserFindManyArgs>(args?: SelectSubset<T, tbUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbUser.
     * @param {tbUserCreateArgs} args - Arguments to create a TbUser.
     * @example
     * // Create one TbUser
     * const TbUser = await prisma.tbUser.create({
     *   data: {
     *     // ... data to create a TbUser
     *   }
     * })
     * 
     */
    create<T extends tbUserCreateArgs>(args: SelectSubset<T, tbUserCreateArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbUsers.
     * @param {tbUserCreateManyArgs} args - Arguments to create many TbUsers.
     * @example
     * // Create many TbUsers
     * const tbUser = await prisma.tbUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbUserCreateManyArgs>(args?: SelectSubset<T, tbUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbUsers and returns the data saved in the database.
     * @param {tbUserCreateManyAndReturnArgs} args - Arguments to create many TbUsers.
     * @example
     * // Create many TbUsers
     * const tbUser = await prisma.tbUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbUsers and only return the `idU`
     * const tbUserWithIdUOnly = await prisma.tbUser.createManyAndReturn({
     *   select: { idU: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbUserCreateManyAndReturnArgs>(args?: SelectSubset<T, tbUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbUser.
     * @param {tbUserDeleteArgs} args - Arguments to delete one TbUser.
     * @example
     * // Delete one TbUser
     * const TbUser = await prisma.tbUser.delete({
     *   where: {
     *     // ... filter to delete one TbUser
     *   }
     * })
     * 
     */
    delete<T extends tbUserDeleteArgs>(args: SelectSubset<T, tbUserDeleteArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbUser.
     * @param {tbUserUpdateArgs} args - Arguments to update one TbUser.
     * @example
     * // Update one TbUser
     * const tbUser = await prisma.tbUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbUserUpdateArgs>(args: SelectSubset<T, tbUserUpdateArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbUsers.
     * @param {tbUserDeleteManyArgs} args - Arguments to filter TbUsers to delete.
     * @example
     * // Delete a few TbUsers
     * const { count } = await prisma.tbUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbUserDeleteManyArgs>(args?: SelectSubset<T, tbUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbUsers
     * const tbUser = await prisma.tbUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbUserUpdateManyArgs>(args: SelectSubset<T, tbUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbUsers and returns the data updated in the database.
     * @param {tbUserUpdateManyAndReturnArgs} args - Arguments to update many TbUsers.
     * @example
     * // Update many TbUsers
     * const tbUser = await prisma.tbUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbUsers and only return the `idU`
     * const tbUserWithIdUOnly = await prisma.tbUser.updateManyAndReturn({
     *   select: { idU: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbUserUpdateManyAndReturnArgs>(args: SelectSubset<T, tbUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbUser.
     * @param {tbUserUpsertArgs} args - Arguments to update or create a TbUser.
     * @example
     * // Update or create a TbUser
     * const tbUser = await prisma.tbUser.upsert({
     *   create: {
     *     // ... data to create a TbUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbUser we want to update
     *   }
     * })
     */
    upsert<T extends tbUserUpsertArgs>(args: SelectSubset<T, tbUserUpsertArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbUserCountArgs} args - Arguments to filter TbUsers to count.
     * @example
     * // Count the number of TbUsers
     * const count = await prisma.tbUser.count({
     *   where: {
     *     // ... the filter for the TbUsers we want to count
     *   }
     * })
    **/
    count<T extends tbUserCountArgs>(
      args?: Subset<T, tbUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbUserAggregateArgs>(args: Subset<T, TbUserAggregateArgs>): Prisma.PrismaPromise<GetTbUserAggregateType<T>>

    /**
     * Group by TbUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbUserGroupByArgs['orderBy'] }
        : { orderBy?: tbUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbUser model
   */
  readonly fields: tbUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbFuncioanrio<T extends tbUser$tbFuncioanrioArgs<ExtArgs> = {}>(args?: Subset<T, tbUser$tbFuncioanrioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tbAcconts<T extends tbUser$tbAccontsArgs<ExtArgs> = {}>(args?: Subset<T, tbUser$tbAccontsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Session<T extends tbUser$SessionArgs<ExtArgs> = {}>(args?: Subset<T, tbUser$SessionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbUser model
   */
  interface tbUserFieldRefs {
    readonly idU: FieldRef<"tbUser", 'String'>
    readonly idUser: FieldRef<"tbUser", 'String'>
    readonly nomeUser: FieldRef<"tbUser", 'String'>
    readonly emailUser: FieldRef<"tbUser", 'String'>
    readonly senhaUser: FieldRef<"tbUser", 'String'>
    readonly avatarUser: FieldRef<"tbUser", 'String'>
    readonly createdAt: FieldRef<"tbUser", 'DateTime'>
    readonly updatedAt: FieldRef<"tbUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * tbUser findUnique
   */
  export type tbUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * Filter, which tbUser to fetch.
     */
    where: tbUserWhereUniqueInput
  }

  /**
   * tbUser findUniqueOrThrow
   */
  export type tbUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * Filter, which tbUser to fetch.
     */
    where: tbUserWhereUniqueInput
  }

  /**
   * tbUser findFirst
   */
  export type tbUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * Filter, which tbUser to fetch.
     */
    where?: tbUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbUsers to fetch.
     */
    orderBy?: tbUserOrderByWithRelationInput | tbUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbUsers.
     */
    cursor?: tbUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbUsers.
     */
    distinct?: TbUserScalarFieldEnum | TbUserScalarFieldEnum[]
  }

  /**
   * tbUser findFirstOrThrow
   */
  export type tbUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * Filter, which tbUser to fetch.
     */
    where?: tbUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbUsers to fetch.
     */
    orderBy?: tbUserOrderByWithRelationInput | tbUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbUsers.
     */
    cursor?: tbUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbUsers.
     */
    distinct?: TbUserScalarFieldEnum | TbUserScalarFieldEnum[]
  }

  /**
   * tbUser findMany
   */
  export type tbUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * Filter, which tbUsers to fetch.
     */
    where?: tbUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbUsers to fetch.
     */
    orderBy?: tbUserOrderByWithRelationInput | tbUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbUsers.
     */
    cursor?: tbUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbUsers.
     */
    skip?: number
    distinct?: TbUserScalarFieldEnum | TbUserScalarFieldEnum[]
  }

  /**
   * tbUser create
   */
  export type tbUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * The data needed to create a tbUser.
     */
    data: XOR<tbUserCreateInput, tbUserUncheckedCreateInput>
  }

  /**
   * tbUser createMany
   */
  export type tbUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbUsers.
     */
    data: tbUserCreateManyInput | tbUserCreateManyInput[]
  }

  /**
   * tbUser createManyAndReturn
   */
  export type tbUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * The data used to create many tbUsers.
     */
    data: tbUserCreateManyInput | tbUserCreateManyInput[]
  }

  /**
   * tbUser update
   */
  export type tbUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * The data needed to update a tbUser.
     */
    data: XOR<tbUserUpdateInput, tbUserUncheckedUpdateInput>
    /**
     * Choose, which tbUser to update.
     */
    where: tbUserWhereUniqueInput
  }

  /**
   * tbUser updateMany
   */
  export type tbUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbUsers.
     */
    data: XOR<tbUserUpdateManyMutationInput, tbUserUncheckedUpdateManyInput>
    /**
     * Filter which tbUsers to update
     */
    where?: tbUserWhereInput
    /**
     * Limit how many tbUsers to update.
     */
    limit?: number
  }

  /**
   * tbUser updateManyAndReturn
   */
  export type tbUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * The data used to update tbUsers.
     */
    data: XOR<tbUserUpdateManyMutationInput, tbUserUncheckedUpdateManyInput>
    /**
     * Filter which tbUsers to update
     */
    where?: tbUserWhereInput
    /**
     * Limit how many tbUsers to update.
     */
    limit?: number
  }

  /**
   * tbUser upsert
   */
  export type tbUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * The filter to search for the tbUser to update in case it exists.
     */
    where: tbUserWhereUniqueInput
    /**
     * In case the tbUser found by the `where` argument doesn't exist, create a new tbUser with this data.
     */
    create: XOR<tbUserCreateInput, tbUserUncheckedCreateInput>
    /**
     * In case the tbUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbUserUpdateInput, tbUserUncheckedUpdateInput>
  }

  /**
   * tbUser delete
   */
  export type tbUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    /**
     * Filter which tbUser to delete.
     */
    where: tbUserWhereUniqueInput
  }

  /**
   * tbUser deleteMany
   */
  export type tbUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbUsers to delete
     */
    where?: tbUserWhereInput
    /**
     * Limit how many tbUsers to delete.
     */
    limit?: number
  }

  /**
   * tbUser.tbFuncioanrio
   */
  export type tbUser$tbFuncioanrioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    where?: tbFuncionarioWhereInput
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    cursor?: tbFuncionarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbUser.tbAcconts
   */
  export type tbUser$tbAccontsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    where?: tbAccontWhereInput
    orderBy?: tbAccontOrderByWithRelationInput | tbAccontOrderByWithRelationInput[]
    cursor?: tbAccontWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbAccontScalarFieldEnum | TbAccontScalarFieldEnum[]
  }

  /**
   * tbUser.Session
   */
  export type tbUser$SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * tbUser without action
   */
  export type tbUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
  }


  /**
   * Model tbFuncionario
   */

  export type AggregateTbFuncionario = {
    _count: TbFuncionarioCountAggregateOutputType | null
    _min: TbFuncionarioMinAggregateOutputType | null
    _max: TbFuncionarioMaxAggregateOutputType | null
  }

  export type TbFuncionarioMinAggregateOutputType = {
    idF: string | null
    idMatFun: string | null
    nomeFun: string | null
    cpfFun: string | null
    dataAdmFun: Date | null
    dataDesFun: Date | null
    avatarFun: string | null
    idFuncaoFun: string | null
    idUserFun: string | null
    idStatusFun: string | null
    idCustoFun: string | null
  }

  export type TbFuncionarioMaxAggregateOutputType = {
    idF: string | null
    idMatFun: string | null
    nomeFun: string | null
    cpfFun: string | null
    dataAdmFun: Date | null
    dataDesFun: Date | null
    avatarFun: string | null
    idFuncaoFun: string | null
    idUserFun: string | null
    idStatusFun: string | null
    idCustoFun: string | null
  }

  export type TbFuncionarioCountAggregateOutputType = {
    idF: number
    idMatFun: number
    nomeFun: number
    cpfFun: number
    dataAdmFun: number
    dataDesFun: number
    avatarFun: number
    idFuncaoFun: number
    idUserFun: number
    idStatusFun: number
    idCustoFun: number
    _all: number
  }


  export type TbFuncionarioMinAggregateInputType = {
    idF?: true
    idMatFun?: true
    nomeFun?: true
    cpfFun?: true
    dataAdmFun?: true
    dataDesFun?: true
    avatarFun?: true
    idFuncaoFun?: true
    idUserFun?: true
    idStatusFun?: true
    idCustoFun?: true
  }

  export type TbFuncionarioMaxAggregateInputType = {
    idF?: true
    idMatFun?: true
    nomeFun?: true
    cpfFun?: true
    dataAdmFun?: true
    dataDesFun?: true
    avatarFun?: true
    idFuncaoFun?: true
    idUserFun?: true
    idStatusFun?: true
    idCustoFun?: true
  }

  export type TbFuncionarioCountAggregateInputType = {
    idF?: true
    idMatFun?: true
    nomeFun?: true
    cpfFun?: true
    dataAdmFun?: true
    dataDesFun?: true
    avatarFun?: true
    idFuncaoFun?: true
    idUserFun?: true
    idStatusFun?: true
    idCustoFun?: true
    _all?: true
  }

  export type TbFuncionarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbFuncionario to aggregate.
     */
    where?: tbFuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncionarios to fetch.
     */
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbFuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncionarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbFuncionarios
    **/
    _count?: true | TbFuncionarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbFuncionarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbFuncionarioMaxAggregateInputType
  }

  export type GetTbFuncionarioAggregateType<T extends TbFuncionarioAggregateArgs> = {
        [P in keyof T & keyof AggregateTbFuncionario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbFuncionario[P]>
      : GetScalarType<T[P], AggregateTbFuncionario[P]>
  }




  export type tbFuncionarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbFuncionarioWhereInput
    orderBy?: tbFuncionarioOrderByWithAggregationInput | tbFuncionarioOrderByWithAggregationInput[]
    by: TbFuncionarioScalarFieldEnum[] | TbFuncionarioScalarFieldEnum
    having?: tbFuncionarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbFuncionarioCountAggregateInputType | true
    _min?: TbFuncionarioMinAggregateInputType
    _max?: TbFuncionarioMaxAggregateInputType
  }

  export type TbFuncionarioGroupByOutputType = {
    idF: string
    idMatFun: string
    nomeFun: string
    cpfFun: string | null
    dataAdmFun: Date | null
    dataDesFun: Date | null
    avatarFun: string | null
    idFuncaoFun: string | null
    idUserFun: string | null
    idStatusFun: string | null
    idCustoFun: string | null
    _count: TbFuncionarioCountAggregateOutputType | null
    _min: TbFuncionarioMinAggregateOutputType | null
    _max: TbFuncionarioMaxAggregateOutputType | null
  }

  type GetTbFuncionarioGroupByPayload<T extends tbFuncionarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbFuncionarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbFuncionarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbFuncionarioGroupByOutputType[P]>
            : GetScalarType<T[P], TbFuncionarioGroupByOutputType[P]>
        }
      >
    >


  export type tbFuncionarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idF?: boolean
    idMatFun?: boolean
    nomeFun?: boolean
    cpfFun?: boolean
    dataAdmFun?: boolean
    dataDesFun?: boolean
    avatarFun?: boolean
    idFuncaoFun?: boolean
    idUserFun?: boolean
    idStatusFun?: boolean
    idCustoFun?: boolean
    tbStatusFun?: boolean | tbFuncionario$tbStatusFunArgs<ExtArgs>
    tbUser?: boolean | tbFuncionario$tbUserArgs<ExtArgs>
    tbFuncao?: boolean | tbFuncionario$tbFuncaoArgs<ExtArgs>
    tbCCusto?: boolean | tbFuncionario$tbCCustoArgs<ExtArgs>
    tbCadastro?: boolean | tbFuncionario$tbCadastroArgs<ExtArgs>
    _count?: boolean | TbFuncionarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbFuncionario"]>

  export type tbFuncionarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idF?: boolean
    idMatFun?: boolean
    nomeFun?: boolean
    cpfFun?: boolean
    dataAdmFun?: boolean
    dataDesFun?: boolean
    avatarFun?: boolean
    idFuncaoFun?: boolean
    idUserFun?: boolean
    idStatusFun?: boolean
    idCustoFun?: boolean
    tbStatusFun?: boolean | tbFuncionario$tbStatusFunArgs<ExtArgs>
    tbUser?: boolean | tbFuncionario$tbUserArgs<ExtArgs>
    tbFuncao?: boolean | tbFuncionario$tbFuncaoArgs<ExtArgs>
    tbCCusto?: boolean | tbFuncionario$tbCCustoArgs<ExtArgs>
  }, ExtArgs["result"]["tbFuncionario"]>

  export type tbFuncionarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idF?: boolean
    idMatFun?: boolean
    nomeFun?: boolean
    cpfFun?: boolean
    dataAdmFun?: boolean
    dataDesFun?: boolean
    avatarFun?: boolean
    idFuncaoFun?: boolean
    idUserFun?: boolean
    idStatusFun?: boolean
    idCustoFun?: boolean
    tbStatusFun?: boolean | tbFuncionario$tbStatusFunArgs<ExtArgs>
    tbUser?: boolean | tbFuncionario$tbUserArgs<ExtArgs>
    tbFuncao?: boolean | tbFuncionario$tbFuncaoArgs<ExtArgs>
    tbCCusto?: boolean | tbFuncionario$tbCCustoArgs<ExtArgs>
  }, ExtArgs["result"]["tbFuncionario"]>

  export type tbFuncionarioSelectScalar = {
    idF?: boolean
    idMatFun?: boolean
    nomeFun?: boolean
    cpfFun?: boolean
    dataAdmFun?: boolean
    dataDesFun?: boolean
    avatarFun?: boolean
    idFuncaoFun?: boolean
    idUserFun?: boolean
    idStatusFun?: boolean
    idCustoFun?: boolean
  }

  export type tbFuncionarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idF" | "idMatFun" | "nomeFun" | "cpfFun" | "dataAdmFun" | "dataDesFun" | "avatarFun" | "idFuncaoFun" | "idUserFun" | "idStatusFun" | "idCustoFun", ExtArgs["result"]["tbFuncionario"]>
  export type tbFuncionarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbStatusFun?: boolean | tbFuncionario$tbStatusFunArgs<ExtArgs>
    tbUser?: boolean | tbFuncionario$tbUserArgs<ExtArgs>
    tbFuncao?: boolean | tbFuncionario$tbFuncaoArgs<ExtArgs>
    tbCCusto?: boolean | tbFuncionario$tbCCustoArgs<ExtArgs>
    tbCadastro?: boolean | tbFuncionario$tbCadastroArgs<ExtArgs>
    _count?: boolean | TbFuncionarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbFuncionarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbStatusFun?: boolean | tbFuncionario$tbStatusFunArgs<ExtArgs>
    tbUser?: boolean | tbFuncionario$tbUserArgs<ExtArgs>
    tbFuncao?: boolean | tbFuncionario$tbFuncaoArgs<ExtArgs>
    tbCCusto?: boolean | tbFuncionario$tbCCustoArgs<ExtArgs>
  }
  export type tbFuncionarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbStatusFun?: boolean | tbFuncionario$tbStatusFunArgs<ExtArgs>
    tbUser?: boolean | tbFuncionario$tbUserArgs<ExtArgs>
    tbFuncao?: boolean | tbFuncionario$tbFuncaoArgs<ExtArgs>
    tbCCusto?: boolean | tbFuncionario$tbCCustoArgs<ExtArgs>
  }

  export type $tbFuncionarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbFuncionario"
    objects: {
      tbStatusFun: Prisma.$tbStatusFunPayload<ExtArgs> | null
      tbUser: Prisma.$tbUserPayload<ExtArgs> | null
      tbFuncao: Prisma.$tbFuncaoPayload<ExtArgs> | null
      tbCCusto: Prisma.$tbCCustoPayload<ExtArgs> | null
      tbCadastro: Prisma.$tbCadastroPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idF: string
      idMatFun: string
      nomeFun: string
      cpfFun: string | null
      dataAdmFun: Date | null
      dataDesFun: Date | null
      avatarFun: string | null
      idFuncaoFun: string | null
      idUserFun: string | null
      idStatusFun: string | null
      idCustoFun: string | null
    }, ExtArgs["result"]["tbFuncionario"]>
    composites: {}
  }

  type tbFuncionarioGetPayload<S extends boolean | null | undefined | tbFuncionarioDefaultArgs> = $Result.GetResult<Prisma.$tbFuncionarioPayload, S>

  type tbFuncionarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbFuncionarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbFuncionarioCountAggregateInputType | true
    }

  export interface tbFuncionarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbFuncionario'], meta: { name: 'tbFuncionario' } }
    /**
     * Find zero or one TbFuncionario that matches the filter.
     * @param {tbFuncionarioFindUniqueArgs} args - Arguments to find a TbFuncionario
     * @example
     * // Get one TbFuncionario
     * const tbFuncionario = await prisma.tbFuncionario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbFuncionarioFindUniqueArgs>(args: SelectSubset<T, tbFuncionarioFindUniqueArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbFuncionario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbFuncionarioFindUniqueOrThrowArgs} args - Arguments to find a TbFuncionario
     * @example
     * // Get one TbFuncionario
     * const tbFuncionario = await prisma.tbFuncionario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbFuncionarioFindUniqueOrThrowArgs>(args: SelectSubset<T, tbFuncionarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbFuncionario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncionarioFindFirstArgs} args - Arguments to find a TbFuncionario
     * @example
     * // Get one TbFuncionario
     * const tbFuncionario = await prisma.tbFuncionario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbFuncionarioFindFirstArgs>(args?: SelectSubset<T, tbFuncionarioFindFirstArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbFuncionario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncionarioFindFirstOrThrowArgs} args - Arguments to find a TbFuncionario
     * @example
     * // Get one TbFuncionario
     * const tbFuncionario = await prisma.tbFuncionario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbFuncionarioFindFirstOrThrowArgs>(args?: SelectSubset<T, tbFuncionarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbFuncionarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncionarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbFuncionarios
     * const tbFuncionarios = await prisma.tbFuncionario.findMany()
     * 
     * // Get first 10 TbFuncionarios
     * const tbFuncionarios = await prisma.tbFuncionario.findMany({ take: 10 })
     * 
     * // Only select the `idF`
     * const tbFuncionarioWithIdFOnly = await prisma.tbFuncionario.findMany({ select: { idF: true } })
     * 
     */
    findMany<T extends tbFuncionarioFindManyArgs>(args?: SelectSubset<T, tbFuncionarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbFuncionario.
     * @param {tbFuncionarioCreateArgs} args - Arguments to create a TbFuncionario.
     * @example
     * // Create one TbFuncionario
     * const TbFuncionario = await prisma.tbFuncionario.create({
     *   data: {
     *     // ... data to create a TbFuncionario
     *   }
     * })
     * 
     */
    create<T extends tbFuncionarioCreateArgs>(args: SelectSubset<T, tbFuncionarioCreateArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbFuncionarios.
     * @param {tbFuncionarioCreateManyArgs} args - Arguments to create many TbFuncionarios.
     * @example
     * // Create many TbFuncionarios
     * const tbFuncionario = await prisma.tbFuncionario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbFuncionarioCreateManyArgs>(args?: SelectSubset<T, tbFuncionarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbFuncionarios and returns the data saved in the database.
     * @param {tbFuncionarioCreateManyAndReturnArgs} args - Arguments to create many TbFuncionarios.
     * @example
     * // Create many TbFuncionarios
     * const tbFuncionario = await prisma.tbFuncionario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbFuncionarios and only return the `idF`
     * const tbFuncionarioWithIdFOnly = await prisma.tbFuncionario.createManyAndReturn({
     *   select: { idF: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbFuncionarioCreateManyAndReturnArgs>(args?: SelectSubset<T, tbFuncionarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbFuncionario.
     * @param {tbFuncionarioDeleteArgs} args - Arguments to delete one TbFuncionario.
     * @example
     * // Delete one TbFuncionario
     * const TbFuncionario = await prisma.tbFuncionario.delete({
     *   where: {
     *     // ... filter to delete one TbFuncionario
     *   }
     * })
     * 
     */
    delete<T extends tbFuncionarioDeleteArgs>(args: SelectSubset<T, tbFuncionarioDeleteArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbFuncionario.
     * @param {tbFuncionarioUpdateArgs} args - Arguments to update one TbFuncionario.
     * @example
     * // Update one TbFuncionario
     * const tbFuncionario = await prisma.tbFuncionario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbFuncionarioUpdateArgs>(args: SelectSubset<T, tbFuncionarioUpdateArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbFuncionarios.
     * @param {tbFuncionarioDeleteManyArgs} args - Arguments to filter TbFuncionarios to delete.
     * @example
     * // Delete a few TbFuncionarios
     * const { count } = await prisma.tbFuncionario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbFuncionarioDeleteManyArgs>(args?: SelectSubset<T, tbFuncionarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbFuncionarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncionarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbFuncionarios
     * const tbFuncionario = await prisma.tbFuncionario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbFuncionarioUpdateManyArgs>(args: SelectSubset<T, tbFuncionarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbFuncionarios and returns the data updated in the database.
     * @param {tbFuncionarioUpdateManyAndReturnArgs} args - Arguments to update many TbFuncionarios.
     * @example
     * // Update many TbFuncionarios
     * const tbFuncionario = await prisma.tbFuncionario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbFuncionarios and only return the `idF`
     * const tbFuncionarioWithIdFOnly = await prisma.tbFuncionario.updateManyAndReturn({
     *   select: { idF: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbFuncionarioUpdateManyAndReturnArgs>(args: SelectSubset<T, tbFuncionarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbFuncionario.
     * @param {tbFuncionarioUpsertArgs} args - Arguments to update or create a TbFuncionario.
     * @example
     * // Update or create a TbFuncionario
     * const tbFuncionario = await prisma.tbFuncionario.upsert({
     *   create: {
     *     // ... data to create a TbFuncionario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbFuncionario we want to update
     *   }
     * })
     */
    upsert<T extends tbFuncionarioUpsertArgs>(args: SelectSubset<T, tbFuncionarioUpsertArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbFuncionarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncionarioCountArgs} args - Arguments to filter TbFuncionarios to count.
     * @example
     * // Count the number of TbFuncionarios
     * const count = await prisma.tbFuncionario.count({
     *   where: {
     *     // ... the filter for the TbFuncionarios we want to count
     *   }
     * })
    **/
    count<T extends tbFuncionarioCountArgs>(
      args?: Subset<T, tbFuncionarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbFuncionarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbFuncionario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbFuncionarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbFuncionarioAggregateArgs>(args: Subset<T, TbFuncionarioAggregateArgs>): Prisma.PrismaPromise<GetTbFuncionarioAggregateType<T>>

    /**
     * Group by TbFuncionario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncionarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbFuncionarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbFuncionarioGroupByArgs['orderBy'] }
        : { orderBy?: tbFuncionarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbFuncionarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbFuncionarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbFuncionario model
   */
  readonly fields: tbFuncionarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbFuncionario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbFuncionarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbStatusFun<T extends tbFuncionario$tbStatusFunArgs<ExtArgs> = {}>(args?: Subset<T, tbFuncionario$tbStatusFunArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbUser<T extends tbFuncionario$tbUserArgs<ExtArgs> = {}>(args?: Subset<T, tbFuncionario$tbUserArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbFuncao<T extends tbFuncionario$tbFuncaoArgs<ExtArgs> = {}>(args?: Subset<T, tbFuncionario$tbFuncaoArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbCCusto<T extends tbFuncionario$tbCCustoArgs<ExtArgs> = {}>(args?: Subset<T, tbFuncionario$tbCCustoArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbCadastro<T extends tbFuncionario$tbCadastroArgs<ExtArgs> = {}>(args?: Subset<T, tbFuncionario$tbCadastroArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbFuncionario model
   */
  interface tbFuncionarioFieldRefs {
    readonly idF: FieldRef<"tbFuncionario", 'String'>
    readonly idMatFun: FieldRef<"tbFuncionario", 'String'>
    readonly nomeFun: FieldRef<"tbFuncionario", 'String'>
    readonly cpfFun: FieldRef<"tbFuncionario", 'String'>
    readonly dataAdmFun: FieldRef<"tbFuncionario", 'DateTime'>
    readonly dataDesFun: FieldRef<"tbFuncionario", 'DateTime'>
    readonly avatarFun: FieldRef<"tbFuncionario", 'String'>
    readonly idFuncaoFun: FieldRef<"tbFuncionario", 'String'>
    readonly idUserFun: FieldRef<"tbFuncionario", 'String'>
    readonly idStatusFun: FieldRef<"tbFuncionario", 'String'>
    readonly idCustoFun: FieldRef<"tbFuncionario", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbFuncionario findUnique
   */
  export type tbFuncionarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncionario to fetch.
     */
    where: tbFuncionarioWhereUniqueInput
  }

  /**
   * tbFuncionario findUniqueOrThrow
   */
  export type tbFuncionarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncionario to fetch.
     */
    where: tbFuncionarioWhereUniqueInput
  }

  /**
   * tbFuncionario findFirst
   */
  export type tbFuncionarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncionario to fetch.
     */
    where?: tbFuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncionarios to fetch.
     */
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbFuncionarios.
     */
    cursor?: tbFuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncionarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbFuncionarios.
     */
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbFuncionario findFirstOrThrow
   */
  export type tbFuncionarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncionario to fetch.
     */
    where?: tbFuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncionarios to fetch.
     */
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbFuncionarios.
     */
    cursor?: tbFuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncionarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbFuncionarios.
     */
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbFuncionario findMany
   */
  export type tbFuncionarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncionarios to fetch.
     */
    where?: tbFuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncionarios to fetch.
     */
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbFuncionarios.
     */
    cursor?: tbFuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncionarios.
     */
    skip?: number
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbFuncionario create
   */
  export type tbFuncionarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * The data needed to create a tbFuncionario.
     */
    data: XOR<tbFuncionarioCreateInput, tbFuncionarioUncheckedCreateInput>
  }

  /**
   * tbFuncionario createMany
   */
  export type tbFuncionarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbFuncionarios.
     */
    data: tbFuncionarioCreateManyInput | tbFuncionarioCreateManyInput[]
  }

  /**
   * tbFuncionario createManyAndReturn
   */
  export type tbFuncionarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * The data used to create many tbFuncionarios.
     */
    data: tbFuncionarioCreateManyInput | tbFuncionarioCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbFuncionario update
   */
  export type tbFuncionarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * The data needed to update a tbFuncionario.
     */
    data: XOR<tbFuncionarioUpdateInput, tbFuncionarioUncheckedUpdateInput>
    /**
     * Choose, which tbFuncionario to update.
     */
    where: tbFuncionarioWhereUniqueInput
  }

  /**
   * tbFuncionario updateMany
   */
  export type tbFuncionarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbFuncionarios.
     */
    data: XOR<tbFuncionarioUpdateManyMutationInput, tbFuncionarioUncheckedUpdateManyInput>
    /**
     * Filter which tbFuncionarios to update
     */
    where?: tbFuncionarioWhereInput
    /**
     * Limit how many tbFuncionarios to update.
     */
    limit?: number
  }

  /**
   * tbFuncionario updateManyAndReturn
   */
  export type tbFuncionarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * The data used to update tbFuncionarios.
     */
    data: XOR<tbFuncionarioUpdateManyMutationInput, tbFuncionarioUncheckedUpdateManyInput>
    /**
     * Filter which tbFuncionarios to update
     */
    where?: tbFuncionarioWhereInput
    /**
     * Limit how many tbFuncionarios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbFuncionario upsert
   */
  export type tbFuncionarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * The filter to search for the tbFuncionario to update in case it exists.
     */
    where: tbFuncionarioWhereUniqueInput
    /**
     * In case the tbFuncionario found by the `where` argument doesn't exist, create a new tbFuncionario with this data.
     */
    create: XOR<tbFuncionarioCreateInput, tbFuncionarioUncheckedCreateInput>
    /**
     * In case the tbFuncionario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbFuncionarioUpdateInput, tbFuncionarioUncheckedUpdateInput>
  }

  /**
   * tbFuncionario delete
   */
  export type tbFuncionarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    /**
     * Filter which tbFuncionario to delete.
     */
    where: tbFuncionarioWhereUniqueInput
  }

  /**
   * tbFuncionario deleteMany
   */
  export type tbFuncionarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbFuncionarios to delete
     */
    where?: tbFuncionarioWhereInput
    /**
     * Limit how many tbFuncionarios to delete.
     */
    limit?: number
  }

  /**
   * tbFuncionario.tbStatusFun
   */
  export type tbFuncionario$tbStatusFunArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    where?: tbStatusFunWhereInput
  }

  /**
   * tbFuncionario.tbUser
   */
  export type tbFuncionario$tbUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbUser
     */
    select?: tbUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbUser
     */
    omit?: tbUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbUserInclude<ExtArgs> | null
    where?: tbUserWhereInput
  }

  /**
   * tbFuncionario.tbFuncao
   */
  export type tbFuncionario$tbFuncaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    where?: tbFuncaoWhereInput
  }

  /**
   * tbFuncionario.tbCCusto
   */
  export type tbFuncionario$tbCCustoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    where?: tbCCustoWhereInput
  }

  /**
   * tbFuncionario.tbCadastro
   */
  export type tbFuncionario$tbCadastroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    where?: tbCadastroWhereInput
    orderBy?: tbCadastroOrderByWithRelationInput | tbCadastroOrderByWithRelationInput[]
    cursor?: tbCadastroWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbCadastroScalarFieldEnum | TbCadastroScalarFieldEnum[]
  }

  /**
   * tbFuncionario without action
   */
  export type tbFuncionarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
  }


  /**
   * Model tbStatusFun
   */

  export type AggregateTbStatusFun = {
    _count: TbStatusFunCountAggregateOutputType | null
    _min: TbStatusFunMinAggregateOutputType | null
    _max: TbStatusFunMaxAggregateOutputType | null
  }

  export type TbStatusFunMinAggregateOutputType = {
    idStatusFun: string | null
    descricaoStatusFun: string | null
  }

  export type TbStatusFunMaxAggregateOutputType = {
    idStatusFun: string | null
    descricaoStatusFun: string | null
  }

  export type TbStatusFunCountAggregateOutputType = {
    idStatusFun: number
    descricaoStatusFun: number
    _all: number
  }


  export type TbStatusFunMinAggregateInputType = {
    idStatusFun?: true
    descricaoStatusFun?: true
  }

  export type TbStatusFunMaxAggregateInputType = {
    idStatusFun?: true
    descricaoStatusFun?: true
  }

  export type TbStatusFunCountAggregateInputType = {
    idStatusFun?: true
    descricaoStatusFun?: true
    _all?: true
  }

  export type TbStatusFunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbStatusFun to aggregate.
     */
    where?: tbStatusFunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusFuns to fetch.
     */
    orderBy?: tbStatusFunOrderByWithRelationInput | tbStatusFunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbStatusFunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusFuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusFuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbStatusFuns
    **/
    _count?: true | TbStatusFunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbStatusFunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbStatusFunMaxAggregateInputType
  }

  export type GetTbStatusFunAggregateType<T extends TbStatusFunAggregateArgs> = {
        [P in keyof T & keyof AggregateTbStatusFun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbStatusFun[P]>
      : GetScalarType<T[P], AggregateTbStatusFun[P]>
  }




  export type tbStatusFunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbStatusFunWhereInput
    orderBy?: tbStatusFunOrderByWithAggregationInput | tbStatusFunOrderByWithAggregationInput[]
    by: TbStatusFunScalarFieldEnum[] | TbStatusFunScalarFieldEnum
    having?: tbStatusFunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbStatusFunCountAggregateInputType | true
    _min?: TbStatusFunMinAggregateInputType
    _max?: TbStatusFunMaxAggregateInputType
  }

  export type TbStatusFunGroupByOutputType = {
    idStatusFun: string
    descricaoStatusFun: string
    _count: TbStatusFunCountAggregateOutputType | null
    _min: TbStatusFunMinAggregateOutputType | null
    _max: TbStatusFunMaxAggregateOutputType | null
  }

  type GetTbStatusFunGroupByPayload<T extends tbStatusFunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbStatusFunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbStatusFunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbStatusFunGroupByOutputType[P]>
            : GetScalarType<T[P], TbStatusFunGroupByOutputType[P]>
        }
      >
    >


  export type tbStatusFunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idStatusFun?: boolean
    descricaoStatusFun?: boolean
    tbFuncionario?: boolean | tbStatusFun$tbFuncionarioArgs<ExtArgs>
    _count?: boolean | TbStatusFunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbStatusFun"]>

  export type tbStatusFunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idStatusFun?: boolean
    descricaoStatusFun?: boolean
  }, ExtArgs["result"]["tbStatusFun"]>

  export type tbStatusFunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idStatusFun?: boolean
    descricaoStatusFun?: boolean
  }, ExtArgs["result"]["tbStatusFun"]>

  export type tbStatusFunSelectScalar = {
    idStatusFun?: boolean
    descricaoStatusFun?: boolean
  }

  export type tbStatusFunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idStatusFun" | "descricaoStatusFun", ExtArgs["result"]["tbStatusFun"]>
  export type tbStatusFunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbFuncionario?: boolean | tbStatusFun$tbFuncionarioArgs<ExtArgs>
    _count?: boolean | TbStatusFunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbStatusFunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type tbStatusFunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $tbStatusFunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbStatusFun"
    objects: {
      tbFuncionario: Prisma.$tbFuncionarioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idStatusFun: string
      descricaoStatusFun: string
    }, ExtArgs["result"]["tbStatusFun"]>
    composites: {}
  }

  type tbStatusFunGetPayload<S extends boolean | null | undefined | tbStatusFunDefaultArgs> = $Result.GetResult<Prisma.$tbStatusFunPayload, S>

  type tbStatusFunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbStatusFunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbStatusFunCountAggregateInputType | true
    }

  export interface tbStatusFunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbStatusFun'], meta: { name: 'tbStatusFun' } }
    /**
     * Find zero or one TbStatusFun that matches the filter.
     * @param {tbStatusFunFindUniqueArgs} args - Arguments to find a TbStatusFun
     * @example
     * // Get one TbStatusFun
     * const tbStatusFun = await prisma.tbStatusFun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbStatusFunFindUniqueArgs>(args: SelectSubset<T, tbStatusFunFindUniqueArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbStatusFun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbStatusFunFindUniqueOrThrowArgs} args - Arguments to find a TbStatusFun
     * @example
     * // Get one TbStatusFun
     * const tbStatusFun = await prisma.tbStatusFun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbStatusFunFindUniqueOrThrowArgs>(args: SelectSubset<T, tbStatusFunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbStatusFun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusFunFindFirstArgs} args - Arguments to find a TbStatusFun
     * @example
     * // Get one TbStatusFun
     * const tbStatusFun = await prisma.tbStatusFun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbStatusFunFindFirstArgs>(args?: SelectSubset<T, tbStatusFunFindFirstArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbStatusFun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusFunFindFirstOrThrowArgs} args - Arguments to find a TbStatusFun
     * @example
     * // Get one TbStatusFun
     * const tbStatusFun = await prisma.tbStatusFun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbStatusFunFindFirstOrThrowArgs>(args?: SelectSubset<T, tbStatusFunFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbStatusFuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusFunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbStatusFuns
     * const tbStatusFuns = await prisma.tbStatusFun.findMany()
     * 
     * // Get first 10 TbStatusFuns
     * const tbStatusFuns = await prisma.tbStatusFun.findMany({ take: 10 })
     * 
     * // Only select the `idStatusFun`
     * const tbStatusFunWithIdStatusFunOnly = await prisma.tbStatusFun.findMany({ select: { idStatusFun: true } })
     * 
     */
    findMany<T extends tbStatusFunFindManyArgs>(args?: SelectSubset<T, tbStatusFunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbStatusFun.
     * @param {tbStatusFunCreateArgs} args - Arguments to create a TbStatusFun.
     * @example
     * // Create one TbStatusFun
     * const TbStatusFun = await prisma.tbStatusFun.create({
     *   data: {
     *     // ... data to create a TbStatusFun
     *   }
     * })
     * 
     */
    create<T extends tbStatusFunCreateArgs>(args: SelectSubset<T, tbStatusFunCreateArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbStatusFuns.
     * @param {tbStatusFunCreateManyArgs} args - Arguments to create many TbStatusFuns.
     * @example
     * // Create many TbStatusFuns
     * const tbStatusFun = await prisma.tbStatusFun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbStatusFunCreateManyArgs>(args?: SelectSubset<T, tbStatusFunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbStatusFuns and returns the data saved in the database.
     * @param {tbStatusFunCreateManyAndReturnArgs} args - Arguments to create many TbStatusFuns.
     * @example
     * // Create many TbStatusFuns
     * const tbStatusFun = await prisma.tbStatusFun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbStatusFuns and only return the `idStatusFun`
     * const tbStatusFunWithIdStatusFunOnly = await prisma.tbStatusFun.createManyAndReturn({
     *   select: { idStatusFun: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbStatusFunCreateManyAndReturnArgs>(args?: SelectSubset<T, tbStatusFunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbStatusFun.
     * @param {tbStatusFunDeleteArgs} args - Arguments to delete one TbStatusFun.
     * @example
     * // Delete one TbStatusFun
     * const TbStatusFun = await prisma.tbStatusFun.delete({
     *   where: {
     *     // ... filter to delete one TbStatusFun
     *   }
     * })
     * 
     */
    delete<T extends tbStatusFunDeleteArgs>(args: SelectSubset<T, tbStatusFunDeleteArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbStatusFun.
     * @param {tbStatusFunUpdateArgs} args - Arguments to update one TbStatusFun.
     * @example
     * // Update one TbStatusFun
     * const tbStatusFun = await prisma.tbStatusFun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbStatusFunUpdateArgs>(args: SelectSubset<T, tbStatusFunUpdateArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbStatusFuns.
     * @param {tbStatusFunDeleteManyArgs} args - Arguments to filter TbStatusFuns to delete.
     * @example
     * // Delete a few TbStatusFuns
     * const { count } = await prisma.tbStatusFun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbStatusFunDeleteManyArgs>(args?: SelectSubset<T, tbStatusFunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbStatusFuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusFunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbStatusFuns
     * const tbStatusFun = await prisma.tbStatusFun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbStatusFunUpdateManyArgs>(args: SelectSubset<T, tbStatusFunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbStatusFuns and returns the data updated in the database.
     * @param {tbStatusFunUpdateManyAndReturnArgs} args - Arguments to update many TbStatusFuns.
     * @example
     * // Update many TbStatusFuns
     * const tbStatusFun = await prisma.tbStatusFun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbStatusFuns and only return the `idStatusFun`
     * const tbStatusFunWithIdStatusFunOnly = await prisma.tbStatusFun.updateManyAndReturn({
     *   select: { idStatusFun: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbStatusFunUpdateManyAndReturnArgs>(args: SelectSubset<T, tbStatusFunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbStatusFun.
     * @param {tbStatusFunUpsertArgs} args - Arguments to update or create a TbStatusFun.
     * @example
     * // Update or create a TbStatusFun
     * const tbStatusFun = await prisma.tbStatusFun.upsert({
     *   create: {
     *     // ... data to create a TbStatusFun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbStatusFun we want to update
     *   }
     * })
     */
    upsert<T extends tbStatusFunUpsertArgs>(args: SelectSubset<T, tbStatusFunUpsertArgs<ExtArgs>>): Prisma__tbStatusFunClient<$Result.GetResult<Prisma.$tbStatusFunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbStatusFuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusFunCountArgs} args - Arguments to filter TbStatusFuns to count.
     * @example
     * // Count the number of TbStatusFuns
     * const count = await prisma.tbStatusFun.count({
     *   where: {
     *     // ... the filter for the TbStatusFuns we want to count
     *   }
     * })
    **/
    count<T extends tbStatusFunCountArgs>(
      args?: Subset<T, tbStatusFunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbStatusFunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbStatusFun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbStatusFunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbStatusFunAggregateArgs>(args: Subset<T, TbStatusFunAggregateArgs>): Prisma.PrismaPromise<GetTbStatusFunAggregateType<T>>

    /**
     * Group by TbStatusFun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusFunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbStatusFunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbStatusFunGroupByArgs['orderBy'] }
        : { orderBy?: tbStatusFunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbStatusFunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbStatusFunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbStatusFun model
   */
  readonly fields: tbStatusFunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbStatusFun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbStatusFunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbFuncionario<T extends tbStatusFun$tbFuncionarioArgs<ExtArgs> = {}>(args?: Subset<T, tbStatusFun$tbFuncionarioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbStatusFun model
   */
  interface tbStatusFunFieldRefs {
    readonly idStatusFun: FieldRef<"tbStatusFun", 'String'>
    readonly descricaoStatusFun: FieldRef<"tbStatusFun", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbStatusFun findUnique
   */
  export type tbStatusFunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusFun to fetch.
     */
    where: tbStatusFunWhereUniqueInput
  }

  /**
   * tbStatusFun findUniqueOrThrow
   */
  export type tbStatusFunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusFun to fetch.
     */
    where: tbStatusFunWhereUniqueInput
  }

  /**
   * tbStatusFun findFirst
   */
  export type tbStatusFunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusFun to fetch.
     */
    where?: tbStatusFunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusFuns to fetch.
     */
    orderBy?: tbStatusFunOrderByWithRelationInput | tbStatusFunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbStatusFuns.
     */
    cursor?: tbStatusFunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusFuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusFuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbStatusFuns.
     */
    distinct?: TbStatusFunScalarFieldEnum | TbStatusFunScalarFieldEnum[]
  }

  /**
   * tbStatusFun findFirstOrThrow
   */
  export type tbStatusFunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusFun to fetch.
     */
    where?: tbStatusFunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusFuns to fetch.
     */
    orderBy?: tbStatusFunOrderByWithRelationInput | tbStatusFunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbStatusFuns.
     */
    cursor?: tbStatusFunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusFuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusFuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbStatusFuns.
     */
    distinct?: TbStatusFunScalarFieldEnum | TbStatusFunScalarFieldEnum[]
  }

  /**
   * tbStatusFun findMany
   */
  export type tbStatusFunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusFuns to fetch.
     */
    where?: tbStatusFunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusFuns to fetch.
     */
    orderBy?: tbStatusFunOrderByWithRelationInput | tbStatusFunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbStatusFuns.
     */
    cursor?: tbStatusFunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusFuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusFuns.
     */
    skip?: number
    distinct?: TbStatusFunScalarFieldEnum | TbStatusFunScalarFieldEnum[]
  }

  /**
   * tbStatusFun create
   */
  export type tbStatusFunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * The data needed to create a tbStatusFun.
     */
    data: XOR<tbStatusFunCreateInput, tbStatusFunUncheckedCreateInput>
  }

  /**
   * tbStatusFun createMany
   */
  export type tbStatusFunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbStatusFuns.
     */
    data: tbStatusFunCreateManyInput | tbStatusFunCreateManyInput[]
  }

  /**
   * tbStatusFun createManyAndReturn
   */
  export type tbStatusFunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * The data used to create many tbStatusFuns.
     */
    data: tbStatusFunCreateManyInput | tbStatusFunCreateManyInput[]
  }

  /**
   * tbStatusFun update
   */
  export type tbStatusFunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * The data needed to update a tbStatusFun.
     */
    data: XOR<tbStatusFunUpdateInput, tbStatusFunUncheckedUpdateInput>
    /**
     * Choose, which tbStatusFun to update.
     */
    where: tbStatusFunWhereUniqueInput
  }

  /**
   * tbStatusFun updateMany
   */
  export type tbStatusFunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbStatusFuns.
     */
    data: XOR<tbStatusFunUpdateManyMutationInput, tbStatusFunUncheckedUpdateManyInput>
    /**
     * Filter which tbStatusFuns to update
     */
    where?: tbStatusFunWhereInput
    /**
     * Limit how many tbStatusFuns to update.
     */
    limit?: number
  }

  /**
   * tbStatusFun updateManyAndReturn
   */
  export type tbStatusFunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * The data used to update tbStatusFuns.
     */
    data: XOR<tbStatusFunUpdateManyMutationInput, tbStatusFunUncheckedUpdateManyInput>
    /**
     * Filter which tbStatusFuns to update
     */
    where?: tbStatusFunWhereInput
    /**
     * Limit how many tbStatusFuns to update.
     */
    limit?: number
  }

  /**
   * tbStatusFun upsert
   */
  export type tbStatusFunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * The filter to search for the tbStatusFun to update in case it exists.
     */
    where: tbStatusFunWhereUniqueInput
    /**
     * In case the tbStatusFun found by the `where` argument doesn't exist, create a new tbStatusFun with this data.
     */
    create: XOR<tbStatusFunCreateInput, tbStatusFunUncheckedCreateInput>
    /**
     * In case the tbStatusFun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbStatusFunUpdateInput, tbStatusFunUncheckedUpdateInput>
  }

  /**
   * tbStatusFun delete
   */
  export type tbStatusFunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
    /**
     * Filter which tbStatusFun to delete.
     */
    where: tbStatusFunWhereUniqueInput
  }

  /**
   * tbStatusFun deleteMany
   */
  export type tbStatusFunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbStatusFuns to delete
     */
    where?: tbStatusFunWhereInput
    /**
     * Limit how many tbStatusFuns to delete.
     */
    limit?: number
  }

  /**
   * tbStatusFun.tbFuncionario
   */
  export type tbStatusFun$tbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    where?: tbFuncionarioWhereInput
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    cursor?: tbFuncionarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbStatusFun without action
   */
  export type tbStatusFunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusFun
     */
    select?: tbStatusFunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusFun
     */
    omit?: tbStatusFunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusFunInclude<ExtArgs> | null
  }


  /**
   * Model tbFuncao
   */

  export type AggregateTbFuncao = {
    _count: TbFuncaoCountAggregateOutputType | null
    _min: TbFuncaoMinAggregateOutputType | null
    _max: TbFuncaoMaxAggregateOutputType | null
  }

  export type TbFuncaoMinAggregateOutputType = {
    idFuncao: string | null
    nomeFuncao: string | null
  }

  export type TbFuncaoMaxAggregateOutputType = {
    idFuncao: string | null
    nomeFuncao: string | null
  }

  export type TbFuncaoCountAggregateOutputType = {
    idFuncao: number
    nomeFuncao: number
    _all: number
  }


  export type TbFuncaoMinAggregateInputType = {
    idFuncao?: true
    nomeFuncao?: true
  }

  export type TbFuncaoMaxAggregateInputType = {
    idFuncao?: true
    nomeFuncao?: true
  }

  export type TbFuncaoCountAggregateInputType = {
    idFuncao?: true
    nomeFuncao?: true
    _all?: true
  }

  export type TbFuncaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbFuncao to aggregate.
     */
    where?: tbFuncaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncaos to fetch.
     */
    orderBy?: tbFuncaoOrderByWithRelationInput | tbFuncaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbFuncaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbFuncaos
    **/
    _count?: true | TbFuncaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbFuncaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbFuncaoMaxAggregateInputType
  }

  export type GetTbFuncaoAggregateType<T extends TbFuncaoAggregateArgs> = {
        [P in keyof T & keyof AggregateTbFuncao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbFuncao[P]>
      : GetScalarType<T[P], AggregateTbFuncao[P]>
  }




  export type tbFuncaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbFuncaoWhereInput
    orderBy?: tbFuncaoOrderByWithAggregationInput | tbFuncaoOrderByWithAggregationInput[]
    by: TbFuncaoScalarFieldEnum[] | TbFuncaoScalarFieldEnum
    having?: tbFuncaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbFuncaoCountAggregateInputType | true
    _min?: TbFuncaoMinAggregateInputType
    _max?: TbFuncaoMaxAggregateInputType
  }

  export type TbFuncaoGroupByOutputType = {
    idFuncao: string
    nomeFuncao: string
    _count: TbFuncaoCountAggregateOutputType | null
    _min: TbFuncaoMinAggregateOutputType | null
    _max: TbFuncaoMaxAggregateOutputType | null
  }

  type GetTbFuncaoGroupByPayload<T extends tbFuncaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbFuncaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbFuncaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbFuncaoGroupByOutputType[P]>
            : GetScalarType<T[P], TbFuncaoGroupByOutputType[P]>
        }
      >
    >


  export type tbFuncaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idFuncao?: boolean
    nomeFuncao?: boolean
    tbFuncionario?: boolean | tbFuncao$tbFuncionarioArgs<ExtArgs>
    _count?: boolean | TbFuncaoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbFuncao"]>

  export type tbFuncaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idFuncao?: boolean
    nomeFuncao?: boolean
  }, ExtArgs["result"]["tbFuncao"]>

  export type tbFuncaoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idFuncao?: boolean
    nomeFuncao?: boolean
  }, ExtArgs["result"]["tbFuncao"]>

  export type tbFuncaoSelectScalar = {
    idFuncao?: boolean
    nomeFuncao?: boolean
  }

  export type tbFuncaoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idFuncao" | "nomeFuncao", ExtArgs["result"]["tbFuncao"]>
  export type tbFuncaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbFuncionario?: boolean | tbFuncao$tbFuncionarioArgs<ExtArgs>
    _count?: boolean | TbFuncaoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbFuncaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type tbFuncaoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $tbFuncaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbFuncao"
    objects: {
      tbFuncionario: Prisma.$tbFuncionarioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idFuncao: string
      nomeFuncao: string
    }, ExtArgs["result"]["tbFuncao"]>
    composites: {}
  }

  type tbFuncaoGetPayload<S extends boolean | null | undefined | tbFuncaoDefaultArgs> = $Result.GetResult<Prisma.$tbFuncaoPayload, S>

  type tbFuncaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbFuncaoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbFuncaoCountAggregateInputType | true
    }

  export interface tbFuncaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbFuncao'], meta: { name: 'tbFuncao' } }
    /**
     * Find zero or one TbFuncao that matches the filter.
     * @param {tbFuncaoFindUniqueArgs} args - Arguments to find a TbFuncao
     * @example
     * // Get one TbFuncao
     * const tbFuncao = await prisma.tbFuncao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbFuncaoFindUniqueArgs>(args: SelectSubset<T, tbFuncaoFindUniqueArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbFuncao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbFuncaoFindUniqueOrThrowArgs} args - Arguments to find a TbFuncao
     * @example
     * // Get one TbFuncao
     * const tbFuncao = await prisma.tbFuncao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbFuncaoFindUniqueOrThrowArgs>(args: SelectSubset<T, tbFuncaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbFuncao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncaoFindFirstArgs} args - Arguments to find a TbFuncao
     * @example
     * // Get one TbFuncao
     * const tbFuncao = await prisma.tbFuncao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbFuncaoFindFirstArgs>(args?: SelectSubset<T, tbFuncaoFindFirstArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbFuncao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncaoFindFirstOrThrowArgs} args - Arguments to find a TbFuncao
     * @example
     * // Get one TbFuncao
     * const tbFuncao = await prisma.tbFuncao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbFuncaoFindFirstOrThrowArgs>(args?: SelectSubset<T, tbFuncaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbFuncaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbFuncaos
     * const tbFuncaos = await prisma.tbFuncao.findMany()
     * 
     * // Get first 10 TbFuncaos
     * const tbFuncaos = await prisma.tbFuncao.findMany({ take: 10 })
     * 
     * // Only select the `idFuncao`
     * const tbFuncaoWithIdFuncaoOnly = await prisma.tbFuncao.findMany({ select: { idFuncao: true } })
     * 
     */
    findMany<T extends tbFuncaoFindManyArgs>(args?: SelectSubset<T, tbFuncaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbFuncao.
     * @param {tbFuncaoCreateArgs} args - Arguments to create a TbFuncao.
     * @example
     * // Create one TbFuncao
     * const TbFuncao = await prisma.tbFuncao.create({
     *   data: {
     *     // ... data to create a TbFuncao
     *   }
     * })
     * 
     */
    create<T extends tbFuncaoCreateArgs>(args: SelectSubset<T, tbFuncaoCreateArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbFuncaos.
     * @param {tbFuncaoCreateManyArgs} args - Arguments to create many TbFuncaos.
     * @example
     * // Create many TbFuncaos
     * const tbFuncao = await prisma.tbFuncao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbFuncaoCreateManyArgs>(args?: SelectSubset<T, tbFuncaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbFuncaos and returns the data saved in the database.
     * @param {tbFuncaoCreateManyAndReturnArgs} args - Arguments to create many TbFuncaos.
     * @example
     * // Create many TbFuncaos
     * const tbFuncao = await prisma.tbFuncao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbFuncaos and only return the `idFuncao`
     * const tbFuncaoWithIdFuncaoOnly = await prisma.tbFuncao.createManyAndReturn({
     *   select: { idFuncao: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbFuncaoCreateManyAndReturnArgs>(args?: SelectSubset<T, tbFuncaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbFuncao.
     * @param {tbFuncaoDeleteArgs} args - Arguments to delete one TbFuncao.
     * @example
     * // Delete one TbFuncao
     * const TbFuncao = await prisma.tbFuncao.delete({
     *   where: {
     *     // ... filter to delete one TbFuncao
     *   }
     * })
     * 
     */
    delete<T extends tbFuncaoDeleteArgs>(args: SelectSubset<T, tbFuncaoDeleteArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbFuncao.
     * @param {tbFuncaoUpdateArgs} args - Arguments to update one TbFuncao.
     * @example
     * // Update one TbFuncao
     * const tbFuncao = await prisma.tbFuncao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbFuncaoUpdateArgs>(args: SelectSubset<T, tbFuncaoUpdateArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbFuncaos.
     * @param {tbFuncaoDeleteManyArgs} args - Arguments to filter TbFuncaos to delete.
     * @example
     * // Delete a few TbFuncaos
     * const { count } = await prisma.tbFuncao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbFuncaoDeleteManyArgs>(args?: SelectSubset<T, tbFuncaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbFuncaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbFuncaos
     * const tbFuncao = await prisma.tbFuncao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbFuncaoUpdateManyArgs>(args: SelectSubset<T, tbFuncaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbFuncaos and returns the data updated in the database.
     * @param {tbFuncaoUpdateManyAndReturnArgs} args - Arguments to update many TbFuncaos.
     * @example
     * // Update many TbFuncaos
     * const tbFuncao = await prisma.tbFuncao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbFuncaos and only return the `idFuncao`
     * const tbFuncaoWithIdFuncaoOnly = await prisma.tbFuncao.updateManyAndReturn({
     *   select: { idFuncao: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbFuncaoUpdateManyAndReturnArgs>(args: SelectSubset<T, tbFuncaoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbFuncao.
     * @param {tbFuncaoUpsertArgs} args - Arguments to update or create a TbFuncao.
     * @example
     * // Update or create a TbFuncao
     * const tbFuncao = await prisma.tbFuncao.upsert({
     *   create: {
     *     // ... data to create a TbFuncao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbFuncao we want to update
     *   }
     * })
     */
    upsert<T extends tbFuncaoUpsertArgs>(args: SelectSubset<T, tbFuncaoUpsertArgs<ExtArgs>>): Prisma__tbFuncaoClient<$Result.GetResult<Prisma.$tbFuncaoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbFuncaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncaoCountArgs} args - Arguments to filter TbFuncaos to count.
     * @example
     * // Count the number of TbFuncaos
     * const count = await prisma.tbFuncao.count({
     *   where: {
     *     // ... the filter for the TbFuncaos we want to count
     *   }
     * })
    **/
    count<T extends tbFuncaoCountArgs>(
      args?: Subset<T, tbFuncaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbFuncaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbFuncao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbFuncaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbFuncaoAggregateArgs>(args: Subset<T, TbFuncaoAggregateArgs>): Prisma.PrismaPromise<GetTbFuncaoAggregateType<T>>

    /**
     * Group by TbFuncao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbFuncaoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbFuncaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbFuncaoGroupByArgs['orderBy'] }
        : { orderBy?: tbFuncaoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbFuncaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbFuncaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbFuncao model
   */
  readonly fields: tbFuncaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbFuncao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbFuncaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbFuncionario<T extends tbFuncao$tbFuncionarioArgs<ExtArgs> = {}>(args?: Subset<T, tbFuncao$tbFuncionarioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbFuncao model
   */
  interface tbFuncaoFieldRefs {
    readonly idFuncao: FieldRef<"tbFuncao", 'String'>
    readonly nomeFuncao: FieldRef<"tbFuncao", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbFuncao findUnique
   */
  export type tbFuncaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncao to fetch.
     */
    where: tbFuncaoWhereUniqueInput
  }

  /**
   * tbFuncao findUniqueOrThrow
   */
  export type tbFuncaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncao to fetch.
     */
    where: tbFuncaoWhereUniqueInput
  }

  /**
   * tbFuncao findFirst
   */
  export type tbFuncaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncao to fetch.
     */
    where?: tbFuncaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncaos to fetch.
     */
    orderBy?: tbFuncaoOrderByWithRelationInput | tbFuncaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbFuncaos.
     */
    cursor?: tbFuncaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbFuncaos.
     */
    distinct?: TbFuncaoScalarFieldEnum | TbFuncaoScalarFieldEnum[]
  }

  /**
   * tbFuncao findFirstOrThrow
   */
  export type tbFuncaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncao to fetch.
     */
    where?: tbFuncaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncaos to fetch.
     */
    orderBy?: tbFuncaoOrderByWithRelationInput | tbFuncaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbFuncaos.
     */
    cursor?: tbFuncaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbFuncaos.
     */
    distinct?: TbFuncaoScalarFieldEnum | TbFuncaoScalarFieldEnum[]
  }

  /**
   * tbFuncao findMany
   */
  export type tbFuncaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * Filter, which tbFuncaos to fetch.
     */
    where?: tbFuncaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbFuncaos to fetch.
     */
    orderBy?: tbFuncaoOrderByWithRelationInput | tbFuncaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbFuncaos.
     */
    cursor?: tbFuncaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbFuncaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbFuncaos.
     */
    skip?: number
    distinct?: TbFuncaoScalarFieldEnum | TbFuncaoScalarFieldEnum[]
  }

  /**
   * tbFuncao create
   */
  export type tbFuncaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * The data needed to create a tbFuncao.
     */
    data: XOR<tbFuncaoCreateInput, tbFuncaoUncheckedCreateInput>
  }

  /**
   * tbFuncao createMany
   */
  export type tbFuncaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbFuncaos.
     */
    data: tbFuncaoCreateManyInput | tbFuncaoCreateManyInput[]
  }

  /**
   * tbFuncao createManyAndReturn
   */
  export type tbFuncaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * The data used to create many tbFuncaos.
     */
    data: tbFuncaoCreateManyInput | tbFuncaoCreateManyInput[]
  }

  /**
   * tbFuncao update
   */
  export type tbFuncaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * The data needed to update a tbFuncao.
     */
    data: XOR<tbFuncaoUpdateInput, tbFuncaoUncheckedUpdateInput>
    /**
     * Choose, which tbFuncao to update.
     */
    where: tbFuncaoWhereUniqueInput
  }

  /**
   * tbFuncao updateMany
   */
  export type tbFuncaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbFuncaos.
     */
    data: XOR<tbFuncaoUpdateManyMutationInput, tbFuncaoUncheckedUpdateManyInput>
    /**
     * Filter which tbFuncaos to update
     */
    where?: tbFuncaoWhereInput
    /**
     * Limit how many tbFuncaos to update.
     */
    limit?: number
  }

  /**
   * tbFuncao updateManyAndReturn
   */
  export type tbFuncaoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * The data used to update tbFuncaos.
     */
    data: XOR<tbFuncaoUpdateManyMutationInput, tbFuncaoUncheckedUpdateManyInput>
    /**
     * Filter which tbFuncaos to update
     */
    where?: tbFuncaoWhereInput
    /**
     * Limit how many tbFuncaos to update.
     */
    limit?: number
  }

  /**
   * tbFuncao upsert
   */
  export type tbFuncaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * The filter to search for the tbFuncao to update in case it exists.
     */
    where: tbFuncaoWhereUniqueInput
    /**
     * In case the tbFuncao found by the `where` argument doesn't exist, create a new tbFuncao with this data.
     */
    create: XOR<tbFuncaoCreateInput, tbFuncaoUncheckedCreateInput>
    /**
     * In case the tbFuncao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbFuncaoUpdateInput, tbFuncaoUncheckedUpdateInput>
  }

  /**
   * tbFuncao delete
   */
  export type tbFuncaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
    /**
     * Filter which tbFuncao to delete.
     */
    where: tbFuncaoWhereUniqueInput
  }

  /**
   * tbFuncao deleteMany
   */
  export type tbFuncaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbFuncaos to delete
     */
    where?: tbFuncaoWhereInput
    /**
     * Limit how many tbFuncaos to delete.
     */
    limit?: number
  }

  /**
   * tbFuncao.tbFuncionario
   */
  export type tbFuncao$tbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    where?: tbFuncionarioWhereInput
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    cursor?: tbFuncionarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbFuncao without action
   */
  export type tbFuncaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncao
     */
    select?: tbFuncaoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncao
     */
    omit?: tbFuncaoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncaoInclude<ExtArgs> | null
  }


  /**
   * Model tbPatrimonio
   */

  export type AggregateTbPatrimonio = {
    _count: TbPatrimonioCountAggregateOutputType | null
    _avg: TbPatrimonioAvgAggregateOutputType | null
    _sum: TbPatrimonioSumAggregateOutputType | null
    _min: TbPatrimonioMinAggregateOutputType | null
    _max: TbPatrimonioMaxAggregateOutputType | null
  }

  export type TbPatrimonioAvgAggregateOutputType = {
    valorPat: number | null
  }

  export type TbPatrimonioSumAggregateOutputType = {
    valorPat: number | null
  }

  export type TbPatrimonioMinAggregateOutputType = {
    idP: string | null
    idPat: string | null
    descricaoPat: string | null
    descricaoDetalhadaPat: string | null
    licencaPat: string | null
    dataEntPat: Date | null
    dataSaiPat: Date | null
    notaFiscalPat: string | null
    valorPat: number | null
    createdAt: Date | null
    updatedAt: Date | null
    idPat_TipoPat: string | null
    idPat_StatusPat: string | null
    idPat_CustoPat: string | null
  }

  export type TbPatrimonioMaxAggregateOutputType = {
    idP: string | null
    idPat: string | null
    descricaoPat: string | null
    descricaoDetalhadaPat: string | null
    licencaPat: string | null
    dataEntPat: Date | null
    dataSaiPat: Date | null
    notaFiscalPat: string | null
    valorPat: number | null
    createdAt: Date | null
    updatedAt: Date | null
    idPat_TipoPat: string | null
    idPat_StatusPat: string | null
    idPat_CustoPat: string | null
  }

  export type TbPatrimonioCountAggregateOutputType = {
    idP: number
    idPat: number
    descricaoPat: number
    descricaoDetalhadaPat: number
    licencaPat: number
    dataEntPat: number
    dataSaiPat: number
    notaFiscalPat: number
    valorPat: number
    createdAt: number
    updatedAt: number
    idPat_TipoPat: number
    idPat_StatusPat: number
    idPat_CustoPat: number
    _all: number
  }


  export type TbPatrimonioAvgAggregateInputType = {
    valorPat?: true
  }

  export type TbPatrimonioSumAggregateInputType = {
    valorPat?: true
  }

  export type TbPatrimonioMinAggregateInputType = {
    idP?: true
    idPat?: true
    descricaoPat?: true
    descricaoDetalhadaPat?: true
    licencaPat?: true
    dataEntPat?: true
    dataSaiPat?: true
    notaFiscalPat?: true
    valorPat?: true
    createdAt?: true
    updatedAt?: true
    idPat_TipoPat?: true
    idPat_StatusPat?: true
    idPat_CustoPat?: true
  }

  export type TbPatrimonioMaxAggregateInputType = {
    idP?: true
    idPat?: true
    descricaoPat?: true
    descricaoDetalhadaPat?: true
    licencaPat?: true
    dataEntPat?: true
    dataSaiPat?: true
    notaFiscalPat?: true
    valorPat?: true
    createdAt?: true
    updatedAt?: true
    idPat_TipoPat?: true
    idPat_StatusPat?: true
    idPat_CustoPat?: true
  }

  export type TbPatrimonioCountAggregateInputType = {
    idP?: true
    idPat?: true
    descricaoPat?: true
    descricaoDetalhadaPat?: true
    licencaPat?: true
    dataEntPat?: true
    dataSaiPat?: true
    notaFiscalPat?: true
    valorPat?: true
    createdAt?: true
    updatedAt?: true
    idPat_TipoPat?: true
    idPat_StatusPat?: true
    idPat_CustoPat?: true
    _all?: true
  }

  export type TbPatrimonioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbPatrimonio to aggregate.
     */
    where?: tbPatrimonioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbPatrimonios to fetch.
     */
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbPatrimonioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbPatrimonios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbPatrimonios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbPatrimonios
    **/
    _count?: true | TbPatrimonioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TbPatrimonioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TbPatrimonioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbPatrimonioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbPatrimonioMaxAggregateInputType
  }

  export type GetTbPatrimonioAggregateType<T extends TbPatrimonioAggregateArgs> = {
        [P in keyof T & keyof AggregateTbPatrimonio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbPatrimonio[P]>
      : GetScalarType<T[P], AggregateTbPatrimonio[P]>
  }




  export type tbPatrimonioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbPatrimonioWhereInput
    orderBy?: tbPatrimonioOrderByWithAggregationInput | tbPatrimonioOrderByWithAggregationInput[]
    by: TbPatrimonioScalarFieldEnum[] | TbPatrimonioScalarFieldEnum
    having?: tbPatrimonioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbPatrimonioCountAggregateInputType | true
    _avg?: TbPatrimonioAvgAggregateInputType
    _sum?: TbPatrimonioSumAggregateInputType
    _min?: TbPatrimonioMinAggregateInputType
    _max?: TbPatrimonioMaxAggregateInputType
  }

  export type TbPatrimonioGroupByOutputType = {
    idP: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat: string | null
    licencaPat: string | null
    dataEntPat: Date
    dataSaiPat: Date | null
    notaFiscalPat: string | null
    valorPat: number
    createdAt: Date | null
    updatedAt: Date | null
    idPat_TipoPat: string | null
    idPat_StatusPat: string | null
    idPat_CustoPat: string | null
    _count: TbPatrimonioCountAggregateOutputType | null
    _avg: TbPatrimonioAvgAggregateOutputType | null
    _sum: TbPatrimonioSumAggregateOutputType | null
    _min: TbPatrimonioMinAggregateOutputType | null
    _max: TbPatrimonioMaxAggregateOutputType | null
  }

  type GetTbPatrimonioGroupByPayload<T extends tbPatrimonioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbPatrimonioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbPatrimonioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbPatrimonioGroupByOutputType[P]>
            : GetScalarType<T[P], TbPatrimonioGroupByOutputType[P]>
        }
      >
    >


  export type tbPatrimonioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idP?: boolean
    idPat?: boolean
    descricaoPat?: boolean
    descricaoDetalhadaPat?: boolean
    licencaPat?: boolean
    dataEntPat?: boolean
    dataSaiPat?: boolean
    notaFiscalPat?: boolean
    valorPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPat_TipoPat?: boolean
    idPat_StatusPat?: boolean
    idPat_CustoPat?: boolean
    tbTipoPat?: boolean | tbPatrimonio$tbTipoPatArgs<ExtArgs>
    tbStatusPat?: boolean | tbPatrimonio$tbStatusPatArgs<ExtArgs>
    tbCCusto?: boolean | tbPatrimonio$tbCCustoArgs<ExtArgs>
    tbCadastro?: boolean | tbPatrimonio$tbCadastroArgs<ExtArgs>
    _count?: boolean | TbPatrimonioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbPatrimonio"]>

  export type tbPatrimonioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idP?: boolean
    idPat?: boolean
    descricaoPat?: boolean
    descricaoDetalhadaPat?: boolean
    licencaPat?: boolean
    dataEntPat?: boolean
    dataSaiPat?: boolean
    notaFiscalPat?: boolean
    valorPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPat_TipoPat?: boolean
    idPat_StatusPat?: boolean
    idPat_CustoPat?: boolean
    tbTipoPat?: boolean | tbPatrimonio$tbTipoPatArgs<ExtArgs>
    tbStatusPat?: boolean | tbPatrimonio$tbStatusPatArgs<ExtArgs>
    tbCCusto?: boolean | tbPatrimonio$tbCCustoArgs<ExtArgs>
  }, ExtArgs["result"]["tbPatrimonio"]>

  export type tbPatrimonioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idP?: boolean
    idPat?: boolean
    descricaoPat?: boolean
    descricaoDetalhadaPat?: boolean
    licencaPat?: boolean
    dataEntPat?: boolean
    dataSaiPat?: boolean
    notaFiscalPat?: boolean
    valorPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPat_TipoPat?: boolean
    idPat_StatusPat?: boolean
    idPat_CustoPat?: boolean
    tbTipoPat?: boolean | tbPatrimonio$tbTipoPatArgs<ExtArgs>
    tbStatusPat?: boolean | tbPatrimonio$tbStatusPatArgs<ExtArgs>
    tbCCusto?: boolean | tbPatrimonio$tbCCustoArgs<ExtArgs>
  }, ExtArgs["result"]["tbPatrimonio"]>

  export type tbPatrimonioSelectScalar = {
    idP?: boolean
    idPat?: boolean
    descricaoPat?: boolean
    descricaoDetalhadaPat?: boolean
    licencaPat?: boolean
    dataEntPat?: boolean
    dataSaiPat?: boolean
    notaFiscalPat?: boolean
    valorPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPat_TipoPat?: boolean
    idPat_StatusPat?: boolean
    idPat_CustoPat?: boolean
  }

  export type tbPatrimonioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idP" | "idPat" | "descricaoPat" | "descricaoDetalhadaPat" | "licencaPat" | "dataEntPat" | "dataSaiPat" | "notaFiscalPat" | "valorPat" | "createdAt" | "updatedAt" | "idPat_TipoPat" | "idPat_StatusPat" | "idPat_CustoPat", ExtArgs["result"]["tbPatrimonio"]>
  export type tbPatrimonioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbTipoPat?: boolean | tbPatrimonio$tbTipoPatArgs<ExtArgs>
    tbStatusPat?: boolean | tbPatrimonio$tbStatusPatArgs<ExtArgs>
    tbCCusto?: boolean | tbPatrimonio$tbCCustoArgs<ExtArgs>
    tbCadastro?: boolean | tbPatrimonio$tbCadastroArgs<ExtArgs>
    _count?: boolean | TbPatrimonioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbPatrimonioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbTipoPat?: boolean | tbPatrimonio$tbTipoPatArgs<ExtArgs>
    tbStatusPat?: boolean | tbPatrimonio$tbStatusPatArgs<ExtArgs>
    tbCCusto?: boolean | tbPatrimonio$tbCCustoArgs<ExtArgs>
  }
  export type tbPatrimonioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbTipoPat?: boolean | tbPatrimonio$tbTipoPatArgs<ExtArgs>
    tbStatusPat?: boolean | tbPatrimonio$tbStatusPatArgs<ExtArgs>
    tbCCusto?: boolean | tbPatrimonio$tbCCustoArgs<ExtArgs>
  }

  export type $tbPatrimonioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbPatrimonio"
    objects: {
      tbTipoPat: Prisma.$tbTipoPatPayload<ExtArgs> | null
      tbStatusPat: Prisma.$tbStatusPatPayload<ExtArgs> | null
      tbCCusto: Prisma.$tbCCustoPayload<ExtArgs> | null
      tbCadastro: Prisma.$tbCadastroPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idP: string
      idPat: string
      descricaoPat: string
      descricaoDetalhadaPat: string | null
      licencaPat: string | null
      dataEntPat: Date
      dataSaiPat: Date | null
      notaFiscalPat: string | null
      valorPat: number
      createdAt: Date | null
      updatedAt: Date | null
      idPat_TipoPat: string | null
      idPat_StatusPat: string | null
      idPat_CustoPat: string | null
    }, ExtArgs["result"]["tbPatrimonio"]>
    composites: {}
  }

  type tbPatrimonioGetPayload<S extends boolean | null | undefined | tbPatrimonioDefaultArgs> = $Result.GetResult<Prisma.$tbPatrimonioPayload, S>

  type tbPatrimonioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbPatrimonioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbPatrimonioCountAggregateInputType | true
    }

  export interface tbPatrimonioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbPatrimonio'], meta: { name: 'tbPatrimonio' } }
    /**
     * Find zero or one TbPatrimonio that matches the filter.
     * @param {tbPatrimonioFindUniqueArgs} args - Arguments to find a TbPatrimonio
     * @example
     * // Get one TbPatrimonio
     * const tbPatrimonio = await prisma.tbPatrimonio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbPatrimonioFindUniqueArgs>(args: SelectSubset<T, tbPatrimonioFindUniqueArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbPatrimonio that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbPatrimonioFindUniqueOrThrowArgs} args - Arguments to find a TbPatrimonio
     * @example
     * // Get one TbPatrimonio
     * const tbPatrimonio = await prisma.tbPatrimonio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbPatrimonioFindUniqueOrThrowArgs>(args: SelectSubset<T, tbPatrimonioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbPatrimonio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbPatrimonioFindFirstArgs} args - Arguments to find a TbPatrimonio
     * @example
     * // Get one TbPatrimonio
     * const tbPatrimonio = await prisma.tbPatrimonio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbPatrimonioFindFirstArgs>(args?: SelectSubset<T, tbPatrimonioFindFirstArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbPatrimonio that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbPatrimonioFindFirstOrThrowArgs} args - Arguments to find a TbPatrimonio
     * @example
     * // Get one TbPatrimonio
     * const tbPatrimonio = await prisma.tbPatrimonio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbPatrimonioFindFirstOrThrowArgs>(args?: SelectSubset<T, tbPatrimonioFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbPatrimonios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbPatrimonioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbPatrimonios
     * const tbPatrimonios = await prisma.tbPatrimonio.findMany()
     * 
     * // Get first 10 TbPatrimonios
     * const tbPatrimonios = await prisma.tbPatrimonio.findMany({ take: 10 })
     * 
     * // Only select the `idP`
     * const tbPatrimonioWithIdPOnly = await prisma.tbPatrimonio.findMany({ select: { idP: true } })
     * 
     */
    findMany<T extends tbPatrimonioFindManyArgs>(args?: SelectSubset<T, tbPatrimonioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbPatrimonio.
     * @param {tbPatrimonioCreateArgs} args - Arguments to create a TbPatrimonio.
     * @example
     * // Create one TbPatrimonio
     * const TbPatrimonio = await prisma.tbPatrimonio.create({
     *   data: {
     *     // ... data to create a TbPatrimonio
     *   }
     * })
     * 
     */
    create<T extends tbPatrimonioCreateArgs>(args: SelectSubset<T, tbPatrimonioCreateArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbPatrimonios.
     * @param {tbPatrimonioCreateManyArgs} args - Arguments to create many TbPatrimonios.
     * @example
     * // Create many TbPatrimonios
     * const tbPatrimonio = await prisma.tbPatrimonio.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbPatrimonioCreateManyArgs>(args?: SelectSubset<T, tbPatrimonioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbPatrimonios and returns the data saved in the database.
     * @param {tbPatrimonioCreateManyAndReturnArgs} args - Arguments to create many TbPatrimonios.
     * @example
     * // Create many TbPatrimonios
     * const tbPatrimonio = await prisma.tbPatrimonio.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbPatrimonios and only return the `idP`
     * const tbPatrimonioWithIdPOnly = await prisma.tbPatrimonio.createManyAndReturn({
     *   select: { idP: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbPatrimonioCreateManyAndReturnArgs>(args?: SelectSubset<T, tbPatrimonioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbPatrimonio.
     * @param {tbPatrimonioDeleteArgs} args - Arguments to delete one TbPatrimonio.
     * @example
     * // Delete one TbPatrimonio
     * const TbPatrimonio = await prisma.tbPatrimonio.delete({
     *   where: {
     *     // ... filter to delete one TbPatrimonio
     *   }
     * })
     * 
     */
    delete<T extends tbPatrimonioDeleteArgs>(args: SelectSubset<T, tbPatrimonioDeleteArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbPatrimonio.
     * @param {tbPatrimonioUpdateArgs} args - Arguments to update one TbPatrimonio.
     * @example
     * // Update one TbPatrimonio
     * const tbPatrimonio = await prisma.tbPatrimonio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbPatrimonioUpdateArgs>(args: SelectSubset<T, tbPatrimonioUpdateArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbPatrimonios.
     * @param {tbPatrimonioDeleteManyArgs} args - Arguments to filter TbPatrimonios to delete.
     * @example
     * // Delete a few TbPatrimonios
     * const { count } = await prisma.tbPatrimonio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbPatrimonioDeleteManyArgs>(args?: SelectSubset<T, tbPatrimonioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbPatrimonios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbPatrimonioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbPatrimonios
     * const tbPatrimonio = await prisma.tbPatrimonio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbPatrimonioUpdateManyArgs>(args: SelectSubset<T, tbPatrimonioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbPatrimonios and returns the data updated in the database.
     * @param {tbPatrimonioUpdateManyAndReturnArgs} args - Arguments to update many TbPatrimonios.
     * @example
     * // Update many TbPatrimonios
     * const tbPatrimonio = await prisma.tbPatrimonio.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbPatrimonios and only return the `idP`
     * const tbPatrimonioWithIdPOnly = await prisma.tbPatrimonio.updateManyAndReturn({
     *   select: { idP: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbPatrimonioUpdateManyAndReturnArgs>(args: SelectSubset<T, tbPatrimonioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbPatrimonio.
     * @param {tbPatrimonioUpsertArgs} args - Arguments to update or create a TbPatrimonio.
     * @example
     * // Update or create a TbPatrimonio
     * const tbPatrimonio = await prisma.tbPatrimonio.upsert({
     *   create: {
     *     // ... data to create a TbPatrimonio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbPatrimonio we want to update
     *   }
     * })
     */
    upsert<T extends tbPatrimonioUpsertArgs>(args: SelectSubset<T, tbPatrimonioUpsertArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbPatrimonios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbPatrimonioCountArgs} args - Arguments to filter TbPatrimonios to count.
     * @example
     * // Count the number of TbPatrimonios
     * const count = await prisma.tbPatrimonio.count({
     *   where: {
     *     // ... the filter for the TbPatrimonios we want to count
     *   }
     * })
    **/
    count<T extends tbPatrimonioCountArgs>(
      args?: Subset<T, tbPatrimonioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbPatrimonioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbPatrimonio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbPatrimonioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbPatrimonioAggregateArgs>(args: Subset<T, TbPatrimonioAggregateArgs>): Prisma.PrismaPromise<GetTbPatrimonioAggregateType<T>>

    /**
     * Group by TbPatrimonio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbPatrimonioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbPatrimonioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbPatrimonioGroupByArgs['orderBy'] }
        : { orderBy?: tbPatrimonioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbPatrimonioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbPatrimonioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbPatrimonio model
   */
  readonly fields: tbPatrimonioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbPatrimonio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbPatrimonioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbTipoPat<T extends tbPatrimonio$tbTipoPatArgs<ExtArgs> = {}>(args?: Subset<T, tbPatrimonio$tbTipoPatArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbStatusPat<T extends tbPatrimonio$tbStatusPatArgs<ExtArgs> = {}>(args?: Subset<T, tbPatrimonio$tbStatusPatArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbCCusto<T extends tbPatrimonio$tbCCustoArgs<ExtArgs> = {}>(args?: Subset<T, tbPatrimonio$tbCCustoArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbCadastro<T extends tbPatrimonio$tbCadastroArgs<ExtArgs> = {}>(args?: Subset<T, tbPatrimonio$tbCadastroArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbPatrimonio model
   */
  interface tbPatrimonioFieldRefs {
    readonly idP: FieldRef<"tbPatrimonio", 'String'>
    readonly idPat: FieldRef<"tbPatrimonio", 'String'>
    readonly descricaoPat: FieldRef<"tbPatrimonio", 'String'>
    readonly descricaoDetalhadaPat: FieldRef<"tbPatrimonio", 'String'>
    readonly licencaPat: FieldRef<"tbPatrimonio", 'String'>
    readonly dataEntPat: FieldRef<"tbPatrimonio", 'DateTime'>
    readonly dataSaiPat: FieldRef<"tbPatrimonio", 'DateTime'>
    readonly notaFiscalPat: FieldRef<"tbPatrimonio", 'String'>
    readonly valorPat: FieldRef<"tbPatrimonio", 'Float'>
    readonly createdAt: FieldRef<"tbPatrimonio", 'DateTime'>
    readonly updatedAt: FieldRef<"tbPatrimonio", 'DateTime'>
    readonly idPat_TipoPat: FieldRef<"tbPatrimonio", 'String'>
    readonly idPat_StatusPat: FieldRef<"tbPatrimonio", 'String'>
    readonly idPat_CustoPat: FieldRef<"tbPatrimonio", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbPatrimonio findUnique
   */
  export type tbPatrimonioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * Filter, which tbPatrimonio to fetch.
     */
    where: tbPatrimonioWhereUniqueInput
  }

  /**
   * tbPatrimonio findUniqueOrThrow
   */
  export type tbPatrimonioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * Filter, which tbPatrimonio to fetch.
     */
    where: tbPatrimonioWhereUniqueInput
  }

  /**
   * tbPatrimonio findFirst
   */
  export type tbPatrimonioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * Filter, which tbPatrimonio to fetch.
     */
    where?: tbPatrimonioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbPatrimonios to fetch.
     */
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbPatrimonios.
     */
    cursor?: tbPatrimonioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbPatrimonios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbPatrimonios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbPatrimonios.
     */
    distinct?: TbPatrimonioScalarFieldEnum | TbPatrimonioScalarFieldEnum[]
  }

  /**
   * tbPatrimonio findFirstOrThrow
   */
  export type tbPatrimonioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * Filter, which tbPatrimonio to fetch.
     */
    where?: tbPatrimonioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbPatrimonios to fetch.
     */
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbPatrimonios.
     */
    cursor?: tbPatrimonioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbPatrimonios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbPatrimonios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbPatrimonios.
     */
    distinct?: TbPatrimonioScalarFieldEnum | TbPatrimonioScalarFieldEnum[]
  }

  /**
   * tbPatrimonio findMany
   */
  export type tbPatrimonioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * Filter, which tbPatrimonios to fetch.
     */
    where?: tbPatrimonioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbPatrimonios to fetch.
     */
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbPatrimonios.
     */
    cursor?: tbPatrimonioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbPatrimonios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbPatrimonios.
     */
    skip?: number
    distinct?: TbPatrimonioScalarFieldEnum | TbPatrimonioScalarFieldEnum[]
  }

  /**
   * tbPatrimonio create
   */
  export type tbPatrimonioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * The data needed to create a tbPatrimonio.
     */
    data: XOR<tbPatrimonioCreateInput, tbPatrimonioUncheckedCreateInput>
  }

  /**
   * tbPatrimonio createMany
   */
  export type tbPatrimonioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbPatrimonios.
     */
    data: tbPatrimonioCreateManyInput | tbPatrimonioCreateManyInput[]
  }

  /**
   * tbPatrimonio createManyAndReturn
   */
  export type tbPatrimonioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * The data used to create many tbPatrimonios.
     */
    data: tbPatrimonioCreateManyInput | tbPatrimonioCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbPatrimonio update
   */
  export type tbPatrimonioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * The data needed to update a tbPatrimonio.
     */
    data: XOR<tbPatrimonioUpdateInput, tbPatrimonioUncheckedUpdateInput>
    /**
     * Choose, which tbPatrimonio to update.
     */
    where: tbPatrimonioWhereUniqueInput
  }

  /**
   * tbPatrimonio updateMany
   */
  export type tbPatrimonioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbPatrimonios.
     */
    data: XOR<tbPatrimonioUpdateManyMutationInput, tbPatrimonioUncheckedUpdateManyInput>
    /**
     * Filter which tbPatrimonios to update
     */
    where?: tbPatrimonioWhereInput
    /**
     * Limit how many tbPatrimonios to update.
     */
    limit?: number
  }

  /**
   * tbPatrimonio updateManyAndReturn
   */
  export type tbPatrimonioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * The data used to update tbPatrimonios.
     */
    data: XOR<tbPatrimonioUpdateManyMutationInput, tbPatrimonioUncheckedUpdateManyInput>
    /**
     * Filter which tbPatrimonios to update
     */
    where?: tbPatrimonioWhereInput
    /**
     * Limit how many tbPatrimonios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbPatrimonio upsert
   */
  export type tbPatrimonioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * The filter to search for the tbPatrimonio to update in case it exists.
     */
    where: tbPatrimonioWhereUniqueInput
    /**
     * In case the tbPatrimonio found by the `where` argument doesn't exist, create a new tbPatrimonio with this data.
     */
    create: XOR<tbPatrimonioCreateInput, tbPatrimonioUncheckedCreateInput>
    /**
     * In case the tbPatrimonio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbPatrimonioUpdateInput, tbPatrimonioUncheckedUpdateInput>
  }

  /**
   * tbPatrimonio delete
   */
  export type tbPatrimonioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    /**
     * Filter which tbPatrimonio to delete.
     */
    where: tbPatrimonioWhereUniqueInput
  }

  /**
   * tbPatrimonio deleteMany
   */
  export type tbPatrimonioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbPatrimonios to delete
     */
    where?: tbPatrimonioWhereInput
    /**
     * Limit how many tbPatrimonios to delete.
     */
    limit?: number
  }

  /**
   * tbPatrimonio.tbTipoPat
   */
  export type tbPatrimonio$tbTipoPatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    where?: tbTipoPatWhereInput
  }

  /**
   * tbPatrimonio.tbStatusPat
   */
  export type tbPatrimonio$tbStatusPatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    where?: tbStatusPatWhereInput
  }

  /**
   * tbPatrimonio.tbCCusto
   */
  export type tbPatrimonio$tbCCustoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    where?: tbCCustoWhereInput
  }

  /**
   * tbPatrimonio.tbCadastro
   */
  export type tbPatrimonio$tbCadastroArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    where?: tbCadastroWhereInput
    orderBy?: tbCadastroOrderByWithRelationInput | tbCadastroOrderByWithRelationInput[]
    cursor?: tbCadastroWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbCadastroScalarFieldEnum | TbCadastroScalarFieldEnum[]
  }

  /**
   * tbPatrimonio without action
   */
  export type tbPatrimonioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
  }


  /**
   * Model tbTipoPat
   */

  export type AggregateTbTipoPat = {
    _count: TbTipoPatCountAggregateOutputType | null
    _min: TbTipoPatMinAggregateOutputType | null
    _max: TbTipoPatMaxAggregateOutputType | null
  }

  export type TbTipoPatMinAggregateOutputType = {
    idTipPat: string | null
    descricaoTipPat: string | null
  }

  export type TbTipoPatMaxAggregateOutputType = {
    idTipPat: string | null
    descricaoTipPat: string | null
  }

  export type TbTipoPatCountAggregateOutputType = {
    idTipPat: number
    descricaoTipPat: number
    _all: number
  }


  export type TbTipoPatMinAggregateInputType = {
    idTipPat?: true
    descricaoTipPat?: true
  }

  export type TbTipoPatMaxAggregateInputType = {
    idTipPat?: true
    descricaoTipPat?: true
  }

  export type TbTipoPatCountAggregateInputType = {
    idTipPat?: true
    descricaoTipPat?: true
    _all?: true
  }

  export type TbTipoPatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbTipoPat to aggregate.
     */
    where?: tbTipoPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbTipoPats to fetch.
     */
    orderBy?: tbTipoPatOrderByWithRelationInput | tbTipoPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbTipoPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbTipoPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbTipoPats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbTipoPats
    **/
    _count?: true | TbTipoPatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbTipoPatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbTipoPatMaxAggregateInputType
  }

  export type GetTbTipoPatAggregateType<T extends TbTipoPatAggregateArgs> = {
        [P in keyof T & keyof AggregateTbTipoPat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbTipoPat[P]>
      : GetScalarType<T[P], AggregateTbTipoPat[P]>
  }




  export type tbTipoPatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbTipoPatWhereInput
    orderBy?: tbTipoPatOrderByWithAggregationInput | tbTipoPatOrderByWithAggregationInput[]
    by: TbTipoPatScalarFieldEnum[] | TbTipoPatScalarFieldEnum
    having?: tbTipoPatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbTipoPatCountAggregateInputType | true
    _min?: TbTipoPatMinAggregateInputType
    _max?: TbTipoPatMaxAggregateInputType
  }

  export type TbTipoPatGroupByOutputType = {
    idTipPat: string
    descricaoTipPat: string | null
    _count: TbTipoPatCountAggregateOutputType | null
    _min: TbTipoPatMinAggregateOutputType | null
    _max: TbTipoPatMaxAggregateOutputType | null
  }

  type GetTbTipoPatGroupByPayload<T extends tbTipoPatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbTipoPatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbTipoPatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbTipoPatGroupByOutputType[P]>
            : GetScalarType<T[P], TbTipoPatGroupByOutputType[P]>
        }
      >
    >


  export type tbTipoPatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTipPat?: boolean
    descricaoTipPat?: boolean
    tbPatrimonio?: boolean | tbTipoPat$tbPatrimonioArgs<ExtArgs>
    _count?: boolean | TbTipoPatCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbTipoPat"]>

  export type tbTipoPatSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTipPat?: boolean
    descricaoTipPat?: boolean
  }, ExtArgs["result"]["tbTipoPat"]>

  export type tbTipoPatSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTipPat?: boolean
    descricaoTipPat?: boolean
  }, ExtArgs["result"]["tbTipoPat"]>

  export type tbTipoPatSelectScalar = {
    idTipPat?: boolean
    descricaoTipPat?: boolean
  }

  export type tbTipoPatOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idTipPat" | "descricaoTipPat", ExtArgs["result"]["tbTipoPat"]>
  export type tbTipoPatInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | tbTipoPat$tbPatrimonioArgs<ExtArgs>
    _count?: boolean | TbTipoPatCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbTipoPatIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type tbTipoPatIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $tbTipoPatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbTipoPat"
    objects: {
      tbPatrimonio: Prisma.$tbPatrimonioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idTipPat: string
      descricaoTipPat: string | null
    }, ExtArgs["result"]["tbTipoPat"]>
    composites: {}
  }

  type tbTipoPatGetPayload<S extends boolean | null | undefined | tbTipoPatDefaultArgs> = $Result.GetResult<Prisma.$tbTipoPatPayload, S>

  type tbTipoPatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbTipoPatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbTipoPatCountAggregateInputType | true
    }

  export interface tbTipoPatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbTipoPat'], meta: { name: 'tbTipoPat' } }
    /**
     * Find zero or one TbTipoPat that matches the filter.
     * @param {tbTipoPatFindUniqueArgs} args - Arguments to find a TbTipoPat
     * @example
     * // Get one TbTipoPat
     * const tbTipoPat = await prisma.tbTipoPat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbTipoPatFindUniqueArgs>(args: SelectSubset<T, tbTipoPatFindUniqueArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbTipoPat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbTipoPatFindUniqueOrThrowArgs} args - Arguments to find a TbTipoPat
     * @example
     * // Get one TbTipoPat
     * const tbTipoPat = await prisma.tbTipoPat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbTipoPatFindUniqueOrThrowArgs>(args: SelectSubset<T, tbTipoPatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbTipoPat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbTipoPatFindFirstArgs} args - Arguments to find a TbTipoPat
     * @example
     * // Get one TbTipoPat
     * const tbTipoPat = await prisma.tbTipoPat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbTipoPatFindFirstArgs>(args?: SelectSubset<T, tbTipoPatFindFirstArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbTipoPat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbTipoPatFindFirstOrThrowArgs} args - Arguments to find a TbTipoPat
     * @example
     * // Get one TbTipoPat
     * const tbTipoPat = await prisma.tbTipoPat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbTipoPatFindFirstOrThrowArgs>(args?: SelectSubset<T, tbTipoPatFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbTipoPats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbTipoPatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbTipoPats
     * const tbTipoPats = await prisma.tbTipoPat.findMany()
     * 
     * // Get first 10 TbTipoPats
     * const tbTipoPats = await prisma.tbTipoPat.findMany({ take: 10 })
     * 
     * // Only select the `idTipPat`
     * const tbTipoPatWithIdTipPatOnly = await prisma.tbTipoPat.findMany({ select: { idTipPat: true } })
     * 
     */
    findMany<T extends tbTipoPatFindManyArgs>(args?: SelectSubset<T, tbTipoPatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbTipoPat.
     * @param {tbTipoPatCreateArgs} args - Arguments to create a TbTipoPat.
     * @example
     * // Create one TbTipoPat
     * const TbTipoPat = await prisma.tbTipoPat.create({
     *   data: {
     *     // ... data to create a TbTipoPat
     *   }
     * })
     * 
     */
    create<T extends tbTipoPatCreateArgs>(args: SelectSubset<T, tbTipoPatCreateArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbTipoPats.
     * @param {tbTipoPatCreateManyArgs} args - Arguments to create many TbTipoPats.
     * @example
     * // Create many TbTipoPats
     * const tbTipoPat = await prisma.tbTipoPat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbTipoPatCreateManyArgs>(args?: SelectSubset<T, tbTipoPatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbTipoPats and returns the data saved in the database.
     * @param {tbTipoPatCreateManyAndReturnArgs} args - Arguments to create many TbTipoPats.
     * @example
     * // Create many TbTipoPats
     * const tbTipoPat = await prisma.tbTipoPat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbTipoPats and only return the `idTipPat`
     * const tbTipoPatWithIdTipPatOnly = await prisma.tbTipoPat.createManyAndReturn({
     *   select: { idTipPat: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbTipoPatCreateManyAndReturnArgs>(args?: SelectSubset<T, tbTipoPatCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbTipoPat.
     * @param {tbTipoPatDeleteArgs} args - Arguments to delete one TbTipoPat.
     * @example
     * // Delete one TbTipoPat
     * const TbTipoPat = await prisma.tbTipoPat.delete({
     *   where: {
     *     // ... filter to delete one TbTipoPat
     *   }
     * })
     * 
     */
    delete<T extends tbTipoPatDeleteArgs>(args: SelectSubset<T, tbTipoPatDeleteArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbTipoPat.
     * @param {tbTipoPatUpdateArgs} args - Arguments to update one TbTipoPat.
     * @example
     * // Update one TbTipoPat
     * const tbTipoPat = await prisma.tbTipoPat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbTipoPatUpdateArgs>(args: SelectSubset<T, tbTipoPatUpdateArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbTipoPats.
     * @param {tbTipoPatDeleteManyArgs} args - Arguments to filter TbTipoPats to delete.
     * @example
     * // Delete a few TbTipoPats
     * const { count } = await prisma.tbTipoPat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbTipoPatDeleteManyArgs>(args?: SelectSubset<T, tbTipoPatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbTipoPats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbTipoPatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbTipoPats
     * const tbTipoPat = await prisma.tbTipoPat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbTipoPatUpdateManyArgs>(args: SelectSubset<T, tbTipoPatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbTipoPats and returns the data updated in the database.
     * @param {tbTipoPatUpdateManyAndReturnArgs} args - Arguments to update many TbTipoPats.
     * @example
     * // Update many TbTipoPats
     * const tbTipoPat = await prisma.tbTipoPat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbTipoPats and only return the `idTipPat`
     * const tbTipoPatWithIdTipPatOnly = await prisma.tbTipoPat.updateManyAndReturn({
     *   select: { idTipPat: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbTipoPatUpdateManyAndReturnArgs>(args: SelectSubset<T, tbTipoPatUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbTipoPat.
     * @param {tbTipoPatUpsertArgs} args - Arguments to update or create a TbTipoPat.
     * @example
     * // Update or create a TbTipoPat
     * const tbTipoPat = await prisma.tbTipoPat.upsert({
     *   create: {
     *     // ... data to create a TbTipoPat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbTipoPat we want to update
     *   }
     * })
     */
    upsert<T extends tbTipoPatUpsertArgs>(args: SelectSubset<T, tbTipoPatUpsertArgs<ExtArgs>>): Prisma__tbTipoPatClient<$Result.GetResult<Prisma.$tbTipoPatPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbTipoPats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbTipoPatCountArgs} args - Arguments to filter TbTipoPats to count.
     * @example
     * // Count the number of TbTipoPats
     * const count = await prisma.tbTipoPat.count({
     *   where: {
     *     // ... the filter for the TbTipoPats we want to count
     *   }
     * })
    **/
    count<T extends tbTipoPatCountArgs>(
      args?: Subset<T, tbTipoPatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbTipoPatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbTipoPat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbTipoPatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbTipoPatAggregateArgs>(args: Subset<T, TbTipoPatAggregateArgs>): Prisma.PrismaPromise<GetTbTipoPatAggregateType<T>>

    /**
     * Group by TbTipoPat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbTipoPatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbTipoPatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbTipoPatGroupByArgs['orderBy'] }
        : { orderBy?: tbTipoPatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbTipoPatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbTipoPatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbTipoPat model
   */
  readonly fields: tbTipoPatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbTipoPat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbTipoPatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbPatrimonio<T extends tbTipoPat$tbPatrimonioArgs<ExtArgs> = {}>(args?: Subset<T, tbTipoPat$tbPatrimonioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbTipoPat model
   */
  interface tbTipoPatFieldRefs {
    readonly idTipPat: FieldRef<"tbTipoPat", 'String'>
    readonly descricaoTipPat: FieldRef<"tbTipoPat", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbTipoPat findUnique
   */
  export type tbTipoPatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * Filter, which tbTipoPat to fetch.
     */
    where: tbTipoPatWhereUniqueInput
  }

  /**
   * tbTipoPat findUniqueOrThrow
   */
  export type tbTipoPatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * Filter, which tbTipoPat to fetch.
     */
    where: tbTipoPatWhereUniqueInput
  }

  /**
   * tbTipoPat findFirst
   */
  export type tbTipoPatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * Filter, which tbTipoPat to fetch.
     */
    where?: tbTipoPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbTipoPats to fetch.
     */
    orderBy?: tbTipoPatOrderByWithRelationInput | tbTipoPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbTipoPats.
     */
    cursor?: tbTipoPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbTipoPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbTipoPats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbTipoPats.
     */
    distinct?: TbTipoPatScalarFieldEnum | TbTipoPatScalarFieldEnum[]
  }

  /**
   * tbTipoPat findFirstOrThrow
   */
  export type tbTipoPatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * Filter, which tbTipoPat to fetch.
     */
    where?: tbTipoPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbTipoPats to fetch.
     */
    orderBy?: tbTipoPatOrderByWithRelationInput | tbTipoPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbTipoPats.
     */
    cursor?: tbTipoPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbTipoPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbTipoPats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbTipoPats.
     */
    distinct?: TbTipoPatScalarFieldEnum | TbTipoPatScalarFieldEnum[]
  }

  /**
   * tbTipoPat findMany
   */
  export type tbTipoPatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * Filter, which tbTipoPats to fetch.
     */
    where?: tbTipoPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbTipoPats to fetch.
     */
    orderBy?: tbTipoPatOrderByWithRelationInput | tbTipoPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbTipoPats.
     */
    cursor?: tbTipoPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbTipoPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbTipoPats.
     */
    skip?: number
    distinct?: TbTipoPatScalarFieldEnum | TbTipoPatScalarFieldEnum[]
  }

  /**
   * tbTipoPat create
   */
  export type tbTipoPatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * The data needed to create a tbTipoPat.
     */
    data?: XOR<tbTipoPatCreateInput, tbTipoPatUncheckedCreateInput>
  }

  /**
   * tbTipoPat createMany
   */
  export type tbTipoPatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbTipoPats.
     */
    data: tbTipoPatCreateManyInput | tbTipoPatCreateManyInput[]
  }

  /**
   * tbTipoPat createManyAndReturn
   */
  export type tbTipoPatCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * The data used to create many tbTipoPats.
     */
    data: tbTipoPatCreateManyInput | tbTipoPatCreateManyInput[]
  }

  /**
   * tbTipoPat update
   */
  export type tbTipoPatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * The data needed to update a tbTipoPat.
     */
    data: XOR<tbTipoPatUpdateInput, tbTipoPatUncheckedUpdateInput>
    /**
     * Choose, which tbTipoPat to update.
     */
    where: tbTipoPatWhereUniqueInput
  }

  /**
   * tbTipoPat updateMany
   */
  export type tbTipoPatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbTipoPats.
     */
    data: XOR<tbTipoPatUpdateManyMutationInput, tbTipoPatUncheckedUpdateManyInput>
    /**
     * Filter which tbTipoPats to update
     */
    where?: tbTipoPatWhereInput
    /**
     * Limit how many tbTipoPats to update.
     */
    limit?: number
  }

  /**
   * tbTipoPat updateManyAndReturn
   */
  export type tbTipoPatUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * The data used to update tbTipoPats.
     */
    data: XOR<tbTipoPatUpdateManyMutationInput, tbTipoPatUncheckedUpdateManyInput>
    /**
     * Filter which tbTipoPats to update
     */
    where?: tbTipoPatWhereInput
    /**
     * Limit how many tbTipoPats to update.
     */
    limit?: number
  }

  /**
   * tbTipoPat upsert
   */
  export type tbTipoPatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * The filter to search for the tbTipoPat to update in case it exists.
     */
    where: tbTipoPatWhereUniqueInput
    /**
     * In case the tbTipoPat found by the `where` argument doesn't exist, create a new tbTipoPat with this data.
     */
    create: XOR<tbTipoPatCreateInput, tbTipoPatUncheckedCreateInput>
    /**
     * In case the tbTipoPat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbTipoPatUpdateInput, tbTipoPatUncheckedUpdateInput>
  }

  /**
   * tbTipoPat delete
   */
  export type tbTipoPatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
    /**
     * Filter which tbTipoPat to delete.
     */
    where: tbTipoPatWhereUniqueInput
  }

  /**
   * tbTipoPat deleteMany
   */
  export type tbTipoPatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbTipoPats to delete
     */
    where?: tbTipoPatWhereInput
    /**
     * Limit how many tbTipoPats to delete.
     */
    limit?: number
  }

  /**
   * tbTipoPat.tbPatrimonio
   */
  export type tbTipoPat$tbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    where?: tbPatrimonioWhereInput
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    cursor?: tbPatrimonioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbPatrimonioScalarFieldEnum | TbPatrimonioScalarFieldEnum[]
  }

  /**
   * tbTipoPat without action
   */
  export type tbTipoPatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbTipoPat
     */
    select?: tbTipoPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbTipoPat
     */
    omit?: tbTipoPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbTipoPatInclude<ExtArgs> | null
  }


  /**
   * Model tbStatusPat
   */

  export type AggregateTbStatusPat = {
    _count: TbStatusPatCountAggregateOutputType | null
    _min: TbStatusPatMinAggregateOutputType | null
    _max: TbStatusPatMaxAggregateOutputType | null
  }

  export type TbStatusPatMinAggregateOutputType = {
    idStatusPat: string | null
    descricaoStatPat: string | null
  }

  export type TbStatusPatMaxAggregateOutputType = {
    idStatusPat: string | null
    descricaoStatPat: string | null
  }

  export type TbStatusPatCountAggregateOutputType = {
    idStatusPat: number
    descricaoStatPat: number
    _all: number
  }


  export type TbStatusPatMinAggregateInputType = {
    idStatusPat?: true
    descricaoStatPat?: true
  }

  export type TbStatusPatMaxAggregateInputType = {
    idStatusPat?: true
    descricaoStatPat?: true
  }

  export type TbStatusPatCountAggregateInputType = {
    idStatusPat?: true
    descricaoStatPat?: true
    _all?: true
  }

  export type TbStatusPatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbStatusPat to aggregate.
     */
    where?: tbStatusPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusPats to fetch.
     */
    orderBy?: tbStatusPatOrderByWithRelationInput | tbStatusPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbStatusPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusPats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbStatusPats
    **/
    _count?: true | TbStatusPatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbStatusPatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbStatusPatMaxAggregateInputType
  }

  export type GetTbStatusPatAggregateType<T extends TbStatusPatAggregateArgs> = {
        [P in keyof T & keyof AggregateTbStatusPat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbStatusPat[P]>
      : GetScalarType<T[P], AggregateTbStatusPat[P]>
  }




  export type tbStatusPatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbStatusPatWhereInput
    orderBy?: tbStatusPatOrderByWithAggregationInput | tbStatusPatOrderByWithAggregationInput[]
    by: TbStatusPatScalarFieldEnum[] | TbStatusPatScalarFieldEnum
    having?: tbStatusPatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbStatusPatCountAggregateInputType | true
    _min?: TbStatusPatMinAggregateInputType
    _max?: TbStatusPatMaxAggregateInputType
  }

  export type TbStatusPatGroupByOutputType = {
    idStatusPat: string
    descricaoStatPat: string
    _count: TbStatusPatCountAggregateOutputType | null
    _min: TbStatusPatMinAggregateOutputType | null
    _max: TbStatusPatMaxAggregateOutputType | null
  }

  type GetTbStatusPatGroupByPayload<T extends tbStatusPatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbStatusPatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbStatusPatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbStatusPatGroupByOutputType[P]>
            : GetScalarType<T[P], TbStatusPatGroupByOutputType[P]>
        }
      >
    >


  export type tbStatusPatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idStatusPat?: boolean
    descricaoStatPat?: boolean
    tbPatrimonio?: boolean | tbStatusPat$tbPatrimonioArgs<ExtArgs>
    _count?: boolean | TbStatusPatCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbStatusPat"]>

  export type tbStatusPatSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idStatusPat?: boolean
    descricaoStatPat?: boolean
  }, ExtArgs["result"]["tbStatusPat"]>

  export type tbStatusPatSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idStatusPat?: boolean
    descricaoStatPat?: boolean
  }, ExtArgs["result"]["tbStatusPat"]>

  export type tbStatusPatSelectScalar = {
    idStatusPat?: boolean
    descricaoStatPat?: boolean
  }

  export type tbStatusPatOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idStatusPat" | "descricaoStatPat", ExtArgs["result"]["tbStatusPat"]>
  export type tbStatusPatInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | tbStatusPat$tbPatrimonioArgs<ExtArgs>
    _count?: boolean | TbStatusPatCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbStatusPatIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type tbStatusPatIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $tbStatusPatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbStatusPat"
    objects: {
      tbPatrimonio: Prisma.$tbPatrimonioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idStatusPat: string
      descricaoStatPat: string
    }, ExtArgs["result"]["tbStatusPat"]>
    composites: {}
  }

  type tbStatusPatGetPayload<S extends boolean | null | undefined | tbStatusPatDefaultArgs> = $Result.GetResult<Prisma.$tbStatusPatPayload, S>

  type tbStatusPatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbStatusPatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbStatusPatCountAggregateInputType | true
    }

  export interface tbStatusPatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbStatusPat'], meta: { name: 'tbStatusPat' } }
    /**
     * Find zero or one TbStatusPat that matches the filter.
     * @param {tbStatusPatFindUniqueArgs} args - Arguments to find a TbStatusPat
     * @example
     * // Get one TbStatusPat
     * const tbStatusPat = await prisma.tbStatusPat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbStatusPatFindUniqueArgs>(args: SelectSubset<T, tbStatusPatFindUniqueArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbStatusPat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbStatusPatFindUniqueOrThrowArgs} args - Arguments to find a TbStatusPat
     * @example
     * // Get one TbStatusPat
     * const tbStatusPat = await prisma.tbStatusPat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbStatusPatFindUniqueOrThrowArgs>(args: SelectSubset<T, tbStatusPatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbStatusPat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusPatFindFirstArgs} args - Arguments to find a TbStatusPat
     * @example
     * // Get one TbStatusPat
     * const tbStatusPat = await prisma.tbStatusPat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbStatusPatFindFirstArgs>(args?: SelectSubset<T, tbStatusPatFindFirstArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbStatusPat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusPatFindFirstOrThrowArgs} args - Arguments to find a TbStatusPat
     * @example
     * // Get one TbStatusPat
     * const tbStatusPat = await prisma.tbStatusPat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbStatusPatFindFirstOrThrowArgs>(args?: SelectSubset<T, tbStatusPatFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbStatusPats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusPatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbStatusPats
     * const tbStatusPats = await prisma.tbStatusPat.findMany()
     * 
     * // Get first 10 TbStatusPats
     * const tbStatusPats = await prisma.tbStatusPat.findMany({ take: 10 })
     * 
     * // Only select the `idStatusPat`
     * const tbStatusPatWithIdStatusPatOnly = await prisma.tbStatusPat.findMany({ select: { idStatusPat: true } })
     * 
     */
    findMany<T extends tbStatusPatFindManyArgs>(args?: SelectSubset<T, tbStatusPatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbStatusPat.
     * @param {tbStatusPatCreateArgs} args - Arguments to create a TbStatusPat.
     * @example
     * // Create one TbStatusPat
     * const TbStatusPat = await prisma.tbStatusPat.create({
     *   data: {
     *     // ... data to create a TbStatusPat
     *   }
     * })
     * 
     */
    create<T extends tbStatusPatCreateArgs>(args: SelectSubset<T, tbStatusPatCreateArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbStatusPats.
     * @param {tbStatusPatCreateManyArgs} args - Arguments to create many TbStatusPats.
     * @example
     * // Create many TbStatusPats
     * const tbStatusPat = await prisma.tbStatusPat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbStatusPatCreateManyArgs>(args?: SelectSubset<T, tbStatusPatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbStatusPats and returns the data saved in the database.
     * @param {tbStatusPatCreateManyAndReturnArgs} args - Arguments to create many TbStatusPats.
     * @example
     * // Create many TbStatusPats
     * const tbStatusPat = await prisma.tbStatusPat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbStatusPats and only return the `idStatusPat`
     * const tbStatusPatWithIdStatusPatOnly = await prisma.tbStatusPat.createManyAndReturn({
     *   select: { idStatusPat: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbStatusPatCreateManyAndReturnArgs>(args?: SelectSubset<T, tbStatusPatCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbStatusPat.
     * @param {tbStatusPatDeleteArgs} args - Arguments to delete one TbStatusPat.
     * @example
     * // Delete one TbStatusPat
     * const TbStatusPat = await prisma.tbStatusPat.delete({
     *   where: {
     *     // ... filter to delete one TbStatusPat
     *   }
     * })
     * 
     */
    delete<T extends tbStatusPatDeleteArgs>(args: SelectSubset<T, tbStatusPatDeleteArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbStatusPat.
     * @param {tbStatusPatUpdateArgs} args - Arguments to update one TbStatusPat.
     * @example
     * // Update one TbStatusPat
     * const tbStatusPat = await prisma.tbStatusPat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbStatusPatUpdateArgs>(args: SelectSubset<T, tbStatusPatUpdateArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbStatusPats.
     * @param {tbStatusPatDeleteManyArgs} args - Arguments to filter TbStatusPats to delete.
     * @example
     * // Delete a few TbStatusPats
     * const { count } = await prisma.tbStatusPat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbStatusPatDeleteManyArgs>(args?: SelectSubset<T, tbStatusPatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbStatusPats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusPatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbStatusPats
     * const tbStatusPat = await prisma.tbStatusPat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbStatusPatUpdateManyArgs>(args: SelectSubset<T, tbStatusPatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbStatusPats and returns the data updated in the database.
     * @param {tbStatusPatUpdateManyAndReturnArgs} args - Arguments to update many TbStatusPats.
     * @example
     * // Update many TbStatusPats
     * const tbStatusPat = await prisma.tbStatusPat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbStatusPats and only return the `idStatusPat`
     * const tbStatusPatWithIdStatusPatOnly = await prisma.tbStatusPat.updateManyAndReturn({
     *   select: { idStatusPat: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbStatusPatUpdateManyAndReturnArgs>(args: SelectSubset<T, tbStatusPatUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbStatusPat.
     * @param {tbStatusPatUpsertArgs} args - Arguments to update or create a TbStatusPat.
     * @example
     * // Update or create a TbStatusPat
     * const tbStatusPat = await prisma.tbStatusPat.upsert({
     *   create: {
     *     // ... data to create a TbStatusPat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbStatusPat we want to update
     *   }
     * })
     */
    upsert<T extends tbStatusPatUpsertArgs>(args: SelectSubset<T, tbStatusPatUpsertArgs<ExtArgs>>): Prisma__tbStatusPatClient<$Result.GetResult<Prisma.$tbStatusPatPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbStatusPats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusPatCountArgs} args - Arguments to filter TbStatusPats to count.
     * @example
     * // Count the number of TbStatusPats
     * const count = await prisma.tbStatusPat.count({
     *   where: {
     *     // ... the filter for the TbStatusPats we want to count
     *   }
     * })
    **/
    count<T extends tbStatusPatCountArgs>(
      args?: Subset<T, tbStatusPatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbStatusPatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbStatusPat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbStatusPatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbStatusPatAggregateArgs>(args: Subset<T, TbStatusPatAggregateArgs>): Prisma.PrismaPromise<GetTbStatusPatAggregateType<T>>

    /**
     * Group by TbStatusPat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbStatusPatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbStatusPatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbStatusPatGroupByArgs['orderBy'] }
        : { orderBy?: tbStatusPatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbStatusPatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbStatusPatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbStatusPat model
   */
  readonly fields: tbStatusPatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbStatusPat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbStatusPatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbPatrimonio<T extends tbStatusPat$tbPatrimonioArgs<ExtArgs> = {}>(args?: Subset<T, tbStatusPat$tbPatrimonioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbStatusPat model
   */
  interface tbStatusPatFieldRefs {
    readonly idStatusPat: FieldRef<"tbStatusPat", 'String'>
    readonly descricaoStatPat: FieldRef<"tbStatusPat", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbStatusPat findUnique
   */
  export type tbStatusPatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusPat to fetch.
     */
    where: tbStatusPatWhereUniqueInput
  }

  /**
   * tbStatusPat findUniqueOrThrow
   */
  export type tbStatusPatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusPat to fetch.
     */
    where: tbStatusPatWhereUniqueInput
  }

  /**
   * tbStatusPat findFirst
   */
  export type tbStatusPatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusPat to fetch.
     */
    where?: tbStatusPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusPats to fetch.
     */
    orderBy?: tbStatusPatOrderByWithRelationInput | tbStatusPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbStatusPats.
     */
    cursor?: tbStatusPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusPats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbStatusPats.
     */
    distinct?: TbStatusPatScalarFieldEnum | TbStatusPatScalarFieldEnum[]
  }

  /**
   * tbStatusPat findFirstOrThrow
   */
  export type tbStatusPatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusPat to fetch.
     */
    where?: tbStatusPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusPats to fetch.
     */
    orderBy?: tbStatusPatOrderByWithRelationInput | tbStatusPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbStatusPats.
     */
    cursor?: tbStatusPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusPats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbStatusPats.
     */
    distinct?: TbStatusPatScalarFieldEnum | TbStatusPatScalarFieldEnum[]
  }

  /**
   * tbStatusPat findMany
   */
  export type tbStatusPatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * Filter, which tbStatusPats to fetch.
     */
    where?: tbStatusPatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbStatusPats to fetch.
     */
    orderBy?: tbStatusPatOrderByWithRelationInput | tbStatusPatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbStatusPats.
     */
    cursor?: tbStatusPatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbStatusPats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbStatusPats.
     */
    skip?: number
    distinct?: TbStatusPatScalarFieldEnum | TbStatusPatScalarFieldEnum[]
  }

  /**
   * tbStatusPat create
   */
  export type tbStatusPatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * The data needed to create a tbStatusPat.
     */
    data: XOR<tbStatusPatCreateInput, tbStatusPatUncheckedCreateInput>
  }

  /**
   * tbStatusPat createMany
   */
  export type tbStatusPatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbStatusPats.
     */
    data: tbStatusPatCreateManyInput | tbStatusPatCreateManyInput[]
  }

  /**
   * tbStatusPat createManyAndReturn
   */
  export type tbStatusPatCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * The data used to create many tbStatusPats.
     */
    data: tbStatusPatCreateManyInput | tbStatusPatCreateManyInput[]
  }

  /**
   * tbStatusPat update
   */
  export type tbStatusPatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * The data needed to update a tbStatusPat.
     */
    data: XOR<tbStatusPatUpdateInput, tbStatusPatUncheckedUpdateInput>
    /**
     * Choose, which tbStatusPat to update.
     */
    where: tbStatusPatWhereUniqueInput
  }

  /**
   * tbStatusPat updateMany
   */
  export type tbStatusPatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbStatusPats.
     */
    data: XOR<tbStatusPatUpdateManyMutationInput, tbStatusPatUncheckedUpdateManyInput>
    /**
     * Filter which tbStatusPats to update
     */
    where?: tbStatusPatWhereInput
    /**
     * Limit how many tbStatusPats to update.
     */
    limit?: number
  }

  /**
   * tbStatusPat updateManyAndReturn
   */
  export type tbStatusPatUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * The data used to update tbStatusPats.
     */
    data: XOR<tbStatusPatUpdateManyMutationInput, tbStatusPatUncheckedUpdateManyInput>
    /**
     * Filter which tbStatusPats to update
     */
    where?: tbStatusPatWhereInput
    /**
     * Limit how many tbStatusPats to update.
     */
    limit?: number
  }

  /**
   * tbStatusPat upsert
   */
  export type tbStatusPatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * The filter to search for the tbStatusPat to update in case it exists.
     */
    where: tbStatusPatWhereUniqueInput
    /**
     * In case the tbStatusPat found by the `where` argument doesn't exist, create a new tbStatusPat with this data.
     */
    create: XOR<tbStatusPatCreateInput, tbStatusPatUncheckedCreateInput>
    /**
     * In case the tbStatusPat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbStatusPatUpdateInput, tbStatusPatUncheckedUpdateInput>
  }

  /**
   * tbStatusPat delete
   */
  export type tbStatusPatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
    /**
     * Filter which tbStatusPat to delete.
     */
    where: tbStatusPatWhereUniqueInput
  }

  /**
   * tbStatusPat deleteMany
   */
  export type tbStatusPatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbStatusPats to delete
     */
    where?: tbStatusPatWhereInput
    /**
     * Limit how many tbStatusPats to delete.
     */
    limit?: number
  }

  /**
   * tbStatusPat.tbPatrimonio
   */
  export type tbStatusPat$tbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    where?: tbPatrimonioWhereInput
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    cursor?: tbPatrimonioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbPatrimonioScalarFieldEnum | TbPatrimonioScalarFieldEnum[]
  }

  /**
   * tbStatusPat without action
   */
  export type tbStatusPatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbStatusPat
     */
    select?: tbStatusPatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbStatusPat
     */
    omit?: tbStatusPatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbStatusPatInclude<ExtArgs> | null
  }


  /**
   * Model tbEmpresa
   */

  export type AggregateTbEmpresa = {
    _count: TbEmpresaCountAggregateOutputType | null
    _min: TbEmpresaMinAggregateOutputType | null
    _max: TbEmpresaMaxAggregateOutputType | null
  }

  export type TbEmpresaMinAggregateOutputType = {
    idEmp: string | null
    razaoEmpresa: string | null
    fantasiaEmpresa: string | null
    cnpjEmpresa: string | null
    idCustEmp: string | null
  }

  export type TbEmpresaMaxAggregateOutputType = {
    idEmp: string | null
    razaoEmpresa: string | null
    fantasiaEmpresa: string | null
    cnpjEmpresa: string | null
    idCustEmp: string | null
  }

  export type TbEmpresaCountAggregateOutputType = {
    idEmp: number
    razaoEmpresa: number
    fantasiaEmpresa: number
    cnpjEmpresa: number
    idCustEmp: number
    _all: number
  }


  export type TbEmpresaMinAggregateInputType = {
    idEmp?: true
    razaoEmpresa?: true
    fantasiaEmpresa?: true
    cnpjEmpresa?: true
    idCustEmp?: true
  }

  export type TbEmpresaMaxAggregateInputType = {
    idEmp?: true
    razaoEmpresa?: true
    fantasiaEmpresa?: true
    cnpjEmpresa?: true
    idCustEmp?: true
  }

  export type TbEmpresaCountAggregateInputType = {
    idEmp?: true
    razaoEmpresa?: true
    fantasiaEmpresa?: true
    cnpjEmpresa?: true
    idCustEmp?: true
    _all?: true
  }

  export type TbEmpresaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbEmpresa to aggregate.
     */
    where?: tbEmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbEmpresas to fetch.
     */
    orderBy?: tbEmpresaOrderByWithRelationInput | tbEmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbEmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbEmpresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbEmpresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbEmpresas
    **/
    _count?: true | TbEmpresaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbEmpresaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbEmpresaMaxAggregateInputType
  }

  export type GetTbEmpresaAggregateType<T extends TbEmpresaAggregateArgs> = {
        [P in keyof T & keyof AggregateTbEmpresa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbEmpresa[P]>
      : GetScalarType<T[P], AggregateTbEmpresa[P]>
  }




  export type tbEmpresaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbEmpresaWhereInput
    orderBy?: tbEmpresaOrderByWithAggregationInput | tbEmpresaOrderByWithAggregationInput[]
    by: TbEmpresaScalarFieldEnum[] | TbEmpresaScalarFieldEnum
    having?: tbEmpresaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbEmpresaCountAggregateInputType | true
    _min?: TbEmpresaMinAggregateInputType
    _max?: TbEmpresaMaxAggregateInputType
  }

  export type TbEmpresaGroupByOutputType = {
    idEmp: string
    razaoEmpresa: string | null
    fantasiaEmpresa: string | null
    cnpjEmpresa: string | null
    idCustEmp: string | null
    _count: TbEmpresaCountAggregateOutputType | null
    _min: TbEmpresaMinAggregateOutputType | null
    _max: TbEmpresaMaxAggregateOutputType | null
  }

  type GetTbEmpresaGroupByPayload<T extends tbEmpresaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbEmpresaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbEmpresaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbEmpresaGroupByOutputType[P]>
            : GetScalarType<T[P], TbEmpresaGroupByOutputType[P]>
        }
      >
    >


  export type tbEmpresaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idEmp?: boolean
    razaoEmpresa?: boolean
    fantasiaEmpresa?: boolean
    cnpjEmpresa?: boolean
    idCustEmp?: boolean
    tbCCusto?: boolean | tbEmpresa$tbCCustoArgs<ExtArgs>
    _count?: boolean | TbEmpresaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbEmpresa"]>

  export type tbEmpresaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idEmp?: boolean
    razaoEmpresa?: boolean
    fantasiaEmpresa?: boolean
    cnpjEmpresa?: boolean
    idCustEmp?: boolean
  }, ExtArgs["result"]["tbEmpresa"]>

  export type tbEmpresaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idEmp?: boolean
    razaoEmpresa?: boolean
    fantasiaEmpresa?: boolean
    cnpjEmpresa?: boolean
    idCustEmp?: boolean
  }, ExtArgs["result"]["tbEmpresa"]>

  export type tbEmpresaSelectScalar = {
    idEmp?: boolean
    razaoEmpresa?: boolean
    fantasiaEmpresa?: boolean
    cnpjEmpresa?: boolean
    idCustEmp?: boolean
  }

  export type tbEmpresaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idEmp" | "razaoEmpresa" | "fantasiaEmpresa" | "cnpjEmpresa" | "idCustEmp", ExtArgs["result"]["tbEmpresa"]>
  export type tbEmpresaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbCCusto?: boolean | tbEmpresa$tbCCustoArgs<ExtArgs>
    _count?: boolean | TbEmpresaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbEmpresaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type tbEmpresaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $tbEmpresaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbEmpresa"
    objects: {
      tbCCusto: Prisma.$tbCCustoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idEmp: string
      razaoEmpresa: string | null
      fantasiaEmpresa: string | null
      cnpjEmpresa: string | null
      idCustEmp: string | null
    }, ExtArgs["result"]["tbEmpresa"]>
    composites: {}
  }

  type tbEmpresaGetPayload<S extends boolean | null | undefined | tbEmpresaDefaultArgs> = $Result.GetResult<Prisma.$tbEmpresaPayload, S>

  type tbEmpresaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbEmpresaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbEmpresaCountAggregateInputType | true
    }

  export interface tbEmpresaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbEmpresa'], meta: { name: 'tbEmpresa' } }
    /**
     * Find zero or one TbEmpresa that matches the filter.
     * @param {tbEmpresaFindUniqueArgs} args - Arguments to find a TbEmpresa
     * @example
     * // Get one TbEmpresa
     * const tbEmpresa = await prisma.tbEmpresa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbEmpresaFindUniqueArgs>(args: SelectSubset<T, tbEmpresaFindUniqueArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbEmpresa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbEmpresaFindUniqueOrThrowArgs} args - Arguments to find a TbEmpresa
     * @example
     * // Get one TbEmpresa
     * const tbEmpresa = await prisma.tbEmpresa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbEmpresaFindUniqueOrThrowArgs>(args: SelectSubset<T, tbEmpresaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbEmpresa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbEmpresaFindFirstArgs} args - Arguments to find a TbEmpresa
     * @example
     * // Get one TbEmpresa
     * const tbEmpresa = await prisma.tbEmpresa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbEmpresaFindFirstArgs>(args?: SelectSubset<T, tbEmpresaFindFirstArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbEmpresa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbEmpresaFindFirstOrThrowArgs} args - Arguments to find a TbEmpresa
     * @example
     * // Get one TbEmpresa
     * const tbEmpresa = await prisma.tbEmpresa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbEmpresaFindFirstOrThrowArgs>(args?: SelectSubset<T, tbEmpresaFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbEmpresas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbEmpresaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbEmpresas
     * const tbEmpresas = await prisma.tbEmpresa.findMany()
     * 
     * // Get first 10 TbEmpresas
     * const tbEmpresas = await prisma.tbEmpresa.findMany({ take: 10 })
     * 
     * // Only select the `idEmp`
     * const tbEmpresaWithIdEmpOnly = await prisma.tbEmpresa.findMany({ select: { idEmp: true } })
     * 
     */
    findMany<T extends tbEmpresaFindManyArgs>(args?: SelectSubset<T, tbEmpresaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbEmpresa.
     * @param {tbEmpresaCreateArgs} args - Arguments to create a TbEmpresa.
     * @example
     * // Create one TbEmpresa
     * const TbEmpresa = await prisma.tbEmpresa.create({
     *   data: {
     *     // ... data to create a TbEmpresa
     *   }
     * })
     * 
     */
    create<T extends tbEmpresaCreateArgs>(args: SelectSubset<T, tbEmpresaCreateArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbEmpresas.
     * @param {tbEmpresaCreateManyArgs} args - Arguments to create many TbEmpresas.
     * @example
     * // Create many TbEmpresas
     * const tbEmpresa = await prisma.tbEmpresa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbEmpresaCreateManyArgs>(args?: SelectSubset<T, tbEmpresaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbEmpresas and returns the data saved in the database.
     * @param {tbEmpresaCreateManyAndReturnArgs} args - Arguments to create many TbEmpresas.
     * @example
     * // Create many TbEmpresas
     * const tbEmpresa = await prisma.tbEmpresa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbEmpresas and only return the `idEmp`
     * const tbEmpresaWithIdEmpOnly = await prisma.tbEmpresa.createManyAndReturn({
     *   select: { idEmp: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbEmpresaCreateManyAndReturnArgs>(args?: SelectSubset<T, tbEmpresaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbEmpresa.
     * @param {tbEmpresaDeleteArgs} args - Arguments to delete one TbEmpresa.
     * @example
     * // Delete one TbEmpresa
     * const TbEmpresa = await prisma.tbEmpresa.delete({
     *   where: {
     *     // ... filter to delete one TbEmpresa
     *   }
     * })
     * 
     */
    delete<T extends tbEmpresaDeleteArgs>(args: SelectSubset<T, tbEmpresaDeleteArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbEmpresa.
     * @param {tbEmpresaUpdateArgs} args - Arguments to update one TbEmpresa.
     * @example
     * // Update one TbEmpresa
     * const tbEmpresa = await prisma.tbEmpresa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbEmpresaUpdateArgs>(args: SelectSubset<T, tbEmpresaUpdateArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbEmpresas.
     * @param {tbEmpresaDeleteManyArgs} args - Arguments to filter TbEmpresas to delete.
     * @example
     * // Delete a few TbEmpresas
     * const { count } = await prisma.tbEmpresa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbEmpresaDeleteManyArgs>(args?: SelectSubset<T, tbEmpresaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbEmpresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbEmpresaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbEmpresas
     * const tbEmpresa = await prisma.tbEmpresa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbEmpresaUpdateManyArgs>(args: SelectSubset<T, tbEmpresaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbEmpresas and returns the data updated in the database.
     * @param {tbEmpresaUpdateManyAndReturnArgs} args - Arguments to update many TbEmpresas.
     * @example
     * // Update many TbEmpresas
     * const tbEmpresa = await prisma.tbEmpresa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbEmpresas and only return the `idEmp`
     * const tbEmpresaWithIdEmpOnly = await prisma.tbEmpresa.updateManyAndReturn({
     *   select: { idEmp: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbEmpresaUpdateManyAndReturnArgs>(args: SelectSubset<T, tbEmpresaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbEmpresa.
     * @param {tbEmpresaUpsertArgs} args - Arguments to update or create a TbEmpresa.
     * @example
     * // Update or create a TbEmpresa
     * const tbEmpresa = await prisma.tbEmpresa.upsert({
     *   create: {
     *     // ... data to create a TbEmpresa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbEmpresa we want to update
     *   }
     * })
     */
    upsert<T extends tbEmpresaUpsertArgs>(args: SelectSubset<T, tbEmpresaUpsertArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbEmpresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbEmpresaCountArgs} args - Arguments to filter TbEmpresas to count.
     * @example
     * // Count the number of TbEmpresas
     * const count = await prisma.tbEmpresa.count({
     *   where: {
     *     // ... the filter for the TbEmpresas we want to count
     *   }
     * })
    **/
    count<T extends tbEmpresaCountArgs>(
      args?: Subset<T, tbEmpresaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbEmpresaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbEmpresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbEmpresaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbEmpresaAggregateArgs>(args: Subset<T, TbEmpresaAggregateArgs>): Prisma.PrismaPromise<GetTbEmpresaAggregateType<T>>

    /**
     * Group by TbEmpresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbEmpresaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbEmpresaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbEmpresaGroupByArgs['orderBy'] }
        : { orderBy?: tbEmpresaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbEmpresaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbEmpresaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbEmpresa model
   */
  readonly fields: tbEmpresaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbEmpresa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbEmpresaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbCCusto<T extends tbEmpresa$tbCCustoArgs<ExtArgs> = {}>(args?: Subset<T, tbEmpresa$tbCCustoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbEmpresa model
   */
  interface tbEmpresaFieldRefs {
    readonly idEmp: FieldRef<"tbEmpresa", 'String'>
    readonly razaoEmpresa: FieldRef<"tbEmpresa", 'String'>
    readonly fantasiaEmpresa: FieldRef<"tbEmpresa", 'String'>
    readonly cnpjEmpresa: FieldRef<"tbEmpresa", 'String'>
    readonly idCustEmp: FieldRef<"tbEmpresa", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbEmpresa findUnique
   */
  export type tbEmpresaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * Filter, which tbEmpresa to fetch.
     */
    where: tbEmpresaWhereUniqueInput
  }

  /**
   * tbEmpresa findUniqueOrThrow
   */
  export type tbEmpresaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * Filter, which tbEmpresa to fetch.
     */
    where: tbEmpresaWhereUniqueInput
  }

  /**
   * tbEmpresa findFirst
   */
  export type tbEmpresaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * Filter, which tbEmpresa to fetch.
     */
    where?: tbEmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbEmpresas to fetch.
     */
    orderBy?: tbEmpresaOrderByWithRelationInput | tbEmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbEmpresas.
     */
    cursor?: tbEmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbEmpresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbEmpresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbEmpresas.
     */
    distinct?: TbEmpresaScalarFieldEnum | TbEmpresaScalarFieldEnum[]
  }

  /**
   * tbEmpresa findFirstOrThrow
   */
  export type tbEmpresaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * Filter, which tbEmpresa to fetch.
     */
    where?: tbEmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbEmpresas to fetch.
     */
    orderBy?: tbEmpresaOrderByWithRelationInput | tbEmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbEmpresas.
     */
    cursor?: tbEmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbEmpresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbEmpresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbEmpresas.
     */
    distinct?: TbEmpresaScalarFieldEnum | TbEmpresaScalarFieldEnum[]
  }

  /**
   * tbEmpresa findMany
   */
  export type tbEmpresaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * Filter, which tbEmpresas to fetch.
     */
    where?: tbEmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbEmpresas to fetch.
     */
    orderBy?: tbEmpresaOrderByWithRelationInput | tbEmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbEmpresas.
     */
    cursor?: tbEmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbEmpresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbEmpresas.
     */
    skip?: number
    distinct?: TbEmpresaScalarFieldEnum | TbEmpresaScalarFieldEnum[]
  }

  /**
   * tbEmpresa create
   */
  export type tbEmpresaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * The data needed to create a tbEmpresa.
     */
    data?: XOR<tbEmpresaCreateInput, tbEmpresaUncheckedCreateInput>
  }

  /**
   * tbEmpresa createMany
   */
  export type tbEmpresaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbEmpresas.
     */
    data: tbEmpresaCreateManyInput | tbEmpresaCreateManyInput[]
  }

  /**
   * tbEmpresa createManyAndReturn
   */
  export type tbEmpresaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * The data used to create many tbEmpresas.
     */
    data: tbEmpresaCreateManyInput | tbEmpresaCreateManyInput[]
  }

  /**
   * tbEmpresa update
   */
  export type tbEmpresaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * The data needed to update a tbEmpresa.
     */
    data: XOR<tbEmpresaUpdateInput, tbEmpresaUncheckedUpdateInput>
    /**
     * Choose, which tbEmpresa to update.
     */
    where: tbEmpresaWhereUniqueInput
  }

  /**
   * tbEmpresa updateMany
   */
  export type tbEmpresaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbEmpresas.
     */
    data: XOR<tbEmpresaUpdateManyMutationInput, tbEmpresaUncheckedUpdateManyInput>
    /**
     * Filter which tbEmpresas to update
     */
    where?: tbEmpresaWhereInput
    /**
     * Limit how many tbEmpresas to update.
     */
    limit?: number
  }

  /**
   * tbEmpresa updateManyAndReturn
   */
  export type tbEmpresaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * The data used to update tbEmpresas.
     */
    data: XOR<tbEmpresaUpdateManyMutationInput, tbEmpresaUncheckedUpdateManyInput>
    /**
     * Filter which tbEmpresas to update
     */
    where?: tbEmpresaWhereInput
    /**
     * Limit how many tbEmpresas to update.
     */
    limit?: number
  }

  /**
   * tbEmpresa upsert
   */
  export type tbEmpresaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * The filter to search for the tbEmpresa to update in case it exists.
     */
    where: tbEmpresaWhereUniqueInput
    /**
     * In case the tbEmpresa found by the `where` argument doesn't exist, create a new tbEmpresa with this data.
     */
    create: XOR<tbEmpresaCreateInput, tbEmpresaUncheckedCreateInput>
    /**
     * In case the tbEmpresa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbEmpresaUpdateInput, tbEmpresaUncheckedUpdateInput>
  }

  /**
   * tbEmpresa delete
   */
  export type tbEmpresaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    /**
     * Filter which tbEmpresa to delete.
     */
    where: tbEmpresaWhereUniqueInput
  }

  /**
   * tbEmpresa deleteMany
   */
  export type tbEmpresaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbEmpresas to delete
     */
    where?: tbEmpresaWhereInput
    /**
     * Limit how many tbEmpresas to delete.
     */
    limit?: number
  }

  /**
   * tbEmpresa.tbCCusto
   */
  export type tbEmpresa$tbCCustoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    where?: tbCCustoWhereInput
    orderBy?: tbCCustoOrderByWithRelationInput | tbCCustoOrderByWithRelationInput[]
    cursor?: tbCCustoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbCCustoScalarFieldEnum | TbCCustoScalarFieldEnum[]
  }

  /**
   * tbEmpresa without action
   */
  export type tbEmpresaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
  }


  /**
   * Model tbCCusto
   */

  export type AggregateTbCCusto = {
    _count: TbCCustoCountAggregateOutputType | null
    _min: TbCCustoMinAggregateOutputType | null
    _max: TbCCustoMaxAggregateOutputType | null
  }

  export type TbCCustoMinAggregateOutputType = {
    idCCusto: string | null
    codigoCCusto: string | null
    descricaoCCusto: string | null
    idEmp_Custo: string | null
  }

  export type TbCCustoMaxAggregateOutputType = {
    idCCusto: string | null
    codigoCCusto: string | null
    descricaoCCusto: string | null
    idEmp_Custo: string | null
  }

  export type TbCCustoCountAggregateOutputType = {
    idCCusto: number
    codigoCCusto: number
    descricaoCCusto: number
    idEmp_Custo: number
    _all: number
  }


  export type TbCCustoMinAggregateInputType = {
    idCCusto?: true
    codigoCCusto?: true
    descricaoCCusto?: true
    idEmp_Custo?: true
  }

  export type TbCCustoMaxAggregateInputType = {
    idCCusto?: true
    codigoCCusto?: true
    descricaoCCusto?: true
    idEmp_Custo?: true
  }

  export type TbCCustoCountAggregateInputType = {
    idCCusto?: true
    codigoCCusto?: true
    descricaoCCusto?: true
    idEmp_Custo?: true
    _all?: true
  }

  export type TbCCustoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbCCusto to aggregate.
     */
    where?: tbCCustoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCCustos to fetch.
     */
    orderBy?: tbCCustoOrderByWithRelationInput | tbCCustoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbCCustoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCCustos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCCustos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbCCustos
    **/
    _count?: true | TbCCustoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbCCustoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbCCustoMaxAggregateInputType
  }

  export type GetTbCCustoAggregateType<T extends TbCCustoAggregateArgs> = {
        [P in keyof T & keyof AggregateTbCCusto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbCCusto[P]>
      : GetScalarType<T[P], AggregateTbCCusto[P]>
  }




  export type tbCCustoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbCCustoWhereInput
    orderBy?: tbCCustoOrderByWithAggregationInput | tbCCustoOrderByWithAggregationInput[]
    by: TbCCustoScalarFieldEnum[] | TbCCustoScalarFieldEnum
    having?: tbCCustoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbCCustoCountAggregateInputType | true
    _min?: TbCCustoMinAggregateInputType
    _max?: TbCCustoMaxAggregateInputType
  }

  export type TbCCustoGroupByOutputType = {
    idCCusto: string
    codigoCCusto: string | null
    descricaoCCusto: string | null
    idEmp_Custo: string | null
    _count: TbCCustoCountAggregateOutputType | null
    _min: TbCCustoMinAggregateOutputType | null
    _max: TbCCustoMaxAggregateOutputType | null
  }

  type GetTbCCustoGroupByPayload<T extends tbCCustoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbCCustoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbCCustoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbCCustoGroupByOutputType[P]>
            : GetScalarType<T[P], TbCCustoGroupByOutputType[P]>
        }
      >
    >


  export type tbCCustoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCCusto?: boolean
    codigoCCusto?: boolean
    descricaoCCusto?: boolean
    idEmp_Custo?: boolean
    tbEmpresa?: boolean | tbCCusto$tbEmpresaArgs<ExtArgs>
    tbPatrimonio?: boolean | tbCCusto$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCCusto$tbFuncionarioArgs<ExtArgs>
    _count?: boolean | TbCCustoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbCCusto"]>

  export type tbCCustoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCCusto?: boolean
    codigoCCusto?: boolean
    descricaoCCusto?: boolean
    idEmp_Custo?: boolean
    tbEmpresa?: boolean | tbCCusto$tbEmpresaArgs<ExtArgs>
  }, ExtArgs["result"]["tbCCusto"]>

  export type tbCCustoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCCusto?: boolean
    codigoCCusto?: boolean
    descricaoCCusto?: boolean
    idEmp_Custo?: boolean
    tbEmpresa?: boolean | tbCCusto$tbEmpresaArgs<ExtArgs>
  }, ExtArgs["result"]["tbCCusto"]>

  export type tbCCustoSelectScalar = {
    idCCusto?: boolean
    codigoCCusto?: boolean
    descricaoCCusto?: boolean
    idEmp_Custo?: boolean
  }

  export type tbCCustoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idCCusto" | "codigoCCusto" | "descricaoCCusto" | "idEmp_Custo", ExtArgs["result"]["tbCCusto"]>
  export type tbCCustoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbEmpresa?: boolean | tbCCusto$tbEmpresaArgs<ExtArgs>
    tbPatrimonio?: boolean | tbCCusto$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCCusto$tbFuncionarioArgs<ExtArgs>
    _count?: boolean | TbCCustoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type tbCCustoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbEmpresa?: boolean | tbCCusto$tbEmpresaArgs<ExtArgs>
  }
  export type tbCCustoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbEmpresa?: boolean | tbCCusto$tbEmpresaArgs<ExtArgs>
  }

  export type $tbCCustoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbCCusto"
    objects: {
      tbEmpresa: Prisma.$tbEmpresaPayload<ExtArgs> | null
      tbPatrimonio: Prisma.$tbPatrimonioPayload<ExtArgs>[]
      tbFuncionario: Prisma.$tbFuncionarioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idCCusto: string
      codigoCCusto: string | null
      descricaoCCusto: string | null
      idEmp_Custo: string | null
    }, ExtArgs["result"]["tbCCusto"]>
    composites: {}
  }

  type tbCCustoGetPayload<S extends boolean | null | undefined | tbCCustoDefaultArgs> = $Result.GetResult<Prisma.$tbCCustoPayload, S>

  type tbCCustoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbCCustoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbCCustoCountAggregateInputType | true
    }

  export interface tbCCustoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbCCusto'], meta: { name: 'tbCCusto' } }
    /**
     * Find zero or one TbCCusto that matches the filter.
     * @param {tbCCustoFindUniqueArgs} args - Arguments to find a TbCCusto
     * @example
     * // Get one TbCCusto
     * const tbCCusto = await prisma.tbCCusto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbCCustoFindUniqueArgs>(args: SelectSubset<T, tbCCustoFindUniqueArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbCCusto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbCCustoFindUniqueOrThrowArgs} args - Arguments to find a TbCCusto
     * @example
     * // Get one TbCCusto
     * const tbCCusto = await prisma.tbCCusto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbCCustoFindUniqueOrThrowArgs>(args: SelectSubset<T, tbCCustoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCCusto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCCustoFindFirstArgs} args - Arguments to find a TbCCusto
     * @example
     * // Get one TbCCusto
     * const tbCCusto = await prisma.tbCCusto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbCCustoFindFirstArgs>(args?: SelectSubset<T, tbCCustoFindFirstArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCCusto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCCustoFindFirstOrThrowArgs} args - Arguments to find a TbCCusto
     * @example
     * // Get one TbCCusto
     * const tbCCusto = await prisma.tbCCusto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbCCustoFindFirstOrThrowArgs>(args?: SelectSubset<T, tbCCustoFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbCCustos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCCustoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbCCustos
     * const tbCCustos = await prisma.tbCCusto.findMany()
     * 
     * // Get first 10 TbCCustos
     * const tbCCustos = await prisma.tbCCusto.findMany({ take: 10 })
     * 
     * // Only select the `idCCusto`
     * const tbCCustoWithIdCCustoOnly = await prisma.tbCCusto.findMany({ select: { idCCusto: true } })
     * 
     */
    findMany<T extends tbCCustoFindManyArgs>(args?: SelectSubset<T, tbCCustoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbCCusto.
     * @param {tbCCustoCreateArgs} args - Arguments to create a TbCCusto.
     * @example
     * // Create one TbCCusto
     * const TbCCusto = await prisma.tbCCusto.create({
     *   data: {
     *     // ... data to create a TbCCusto
     *   }
     * })
     * 
     */
    create<T extends tbCCustoCreateArgs>(args: SelectSubset<T, tbCCustoCreateArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbCCustos.
     * @param {tbCCustoCreateManyArgs} args - Arguments to create many TbCCustos.
     * @example
     * // Create many TbCCustos
     * const tbCCusto = await prisma.tbCCusto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbCCustoCreateManyArgs>(args?: SelectSubset<T, tbCCustoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbCCustos and returns the data saved in the database.
     * @param {tbCCustoCreateManyAndReturnArgs} args - Arguments to create many TbCCustos.
     * @example
     * // Create many TbCCustos
     * const tbCCusto = await prisma.tbCCusto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbCCustos and only return the `idCCusto`
     * const tbCCustoWithIdCCustoOnly = await prisma.tbCCusto.createManyAndReturn({
     *   select: { idCCusto: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbCCustoCreateManyAndReturnArgs>(args?: SelectSubset<T, tbCCustoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbCCusto.
     * @param {tbCCustoDeleteArgs} args - Arguments to delete one TbCCusto.
     * @example
     * // Delete one TbCCusto
     * const TbCCusto = await prisma.tbCCusto.delete({
     *   where: {
     *     // ... filter to delete one TbCCusto
     *   }
     * })
     * 
     */
    delete<T extends tbCCustoDeleteArgs>(args: SelectSubset<T, tbCCustoDeleteArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbCCusto.
     * @param {tbCCustoUpdateArgs} args - Arguments to update one TbCCusto.
     * @example
     * // Update one TbCCusto
     * const tbCCusto = await prisma.tbCCusto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbCCustoUpdateArgs>(args: SelectSubset<T, tbCCustoUpdateArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbCCustos.
     * @param {tbCCustoDeleteManyArgs} args - Arguments to filter TbCCustos to delete.
     * @example
     * // Delete a few TbCCustos
     * const { count } = await prisma.tbCCusto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbCCustoDeleteManyArgs>(args?: SelectSubset<T, tbCCustoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCCustos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCCustoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbCCustos
     * const tbCCusto = await prisma.tbCCusto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbCCustoUpdateManyArgs>(args: SelectSubset<T, tbCCustoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCCustos and returns the data updated in the database.
     * @param {tbCCustoUpdateManyAndReturnArgs} args - Arguments to update many TbCCustos.
     * @example
     * // Update many TbCCustos
     * const tbCCusto = await prisma.tbCCusto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbCCustos and only return the `idCCusto`
     * const tbCCustoWithIdCCustoOnly = await prisma.tbCCusto.updateManyAndReturn({
     *   select: { idCCusto: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbCCustoUpdateManyAndReturnArgs>(args: SelectSubset<T, tbCCustoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbCCusto.
     * @param {tbCCustoUpsertArgs} args - Arguments to update or create a TbCCusto.
     * @example
     * // Update or create a TbCCusto
     * const tbCCusto = await prisma.tbCCusto.upsert({
     *   create: {
     *     // ... data to create a TbCCusto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbCCusto we want to update
     *   }
     * })
     */
    upsert<T extends tbCCustoUpsertArgs>(args: SelectSubset<T, tbCCustoUpsertArgs<ExtArgs>>): Prisma__tbCCustoClient<$Result.GetResult<Prisma.$tbCCustoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbCCustos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCCustoCountArgs} args - Arguments to filter TbCCustos to count.
     * @example
     * // Count the number of TbCCustos
     * const count = await prisma.tbCCusto.count({
     *   where: {
     *     // ... the filter for the TbCCustos we want to count
     *   }
     * })
    **/
    count<T extends tbCCustoCountArgs>(
      args?: Subset<T, tbCCustoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbCCustoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbCCusto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCCustoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbCCustoAggregateArgs>(args: Subset<T, TbCCustoAggregateArgs>): Prisma.PrismaPromise<GetTbCCustoAggregateType<T>>

    /**
     * Group by TbCCusto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCCustoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbCCustoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbCCustoGroupByArgs['orderBy'] }
        : { orderBy?: tbCCustoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbCCustoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbCCustoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbCCusto model
   */
  readonly fields: tbCCustoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbCCusto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbCCustoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbEmpresa<T extends tbCCusto$tbEmpresaArgs<ExtArgs> = {}>(args?: Subset<T, tbCCusto$tbEmpresaArgs<ExtArgs>>): Prisma__tbEmpresaClient<$Result.GetResult<Prisma.$tbEmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbPatrimonio<T extends tbCCusto$tbPatrimonioArgs<ExtArgs> = {}>(args?: Subset<T, tbCCusto$tbPatrimonioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tbFuncionario<T extends tbCCusto$tbFuncionarioArgs<ExtArgs> = {}>(args?: Subset<T, tbCCusto$tbFuncionarioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbCCusto model
   */
  interface tbCCustoFieldRefs {
    readonly idCCusto: FieldRef<"tbCCusto", 'String'>
    readonly codigoCCusto: FieldRef<"tbCCusto", 'String'>
    readonly descricaoCCusto: FieldRef<"tbCCusto", 'String'>
    readonly idEmp_Custo: FieldRef<"tbCCusto", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbCCusto findUnique
   */
  export type tbCCustoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * Filter, which tbCCusto to fetch.
     */
    where: tbCCustoWhereUniqueInput
  }

  /**
   * tbCCusto findUniqueOrThrow
   */
  export type tbCCustoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * Filter, which tbCCusto to fetch.
     */
    where: tbCCustoWhereUniqueInput
  }

  /**
   * tbCCusto findFirst
   */
  export type tbCCustoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * Filter, which tbCCusto to fetch.
     */
    where?: tbCCustoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCCustos to fetch.
     */
    orderBy?: tbCCustoOrderByWithRelationInput | tbCCustoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbCCustos.
     */
    cursor?: tbCCustoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCCustos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCCustos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbCCustos.
     */
    distinct?: TbCCustoScalarFieldEnum | TbCCustoScalarFieldEnum[]
  }

  /**
   * tbCCusto findFirstOrThrow
   */
  export type tbCCustoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * Filter, which tbCCusto to fetch.
     */
    where?: tbCCustoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCCustos to fetch.
     */
    orderBy?: tbCCustoOrderByWithRelationInput | tbCCustoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbCCustos.
     */
    cursor?: tbCCustoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCCustos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCCustos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbCCustos.
     */
    distinct?: TbCCustoScalarFieldEnum | TbCCustoScalarFieldEnum[]
  }

  /**
   * tbCCusto findMany
   */
  export type tbCCustoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * Filter, which tbCCustos to fetch.
     */
    where?: tbCCustoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCCustos to fetch.
     */
    orderBy?: tbCCustoOrderByWithRelationInput | tbCCustoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbCCustos.
     */
    cursor?: tbCCustoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCCustos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCCustos.
     */
    skip?: number
    distinct?: TbCCustoScalarFieldEnum | TbCCustoScalarFieldEnum[]
  }

  /**
   * tbCCusto create
   */
  export type tbCCustoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * The data needed to create a tbCCusto.
     */
    data?: XOR<tbCCustoCreateInput, tbCCustoUncheckedCreateInput>
  }

  /**
   * tbCCusto createMany
   */
  export type tbCCustoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbCCustos.
     */
    data: tbCCustoCreateManyInput | tbCCustoCreateManyInput[]
  }

  /**
   * tbCCusto createManyAndReturn
   */
  export type tbCCustoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * The data used to create many tbCCustos.
     */
    data: tbCCustoCreateManyInput | tbCCustoCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbCCusto update
   */
  export type tbCCustoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * The data needed to update a tbCCusto.
     */
    data: XOR<tbCCustoUpdateInput, tbCCustoUncheckedUpdateInput>
    /**
     * Choose, which tbCCusto to update.
     */
    where: tbCCustoWhereUniqueInput
  }

  /**
   * tbCCusto updateMany
   */
  export type tbCCustoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbCCustos.
     */
    data: XOR<tbCCustoUpdateManyMutationInput, tbCCustoUncheckedUpdateManyInput>
    /**
     * Filter which tbCCustos to update
     */
    where?: tbCCustoWhereInput
    /**
     * Limit how many tbCCustos to update.
     */
    limit?: number
  }

  /**
   * tbCCusto updateManyAndReturn
   */
  export type tbCCustoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * The data used to update tbCCustos.
     */
    data: XOR<tbCCustoUpdateManyMutationInput, tbCCustoUncheckedUpdateManyInput>
    /**
     * Filter which tbCCustos to update
     */
    where?: tbCCustoWhereInput
    /**
     * Limit how many tbCCustos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbCCusto upsert
   */
  export type tbCCustoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * The filter to search for the tbCCusto to update in case it exists.
     */
    where: tbCCustoWhereUniqueInput
    /**
     * In case the tbCCusto found by the `where` argument doesn't exist, create a new tbCCusto with this data.
     */
    create: XOR<tbCCustoCreateInput, tbCCustoUncheckedCreateInput>
    /**
     * In case the tbCCusto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbCCustoUpdateInput, tbCCustoUncheckedUpdateInput>
  }

  /**
   * tbCCusto delete
   */
  export type tbCCustoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
    /**
     * Filter which tbCCusto to delete.
     */
    where: tbCCustoWhereUniqueInput
  }

  /**
   * tbCCusto deleteMany
   */
  export type tbCCustoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbCCustos to delete
     */
    where?: tbCCustoWhereInput
    /**
     * Limit how many tbCCustos to delete.
     */
    limit?: number
  }

  /**
   * tbCCusto.tbEmpresa
   */
  export type tbCCusto$tbEmpresaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbEmpresa
     */
    select?: tbEmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbEmpresa
     */
    omit?: tbEmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbEmpresaInclude<ExtArgs> | null
    where?: tbEmpresaWhereInput
  }

  /**
   * tbCCusto.tbPatrimonio
   */
  export type tbCCusto$tbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    where?: tbPatrimonioWhereInput
    orderBy?: tbPatrimonioOrderByWithRelationInput | tbPatrimonioOrderByWithRelationInput[]
    cursor?: tbPatrimonioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbPatrimonioScalarFieldEnum | TbPatrimonioScalarFieldEnum[]
  }

  /**
   * tbCCusto.tbFuncionario
   */
  export type tbCCusto$tbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    where?: tbFuncionarioWhereInput
    orderBy?: tbFuncionarioOrderByWithRelationInput | tbFuncionarioOrderByWithRelationInput[]
    cursor?: tbFuncionarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TbFuncionarioScalarFieldEnum | TbFuncionarioScalarFieldEnum[]
  }

  /**
   * tbCCusto without action
   */
  export type tbCCustoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCCusto
     */
    select?: tbCCustoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCCusto
     */
    omit?: tbCCustoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCCustoInclude<ExtArgs> | null
  }


  /**
   * Model tbCadastro
   */

  export type AggregateTbCadastro = {
    _count: TbCadastroCountAggregateOutputType | null
    _min: TbCadastroMinAggregateOutputType | null
    _max: TbCadastroMaxAggregateOutputType | null
  }

  export type TbCadastroMinAggregateOutputType = {
    idCad: string | null
    dataCadPat: Date | null
    dataDevPat: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    idPatCad: string | null
    idMatFunCad: string | null
  }

  export type TbCadastroMaxAggregateOutputType = {
    idCad: string | null
    dataCadPat: Date | null
    dataDevPat: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    idPatCad: string | null
    idMatFunCad: string | null
  }

  export type TbCadastroCountAggregateOutputType = {
    idCad: number
    dataCadPat: number
    dataDevPat: number
    createdAt: number
    updatedAt: number
    idPatCad: number
    idMatFunCad: number
    _all: number
  }


  export type TbCadastroMinAggregateInputType = {
    idCad?: true
    dataCadPat?: true
    dataDevPat?: true
    createdAt?: true
    updatedAt?: true
    idPatCad?: true
    idMatFunCad?: true
  }

  export type TbCadastroMaxAggregateInputType = {
    idCad?: true
    dataCadPat?: true
    dataDevPat?: true
    createdAt?: true
    updatedAt?: true
    idPatCad?: true
    idMatFunCad?: true
  }

  export type TbCadastroCountAggregateInputType = {
    idCad?: true
    dataCadPat?: true
    dataDevPat?: true
    createdAt?: true
    updatedAt?: true
    idPatCad?: true
    idMatFunCad?: true
    _all?: true
  }

  export type TbCadastroAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbCadastro to aggregate.
     */
    where?: tbCadastroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCadastros to fetch.
     */
    orderBy?: tbCadastroOrderByWithRelationInput | tbCadastroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbCadastroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCadastros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCadastros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbCadastros
    **/
    _count?: true | TbCadastroCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbCadastroMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbCadastroMaxAggregateInputType
  }

  export type GetTbCadastroAggregateType<T extends TbCadastroAggregateArgs> = {
        [P in keyof T & keyof AggregateTbCadastro]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbCadastro[P]>
      : GetScalarType<T[P], AggregateTbCadastro[P]>
  }




  export type tbCadastroGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbCadastroWhereInput
    orderBy?: tbCadastroOrderByWithAggregationInput | tbCadastroOrderByWithAggregationInput[]
    by: TbCadastroScalarFieldEnum[] | TbCadastroScalarFieldEnum
    having?: tbCadastroScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbCadastroCountAggregateInputType | true
    _min?: TbCadastroMinAggregateInputType
    _max?: TbCadastroMaxAggregateInputType
  }

  export type TbCadastroGroupByOutputType = {
    idCad: string
    dataCadPat: Date | null
    dataDevPat: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    idPatCad: string | null
    idMatFunCad: string | null
    _count: TbCadastroCountAggregateOutputType | null
    _min: TbCadastroMinAggregateOutputType | null
    _max: TbCadastroMaxAggregateOutputType | null
  }

  type GetTbCadastroGroupByPayload<T extends tbCadastroGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbCadastroGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbCadastroGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbCadastroGroupByOutputType[P]>
            : GetScalarType<T[P], TbCadastroGroupByOutputType[P]>
        }
      >
    >


  export type tbCadastroSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCad?: boolean
    dataCadPat?: boolean
    dataDevPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPatCad?: boolean
    idMatFunCad?: boolean
    tbPatrimonio?: boolean | tbCadastro$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCadastro$tbFuncionarioArgs<ExtArgs>
  }, ExtArgs["result"]["tbCadastro"]>

  export type tbCadastroSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCad?: boolean
    dataCadPat?: boolean
    dataDevPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPatCad?: boolean
    idMatFunCad?: boolean
    tbPatrimonio?: boolean | tbCadastro$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCadastro$tbFuncionarioArgs<ExtArgs>
  }, ExtArgs["result"]["tbCadastro"]>

  export type tbCadastroSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCad?: boolean
    dataCadPat?: boolean
    dataDevPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPatCad?: boolean
    idMatFunCad?: boolean
    tbPatrimonio?: boolean | tbCadastro$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCadastro$tbFuncionarioArgs<ExtArgs>
  }, ExtArgs["result"]["tbCadastro"]>

  export type tbCadastroSelectScalar = {
    idCad?: boolean
    dataCadPat?: boolean
    dataDevPat?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    idPatCad?: boolean
    idMatFunCad?: boolean
  }

  export type tbCadastroOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idCad" | "dataCadPat" | "dataDevPat" | "createdAt" | "updatedAt" | "idPatCad" | "idMatFunCad", ExtArgs["result"]["tbCadastro"]>
  export type tbCadastroInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | tbCadastro$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCadastro$tbFuncionarioArgs<ExtArgs>
  }
  export type tbCadastroIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | tbCadastro$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCadastro$tbFuncionarioArgs<ExtArgs>
  }
  export type tbCadastroIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbPatrimonio?: boolean | tbCadastro$tbPatrimonioArgs<ExtArgs>
    tbFuncionario?: boolean | tbCadastro$tbFuncionarioArgs<ExtArgs>
  }

  export type $tbCadastroPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbCadastro"
    objects: {
      tbPatrimonio: Prisma.$tbPatrimonioPayload<ExtArgs> | null
      tbFuncionario: Prisma.$tbFuncionarioPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      idCad: string
      dataCadPat: Date | null
      dataDevPat: Date | null
      createdAt: Date | null
      updatedAt: Date | null
      idPatCad: string | null
      idMatFunCad: string | null
    }, ExtArgs["result"]["tbCadastro"]>
    composites: {}
  }

  type tbCadastroGetPayload<S extends boolean | null | undefined | tbCadastroDefaultArgs> = $Result.GetResult<Prisma.$tbCadastroPayload, S>

  type tbCadastroCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbCadastroFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbCadastroCountAggregateInputType | true
    }

  export interface tbCadastroDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbCadastro'], meta: { name: 'tbCadastro' } }
    /**
     * Find zero or one TbCadastro that matches the filter.
     * @param {tbCadastroFindUniqueArgs} args - Arguments to find a TbCadastro
     * @example
     * // Get one TbCadastro
     * const tbCadastro = await prisma.tbCadastro.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbCadastroFindUniqueArgs>(args: SelectSubset<T, tbCadastroFindUniqueArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbCadastro that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbCadastroFindUniqueOrThrowArgs} args - Arguments to find a TbCadastro
     * @example
     * // Get one TbCadastro
     * const tbCadastro = await prisma.tbCadastro.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbCadastroFindUniqueOrThrowArgs>(args: SelectSubset<T, tbCadastroFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCadastro that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCadastroFindFirstArgs} args - Arguments to find a TbCadastro
     * @example
     * // Get one TbCadastro
     * const tbCadastro = await prisma.tbCadastro.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbCadastroFindFirstArgs>(args?: SelectSubset<T, tbCadastroFindFirstArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCadastro that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCadastroFindFirstOrThrowArgs} args - Arguments to find a TbCadastro
     * @example
     * // Get one TbCadastro
     * const tbCadastro = await prisma.tbCadastro.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbCadastroFindFirstOrThrowArgs>(args?: SelectSubset<T, tbCadastroFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbCadastros that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCadastroFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbCadastros
     * const tbCadastros = await prisma.tbCadastro.findMany()
     * 
     * // Get first 10 TbCadastros
     * const tbCadastros = await prisma.tbCadastro.findMany({ take: 10 })
     * 
     * // Only select the `idCad`
     * const tbCadastroWithIdCadOnly = await prisma.tbCadastro.findMany({ select: { idCad: true } })
     * 
     */
    findMany<T extends tbCadastroFindManyArgs>(args?: SelectSubset<T, tbCadastroFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbCadastro.
     * @param {tbCadastroCreateArgs} args - Arguments to create a TbCadastro.
     * @example
     * // Create one TbCadastro
     * const TbCadastro = await prisma.tbCadastro.create({
     *   data: {
     *     // ... data to create a TbCadastro
     *   }
     * })
     * 
     */
    create<T extends tbCadastroCreateArgs>(args: SelectSubset<T, tbCadastroCreateArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbCadastros.
     * @param {tbCadastroCreateManyArgs} args - Arguments to create many TbCadastros.
     * @example
     * // Create many TbCadastros
     * const tbCadastro = await prisma.tbCadastro.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbCadastroCreateManyArgs>(args?: SelectSubset<T, tbCadastroCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbCadastros and returns the data saved in the database.
     * @param {tbCadastroCreateManyAndReturnArgs} args - Arguments to create many TbCadastros.
     * @example
     * // Create many TbCadastros
     * const tbCadastro = await prisma.tbCadastro.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbCadastros and only return the `idCad`
     * const tbCadastroWithIdCadOnly = await prisma.tbCadastro.createManyAndReturn({
     *   select: { idCad: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbCadastroCreateManyAndReturnArgs>(args?: SelectSubset<T, tbCadastroCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbCadastro.
     * @param {tbCadastroDeleteArgs} args - Arguments to delete one TbCadastro.
     * @example
     * // Delete one TbCadastro
     * const TbCadastro = await prisma.tbCadastro.delete({
     *   where: {
     *     // ... filter to delete one TbCadastro
     *   }
     * })
     * 
     */
    delete<T extends tbCadastroDeleteArgs>(args: SelectSubset<T, tbCadastroDeleteArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbCadastro.
     * @param {tbCadastroUpdateArgs} args - Arguments to update one TbCadastro.
     * @example
     * // Update one TbCadastro
     * const tbCadastro = await prisma.tbCadastro.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbCadastroUpdateArgs>(args: SelectSubset<T, tbCadastroUpdateArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbCadastros.
     * @param {tbCadastroDeleteManyArgs} args - Arguments to filter TbCadastros to delete.
     * @example
     * // Delete a few TbCadastros
     * const { count } = await prisma.tbCadastro.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbCadastroDeleteManyArgs>(args?: SelectSubset<T, tbCadastroDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCadastros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCadastroUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbCadastros
     * const tbCadastro = await prisma.tbCadastro.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbCadastroUpdateManyArgs>(args: SelectSubset<T, tbCadastroUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCadastros and returns the data updated in the database.
     * @param {tbCadastroUpdateManyAndReturnArgs} args - Arguments to update many TbCadastros.
     * @example
     * // Update many TbCadastros
     * const tbCadastro = await prisma.tbCadastro.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbCadastros and only return the `idCad`
     * const tbCadastroWithIdCadOnly = await prisma.tbCadastro.updateManyAndReturn({
     *   select: { idCad: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbCadastroUpdateManyAndReturnArgs>(args: SelectSubset<T, tbCadastroUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbCadastro.
     * @param {tbCadastroUpsertArgs} args - Arguments to update or create a TbCadastro.
     * @example
     * // Update or create a TbCadastro
     * const tbCadastro = await prisma.tbCadastro.upsert({
     *   create: {
     *     // ... data to create a TbCadastro
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbCadastro we want to update
     *   }
     * })
     */
    upsert<T extends tbCadastroUpsertArgs>(args: SelectSubset<T, tbCadastroUpsertArgs<ExtArgs>>): Prisma__tbCadastroClient<$Result.GetResult<Prisma.$tbCadastroPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbCadastros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCadastroCountArgs} args - Arguments to filter TbCadastros to count.
     * @example
     * // Count the number of TbCadastros
     * const count = await prisma.tbCadastro.count({
     *   where: {
     *     // ... the filter for the TbCadastros we want to count
     *   }
     * })
    **/
    count<T extends tbCadastroCountArgs>(
      args?: Subset<T, tbCadastroCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbCadastroCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbCadastro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCadastroAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbCadastroAggregateArgs>(args: Subset<T, TbCadastroAggregateArgs>): Prisma.PrismaPromise<GetTbCadastroAggregateType<T>>

    /**
     * Group by TbCadastro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbCadastroGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbCadastroGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbCadastroGroupByArgs['orderBy'] }
        : { orderBy?: tbCadastroGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbCadastroGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbCadastroGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbCadastro model
   */
  readonly fields: tbCadastroFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbCadastro.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbCadastroClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbPatrimonio<T extends tbCadastro$tbPatrimonioArgs<ExtArgs> = {}>(args?: Subset<T, tbCadastro$tbPatrimonioArgs<ExtArgs>>): Prisma__tbPatrimonioClient<$Result.GetResult<Prisma.$tbPatrimonioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tbFuncionario<T extends tbCadastro$tbFuncionarioArgs<ExtArgs> = {}>(args?: Subset<T, tbCadastro$tbFuncionarioArgs<ExtArgs>>): Prisma__tbFuncionarioClient<$Result.GetResult<Prisma.$tbFuncionarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbCadastro model
   */
  interface tbCadastroFieldRefs {
    readonly idCad: FieldRef<"tbCadastro", 'String'>
    readonly dataCadPat: FieldRef<"tbCadastro", 'DateTime'>
    readonly dataDevPat: FieldRef<"tbCadastro", 'DateTime'>
    readonly createdAt: FieldRef<"tbCadastro", 'DateTime'>
    readonly updatedAt: FieldRef<"tbCadastro", 'DateTime'>
    readonly idPatCad: FieldRef<"tbCadastro", 'String'>
    readonly idMatFunCad: FieldRef<"tbCadastro", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbCadastro findUnique
   */
  export type tbCadastroFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * Filter, which tbCadastro to fetch.
     */
    where: tbCadastroWhereUniqueInput
  }

  /**
   * tbCadastro findUniqueOrThrow
   */
  export type tbCadastroFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * Filter, which tbCadastro to fetch.
     */
    where: tbCadastroWhereUniqueInput
  }

  /**
   * tbCadastro findFirst
   */
  export type tbCadastroFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * Filter, which tbCadastro to fetch.
     */
    where?: tbCadastroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCadastros to fetch.
     */
    orderBy?: tbCadastroOrderByWithRelationInput | tbCadastroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbCadastros.
     */
    cursor?: tbCadastroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCadastros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCadastros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbCadastros.
     */
    distinct?: TbCadastroScalarFieldEnum | TbCadastroScalarFieldEnum[]
  }

  /**
   * tbCadastro findFirstOrThrow
   */
  export type tbCadastroFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * Filter, which tbCadastro to fetch.
     */
    where?: tbCadastroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCadastros to fetch.
     */
    orderBy?: tbCadastroOrderByWithRelationInput | tbCadastroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbCadastros.
     */
    cursor?: tbCadastroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCadastros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCadastros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbCadastros.
     */
    distinct?: TbCadastroScalarFieldEnum | TbCadastroScalarFieldEnum[]
  }

  /**
   * tbCadastro findMany
   */
  export type tbCadastroFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * Filter, which tbCadastros to fetch.
     */
    where?: tbCadastroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbCadastros to fetch.
     */
    orderBy?: tbCadastroOrderByWithRelationInput | tbCadastroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbCadastros.
     */
    cursor?: tbCadastroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbCadastros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbCadastros.
     */
    skip?: number
    distinct?: TbCadastroScalarFieldEnum | TbCadastroScalarFieldEnum[]
  }

  /**
   * tbCadastro create
   */
  export type tbCadastroCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * The data needed to create a tbCadastro.
     */
    data?: XOR<tbCadastroCreateInput, tbCadastroUncheckedCreateInput>
  }

  /**
   * tbCadastro createMany
   */
  export type tbCadastroCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbCadastros.
     */
    data: tbCadastroCreateManyInput | tbCadastroCreateManyInput[]
  }

  /**
   * tbCadastro createManyAndReturn
   */
  export type tbCadastroCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * The data used to create many tbCadastros.
     */
    data: tbCadastroCreateManyInput | tbCadastroCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbCadastro update
   */
  export type tbCadastroUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * The data needed to update a tbCadastro.
     */
    data: XOR<tbCadastroUpdateInput, tbCadastroUncheckedUpdateInput>
    /**
     * Choose, which tbCadastro to update.
     */
    where: tbCadastroWhereUniqueInput
  }

  /**
   * tbCadastro updateMany
   */
  export type tbCadastroUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbCadastros.
     */
    data: XOR<tbCadastroUpdateManyMutationInput, tbCadastroUncheckedUpdateManyInput>
    /**
     * Filter which tbCadastros to update
     */
    where?: tbCadastroWhereInput
    /**
     * Limit how many tbCadastros to update.
     */
    limit?: number
  }

  /**
   * tbCadastro updateManyAndReturn
   */
  export type tbCadastroUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * The data used to update tbCadastros.
     */
    data: XOR<tbCadastroUpdateManyMutationInput, tbCadastroUncheckedUpdateManyInput>
    /**
     * Filter which tbCadastros to update
     */
    where?: tbCadastroWhereInput
    /**
     * Limit how many tbCadastros to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbCadastro upsert
   */
  export type tbCadastroUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * The filter to search for the tbCadastro to update in case it exists.
     */
    where: tbCadastroWhereUniqueInput
    /**
     * In case the tbCadastro found by the `where` argument doesn't exist, create a new tbCadastro with this data.
     */
    create: XOR<tbCadastroCreateInput, tbCadastroUncheckedCreateInput>
    /**
     * In case the tbCadastro was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbCadastroUpdateInput, tbCadastroUncheckedUpdateInput>
  }

  /**
   * tbCadastro delete
   */
  export type tbCadastroDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
    /**
     * Filter which tbCadastro to delete.
     */
    where: tbCadastroWhereUniqueInput
  }

  /**
   * tbCadastro deleteMany
   */
  export type tbCadastroDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbCadastros to delete
     */
    where?: tbCadastroWhereInput
    /**
     * Limit how many tbCadastros to delete.
     */
    limit?: number
  }

  /**
   * tbCadastro.tbPatrimonio
   */
  export type tbCadastro$tbPatrimonioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbPatrimonio
     */
    select?: tbPatrimonioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbPatrimonio
     */
    omit?: tbPatrimonioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbPatrimonioInclude<ExtArgs> | null
    where?: tbPatrimonioWhereInput
  }

  /**
   * tbCadastro.tbFuncionario
   */
  export type tbCadastro$tbFuncionarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbFuncionario
     */
    select?: tbFuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbFuncionario
     */
    omit?: tbFuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbFuncionarioInclude<ExtArgs> | null
    where?: tbFuncionarioWhereInput
  }

  /**
   * tbCadastro without action
   */
  export type tbCadastroDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbCadastro
     */
    select?: tbCadastroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbCadastro
     */
    omit?: tbCadastroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbCadastroInclude<ExtArgs> | null
  }


  /**
   * Model tbAccont
   */

  export type AggregateTbAccont = {
    _count: TbAccontCountAggregateOutputType | null
    _avg: TbAccontAvgAggregateOutputType | null
    _sum: TbAccontSumAggregateOutputType | null
    _min: TbAccontMinAggregateOutputType | null
    _max: TbAccontMaxAggregateOutputType | null
  }

  export type TbAccontAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type TbAccontSumAggregateOutputType = {
    expires_at: number | null
  }

  export type TbAccontMinAggregateOutputType = {
    idAccont: string | null
    userID: string | null
    type: string | null
    provider: string | null
    providerAccontId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    sesseion_state: string | null
  }

  export type TbAccontMaxAggregateOutputType = {
    idAccont: string | null
    userID: string | null
    type: string | null
    provider: string | null
    providerAccontId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    sesseion_state: string | null
  }

  export type TbAccontCountAggregateOutputType = {
    idAccont: number
    userID: number
    type: number
    provider: number
    providerAccontId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    sesseion_state: number
    _all: number
  }


  export type TbAccontAvgAggregateInputType = {
    expires_at?: true
  }

  export type TbAccontSumAggregateInputType = {
    expires_at?: true
  }

  export type TbAccontMinAggregateInputType = {
    idAccont?: true
    userID?: true
    type?: true
    provider?: true
    providerAccontId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    sesseion_state?: true
  }

  export type TbAccontMaxAggregateInputType = {
    idAccont?: true
    userID?: true
    type?: true
    provider?: true
    providerAccontId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    sesseion_state?: true
  }

  export type TbAccontCountAggregateInputType = {
    idAccont?: true
    userID?: true
    type?: true
    provider?: true
    providerAccontId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    sesseion_state?: true
    _all?: true
  }

  export type TbAccontAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbAccont to aggregate.
     */
    where?: tbAccontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbAcconts to fetch.
     */
    orderBy?: tbAccontOrderByWithRelationInput | tbAccontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tbAccontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbAcconts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbAcconts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tbAcconts
    **/
    _count?: true | TbAccontCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TbAccontAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TbAccontSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbAccontMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbAccontMaxAggregateInputType
  }

  export type GetTbAccontAggregateType<T extends TbAccontAggregateArgs> = {
        [P in keyof T & keyof AggregateTbAccont]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbAccont[P]>
      : GetScalarType<T[P], AggregateTbAccont[P]>
  }




  export type tbAccontGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tbAccontWhereInput
    orderBy?: tbAccontOrderByWithAggregationInput | tbAccontOrderByWithAggregationInput[]
    by: TbAccontScalarFieldEnum[] | TbAccontScalarFieldEnum
    having?: tbAccontScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbAccontCountAggregateInputType | true
    _avg?: TbAccontAvgAggregateInputType
    _sum?: TbAccontSumAggregateInputType
    _min?: TbAccontMinAggregateInputType
    _max?: TbAccontMaxAggregateInputType
  }

  export type TbAccontGroupByOutputType = {
    idAccont: string
    userID: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    sesseion_state: string | null
    _count: TbAccontCountAggregateOutputType | null
    _avg: TbAccontAvgAggregateOutputType | null
    _sum: TbAccontSumAggregateOutputType | null
    _min: TbAccontMinAggregateOutputType | null
    _max: TbAccontMaxAggregateOutputType | null
  }

  type GetTbAccontGroupByPayload<T extends tbAccontGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbAccontGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbAccontGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbAccontGroupByOutputType[P]>
            : GetScalarType<T[P], TbAccontGroupByOutputType[P]>
        }
      >
    >


  export type tbAccontSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idAccont?: boolean
    userID?: boolean
    type?: boolean
    provider?: boolean
    providerAccontId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    sesseion_state?: boolean
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbAccont"]>

  export type tbAccontSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idAccont?: boolean
    userID?: boolean
    type?: boolean
    provider?: boolean
    providerAccontId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    sesseion_state?: boolean
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbAccont"]>

  export type tbAccontSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idAccont?: boolean
    userID?: boolean
    type?: boolean
    provider?: boolean
    providerAccontId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    sesseion_state?: boolean
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tbAccont"]>

  export type tbAccontSelectScalar = {
    idAccont?: boolean
    userID?: boolean
    type?: boolean
    provider?: boolean
    providerAccontId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    sesseion_state?: boolean
  }

  export type tbAccontOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idAccont" | "userID" | "type" | "provider" | "providerAccontId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "sesseion_state", ExtArgs["result"]["tbAccont"]>
  export type tbAccontInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }
  export type tbAccontIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }
  export type tbAccontIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }

  export type $tbAccontPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tbAccont"
    objects: {
      tbUser: Prisma.$tbUserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idAccont: string
      userID: string
      type: string
      provider: string
      providerAccontId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      sesseion_state: string | null
    }, ExtArgs["result"]["tbAccont"]>
    composites: {}
  }

  type tbAccontGetPayload<S extends boolean | null | undefined | tbAccontDefaultArgs> = $Result.GetResult<Prisma.$tbAccontPayload, S>

  type tbAccontCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tbAccontFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbAccontCountAggregateInputType | true
    }

  export interface tbAccontDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tbAccont'], meta: { name: 'tbAccont' } }
    /**
     * Find zero or one TbAccont that matches the filter.
     * @param {tbAccontFindUniqueArgs} args - Arguments to find a TbAccont
     * @example
     * // Get one TbAccont
     * const tbAccont = await prisma.tbAccont.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tbAccontFindUniqueArgs>(args: SelectSubset<T, tbAccontFindUniqueArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbAccont that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tbAccontFindUniqueOrThrowArgs} args - Arguments to find a TbAccont
     * @example
     * // Get one TbAccont
     * const tbAccont = await prisma.tbAccont.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tbAccontFindUniqueOrThrowArgs>(args: SelectSubset<T, tbAccontFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbAccont that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbAccontFindFirstArgs} args - Arguments to find a TbAccont
     * @example
     * // Get one TbAccont
     * const tbAccont = await prisma.tbAccont.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tbAccontFindFirstArgs>(args?: SelectSubset<T, tbAccontFindFirstArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbAccont that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbAccontFindFirstOrThrowArgs} args - Arguments to find a TbAccont
     * @example
     * // Get one TbAccont
     * const tbAccont = await prisma.tbAccont.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tbAccontFindFirstOrThrowArgs>(args?: SelectSubset<T, tbAccontFindFirstOrThrowArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbAcconts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbAccontFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbAcconts
     * const tbAcconts = await prisma.tbAccont.findMany()
     * 
     * // Get first 10 TbAcconts
     * const tbAcconts = await prisma.tbAccont.findMany({ take: 10 })
     * 
     * // Only select the `idAccont`
     * const tbAccontWithIdAccontOnly = await prisma.tbAccont.findMany({ select: { idAccont: true } })
     * 
     */
    findMany<T extends tbAccontFindManyArgs>(args?: SelectSubset<T, tbAccontFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbAccont.
     * @param {tbAccontCreateArgs} args - Arguments to create a TbAccont.
     * @example
     * // Create one TbAccont
     * const TbAccont = await prisma.tbAccont.create({
     *   data: {
     *     // ... data to create a TbAccont
     *   }
     * })
     * 
     */
    create<T extends tbAccontCreateArgs>(args: SelectSubset<T, tbAccontCreateArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbAcconts.
     * @param {tbAccontCreateManyArgs} args - Arguments to create many TbAcconts.
     * @example
     * // Create many TbAcconts
     * const tbAccont = await prisma.tbAccont.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tbAccontCreateManyArgs>(args?: SelectSubset<T, tbAccontCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TbAcconts and returns the data saved in the database.
     * @param {tbAccontCreateManyAndReturnArgs} args - Arguments to create many TbAcconts.
     * @example
     * // Create many TbAcconts
     * const tbAccont = await prisma.tbAccont.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TbAcconts and only return the `idAccont`
     * const tbAccontWithIdAccontOnly = await prisma.tbAccont.createManyAndReturn({
     *   select: { idAccont: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tbAccontCreateManyAndReturnArgs>(args?: SelectSubset<T, tbAccontCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TbAccont.
     * @param {tbAccontDeleteArgs} args - Arguments to delete one TbAccont.
     * @example
     * // Delete one TbAccont
     * const TbAccont = await prisma.tbAccont.delete({
     *   where: {
     *     // ... filter to delete one TbAccont
     *   }
     * })
     * 
     */
    delete<T extends tbAccontDeleteArgs>(args: SelectSubset<T, tbAccontDeleteArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbAccont.
     * @param {tbAccontUpdateArgs} args - Arguments to update one TbAccont.
     * @example
     * // Update one TbAccont
     * const tbAccont = await prisma.tbAccont.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tbAccontUpdateArgs>(args: SelectSubset<T, tbAccontUpdateArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbAcconts.
     * @param {tbAccontDeleteManyArgs} args - Arguments to filter TbAcconts to delete.
     * @example
     * // Delete a few TbAcconts
     * const { count } = await prisma.tbAccont.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tbAccontDeleteManyArgs>(args?: SelectSubset<T, tbAccontDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbAcconts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbAccontUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbAcconts
     * const tbAccont = await prisma.tbAccont.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tbAccontUpdateManyArgs>(args: SelectSubset<T, tbAccontUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbAcconts and returns the data updated in the database.
     * @param {tbAccontUpdateManyAndReturnArgs} args - Arguments to update many TbAcconts.
     * @example
     * // Update many TbAcconts
     * const tbAccont = await prisma.tbAccont.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TbAcconts and only return the `idAccont`
     * const tbAccontWithIdAccontOnly = await prisma.tbAccont.updateManyAndReturn({
     *   select: { idAccont: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tbAccontUpdateManyAndReturnArgs>(args: SelectSubset<T, tbAccontUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TbAccont.
     * @param {tbAccontUpsertArgs} args - Arguments to update or create a TbAccont.
     * @example
     * // Update or create a TbAccont
     * const tbAccont = await prisma.tbAccont.upsert({
     *   create: {
     *     // ... data to create a TbAccont
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbAccont we want to update
     *   }
     * })
     */
    upsert<T extends tbAccontUpsertArgs>(args: SelectSubset<T, tbAccontUpsertArgs<ExtArgs>>): Prisma__tbAccontClient<$Result.GetResult<Prisma.$tbAccontPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbAcconts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbAccontCountArgs} args - Arguments to filter TbAcconts to count.
     * @example
     * // Count the number of TbAcconts
     * const count = await prisma.tbAccont.count({
     *   where: {
     *     // ... the filter for the TbAcconts we want to count
     *   }
     * })
    **/
    count<T extends tbAccontCountArgs>(
      args?: Subset<T, tbAccontCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbAccontCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbAccont.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbAccontAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbAccontAggregateArgs>(args: Subset<T, TbAccontAggregateArgs>): Prisma.PrismaPromise<GetTbAccontAggregateType<T>>

    /**
     * Group by TbAccont.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tbAccontGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tbAccontGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tbAccontGroupByArgs['orderBy'] }
        : { orderBy?: tbAccontGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tbAccontGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbAccontGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tbAccont model
   */
  readonly fields: tbAccontFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tbAccont.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tbAccontClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbUser<T extends tbUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, tbUserDefaultArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tbAccont model
   */
  interface tbAccontFieldRefs {
    readonly idAccont: FieldRef<"tbAccont", 'String'>
    readonly userID: FieldRef<"tbAccont", 'String'>
    readonly type: FieldRef<"tbAccont", 'String'>
    readonly provider: FieldRef<"tbAccont", 'String'>
    readonly providerAccontId: FieldRef<"tbAccont", 'String'>
    readonly refresh_token: FieldRef<"tbAccont", 'String'>
    readonly access_token: FieldRef<"tbAccont", 'String'>
    readonly expires_at: FieldRef<"tbAccont", 'Int'>
    readonly token_type: FieldRef<"tbAccont", 'String'>
    readonly scope: FieldRef<"tbAccont", 'String'>
    readonly id_token: FieldRef<"tbAccont", 'String'>
    readonly sesseion_state: FieldRef<"tbAccont", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tbAccont findUnique
   */
  export type tbAccontFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * Filter, which tbAccont to fetch.
     */
    where: tbAccontWhereUniqueInput
  }

  /**
   * tbAccont findUniqueOrThrow
   */
  export type tbAccontFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * Filter, which tbAccont to fetch.
     */
    where: tbAccontWhereUniqueInput
  }

  /**
   * tbAccont findFirst
   */
  export type tbAccontFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * Filter, which tbAccont to fetch.
     */
    where?: tbAccontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbAcconts to fetch.
     */
    orderBy?: tbAccontOrderByWithRelationInput | tbAccontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbAcconts.
     */
    cursor?: tbAccontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbAcconts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbAcconts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbAcconts.
     */
    distinct?: TbAccontScalarFieldEnum | TbAccontScalarFieldEnum[]
  }

  /**
   * tbAccont findFirstOrThrow
   */
  export type tbAccontFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * Filter, which tbAccont to fetch.
     */
    where?: tbAccontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbAcconts to fetch.
     */
    orderBy?: tbAccontOrderByWithRelationInput | tbAccontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tbAcconts.
     */
    cursor?: tbAccontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbAcconts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbAcconts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tbAcconts.
     */
    distinct?: TbAccontScalarFieldEnum | TbAccontScalarFieldEnum[]
  }

  /**
   * tbAccont findMany
   */
  export type tbAccontFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * Filter, which tbAcconts to fetch.
     */
    where?: tbAccontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tbAcconts to fetch.
     */
    orderBy?: tbAccontOrderByWithRelationInput | tbAccontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tbAcconts.
     */
    cursor?: tbAccontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tbAcconts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tbAcconts.
     */
    skip?: number
    distinct?: TbAccontScalarFieldEnum | TbAccontScalarFieldEnum[]
  }

  /**
   * tbAccont create
   */
  export type tbAccontCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * The data needed to create a tbAccont.
     */
    data: XOR<tbAccontCreateInput, tbAccontUncheckedCreateInput>
  }

  /**
   * tbAccont createMany
   */
  export type tbAccontCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tbAcconts.
     */
    data: tbAccontCreateManyInput | tbAccontCreateManyInput[]
  }

  /**
   * tbAccont createManyAndReturn
   */
  export type tbAccontCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * The data used to create many tbAcconts.
     */
    data: tbAccontCreateManyInput | tbAccontCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbAccont update
   */
  export type tbAccontUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * The data needed to update a tbAccont.
     */
    data: XOR<tbAccontUpdateInput, tbAccontUncheckedUpdateInput>
    /**
     * Choose, which tbAccont to update.
     */
    where: tbAccontWhereUniqueInput
  }

  /**
   * tbAccont updateMany
   */
  export type tbAccontUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tbAcconts.
     */
    data: XOR<tbAccontUpdateManyMutationInput, tbAccontUncheckedUpdateManyInput>
    /**
     * Filter which tbAcconts to update
     */
    where?: tbAccontWhereInput
    /**
     * Limit how many tbAcconts to update.
     */
    limit?: number
  }

  /**
   * tbAccont updateManyAndReturn
   */
  export type tbAccontUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * The data used to update tbAcconts.
     */
    data: XOR<tbAccontUpdateManyMutationInput, tbAccontUncheckedUpdateManyInput>
    /**
     * Filter which tbAcconts to update
     */
    where?: tbAccontWhereInput
    /**
     * Limit how many tbAcconts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * tbAccont upsert
   */
  export type tbAccontUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * The filter to search for the tbAccont to update in case it exists.
     */
    where: tbAccontWhereUniqueInput
    /**
     * In case the tbAccont found by the `where` argument doesn't exist, create a new tbAccont with this data.
     */
    create: XOR<tbAccontCreateInput, tbAccontUncheckedCreateInput>
    /**
     * In case the tbAccont was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tbAccontUpdateInput, tbAccontUncheckedUpdateInput>
  }

  /**
   * tbAccont delete
   */
  export type tbAccontDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
    /**
     * Filter which tbAccont to delete.
     */
    where: tbAccontWhereUniqueInput
  }

  /**
   * tbAccont deleteMany
   */
  export type tbAccontDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tbAcconts to delete
     */
    where?: tbAccontWhereInput
    /**
     * Limit how many tbAcconts to delete.
     */
    limit?: number
  }

  /**
   * tbAccont without action
   */
  export type tbAccontDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tbAccont
     */
    select?: tbAccontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tbAccont
     */
    omit?: tbAccontOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tbAccontInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tbUser?: boolean | tbUserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      tbUser: Prisma.$tbUserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tbUser<T extends tbUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, tbUserDefaultArgs<ExtArgs>>): Prisma__tbUserClient<$Result.GetResult<Prisma.$tbUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date | null
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date | null
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TbUserScalarFieldEnum: {
    idU: 'idU',
    idUser: 'idUser',
    nomeUser: 'nomeUser',
    emailUser: 'emailUser',
    senhaUser: 'senhaUser',
    avatarUser: 'avatarUser',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TbUserScalarFieldEnum = (typeof TbUserScalarFieldEnum)[keyof typeof TbUserScalarFieldEnum]


  export const TbFuncionarioScalarFieldEnum: {
    idF: 'idF',
    idMatFun: 'idMatFun',
    nomeFun: 'nomeFun',
    cpfFun: 'cpfFun',
    dataAdmFun: 'dataAdmFun',
    dataDesFun: 'dataDesFun',
    avatarFun: 'avatarFun',
    idFuncaoFun: 'idFuncaoFun',
    idUserFun: 'idUserFun',
    idStatusFun: 'idStatusFun',
    idCustoFun: 'idCustoFun'
  };

  export type TbFuncionarioScalarFieldEnum = (typeof TbFuncionarioScalarFieldEnum)[keyof typeof TbFuncionarioScalarFieldEnum]


  export const TbStatusFunScalarFieldEnum: {
    idStatusFun: 'idStatusFun',
    descricaoStatusFun: 'descricaoStatusFun'
  };

  export type TbStatusFunScalarFieldEnum = (typeof TbStatusFunScalarFieldEnum)[keyof typeof TbStatusFunScalarFieldEnum]


  export const TbFuncaoScalarFieldEnum: {
    idFuncao: 'idFuncao',
    nomeFuncao: 'nomeFuncao'
  };

  export type TbFuncaoScalarFieldEnum = (typeof TbFuncaoScalarFieldEnum)[keyof typeof TbFuncaoScalarFieldEnum]


  export const TbPatrimonioScalarFieldEnum: {
    idP: 'idP',
    idPat: 'idPat',
    descricaoPat: 'descricaoPat',
    descricaoDetalhadaPat: 'descricaoDetalhadaPat',
    licencaPat: 'licencaPat',
    dataEntPat: 'dataEntPat',
    dataSaiPat: 'dataSaiPat',
    notaFiscalPat: 'notaFiscalPat',
    valorPat: 'valorPat',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    idPat_TipoPat: 'idPat_TipoPat',
    idPat_StatusPat: 'idPat_StatusPat',
    idPat_CustoPat: 'idPat_CustoPat'
  };

  export type TbPatrimonioScalarFieldEnum = (typeof TbPatrimonioScalarFieldEnum)[keyof typeof TbPatrimonioScalarFieldEnum]


  export const TbTipoPatScalarFieldEnum: {
    idTipPat: 'idTipPat',
    descricaoTipPat: 'descricaoTipPat'
  };

  export type TbTipoPatScalarFieldEnum = (typeof TbTipoPatScalarFieldEnum)[keyof typeof TbTipoPatScalarFieldEnum]


  export const TbStatusPatScalarFieldEnum: {
    idStatusPat: 'idStatusPat',
    descricaoStatPat: 'descricaoStatPat'
  };

  export type TbStatusPatScalarFieldEnum = (typeof TbStatusPatScalarFieldEnum)[keyof typeof TbStatusPatScalarFieldEnum]


  export const TbEmpresaScalarFieldEnum: {
    idEmp: 'idEmp',
    razaoEmpresa: 'razaoEmpresa',
    fantasiaEmpresa: 'fantasiaEmpresa',
    cnpjEmpresa: 'cnpjEmpresa',
    idCustEmp: 'idCustEmp'
  };

  export type TbEmpresaScalarFieldEnum = (typeof TbEmpresaScalarFieldEnum)[keyof typeof TbEmpresaScalarFieldEnum]


  export const TbCCustoScalarFieldEnum: {
    idCCusto: 'idCCusto',
    codigoCCusto: 'codigoCCusto',
    descricaoCCusto: 'descricaoCCusto',
    idEmp_Custo: 'idEmp_Custo'
  };

  export type TbCCustoScalarFieldEnum = (typeof TbCCustoScalarFieldEnum)[keyof typeof TbCCustoScalarFieldEnum]


  export const TbCadastroScalarFieldEnum: {
    idCad: 'idCad',
    dataCadPat: 'dataCadPat',
    dataDevPat: 'dataDevPat',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    idPatCad: 'idPatCad',
    idMatFunCad: 'idMatFunCad'
  };

  export type TbCadastroScalarFieldEnum = (typeof TbCadastroScalarFieldEnum)[keyof typeof TbCadastroScalarFieldEnum]


  export const TbAccontScalarFieldEnum: {
    idAccont: 'idAccont',
    userID: 'userID',
    type: 'type',
    provider: 'provider',
    providerAccontId: 'providerAccontId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    sesseion_state: 'sesseion_state'
  };

  export type TbAccontScalarFieldEnum = (typeof TbAccontScalarFieldEnum)[keyof typeof TbAccontScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type tbUserWhereInput = {
    AND?: tbUserWhereInput | tbUserWhereInput[]
    OR?: tbUserWhereInput[]
    NOT?: tbUserWhereInput | tbUserWhereInput[]
    idU?: StringFilter<"tbUser"> | string
    idUser?: StringNullableFilter<"tbUser"> | string | null
    nomeUser?: StringNullableFilter<"tbUser"> | string | null
    emailUser?: StringNullableFilter<"tbUser"> | string | null
    senhaUser?: StringNullableFilter<"tbUser"> | string | null
    avatarUser?: StringNullableFilter<"tbUser"> | string | null
    createdAt?: DateTimeFilter<"tbUser"> | Date | string
    updatedAt?: DateTimeFilter<"tbUser"> | Date | string
    tbFuncioanrio?: TbFuncionarioListRelationFilter
    tbAcconts?: TbAccontListRelationFilter
    Session?: SessionListRelationFilter
  }

  export type tbUserOrderByWithRelationInput = {
    idU?: SortOrder
    idUser?: SortOrderInput | SortOrder
    nomeUser?: SortOrderInput | SortOrder
    emailUser?: SortOrderInput | SortOrder
    senhaUser?: SortOrderInput | SortOrder
    avatarUser?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tbFuncioanrio?: tbFuncionarioOrderByRelationAggregateInput
    tbAcconts?: tbAccontOrderByRelationAggregateInput
    Session?: SessionOrderByRelationAggregateInput
  }

  export type tbUserWhereUniqueInput = Prisma.AtLeast<{
    idU?: string
    idUser?: string
    AND?: tbUserWhereInput | tbUserWhereInput[]
    OR?: tbUserWhereInput[]
    NOT?: tbUserWhereInput | tbUserWhereInput[]
    nomeUser?: StringNullableFilter<"tbUser"> | string | null
    emailUser?: StringNullableFilter<"tbUser"> | string | null
    senhaUser?: StringNullableFilter<"tbUser"> | string | null
    avatarUser?: StringNullableFilter<"tbUser"> | string | null
    createdAt?: DateTimeFilter<"tbUser"> | Date | string
    updatedAt?: DateTimeFilter<"tbUser"> | Date | string
    tbFuncioanrio?: TbFuncionarioListRelationFilter
    tbAcconts?: TbAccontListRelationFilter
    Session?: SessionListRelationFilter
  }, "idU" | "idUser">

  export type tbUserOrderByWithAggregationInput = {
    idU?: SortOrder
    idUser?: SortOrderInput | SortOrder
    nomeUser?: SortOrderInput | SortOrder
    emailUser?: SortOrderInput | SortOrder
    senhaUser?: SortOrderInput | SortOrder
    avatarUser?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: tbUserCountOrderByAggregateInput
    _max?: tbUserMaxOrderByAggregateInput
    _min?: tbUserMinOrderByAggregateInput
  }

  export type tbUserScalarWhereWithAggregatesInput = {
    AND?: tbUserScalarWhereWithAggregatesInput | tbUserScalarWhereWithAggregatesInput[]
    OR?: tbUserScalarWhereWithAggregatesInput[]
    NOT?: tbUserScalarWhereWithAggregatesInput | tbUserScalarWhereWithAggregatesInput[]
    idU?: StringWithAggregatesFilter<"tbUser"> | string
    idUser?: StringNullableWithAggregatesFilter<"tbUser"> | string | null
    nomeUser?: StringNullableWithAggregatesFilter<"tbUser"> | string | null
    emailUser?: StringNullableWithAggregatesFilter<"tbUser"> | string | null
    senhaUser?: StringNullableWithAggregatesFilter<"tbUser"> | string | null
    avatarUser?: StringNullableWithAggregatesFilter<"tbUser"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"tbUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"tbUser"> | Date | string
  }

  export type tbFuncionarioWhereInput = {
    AND?: tbFuncionarioWhereInput | tbFuncionarioWhereInput[]
    OR?: tbFuncionarioWhereInput[]
    NOT?: tbFuncionarioWhereInput | tbFuncionarioWhereInput[]
    idF?: StringFilter<"tbFuncionario"> | string
    idMatFun?: StringFilter<"tbFuncionario"> | string
    nomeFun?: StringFilter<"tbFuncionario"> | string
    cpfFun?: StringNullableFilter<"tbFuncionario"> | string | null
    dataAdmFun?: DateTimeNullableFilter<"tbFuncionario"> | Date | string | null
    dataDesFun?: DateTimeNullableFilter<"tbFuncionario"> | Date | string | null
    avatarFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idFuncaoFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idUserFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idStatusFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idCustoFun?: StringNullableFilter<"tbFuncionario"> | string | null
    tbStatusFun?: XOR<TbStatusFunNullableScalarRelationFilter, tbStatusFunWhereInput> | null
    tbUser?: XOR<TbUserNullableScalarRelationFilter, tbUserWhereInput> | null
    tbFuncao?: XOR<TbFuncaoNullableScalarRelationFilter, tbFuncaoWhereInput> | null
    tbCCusto?: XOR<TbCCustoNullableScalarRelationFilter, tbCCustoWhereInput> | null
    tbCadastro?: TbCadastroListRelationFilter
  }

  export type tbFuncionarioOrderByWithRelationInput = {
    idF?: SortOrder
    idMatFun?: SortOrder
    nomeFun?: SortOrder
    cpfFun?: SortOrderInput | SortOrder
    dataAdmFun?: SortOrderInput | SortOrder
    dataDesFun?: SortOrderInput | SortOrder
    avatarFun?: SortOrderInput | SortOrder
    idFuncaoFun?: SortOrderInput | SortOrder
    idUserFun?: SortOrderInput | SortOrder
    idStatusFun?: SortOrderInput | SortOrder
    idCustoFun?: SortOrderInput | SortOrder
    tbStatusFun?: tbStatusFunOrderByWithRelationInput
    tbUser?: tbUserOrderByWithRelationInput
    tbFuncao?: tbFuncaoOrderByWithRelationInput
    tbCCusto?: tbCCustoOrderByWithRelationInput
    tbCadastro?: tbCadastroOrderByRelationAggregateInput
  }

  export type tbFuncionarioWhereUniqueInput = Prisma.AtLeast<{
    idF?: string
    idMatFun?: string
    AND?: tbFuncionarioWhereInput | tbFuncionarioWhereInput[]
    OR?: tbFuncionarioWhereInput[]
    NOT?: tbFuncionarioWhereInput | tbFuncionarioWhereInput[]
    nomeFun?: StringFilter<"tbFuncionario"> | string
    cpfFun?: StringNullableFilter<"tbFuncionario"> | string | null
    dataAdmFun?: DateTimeNullableFilter<"tbFuncionario"> | Date | string | null
    dataDesFun?: DateTimeNullableFilter<"tbFuncionario"> | Date | string | null
    avatarFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idFuncaoFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idUserFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idStatusFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idCustoFun?: StringNullableFilter<"tbFuncionario"> | string | null
    tbStatusFun?: XOR<TbStatusFunNullableScalarRelationFilter, tbStatusFunWhereInput> | null
    tbUser?: XOR<TbUserNullableScalarRelationFilter, tbUserWhereInput> | null
    tbFuncao?: XOR<TbFuncaoNullableScalarRelationFilter, tbFuncaoWhereInput> | null
    tbCCusto?: XOR<TbCCustoNullableScalarRelationFilter, tbCCustoWhereInput> | null
    tbCadastro?: TbCadastroListRelationFilter
  }, "idF" | "idMatFun">

  export type tbFuncionarioOrderByWithAggregationInput = {
    idF?: SortOrder
    idMatFun?: SortOrder
    nomeFun?: SortOrder
    cpfFun?: SortOrderInput | SortOrder
    dataAdmFun?: SortOrderInput | SortOrder
    dataDesFun?: SortOrderInput | SortOrder
    avatarFun?: SortOrderInput | SortOrder
    idFuncaoFun?: SortOrderInput | SortOrder
    idUserFun?: SortOrderInput | SortOrder
    idStatusFun?: SortOrderInput | SortOrder
    idCustoFun?: SortOrderInput | SortOrder
    _count?: tbFuncionarioCountOrderByAggregateInput
    _max?: tbFuncionarioMaxOrderByAggregateInput
    _min?: tbFuncionarioMinOrderByAggregateInput
  }

  export type tbFuncionarioScalarWhereWithAggregatesInput = {
    AND?: tbFuncionarioScalarWhereWithAggregatesInput | tbFuncionarioScalarWhereWithAggregatesInput[]
    OR?: tbFuncionarioScalarWhereWithAggregatesInput[]
    NOT?: tbFuncionarioScalarWhereWithAggregatesInput | tbFuncionarioScalarWhereWithAggregatesInput[]
    idF?: StringWithAggregatesFilter<"tbFuncionario"> | string
    idMatFun?: StringWithAggregatesFilter<"tbFuncionario"> | string
    nomeFun?: StringWithAggregatesFilter<"tbFuncionario"> | string
    cpfFun?: StringNullableWithAggregatesFilter<"tbFuncionario"> | string | null
    dataAdmFun?: DateTimeNullableWithAggregatesFilter<"tbFuncionario"> | Date | string | null
    dataDesFun?: DateTimeNullableWithAggregatesFilter<"tbFuncionario"> | Date | string | null
    avatarFun?: StringNullableWithAggregatesFilter<"tbFuncionario"> | string | null
    idFuncaoFun?: StringNullableWithAggregatesFilter<"tbFuncionario"> | string | null
    idUserFun?: StringNullableWithAggregatesFilter<"tbFuncionario"> | string | null
    idStatusFun?: StringNullableWithAggregatesFilter<"tbFuncionario"> | string | null
    idCustoFun?: StringNullableWithAggregatesFilter<"tbFuncionario"> | string | null
  }

  export type tbStatusFunWhereInput = {
    AND?: tbStatusFunWhereInput | tbStatusFunWhereInput[]
    OR?: tbStatusFunWhereInput[]
    NOT?: tbStatusFunWhereInput | tbStatusFunWhereInput[]
    idStatusFun?: StringFilter<"tbStatusFun"> | string
    descricaoStatusFun?: StringFilter<"tbStatusFun"> | string
    tbFuncionario?: TbFuncionarioListRelationFilter
  }

  export type tbStatusFunOrderByWithRelationInput = {
    idStatusFun?: SortOrder
    descricaoStatusFun?: SortOrder
    tbFuncionario?: tbFuncionarioOrderByRelationAggregateInput
  }

  export type tbStatusFunWhereUniqueInput = Prisma.AtLeast<{
    idStatusFun?: string
    AND?: tbStatusFunWhereInput | tbStatusFunWhereInput[]
    OR?: tbStatusFunWhereInput[]
    NOT?: tbStatusFunWhereInput | tbStatusFunWhereInput[]
    descricaoStatusFun?: StringFilter<"tbStatusFun"> | string
    tbFuncionario?: TbFuncionarioListRelationFilter
  }, "idStatusFun">

  export type tbStatusFunOrderByWithAggregationInput = {
    idStatusFun?: SortOrder
    descricaoStatusFun?: SortOrder
    _count?: tbStatusFunCountOrderByAggregateInput
    _max?: tbStatusFunMaxOrderByAggregateInput
    _min?: tbStatusFunMinOrderByAggregateInput
  }

  export type tbStatusFunScalarWhereWithAggregatesInput = {
    AND?: tbStatusFunScalarWhereWithAggregatesInput | tbStatusFunScalarWhereWithAggregatesInput[]
    OR?: tbStatusFunScalarWhereWithAggregatesInput[]
    NOT?: tbStatusFunScalarWhereWithAggregatesInput | tbStatusFunScalarWhereWithAggregatesInput[]
    idStatusFun?: StringWithAggregatesFilter<"tbStatusFun"> | string
    descricaoStatusFun?: StringWithAggregatesFilter<"tbStatusFun"> | string
  }

  export type tbFuncaoWhereInput = {
    AND?: tbFuncaoWhereInput | tbFuncaoWhereInput[]
    OR?: tbFuncaoWhereInput[]
    NOT?: tbFuncaoWhereInput | tbFuncaoWhereInput[]
    idFuncao?: StringFilter<"tbFuncao"> | string
    nomeFuncao?: StringFilter<"tbFuncao"> | string
    tbFuncionario?: TbFuncionarioListRelationFilter
  }

  export type tbFuncaoOrderByWithRelationInput = {
    idFuncao?: SortOrder
    nomeFuncao?: SortOrder
    tbFuncionario?: tbFuncionarioOrderByRelationAggregateInput
  }

  export type tbFuncaoWhereUniqueInput = Prisma.AtLeast<{
    idFuncao?: string
    AND?: tbFuncaoWhereInput | tbFuncaoWhereInput[]
    OR?: tbFuncaoWhereInput[]
    NOT?: tbFuncaoWhereInput | tbFuncaoWhereInput[]
    nomeFuncao?: StringFilter<"tbFuncao"> | string
    tbFuncionario?: TbFuncionarioListRelationFilter
  }, "idFuncao">

  export type tbFuncaoOrderByWithAggregationInput = {
    idFuncao?: SortOrder
    nomeFuncao?: SortOrder
    _count?: tbFuncaoCountOrderByAggregateInput
    _max?: tbFuncaoMaxOrderByAggregateInput
    _min?: tbFuncaoMinOrderByAggregateInput
  }

  export type tbFuncaoScalarWhereWithAggregatesInput = {
    AND?: tbFuncaoScalarWhereWithAggregatesInput | tbFuncaoScalarWhereWithAggregatesInput[]
    OR?: tbFuncaoScalarWhereWithAggregatesInput[]
    NOT?: tbFuncaoScalarWhereWithAggregatesInput | tbFuncaoScalarWhereWithAggregatesInput[]
    idFuncao?: StringWithAggregatesFilter<"tbFuncao"> | string
    nomeFuncao?: StringWithAggregatesFilter<"tbFuncao"> | string
  }

  export type tbPatrimonioWhereInput = {
    AND?: tbPatrimonioWhereInput | tbPatrimonioWhereInput[]
    OR?: tbPatrimonioWhereInput[]
    NOT?: tbPatrimonioWhereInput | tbPatrimonioWhereInput[]
    idP?: StringFilter<"tbPatrimonio"> | string
    idPat?: StringFilter<"tbPatrimonio"> | string
    descricaoPat?: StringFilter<"tbPatrimonio"> | string
    descricaoDetalhadaPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    licencaPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    dataEntPat?: DateTimeFilter<"tbPatrimonio"> | Date | string
    dataSaiPat?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    notaFiscalPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    valorPat?: FloatFilter<"tbPatrimonio"> | number
    createdAt?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    idPat_TipoPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    idPat_StatusPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    idPat_CustoPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    tbTipoPat?: XOR<TbTipoPatNullableScalarRelationFilter, tbTipoPatWhereInput> | null
    tbStatusPat?: XOR<TbStatusPatNullableScalarRelationFilter, tbStatusPatWhereInput> | null
    tbCCusto?: XOR<TbCCustoNullableScalarRelationFilter, tbCCustoWhereInput> | null
    tbCadastro?: TbCadastroListRelationFilter
  }

  export type tbPatrimonioOrderByWithRelationInput = {
    idP?: SortOrder
    idPat?: SortOrder
    descricaoPat?: SortOrder
    descricaoDetalhadaPat?: SortOrderInput | SortOrder
    licencaPat?: SortOrderInput | SortOrder
    dataEntPat?: SortOrder
    dataSaiPat?: SortOrderInput | SortOrder
    notaFiscalPat?: SortOrderInput | SortOrder
    valorPat?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    idPat_TipoPat?: SortOrderInput | SortOrder
    idPat_StatusPat?: SortOrderInput | SortOrder
    idPat_CustoPat?: SortOrderInput | SortOrder
    tbTipoPat?: tbTipoPatOrderByWithRelationInput
    tbStatusPat?: tbStatusPatOrderByWithRelationInput
    tbCCusto?: tbCCustoOrderByWithRelationInput
    tbCadastro?: tbCadastroOrderByRelationAggregateInput
  }

  export type tbPatrimonioWhereUniqueInput = Prisma.AtLeast<{
    idP?: string
    idPat?: string
    AND?: tbPatrimonioWhereInput | tbPatrimonioWhereInput[]
    OR?: tbPatrimonioWhereInput[]
    NOT?: tbPatrimonioWhereInput | tbPatrimonioWhereInput[]
    descricaoPat?: StringFilter<"tbPatrimonio"> | string
    descricaoDetalhadaPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    licencaPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    dataEntPat?: DateTimeFilter<"tbPatrimonio"> | Date | string
    dataSaiPat?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    notaFiscalPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    valorPat?: FloatFilter<"tbPatrimonio"> | number
    createdAt?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    idPat_TipoPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    idPat_StatusPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    idPat_CustoPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    tbTipoPat?: XOR<TbTipoPatNullableScalarRelationFilter, tbTipoPatWhereInput> | null
    tbStatusPat?: XOR<TbStatusPatNullableScalarRelationFilter, tbStatusPatWhereInput> | null
    tbCCusto?: XOR<TbCCustoNullableScalarRelationFilter, tbCCustoWhereInput> | null
    tbCadastro?: TbCadastroListRelationFilter
  }, "idP" | "idPat">

  export type tbPatrimonioOrderByWithAggregationInput = {
    idP?: SortOrder
    idPat?: SortOrder
    descricaoPat?: SortOrder
    descricaoDetalhadaPat?: SortOrderInput | SortOrder
    licencaPat?: SortOrderInput | SortOrder
    dataEntPat?: SortOrder
    dataSaiPat?: SortOrderInput | SortOrder
    notaFiscalPat?: SortOrderInput | SortOrder
    valorPat?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    idPat_TipoPat?: SortOrderInput | SortOrder
    idPat_StatusPat?: SortOrderInput | SortOrder
    idPat_CustoPat?: SortOrderInput | SortOrder
    _count?: tbPatrimonioCountOrderByAggregateInput
    _avg?: tbPatrimonioAvgOrderByAggregateInput
    _max?: tbPatrimonioMaxOrderByAggregateInput
    _min?: tbPatrimonioMinOrderByAggregateInput
    _sum?: tbPatrimonioSumOrderByAggregateInput
  }

  export type tbPatrimonioScalarWhereWithAggregatesInput = {
    AND?: tbPatrimonioScalarWhereWithAggregatesInput | tbPatrimonioScalarWhereWithAggregatesInput[]
    OR?: tbPatrimonioScalarWhereWithAggregatesInput[]
    NOT?: tbPatrimonioScalarWhereWithAggregatesInput | tbPatrimonioScalarWhereWithAggregatesInput[]
    idP?: StringWithAggregatesFilter<"tbPatrimonio"> | string
    idPat?: StringWithAggregatesFilter<"tbPatrimonio"> | string
    descricaoPat?: StringWithAggregatesFilter<"tbPatrimonio"> | string
    descricaoDetalhadaPat?: StringNullableWithAggregatesFilter<"tbPatrimonio"> | string | null
    licencaPat?: StringNullableWithAggregatesFilter<"tbPatrimonio"> | string | null
    dataEntPat?: DateTimeWithAggregatesFilter<"tbPatrimonio"> | Date | string
    dataSaiPat?: DateTimeNullableWithAggregatesFilter<"tbPatrimonio"> | Date | string | null
    notaFiscalPat?: StringNullableWithAggregatesFilter<"tbPatrimonio"> | string | null
    valorPat?: FloatWithAggregatesFilter<"tbPatrimonio"> | number
    createdAt?: DateTimeNullableWithAggregatesFilter<"tbPatrimonio"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"tbPatrimonio"> | Date | string | null
    idPat_TipoPat?: StringNullableWithAggregatesFilter<"tbPatrimonio"> | string | null
    idPat_StatusPat?: StringNullableWithAggregatesFilter<"tbPatrimonio"> | string | null
    idPat_CustoPat?: StringNullableWithAggregatesFilter<"tbPatrimonio"> | string | null
  }

  export type tbTipoPatWhereInput = {
    AND?: tbTipoPatWhereInput | tbTipoPatWhereInput[]
    OR?: tbTipoPatWhereInput[]
    NOT?: tbTipoPatWhereInput | tbTipoPatWhereInput[]
    idTipPat?: StringFilter<"tbTipoPat"> | string
    descricaoTipPat?: StringNullableFilter<"tbTipoPat"> | string | null
    tbPatrimonio?: TbPatrimonioListRelationFilter
  }

  export type tbTipoPatOrderByWithRelationInput = {
    idTipPat?: SortOrder
    descricaoTipPat?: SortOrderInput | SortOrder
    tbPatrimonio?: tbPatrimonioOrderByRelationAggregateInput
  }

  export type tbTipoPatWhereUniqueInput = Prisma.AtLeast<{
    idTipPat?: string
    AND?: tbTipoPatWhereInput | tbTipoPatWhereInput[]
    OR?: tbTipoPatWhereInput[]
    NOT?: tbTipoPatWhereInput | tbTipoPatWhereInput[]
    descricaoTipPat?: StringNullableFilter<"tbTipoPat"> | string | null
    tbPatrimonio?: TbPatrimonioListRelationFilter
  }, "idTipPat">

  export type tbTipoPatOrderByWithAggregationInput = {
    idTipPat?: SortOrder
    descricaoTipPat?: SortOrderInput | SortOrder
    _count?: tbTipoPatCountOrderByAggregateInput
    _max?: tbTipoPatMaxOrderByAggregateInput
    _min?: tbTipoPatMinOrderByAggregateInput
  }

  export type tbTipoPatScalarWhereWithAggregatesInput = {
    AND?: tbTipoPatScalarWhereWithAggregatesInput | tbTipoPatScalarWhereWithAggregatesInput[]
    OR?: tbTipoPatScalarWhereWithAggregatesInput[]
    NOT?: tbTipoPatScalarWhereWithAggregatesInput | tbTipoPatScalarWhereWithAggregatesInput[]
    idTipPat?: StringWithAggregatesFilter<"tbTipoPat"> | string
    descricaoTipPat?: StringNullableWithAggregatesFilter<"tbTipoPat"> | string | null
  }

  export type tbStatusPatWhereInput = {
    AND?: tbStatusPatWhereInput | tbStatusPatWhereInput[]
    OR?: tbStatusPatWhereInput[]
    NOT?: tbStatusPatWhereInput | tbStatusPatWhereInput[]
    idStatusPat?: StringFilter<"tbStatusPat"> | string
    descricaoStatPat?: StringFilter<"tbStatusPat"> | string
    tbPatrimonio?: TbPatrimonioListRelationFilter
  }

  export type tbStatusPatOrderByWithRelationInput = {
    idStatusPat?: SortOrder
    descricaoStatPat?: SortOrder
    tbPatrimonio?: tbPatrimonioOrderByRelationAggregateInput
  }

  export type tbStatusPatWhereUniqueInput = Prisma.AtLeast<{
    idStatusPat?: string
    AND?: tbStatusPatWhereInput | tbStatusPatWhereInput[]
    OR?: tbStatusPatWhereInput[]
    NOT?: tbStatusPatWhereInput | tbStatusPatWhereInput[]
    descricaoStatPat?: StringFilter<"tbStatusPat"> | string
    tbPatrimonio?: TbPatrimonioListRelationFilter
  }, "idStatusPat">

  export type tbStatusPatOrderByWithAggregationInput = {
    idStatusPat?: SortOrder
    descricaoStatPat?: SortOrder
    _count?: tbStatusPatCountOrderByAggregateInput
    _max?: tbStatusPatMaxOrderByAggregateInput
    _min?: tbStatusPatMinOrderByAggregateInput
  }

  export type tbStatusPatScalarWhereWithAggregatesInput = {
    AND?: tbStatusPatScalarWhereWithAggregatesInput | tbStatusPatScalarWhereWithAggregatesInput[]
    OR?: tbStatusPatScalarWhereWithAggregatesInput[]
    NOT?: tbStatusPatScalarWhereWithAggregatesInput | tbStatusPatScalarWhereWithAggregatesInput[]
    idStatusPat?: StringWithAggregatesFilter<"tbStatusPat"> | string
    descricaoStatPat?: StringWithAggregatesFilter<"tbStatusPat"> | string
  }

  export type tbEmpresaWhereInput = {
    AND?: tbEmpresaWhereInput | tbEmpresaWhereInput[]
    OR?: tbEmpresaWhereInput[]
    NOT?: tbEmpresaWhereInput | tbEmpresaWhereInput[]
    idEmp?: StringFilter<"tbEmpresa"> | string
    razaoEmpresa?: StringNullableFilter<"tbEmpresa"> | string | null
    fantasiaEmpresa?: StringNullableFilter<"tbEmpresa"> | string | null
    cnpjEmpresa?: StringNullableFilter<"tbEmpresa"> | string | null
    idCustEmp?: StringNullableFilter<"tbEmpresa"> | string | null
    tbCCusto?: TbCCustoListRelationFilter
  }

  export type tbEmpresaOrderByWithRelationInput = {
    idEmp?: SortOrder
    razaoEmpresa?: SortOrderInput | SortOrder
    fantasiaEmpresa?: SortOrderInput | SortOrder
    cnpjEmpresa?: SortOrderInput | SortOrder
    idCustEmp?: SortOrderInput | SortOrder
    tbCCusto?: tbCCustoOrderByRelationAggregateInput
  }

  export type tbEmpresaWhereUniqueInput = Prisma.AtLeast<{
    idEmp?: string
    AND?: tbEmpresaWhereInput | tbEmpresaWhereInput[]
    OR?: tbEmpresaWhereInput[]
    NOT?: tbEmpresaWhereInput | tbEmpresaWhereInput[]
    razaoEmpresa?: StringNullableFilter<"tbEmpresa"> | string | null
    fantasiaEmpresa?: StringNullableFilter<"tbEmpresa"> | string | null
    cnpjEmpresa?: StringNullableFilter<"tbEmpresa"> | string | null
    idCustEmp?: StringNullableFilter<"tbEmpresa"> | string | null
    tbCCusto?: TbCCustoListRelationFilter
  }, "idEmp">

  export type tbEmpresaOrderByWithAggregationInput = {
    idEmp?: SortOrder
    razaoEmpresa?: SortOrderInput | SortOrder
    fantasiaEmpresa?: SortOrderInput | SortOrder
    cnpjEmpresa?: SortOrderInput | SortOrder
    idCustEmp?: SortOrderInput | SortOrder
    _count?: tbEmpresaCountOrderByAggregateInput
    _max?: tbEmpresaMaxOrderByAggregateInput
    _min?: tbEmpresaMinOrderByAggregateInput
  }

  export type tbEmpresaScalarWhereWithAggregatesInput = {
    AND?: tbEmpresaScalarWhereWithAggregatesInput | tbEmpresaScalarWhereWithAggregatesInput[]
    OR?: tbEmpresaScalarWhereWithAggregatesInput[]
    NOT?: tbEmpresaScalarWhereWithAggregatesInput | tbEmpresaScalarWhereWithAggregatesInput[]
    idEmp?: StringWithAggregatesFilter<"tbEmpresa"> | string
    razaoEmpresa?: StringNullableWithAggregatesFilter<"tbEmpresa"> | string | null
    fantasiaEmpresa?: StringNullableWithAggregatesFilter<"tbEmpresa"> | string | null
    cnpjEmpresa?: StringNullableWithAggregatesFilter<"tbEmpresa"> | string | null
    idCustEmp?: StringNullableWithAggregatesFilter<"tbEmpresa"> | string | null
  }

  export type tbCCustoWhereInput = {
    AND?: tbCCustoWhereInput | tbCCustoWhereInput[]
    OR?: tbCCustoWhereInput[]
    NOT?: tbCCustoWhereInput | tbCCustoWhereInput[]
    idCCusto?: StringFilter<"tbCCusto"> | string
    codigoCCusto?: StringNullableFilter<"tbCCusto"> | string | null
    descricaoCCusto?: StringNullableFilter<"tbCCusto"> | string | null
    idEmp_Custo?: StringNullableFilter<"tbCCusto"> | string | null
    tbEmpresa?: XOR<TbEmpresaNullableScalarRelationFilter, tbEmpresaWhereInput> | null
    tbPatrimonio?: TbPatrimonioListRelationFilter
    tbFuncionario?: TbFuncionarioListRelationFilter
  }

  export type tbCCustoOrderByWithRelationInput = {
    idCCusto?: SortOrder
    codigoCCusto?: SortOrderInput | SortOrder
    descricaoCCusto?: SortOrderInput | SortOrder
    idEmp_Custo?: SortOrderInput | SortOrder
    tbEmpresa?: tbEmpresaOrderByWithRelationInput
    tbPatrimonio?: tbPatrimonioOrderByRelationAggregateInput
    tbFuncionario?: tbFuncionarioOrderByRelationAggregateInput
  }

  export type tbCCustoWhereUniqueInput = Prisma.AtLeast<{
    idCCusto?: string
    AND?: tbCCustoWhereInput | tbCCustoWhereInput[]
    OR?: tbCCustoWhereInput[]
    NOT?: tbCCustoWhereInput | tbCCustoWhereInput[]
    codigoCCusto?: StringNullableFilter<"tbCCusto"> | string | null
    descricaoCCusto?: StringNullableFilter<"tbCCusto"> | string | null
    idEmp_Custo?: StringNullableFilter<"tbCCusto"> | string | null
    tbEmpresa?: XOR<TbEmpresaNullableScalarRelationFilter, tbEmpresaWhereInput> | null
    tbPatrimonio?: TbPatrimonioListRelationFilter
    tbFuncionario?: TbFuncionarioListRelationFilter
  }, "idCCusto">

  export type tbCCustoOrderByWithAggregationInput = {
    idCCusto?: SortOrder
    codigoCCusto?: SortOrderInput | SortOrder
    descricaoCCusto?: SortOrderInput | SortOrder
    idEmp_Custo?: SortOrderInput | SortOrder
    _count?: tbCCustoCountOrderByAggregateInput
    _max?: tbCCustoMaxOrderByAggregateInput
    _min?: tbCCustoMinOrderByAggregateInput
  }

  export type tbCCustoScalarWhereWithAggregatesInput = {
    AND?: tbCCustoScalarWhereWithAggregatesInput | tbCCustoScalarWhereWithAggregatesInput[]
    OR?: tbCCustoScalarWhereWithAggregatesInput[]
    NOT?: tbCCustoScalarWhereWithAggregatesInput | tbCCustoScalarWhereWithAggregatesInput[]
    idCCusto?: StringWithAggregatesFilter<"tbCCusto"> | string
    codigoCCusto?: StringNullableWithAggregatesFilter<"tbCCusto"> | string | null
    descricaoCCusto?: StringNullableWithAggregatesFilter<"tbCCusto"> | string | null
    idEmp_Custo?: StringNullableWithAggregatesFilter<"tbCCusto"> | string | null
  }

  export type tbCadastroWhereInput = {
    AND?: tbCadastroWhereInput | tbCadastroWhereInput[]
    OR?: tbCadastroWhereInput[]
    NOT?: tbCadastroWhereInput | tbCadastroWhereInput[]
    idCad?: StringFilter<"tbCadastro"> | string
    dataCadPat?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    dataDevPat?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    idPatCad?: StringNullableFilter<"tbCadastro"> | string | null
    idMatFunCad?: StringNullableFilter<"tbCadastro"> | string | null
    tbPatrimonio?: XOR<TbPatrimonioNullableScalarRelationFilter, tbPatrimonioWhereInput> | null
    tbFuncionario?: XOR<TbFuncionarioNullableScalarRelationFilter, tbFuncionarioWhereInput> | null
  }

  export type tbCadastroOrderByWithRelationInput = {
    idCad?: SortOrder
    dataCadPat?: SortOrderInput | SortOrder
    dataDevPat?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    idPatCad?: SortOrderInput | SortOrder
    idMatFunCad?: SortOrderInput | SortOrder
    tbPatrimonio?: tbPatrimonioOrderByWithRelationInput
    tbFuncionario?: tbFuncionarioOrderByWithRelationInput
  }

  export type tbCadastroWhereUniqueInput = Prisma.AtLeast<{
    idCad?: string
    AND?: tbCadastroWhereInput | tbCadastroWhereInput[]
    OR?: tbCadastroWhereInput[]
    NOT?: tbCadastroWhereInput | tbCadastroWhereInput[]
    dataCadPat?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    dataDevPat?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    idPatCad?: StringNullableFilter<"tbCadastro"> | string | null
    idMatFunCad?: StringNullableFilter<"tbCadastro"> | string | null
    tbPatrimonio?: XOR<TbPatrimonioNullableScalarRelationFilter, tbPatrimonioWhereInput> | null
    tbFuncionario?: XOR<TbFuncionarioNullableScalarRelationFilter, tbFuncionarioWhereInput> | null
  }, "idCad">

  export type tbCadastroOrderByWithAggregationInput = {
    idCad?: SortOrder
    dataCadPat?: SortOrderInput | SortOrder
    dataDevPat?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    idPatCad?: SortOrderInput | SortOrder
    idMatFunCad?: SortOrderInput | SortOrder
    _count?: tbCadastroCountOrderByAggregateInput
    _max?: tbCadastroMaxOrderByAggregateInput
    _min?: tbCadastroMinOrderByAggregateInput
  }

  export type tbCadastroScalarWhereWithAggregatesInput = {
    AND?: tbCadastroScalarWhereWithAggregatesInput | tbCadastroScalarWhereWithAggregatesInput[]
    OR?: tbCadastroScalarWhereWithAggregatesInput[]
    NOT?: tbCadastroScalarWhereWithAggregatesInput | tbCadastroScalarWhereWithAggregatesInput[]
    idCad?: StringWithAggregatesFilter<"tbCadastro"> | string
    dataCadPat?: DateTimeNullableWithAggregatesFilter<"tbCadastro"> | Date | string | null
    dataDevPat?: DateTimeNullableWithAggregatesFilter<"tbCadastro"> | Date | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"tbCadastro"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"tbCadastro"> | Date | string | null
    idPatCad?: StringNullableWithAggregatesFilter<"tbCadastro"> | string | null
    idMatFunCad?: StringNullableWithAggregatesFilter<"tbCadastro"> | string | null
  }

  export type tbAccontWhereInput = {
    AND?: tbAccontWhereInput | tbAccontWhereInput[]
    OR?: tbAccontWhereInput[]
    NOT?: tbAccontWhereInput | tbAccontWhereInput[]
    idAccont?: StringFilter<"tbAccont"> | string
    userID?: StringFilter<"tbAccont"> | string
    type?: StringFilter<"tbAccont"> | string
    provider?: StringFilter<"tbAccont"> | string
    providerAccontId?: StringFilter<"tbAccont"> | string
    refresh_token?: StringNullableFilter<"tbAccont"> | string | null
    access_token?: StringNullableFilter<"tbAccont"> | string | null
    expires_at?: IntNullableFilter<"tbAccont"> | number | null
    token_type?: StringNullableFilter<"tbAccont"> | string | null
    scope?: StringNullableFilter<"tbAccont"> | string | null
    id_token?: StringNullableFilter<"tbAccont"> | string | null
    sesseion_state?: StringNullableFilter<"tbAccont"> | string | null
    tbUser?: XOR<TbUserScalarRelationFilter, tbUserWhereInput>
  }

  export type tbAccontOrderByWithRelationInput = {
    idAccont?: SortOrder
    userID?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccontId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    sesseion_state?: SortOrderInput | SortOrder
    tbUser?: tbUserOrderByWithRelationInput
  }

  export type tbAccontWhereUniqueInput = Prisma.AtLeast<{
    idAccont?: string
    provider_providerAccontId?: tbAccontProviderProviderAccontIdCompoundUniqueInput
    AND?: tbAccontWhereInput | tbAccontWhereInput[]
    OR?: tbAccontWhereInput[]
    NOT?: tbAccontWhereInput | tbAccontWhereInput[]
    userID?: StringFilter<"tbAccont"> | string
    type?: StringFilter<"tbAccont"> | string
    provider?: StringFilter<"tbAccont"> | string
    providerAccontId?: StringFilter<"tbAccont"> | string
    refresh_token?: StringNullableFilter<"tbAccont"> | string | null
    access_token?: StringNullableFilter<"tbAccont"> | string | null
    expires_at?: IntNullableFilter<"tbAccont"> | number | null
    token_type?: StringNullableFilter<"tbAccont"> | string | null
    scope?: StringNullableFilter<"tbAccont"> | string | null
    id_token?: StringNullableFilter<"tbAccont"> | string | null
    sesseion_state?: StringNullableFilter<"tbAccont"> | string | null
    tbUser?: XOR<TbUserScalarRelationFilter, tbUserWhereInput>
  }, "idAccont" | "provider_providerAccontId">

  export type tbAccontOrderByWithAggregationInput = {
    idAccont?: SortOrder
    userID?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccontId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    sesseion_state?: SortOrderInput | SortOrder
    _count?: tbAccontCountOrderByAggregateInput
    _avg?: tbAccontAvgOrderByAggregateInput
    _max?: tbAccontMaxOrderByAggregateInput
    _min?: tbAccontMinOrderByAggregateInput
    _sum?: tbAccontSumOrderByAggregateInput
  }

  export type tbAccontScalarWhereWithAggregatesInput = {
    AND?: tbAccontScalarWhereWithAggregatesInput | tbAccontScalarWhereWithAggregatesInput[]
    OR?: tbAccontScalarWhereWithAggregatesInput[]
    NOT?: tbAccontScalarWhereWithAggregatesInput | tbAccontScalarWhereWithAggregatesInput[]
    idAccont?: StringWithAggregatesFilter<"tbAccont"> | string
    userID?: StringWithAggregatesFilter<"tbAccont"> | string
    type?: StringWithAggregatesFilter<"tbAccont"> | string
    provider?: StringWithAggregatesFilter<"tbAccont"> | string
    providerAccontId?: StringWithAggregatesFilter<"tbAccont"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"tbAccont"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"tbAccont"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"tbAccont"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"tbAccont"> | string | null
    scope?: StringNullableWithAggregatesFilter<"tbAccont"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"tbAccont"> | string | null
    sesseion_state?: StringNullableWithAggregatesFilter<"tbAccont"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    tbUser?: XOR<TbUserScalarRelationFilter, tbUserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    tbUser?: tbUserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    tbUser?: XOR<TbUserScalarRelationFilter, tbUserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeNullableFilter<"VerificationToken"> | Date | string | null
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrderInput | SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeNullableFilter<"VerificationToken"> | Date | string | null
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrderInput | SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeNullableWithAggregatesFilter<"VerificationToken"> | Date | string | null
  }

  export type tbUserCreateInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbFuncioanrio?: tbFuncionarioCreateNestedManyWithoutTbUserInput
    tbAcconts?: tbAccontCreateNestedManyWithoutTbUserInput
    Session?: SessionCreateNestedManyWithoutTbUserInput
  }

  export type tbUserUncheckedCreateInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbFuncioanrio?: tbFuncionarioUncheckedCreateNestedManyWithoutTbUserInput
    tbAcconts?: tbAccontUncheckedCreateNestedManyWithoutTbUserInput
    Session?: SessionUncheckedCreateNestedManyWithoutTbUserInput
  }

  export type tbUserUpdateInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbFuncioanrio?: tbFuncionarioUpdateManyWithoutTbUserNestedInput
    tbAcconts?: tbAccontUpdateManyWithoutTbUserNestedInput
    Session?: SessionUpdateManyWithoutTbUserNestedInput
  }

  export type tbUserUncheckedUpdateInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbFuncioanrio?: tbFuncionarioUncheckedUpdateManyWithoutTbUserNestedInput
    tbAcconts?: tbAccontUncheckedUpdateManyWithoutTbUserNestedInput
    Session?: SessionUncheckedUpdateManyWithoutTbUserNestedInput
  }

  export type tbUserCreateManyInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type tbUserUpdateManyMutationInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tbUserUncheckedUpdateManyInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tbFuncionarioCreateInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    tbStatusFun?: tbStatusFunCreateNestedOneWithoutTbFuncionarioInput
    tbUser?: tbUserCreateNestedOneWithoutTbFuncioanrioInput
    tbFuncao?: tbFuncaoCreateNestedOneWithoutTbFuncionarioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbFuncionarioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUncheckedCreateInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUpdateInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbStatusFun?: tbStatusFunUpdateOneWithoutTbFuncionarioNestedInput
    tbUser?: tbUserUpdateOneWithoutTbFuncioanrioNestedInput
    tbFuncao?: tbFuncaoUpdateOneWithoutTbFuncionarioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbFuncionarioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioCreateManyInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
  }

  export type tbFuncionarioUpdateManyMutationInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbFuncionarioUncheckedUpdateManyInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbStatusFunCreateInput = {
    idStatusFun?: string
    descricaoStatusFun: string
    tbFuncionario?: tbFuncionarioCreateNestedManyWithoutTbStatusFunInput
  }

  export type tbStatusFunUncheckedCreateInput = {
    idStatusFun?: string
    descricaoStatusFun: string
    tbFuncionario?: tbFuncionarioUncheckedCreateNestedManyWithoutTbStatusFunInput
  }

  export type tbStatusFunUpdateInput = {
    idStatusFun?: StringFieldUpdateOperationsInput | string
    descricaoStatusFun?: StringFieldUpdateOperationsInput | string
    tbFuncionario?: tbFuncionarioUpdateManyWithoutTbStatusFunNestedInput
  }

  export type tbStatusFunUncheckedUpdateInput = {
    idStatusFun?: StringFieldUpdateOperationsInput | string
    descricaoStatusFun?: StringFieldUpdateOperationsInput | string
    tbFuncionario?: tbFuncionarioUncheckedUpdateManyWithoutTbStatusFunNestedInput
  }

  export type tbStatusFunCreateManyInput = {
    idStatusFun?: string
    descricaoStatusFun: string
  }

  export type tbStatusFunUpdateManyMutationInput = {
    idStatusFun?: StringFieldUpdateOperationsInput | string
    descricaoStatusFun?: StringFieldUpdateOperationsInput | string
  }

  export type tbStatusFunUncheckedUpdateManyInput = {
    idStatusFun?: StringFieldUpdateOperationsInput | string
    descricaoStatusFun?: StringFieldUpdateOperationsInput | string
  }

  export type tbFuncaoCreateInput = {
    idFuncao?: string
    nomeFuncao: string
    tbFuncionario?: tbFuncionarioCreateNestedManyWithoutTbFuncaoInput
  }

  export type tbFuncaoUncheckedCreateInput = {
    idFuncao?: string
    nomeFuncao: string
    tbFuncionario?: tbFuncionarioUncheckedCreateNestedManyWithoutTbFuncaoInput
  }

  export type tbFuncaoUpdateInput = {
    idFuncao?: StringFieldUpdateOperationsInput | string
    nomeFuncao?: StringFieldUpdateOperationsInput | string
    tbFuncionario?: tbFuncionarioUpdateManyWithoutTbFuncaoNestedInput
  }

  export type tbFuncaoUncheckedUpdateInput = {
    idFuncao?: StringFieldUpdateOperationsInput | string
    nomeFuncao?: StringFieldUpdateOperationsInput | string
    tbFuncionario?: tbFuncionarioUncheckedUpdateManyWithoutTbFuncaoNestedInput
  }

  export type tbFuncaoCreateManyInput = {
    idFuncao?: string
    nomeFuncao: string
  }

  export type tbFuncaoUpdateManyMutationInput = {
    idFuncao?: StringFieldUpdateOperationsInput | string
    nomeFuncao?: StringFieldUpdateOperationsInput | string
  }

  export type tbFuncaoUncheckedUpdateManyInput = {
    idFuncao?: StringFieldUpdateOperationsInput | string
    nomeFuncao?: StringFieldUpdateOperationsInput | string
  }

  export type tbPatrimonioCreateInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbTipoPat?: tbTipoPatCreateNestedOneWithoutTbPatrimonioInput
    tbStatusPat?: tbStatusPatCreateNestedOneWithoutTbPatrimonioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbPatrimonioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioUncheckedCreateInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_StatusPat?: string | null
    idPat_CustoPat?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioUpdateInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbTipoPat?: tbTipoPatUpdateOneWithoutTbPatrimonioNestedInput
    tbStatusPat?: tbStatusPatUpdateOneWithoutTbPatrimonioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbPatrimonioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioCreateManyInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_StatusPat?: string | null
    idPat_CustoPat?: string | null
  }

  export type tbPatrimonioUpdateManyMutationInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type tbPatrimonioUncheckedUpdateManyInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbTipoPatCreateInput = {
    idTipPat?: string
    descricaoTipPat?: string | null
    tbPatrimonio?: tbPatrimonioCreateNestedManyWithoutTbTipoPatInput
  }

  export type tbTipoPatUncheckedCreateInput = {
    idTipPat?: string
    descricaoTipPat?: string | null
    tbPatrimonio?: tbPatrimonioUncheckedCreateNestedManyWithoutTbTipoPatInput
  }

  export type tbTipoPatUpdateInput = {
    idTipPat?: StringFieldUpdateOperationsInput | string
    descricaoTipPat?: NullableStringFieldUpdateOperationsInput | string | null
    tbPatrimonio?: tbPatrimonioUpdateManyWithoutTbTipoPatNestedInput
  }

  export type tbTipoPatUncheckedUpdateInput = {
    idTipPat?: StringFieldUpdateOperationsInput | string
    descricaoTipPat?: NullableStringFieldUpdateOperationsInput | string | null
    tbPatrimonio?: tbPatrimonioUncheckedUpdateManyWithoutTbTipoPatNestedInput
  }

  export type tbTipoPatCreateManyInput = {
    idTipPat?: string
    descricaoTipPat?: string | null
  }

  export type tbTipoPatUpdateManyMutationInput = {
    idTipPat?: StringFieldUpdateOperationsInput | string
    descricaoTipPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbTipoPatUncheckedUpdateManyInput = {
    idTipPat?: StringFieldUpdateOperationsInput | string
    descricaoTipPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbStatusPatCreateInput = {
    idStatusPat?: string
    descricaoStatPat: string
    tbPatrimonio?: tbPatrimonioCreateNestedManyWithoutTbStatusPatInput
  }

  export type tbStatusPatUncheckedCreateInput = {
    idStatusPat?: string
    descricaoStatPat: string
    tbPatrimonio?: tbPatrimonioUncheckedCreateNestedManyWithoutTbStatusPatInput
  }

  export type tbStatusPatUpdateInput = {
    idStatusPat?: StringFieldUpdateOperationsInput | string
    descricaoStatPat?: StringFieldUpdateOperationsInput | string
    tbPatrimonio?: tbPatrimonioUpdateManyWithoutTbStatusPatNestedInput
  }

  export type tbStatusPatUncheckedUpdateInput = {
    idStatusPat?: StringFieldUpdateOperationsInput | string
    descricaoStatPat?: StringFieldUpdateOperationsInput | string
    tbPatrimonio?: tbPatrimonioUncheckedUpdateManyWithoutTbStatusPatNestedInput
  }

  export type tbStatusPatCreateManyInput = {
    idStatusPat?: string
    descricaoStatPat: string
  }

  export type tbStatusPatUpdateManyMutationInput = {
    idStatusPat?: StringFieldUpdateOperationsInput | string
    descricaoStatPat?: StringFieldUpdateOperationsInput | string
  }

  export type tbStatusPatUncheckedUpdateManyInput = {
    idStatusPat?: StringFieldUpdateOperationsInput | string
    descricaoStatPat?: StringFieldUpdateOperationsInput | string
  }

  export type tbEmpresaCreateInput = {
    idEmp?: string
    razaoEmpresa?: string | null
    fantasiaEmpresa?: string | null
    cnpjEmpresa?: string | null
    idCustEmp?: string | null
    tbCCusto?: tbCCustoCreateNestedManyWithoutTbEmpresaInput
  }

  export type tbEmpresaUncheckedCreateInput = {
    idEmp?: string
    razaoEmpresa?: string | null
    fantasiaEmpresa?: string | null
    cnpjEmpresa?: string | null
    idCustEmp?: string | null
    tbCCusto?: tbCCustoUncheckedCreateNestedManyWithoutTbEmpresaInput
  }

  export type tbEmpresaUpdateInput = {
    idEmp?: StringFieldUpdateOperationsInput | string
    razaoEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    fantasiaEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    cnpjEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    idCustEmp?: NullableStringFieldUpdateOperationsInput | string | null
    tbCCusto?: tbCCustoUpdateManyWithoutTbEmpresaNestedInput
  }

  export type tbEmpresaUncheckedUpdateInput = {
    idEmp?: StringFieldUpdateOperationsInput | string
    razaoEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    fantasiaEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    cnpjEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    idCustEmp?: NullableStringFieldUpdateOperationsInput | string | null
    tbCCusto?: tbCCustoUncheckedUpdateManyWithoutTbEmpresaNestedInput
  }

  export type tbEmpresaCreateManyInput = {
    idEmp?: string
    razaoEmpresa?: string | null
    fantasiaEmpresa?: string | null
    cnpjEmpresa?: string | null
    idCustEmp?: string | null
  }

  export type tbEmpresaUpdateManyMutationInput = {
    idEmp?: StringFieldUpdateOperationsInput | string
    razaoEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    fantasiaEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    cnpjEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    idCustEmp?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbEmpresaUncheckedUpdateManyInput = {
    idEmp?: StringFieldUpdateOperationsInput | string
    razaoEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    fantasiaEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    cnpjEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    idCustEmp?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCCustoCreateInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    tbEmpresa?: tbEmpresaCreateNestedOneWithoutTbCCustoInput
    tbPatrimonio?: tbPatrimonioCreateNestedManyWithoutTbCCustoInput
    tbFuncionario?: tbFuncionarioCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoUncheckedCreateInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    idEmp_Custo?: string | null
    tbPatrimonio?: tbPatrimonioUncheckedCreateNestedManyWithoutTbCCustoInput
    tbFuncionario?: tbFuncionarioUncheckedCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoUpdateInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    tbEmpresa?: tbEmpresaUpdateOneWithoutTbCCustoNestedInput
    tbPatrimonio?: tbPatrimonioUpdateManyWithoutTbCCustoNestedInput
    tbFuncionario?: tbFuncionarioUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCCustoUncheckedUpdateInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    idEmp_Custo?: NullableStringFieldUpdateOperationsInput | string | null
    tbPatrimonio?: tbPatrimonioUncheckedUpdateManyWithoutTbCCustoNestedInput
    tbFuncionario?: tbFuncionarioUncheckedUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCCustoCreateManyInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    idEmp_Custo?: string | null
  }

  export type tbCCustoUpdateManyMutationInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCCustoUncheckedUpdateManyInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    idEmp_Custo?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCadastroCreateInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbPatrimonio?: tbPatrimonioCreateNestedOneWithoutTbCadastroInput
    tbFuncionario?: tbFuncionarioCreateNestedOneWithoutTbCadastroInput
  }

  export type tbCadastroUncheckedCreateInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPatCad?: string | null
    idMatFunCad?: string | null
  }

  export type tbCadastroUpdateInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbPatrimonio?: tbPatrimonioUpdateOneWithoutTbCadastroNestedInput
    tbFuncionario?: tbFuncionarioUpdateOneWithoutTbCadastroNestedInput
  }

  export type tbCadastroUncheckedUpdateInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPatCad?: NullableStringFieldUpdateOperationsInput | string | null
    idMatFunCad?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCadastroCreateManyInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPatCad?: string | null
    idMatFunCad?: string | null
  }

  export type tbCadastroUpdateManyMutationInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type tbCadastroUncheckedUpdateManyInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPatCad?: NullableStringFieldUpdateOperationsInput | string | null
    idMatFunCad?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbAccontCreateInput = {
    idAccont?: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    sesseion_state?: string | null
    tbUser: tbUserCreateNestedOneWithoutTbAccontsInput
  }

  export type tbAccontUncheckedCreateInput = {
    idAccont?: string
    userID: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    sesseion_state?: string | null
  }

  export type tbAccontUpdateInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
    tbUser?: tbUserUpdateOneRequiredWithoutTbAccontsNestedInput
  }

  export type tbAccontUncheckedUpdateInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    userID?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbAccontCreateManyInput = {
    idAccont?: string
    userID: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    sesseion_state?: string | null
  }

  export type tbAccontUpdateManyMutationInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbAccontUncheckedUpdateManyInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    userID?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    tbUser: tbUserCreateNestedOneWithoutSessionInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    tbUser?: tbUserUpdateOneRequiredWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires?: Date | string | null
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires?: Date | string | null
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires?: Date | string | null
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TbFuncionarioListRelationFilter = {
    every?: tbFuncionarioWhereInput
    some?: tbFuncionarioWhereInput
    none?: tbFuncionarioWhereInput
  }

  export type TbAccontListRelationFilter = {
    every?: tbAccontWhereInput
    some?: tbAccontWhereInput
    none?: tbAccontWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type tbFuncionarioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type tbAccontOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type tbUserCountOrderByAggregateInput = {
    idU?: SortOrder
    idUser?: SortOrder
    nomeUser?: SortOrder
    emailUser?: SortOrder
    senhaUser?: SortOrder
    avatarUser?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type tbUserMaxOrderByAggregateInput = {
    idU?: SortOrder
    idUser?: SortOrder
    nomeUser?: SortOrder
    emailUser?: SortOrder
    senhaUser?: SortOrder
    avatarUser?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type tbUserMinOrderByAggregateInput = {
    idU?: SortOrder
    idUser?: SortOrder
    nomeUser?: SortOrder
    emailUser?: SortOrder
    senhaUser?: SortOrder
    avatarUser?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TbStatusFunNullableScalarRelationFilter = {
    is?: tbStatusFunWhereInput | null
    isNot?: tbStatusFunWhereInput | null
  }

  export type TbUserNullableScalarRelationFilter = {
    is?: tbUserWhereInput | null
    isNot?: tbUserWhereInput | null
  }

  export type TbFuncaoNullableScalarRelationFilter = {
    is?: tbFuncaoWhereInput | null
    isNot?: tbFuncaoWhereInput | null
  }

  export type TbCCustoNullableScalarRelationFilter = {
    is?: tbCCustoWhereInput | null
    isNot?: tbCCustoWhereInput | null
  }

  export type TbCadastroListRelationFilter = {
    every?: tbCadastroWhereInput
    some?: tbCadastroWhereInput
    none?: tbCadastroWhereInput
  }

  export type tbCadastroOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type tbFuncionarioCountOrderByAggregateInput = {
    idF?: SortOrder
    idMatFun?: SortOrder
    nomeFun?: SortOrder
    cpfFun?: SortOrder
    dataAdmFun?: SortOrder
    dataDesFun?: SortOrder
    avatarFun?: SortOrder
    idFuncaoFun?: SortOrder
    idUserFun?: SortOrder
    idStatusFun?: SortOrder
    idCustoFun?: SortOrder
  }

  export type tbFuncionarioMaxOrderByAggregateInput = {
    idF?: SortOrder
    idMatFun?: SortOrder
    nomeFun?: SortOrder
    cpfFun?: SortOrder
    dataAdmFun?: SortOrder
    dataDesFun?: SortOrder
    avatarFun?: SortOrder
    idFuncaoFun?: SortOrder
    idUserFun?: SortOrder
    idStatusFun?: SortOrder
    idCustoFun?: SortOrder
  }

  export type tbFuncionarioMinOrderByAggregateInput = {
    idF?: SortOrder
    idMatFun?: SortOrder
    nomeFun?: SortOrder
    cpfFun?: SortOrder
    dataAdmFun?: SortOrder
    dataDesFun?: SortOrder
    avatarFun?: SortOrder
    idFuncaoFun?: SortOrder
    idUserFun?: SortOrder
    idStatusFun?: SortOrder
    idCustoFun?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type tbStatusFunCountOrderByAggregateInput = {
    idStatusFun?: SortOrder
    descricaoStatusFun?: SortOrder
  }

  export type tbStatusFunMaxOrderByAggregateInput = {
    idStatusFun?: SortOrder
    descricaoStatusFun?: SortOrder
  }

  export type tbStatusFunMinOrderByAggregateInput = {
    idStatusFun?: SortOrder
    descricaoStatusFun?: SortOrder
  }

  export type tbFuncaoCountOrderByAggregateInput = {
    idFuncao?: SortOrder
    nomeFuncao?: SortOrder
  }

  export type tbFuncaoMaxOrderByAggregateInput = {
    idFuncao?: SortOrder
    nomeFuncao?: SortOrder
  }

  export type tbFuncaoMinOrderByAggregateInput = {
    idFuncao?: SortOrder
    nomeFuncao?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TbTipoPatNullableScalarRelationFilter = {
    is?: tbTipoPatWhereInput | null
    isNot?: tbTipoPatWhereInput | null
  }

  export type TbStatusPatNullableScalarRelationFilter = {
    is?: tbStatusPatWhereInput | null
    isNot?: tbStatusPatWhereInput | null
  }

  export type tbPatrimonioCountOrderByAggregateInput = {
    idP?: SortOrder
    idPat?: SortOrder
    descricaoPat?: SortOrder
    descricaoDetalhadaPat?: SortOrder
    licencaPat?: SortOrder
    dataEntPat?: SortOrder
    dataSaiPat?: SortOrder
    notaFiscalPat?: SortOrder
    valorPat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    idPat_TipoPat?: SortOrder
    idPat_StatusPat?: SortOrder
    idPat_CustoPat?: SortOrder
  }

  export type tbPatrimonioAvgOrderByAggregateInput = {
    valorPat?: SortOrder
  }

  export type tbPatrimonioMaxOrderByAggregateInput = {
    idP?: SortOrder
    idPat?: SortOrder
    descricaoPat?: SortOrder
    descricaoDetalhadaPat?: SortOrder
    licencaPat?: SortOrder
    dataEntPat?: SortOrder
    dataSaiPat?: SortOrder
    notaFiscalPat?: SortOrder
    valorPat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    idPat_TipoPat?: SortOrder
    idPat_StatusPat?: SortOrder
    idPat_CustoPat?: SortOrder
  }

  export type tbPatrimonioMinOrderByAggregateInput = {
    idP?: SortOrder
    idPat?: SortOrder
    descricaoPat?: SortOrder
    descricaoDetalhadaPat?: SortOrder
    licencaPat?: SortOrder
    dataEntPat?: SortOrder
    dataSaiPat?: SortOrder
    notaFiscalPat?: SortOrder
    valorPat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    idPat_TipoPat?: SortOrder
    idPat_StatusPat?: SortOrder
    idPat_CustoPat?: SortOrder
  }

  export type tbPatrimonioSumOrderByAggregateInput = {
    valorPat?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type TbPatrimonioListRelationFilter = {
    every?: tbPatrimonioWhereInput
    some?: tbPatrimonioWhereInput
    none?: tbPatrimonioWhereInput
  }

  export type tbPatrimonioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type tbTipoPatCountOrderByAggregateInput = {
    idTipPat?: SortOrder
    descricaoTipPat?: SortOrder
  }

  export type tbTipoPatMaxOrderByAggregateInput = {
    idTipPat?: SortOrder
    descricaoTipPat?: SortOrder
  }

  export type tbTipoPatMinOrderByAggregateInput = {
    idTipPat?: SortOrder
    descricaoTipPat?: SortOrder
  }

  export type tbStatusPatCountOrderByAggregateInput = {
    idStatusPat?: SortOrder
    descricaoStatPat?: SortOrder
  }

  export type tbStatusPatMaxOrderByAggregateInput = {
    idStatusPat?: SortOrder
    descricaoStatPat?: SortOrder
  }

  export type tbStatusPatMinOrderByAggregateInput = {
    idStatusPat?: SortOrder
    descricaoStatPat?: SortOrder
  }

  export type TbCCustoListRelationFilter = {
    every?: tbCCustoWhereInput
    some?: tbCCustoWhereInput
    none?: tbCCustoWhereInput
  }

  export type tbCCustoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type tbEmpresaCountOrderByAggregateInput = {
    idEmp?: SortOrder
    razaoEmpresa?: SortOrder
    fantasiaEmpresa?: SortOrder
    cnpjEmpresa?: SortOrder
    idCustEmp?: SortOrder
  }

  export type tbEmpresaMaxOrderByAggregateInput = {
    idEmp?: SortOrder
    razaoEmpresa?: SortOrder
    fantasiaEmpresa?: SortOrder
    cnpjEmpresa?: SortOrder
    idCustEmp?: SortOrder
  }

  export type tbEmpresaMinOrderByAggregateInput = {
    idEmp?: SortOrder
    razaoEmpresa?: SortOrder
    fantasiaEmpresa?: SortOrder
    cnpjEmpresa?: SortOrder
    idCustEmp?: SortOrder
  }

  export type TbEmpresaNullableScalarRelationFilter = {
    is?: tbEmpresaWhereInput | null
    isNot?: tbEmpresaWhereInput | null
  }

  export type tbCCustoCountOrderByAggregateInput = {
    idCCusto?: SortOrder
    codigoCCusto?: SortOrder
    descricaoCCusto?: SortOrder
    idEmp_Custo?: SortOrder
  }

  export type tbCCustoMaxOrderByAggregateInput = {
    idCCusto?: SortOrder
    codigoCCusto?: SortOrder
    descricaoCCusto?: SortOrder
    idEmp_Custo?: SortOrder
  }

  export type tbCCustoMinOrderByAggregateInput = {
    idCCusto?: SortOrder
    codigoCCusto?: SortOrder
    descricaoCCusto?: SortOrder
    idEmp_Custo?: SortOrder
  }

  export type TbPatrimonioNullableScalarRelationFilter = {
    is?: tbPatrimonioWhereInput | null
    isNot?: tbPatrimonioWhereInput | null
  }

  export type TbFuncionarioNullableScalarRelationFilter = {
    is?: tbFuncionarioWhereInput | null
    isNot?: tbFuncionarioWhereInput | null
  }

  export type tbCadastroCountOrderByAggregateInput = {
    idCad?: SortOrder
    dataCadPat?: SortOrder
    dataDevPat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    idPatCad?: SortOrder
    idMatFunCad?: SortOrder
  }

  export type tbCadastroMaxOrderByAggregateInput = {
    idCad?: SortOrder
    dataCadPat?: SortOrder
    dataDevPat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    idPatCad?: SortOrder
    idMatFunCad?: SortOrder
  }

  export type tbCadastroMinOrderByAggregateInput = {
    idCad?: SortOrder
    dataCadPat?: SortOrder
    dataDevPat?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    idPatCad?: SortOrder
    idMatFunCad?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TbUserScalarRelationFilter = {
    is?: tbUserWhereInput
    isNot?: tbUserWhereInput
  }

  export type tbAccontProviderProviderAccontIdCompoundUniqueInput = {
    provider: string
    providerAccontId: string
  }

  export type tbAccontCountOrderByAggregateInput = {
    idAccont?: SortOrder
    userID?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccontId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    sesseion_state?: SortOrder
  }

  export type tbAccontAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type tbAccontMaxOrderByAggregateInput = {
    idAccont?: SortOrder
    userID?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccontId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    sesseion_state?: SortOrder
  }

  export type tbAccontMinOrderByAggregateInput = {
    idAccont?: SortOrder
    userID?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccontId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    sesseion_state?: SortOrder
  }

  export type tbAccontSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type tbFuncionarioCreateNestedManyWithoutTbUserInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbUserInput, tbFuncionarioUncheckedCreateWithoutTbUserInput> | tbFuncionarioCreateWithoutTbUserInput[] | tbFuncionarioUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbUserInput | tbFuncionarioCreateOrConnectWithoutTbUserInput[]
    createMany?: tbFuncionarioCreateManyTbUserInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbAccontCreateNestedManyWithoutTbUserInput = {
    create?: XOR<tbAccontCreateWithoutTbUserInput, tbAccontUncheckedCreateWithoutTbUserInput> | tbAccontCreateWithoutTbUserInput[] | tbAccontUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbAccontCreateOrConnectWithoutTbUserInput | tbAccontCreateOrConnectWithoutTbUserInput[]
    createMany?: tbAccontCreateManyTbUserInputEnvelope
    connect?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutTbUserInput = {
    create?: XOR<SessionCreateWithoutTbUserInput, SessionUncheckedCreateWithoutTbUserInput> | SessionCreateWithoutTbUserInput[] | SessionUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTbUserInput | SessionCreateOrConnectWithoutTbUserInput[]
    createMany?: SessionCreateManyTbUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type tbFuncionarioUncheckedCreateNestedManyWithoutTbUserInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbUserInput, tbFuncionarioUncheckedCreateWithoutTbUserInput> | tbFuncionarioCreateWithoutTbUserInput[] | tbFuncionarioUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbUserInput | tbFuncionarioCreateOrConnectWithoutTbUserInput[]
    createMany?: tbFuncionarioCreateManyTbUserInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbAccontUncheckedCreateNestedManyWithoutTbUserInput = {
    create?: XOR<tbAccontCreateWithoutTbUserInput, tbAccontUncheckedCreateWithoutTbUserInput> | tbAccontCreateWithoutTbUserInput[] | tbAccontUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbAccontCreateOrConnectWithoutTbUserInput | tbAccontCreateOrConnectWithoutTbUserInput[]
    createMany?: tbAccontCreateManyTbUserInputEnvelope
    connect?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutTbUserInput = {
    create?: XOR<SessionCreateWithoutTbUserInput, SessionUncheckedCreateWithoutTbUserInput> | SessionCreateWithoutTbUserInput[] | SessionUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTbUserInput | SessionCreateOrConnectWithoutTbUserInput[]
    createMany?: SessionCreateManyTbUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type tbFuncionarioUpdateManyWithoutTbUserNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbUserInput, tbFuncionarioUncheckedCreateWithoutTbUserInput> | tbFuncionarioCreateWithoutTbUserInput[] | tbFuncionarioUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbUserInput | tbFuncionarioCreateOrConnectWithoutTbUserInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbUserInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbUserInput[]
    createMany?: tbFuncionarioCreateManyTbUserInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbUserInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbUserInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbUserInput | tbFuncionarioUpdateManyWithWhereWithoutTbUserInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbAccontUpdateManyWithoutTbUserNestedInput = {
    create?: XOR<tbAccontCreateWithoutTbUserInput, tbAccontUncheckedCreateWithoutTbUserInput> | tbAccontCreateWithoutTbUserInput[] | tbAccontUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbAccontCreateOrConnectWithoutTbUserInput | tbAccontCreateOrConnectWithoutTbUserInput[]
    upsert?: tbAccontUpsertWithWhereUniqueWithoutTbUserInput | tbAccontUpsertWithWhereUniqueWithoutTbUserInput[]
    createMany?: tbAccontCreateManyTbUserInputEnvelope
    set?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    disconnect?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    delete?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    connect?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    update?: tbAccontUpdateWithWhereUniqueWithoutTbUserInput | tbAccontUpdateWithWhereUniqueWithoutTbUserInput[]
    updateMany?: tbAccontUpdateManyWithWhereWithoutTbUserInput | tbAccontUpdateManyWithWhereWithoutTbUserInput[]
    deleteMany?: tbAccontScalarWhereInput | tbAccontScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutTbUserNestedInput = {
    create?: XOR<SessionCreateWithoutTbUserInput, SessionUncheckedCreateWithoutTbUserInput> | SessionCreateWithoutTbUserInput[] | SessionUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTbUserInput | SessionCreateOrConnectWithoutTbUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutTbUserInput | SessionUpsertWithWhereUniqueWithoutTbUserInput[]
    createMany?: SessionCreateManyTbUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutTbUserInput | SessionUpdateWithWhereUniqueWithoutTbUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutTbUserInput | SessionUpdateManyWithWhereWithoutTbUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbUserNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbUserInput, tbFuncionarioUncheckedCreateWithoutTbUserInput> | tbFuncionarioCreateWithoutTbUserInput[] | tbFuncionarioUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbUserInput | tbFuncionarioCreateOrConnectWithoutTbUserInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbUserInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbUserInput[]
    createMany?: tbFuncionarioCreateManyTbUserInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbUserInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbUserInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbUserInput | tbFuncionarioUpdateManyWithWhereWithoutTbUserInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbAccontUncheckedUpdateManyWithoutTbUserNestedInput = {
    create?: XOR<tbAccontCreateWithoutTbUserInput, tbAccontUncheckedCreateWithoutTbUserInput> | tbAccontCreateWithoutTbUserInput[] | tbAccontUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: tbAccontCreateOrConnectWithoutTbUserInput | tbAccontCreateOrConnectWithoutTbUserInput[]
    upsert?: tbAccontUpsertWithWhereUniqueWithoutTbUserInput | tbAccontUpsertWithWhereUniqueWithoutTbUserInput[]
    createMany?: tbAccontCreateManyTbUserInputEnvelope
    set?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    disconnect?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    delete?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    connect?: tbAccontWhereUniqueInput | tbAccontWhereUniqueInput[]
    update?: tbAccontUpdateWithWhereUniqueWithoutTbUserInput | tbAccontUpdateWithWhereUniqueWithoutTbUserInput[]
    updateMany?: tbAccontUpdateManyWithWhereWithoutTbUserInput | tbAccontUpdateManyWithWhereWithoutTbUserInput[]
    deleteMany?: tbAccontScalarWhereInput | tbAccontScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutTbUserNestedInput = {
    create?: XOR<SessionCreateWithoutTbUserInput, SessionUncheckedCreateWithoutTbUserInput> | SessionCreateWithoutTbUserInput[] | SessionUncheckedCreateWithoutTbUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutTbUserInput | SessionCreateOrConnectWithoutTbUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutTbUserInput | SessionUpsertWithWhereUniqueWithoutTbUserInput[]
    createMany?: SessionCreateManyTbUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutTbUserInput | SessionUpdateWithWhereUniqueWithoutTbUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutTbUserInput | SessionUpdateManyWithWhereWithoutTbUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type tbStatusFunCreateNestedOneWithoutTbFuncionarioInput = {
    create?: XOR<tbStatusFunCreateWithoutTbFuncionarioInput, tbStatusFunUncheckedCreateWithoutTbFuncionarioInput>
    connectOrCreate?: tbStatusFunCreateOrConnectWithoutTbFuncionarioInput
    connect?: tbStatusFunWhereUniqueInput
  }

  export type tbUserCreateNestedOneWithoutTbFuncioanrioInput = {
    create?: XOR<tbUserCreateWithoutTbFuncioanrioInput, tbUserUncheckedCreateWithoutTbFuncioanrioInput>
    connectOrCreate?: tbUserCreateOrConnectWithoutTbFuncioanrioInput
    connect?: tbUserWhereUniqueInput
  }

  export type tbFuncaoCreateNestedOneWithoutTbFuncionarioInput = {
    create?: XOR<tbFuncaoCreateWithoutTbFuncionarioInput, tbFuncaoUncheckedCreateWithoutTbFuncionarioInput>
    connectOrCreate?: tbFuncaoCreateOrConnectWithoutTbFuncionarioInput
    connect?: tbFuncaoWhereUniqueInput
  }

  export type tbCCustoCreateNestedOneWithoutTbFuncionarioInput = {
    create?: XOR<tbCCustoCreateWithoutTbFuncionarioInput, tbCCustoUncheckedCreateWithoutTbFuncionarioInput>
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbFuncionarioInput
    connect?: tbCCustoWhereUniqueInput
  }

  export type tbCadastroCreateNestedManyWithoutTbFuncionarioInput = {
    create?: XOR<tbCadastroCreateWithoutTbFuncionarioInput, tbCadastroUncheckedCreateWithoutTbFuncionarioInput> | tbCadastroCreateWithoutTbFuncionarioInput[] | tbCadastroUncheckedCreateWithoutTbFuncionarioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbFuncionarioInput | tbCadastroCreateOrConnectWithoutTbFuncionarioInput[]
    createMany?: tbCadastroCreateManyTbFuncionarioInputEnvelope
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
  }

  export type tbCadastroUncheckedCreateNestedManyWithoutTbFuncionarioInput = {
    create?: XOR<tbCadastroCreateWithoutTbFuncionarioInput, tbCadastroUncheckedCreateWithoutTbFuncionarioInput> | tbCadastroCreateWithoutTbFuncionarioInput[] | tbCadastroUncheckedCreateWithoutTbFuncionarioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbFuncionarioInput | tbCadastroCreateOrConnectWithoutTbFuncionarioInput[]
    createMany?: tbCadastroCreateManyTbFuncionarioInputEnvelope
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type tbStatusFunUpdateOneWithoutTbFuncionarioNestedInput = {
    create?: XOR<tbStatusFunCreateWithoutTbFuncionarioInput, tbStatusFunUncheckedCreateWithoutTbFuncionarioInput>
    connectOrCreate?: tbStatusFunCreateOrConnectWithoutTbFuncionarioInput
    upsert?: tbStatusFunUpsertWithoutTbFuncionarioInput
    disconnect?: tbStatusFunWhereInput | boolean
    delete?: tbStatusFunWhereInput | boolean
    connect?: tbStatusFunWhereUniqueInput
    update?: XOR<XOR<tbStatusFunUpdateToOneWithWhereWithoutTbFuncionarioInput, tbStatusFunUpdateWithoutTbFuncionarioInput>, tbStatusFunUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbUserUpdateOneWithoutTbFuncioanrioNestedInput = {
    create?: XOR<tbUserCreateWithoutTbFuncioanrioInput, tbUserUncheckedCreateWithoutTbFuncioanrioInput>
    connectOrCreate?: tbUserCreateOrConnectWithoutTbFuncioanrioInput
    upsert?: tbUserUpsertWithoutTbFuncioanrioInput
    disconnect?: tbUserWhereInput | boolean
    delete?: tbUserWhereInput | boolean
    connect?: tbUserWhereUniqueInput
    update?: XOR<XOR<tbUserUpdateToOneWithWhereWithoutTbFuncioanrioInput, tbUserUpdateWithoutTbFuncioanrioInput>, tbUserUncheckedUpdateWithoutTbFuncioanrioInput>
  }

  export type tbFuncaoUpdateOneWithoutTbFuncionarioNestedInput = {
    create?: XOR<tbFuncaoCreateWithoutTbFuncionarioInput, tbFuncaoUncheckedCreateWithoutTbFuncionarioInput>
    connectOrCreate?: tbFuncaoCreateOrConnectWithoutTbFuncionarioInput
    upsert?: tbFuncaoUpsertWithoutTbFuncionarioInput
    disconnect?: tbFuncaoWhereInput | boolean
    delete?: tbFuncaoWhereInput | boolean
    connect?: tbFuncaoWhereUniqueInput
    update?: XOR<XOR<tbFuncaoUpdateToOneWithWhereWithoutTbFuncionarioInput, tbFuncaoUpdateWithoutTbFuncionarioInput>, tbFuncaoUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbCCustoUpdateOneWithoutTbFuncionarioNestedInput = {
    create?: XOR<tbCCustoCreateWithoutTbFuncionarioInput, tbCCustoUncheckedCreateWithoutTbFuncionarioInput>
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbFuncionarioInput
    upsert?: tbCCustoUpsertWithoutTbFuncionarioInput
    disconnect?: tbCCustoWhereInput | boolean
    delete?: tbCCustoWhereInput | boolean
    connect?: tbCCustoWhereUniqueInput
    update?: XOR<XOR<tbCCustoUpdateToOneWithWhereWithoutTbFuncionarioInput, tbCCustoUpdateWithoutTbFuncionarioInput>, tbCCustoUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbCadastroUpdateManyWithoutTbFuncionarioNestedInput = {
    create?: XOR<tbCadastroCreateWithoutTbFuncionarioInput, tbCadastroUncheckedCreateWithoutTbFuncionarioInput> | tbCadastroCreateWithoutTbFuncionarioInput[] | tbCadastroUncheckedCreateWithoutTbFuncionarioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbFuncionarioInput | tbCadastroCreateOrConnectWithoutTbFuncionarioInput[]
    upsert?: tbCadastroUpsertWithWhereUniqueWithoutTbFuncionarioInput | tbCadastroUpsertWithWhereUniqueWithoutTbFuncionarioInput[]
    createMany?: tbCadastroCreateManyTbFuncionarioInputEnvelope
    set?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    disconnect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    delete?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    update?: tbCadastroUpdateWithWhereUniqueWithoutTbFuncionarioInput | tbCadastroUpdateWithWhereUniqueWithoutTbFuncionarioInput[]
    updateMany?: tbCadastroUpdateManyWithWhereWithoutTbFuncionarioInput | tbCadastroUpdateManyWithWhereWithoutTbFuncionarioInput[]
    deleteMany?: tbCadastroScalarWhereInput | tbCadastroScalarWhereInput[]
  }

  export type tbCadastroUncheckedUpdateManyWithoutTbFuncionarioNestedInput = {
    create?: XOR<tbCadastroCreateWithoutTbFuncionarioInput, tbCadastroUncheckedCreateWithoutTbFuncionarioInput> | tbCadastroCreateWithoutTbFuncionarioInput[] | tbCadastroUncheckedCreateWithoutTbFuncionarioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbFuncionarioInput | tbCadastroCreateOrConnectWithoutTbFuncionarioInput[]
    upsert?: tbCadastroUpsertWithWhereUniqueWithoutTbFuncionarioInput | tbCadastroUpsertWithWhereUniqueWithoutTbFuncionarioInput[]
    createMany?: tbCadastroCreateManyTbFuncionarioInputEnvelope
    set?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    disconnect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    delete?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    update?: tbCadastroUpdateWithWhereUniqueWithoutTbFuncionarioInput | tbCadastroUpdateWithWhereUniqueWithoutTbFuncionarioInput[]
    updateMany?: tbCadastroUpdateManyWithWhereWithoutTbFuncionarioInput | tbCadastroUpdateManyWithWhereWithoutTbFuncionarioInput[]
    deleteMany?: tbCadastroScalarWhereInput | tbCadastroScalarWhereInput[]
  }

  export type tbFuncionarioCreateNestedManyWithoutTbStatusFunInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbStatusFunInput, tbFuncionarioUncheckedCreateWithoutTbStatusFunInput> | tbFuncionarioCreateWithoutTbStatusFunInput[] | tbFuncionarioUncheckedCreateWithoutTbStatusFunInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbStatusFunInput | tbFuncionarioCreateOrConnectWithoutTbStatusFunInput[]
    createMany?: tbFuncionarioCreateManyTbStatusFunInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbFuncionarioUncheckedCreateNestedManyWithoutTbStatusFunInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbStatusFunInput, tbFuncionarioUncheckedCreateWithoutTbStatusFunInput> | tbFuncionarioCreateWithoutTbStatusFunInput[] | tbFuncionarioUncheckedCreateWithoutTbStatusFunInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbStatusFunInput | tbFuncionarioCreateOrConnectWithoutTbStatusFunInput[]
    createMany?: tbFuncionarioCreateManyTbStatusFunInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbFuncionarioUpdateManyWithoutTbStatusFunNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbStatusFunInput, tbFuncionarioUncheckedCreateWithoutTbStatusFunInput> | tbFuncionarioCreateWithoutTbStatusFunInput[] | tbFuncionarioUncheckedCreateWithoutTbStatusFunInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbStatusFunInput | tbFuncionarioCreateOrConnectWithoutTbStatusFunInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbStatusFunInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbStatusFunInput[]
    createMany?: tbFuncionarioCreateManyTbStatusFunInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbStatusFunInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbStatusFunInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbStatusFunInput | tbFuncionarioUpdateManyWithWhereWithoutTbStatusFunInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbStatusFunNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbStatusFunInput, tbFuncionarioUncheckedCreateWithoutTbStatusFunInput> | tbFuncionarioCreateWithoutTbStatusFunInput[] | tbFuncionarioUncheckedCreateWithoutTbStatusFunInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbStatusFunInput | tbFuncionarioCreateOrConnectWithoutTbStatusFunInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbStatusFunInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbStatusFunInput[]
    createMany?: tbFuncionarioCreateManyTbStatusFunInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbStatusFunInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbStatusFunInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbStatusFunInput | tbFuncionarioUpdateManyWithWhereWithoutTbStatusFunInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbFuncionarioCreateNestedManyWithoutTbFuncaoInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbFuncaoInput, tbFuncionarioUncheckedCreateWithoutTbFuncaoInput> | tbFuncionarioCreateWithoutTbFuncaoInput[] | tbFuncionarioUncheckedCreateWithoutTbFuncaoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbFuncaoInput | tbFuncionarioCreateOrConnectWithoutTbFuncaoInput[]
    createMany?: tbFuncionarioCreateManyTbFuncaoInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbFuncionarioUncheckedCreateNestedManyWithoutTbFuncaoInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbFuncaoInput, tbFuncionarioUncheckedCreateWithoutTbFuncaoInput> | tbFuncionarioCreateWithoutTbFuncaoInput[] | tbFuncionarioUncheckedCreateWithoutTbFuncaoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbFuncaoInput | tbFuncionarioCreateOrConnectWithoutTbFuncaoInput[]
    createMany?: tbFuncionarioCreateManyTbFuncaoInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbFuncionarioUpdateManyWithoutTbFuncaoNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbFuncaoInput, tbFuncionarioUncheckedCreateWithoutTbFuncaoInput> | tbFuncionarioCreateWithoutTbFuncaoInput[] | tbFuncionarioUncheckedCreateWithoutTbFuncaoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbFuncaoInput | tbFuncionarioCreateOrConnectWithoutTbFuncaoInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbFuncaoInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbFuncaoInput[]
    createMany?: tbFuncionarioCreateManyTbFuncaoInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbFuncaoInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbFuncaoInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbFuncaoInput | tbFuncionarioUpdateManyWithWhereWithoutTbFuncaoInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbFuncaoNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbFuncaoInput, tbFuncionarioUncheckedCreateWithoutTbFuncaoInput> | tbFuncionarioCreateWithoutTbFuncaoInput[] | tbFuncionarioUncheckedCreateWithoutTbFuncaoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbFuncaoInput | tbFuncionarioCreateOrConnectWithoutTbFuncaoInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbFuncaoInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbFuncaoInput[]
    createMany?: tbFuncionarioCreateManyTbFuncaoInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbFuncaoInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbFuncaoInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbFuncaoInput | tbFuncionarioUpdateManyWithWhereWithoutTbFuncaoInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbTipoPatCreateNestedOneWithoutTbPatrimonioInput = {
    create?: XOR<tbTipoPatCreateWithoutTbPatrimonioInput, tbTipoPatUncheckedCreateWithoutTbPatrimonioInput>
    connectOrCreate?: tbTipoPatCreateOrConnectWithoutTbPatrimonioInput
    connect?: tbTipoPatWhereUniqueInput
  }

  export type tbStatusPatCreateNestedOneWithoutTbPatrimonioInput = {
    create?: XOR<tbStatusPatCreateWithoutTbPatrimonioInput, tbStatusPatUncheckedCreateWithoutTbPatrimonioInput>
    connectOrCreate?: tbStatusPatCreateOrConnectWithoutTbPatrimonioInput
    connect?: tbStatusPatWhereUniqueInput
  }

  export type tbCCustoCreateNestedOneWithoutTbPatrimonioInput = {
    create?: XOR<tbCCustoCreateWithoutTbPatrimonioInput, tbCCustoUncheckedCreateWithoutTbPatrimonioInput>
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbPatrimonioInput
    connect?: tbCCustoWhereUniqueInput
  }

  export type tbCadastroCreateNestedManyWithoutTbPatrimonioInput = {
    create?: XOR<tbCadastroCreateWithoutTbPatrimonioInput, tbCadastroUncheckedCreateWithoutTbPatrimonioInput> | tbCadastroCreateWithoutTbPatrimonioInput[] | tbCadastroUncheckedCreateWithoutTbPatrimonioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbPatrimonioInput | tbCadastroCreateOrConnectWithoutTbPatrimonioInput[]
    createMany?: tbCadastroCreateManyTbPatrimonioInputEnvelope
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
  }

  export type tbCadastroUncheckedCreateNestedManyWithoutTbPatrimonioInput = {
    create?: XOR<tbCadastroCreateWithoutTbPatrimonioInput, tbCadastroUncheckedCreateWithoutTbPatrimonioInput> | tbCadastroCreateWithoutTbPatrimonioInput[] | tbCadastroUncheckedCreateWithoutTbPatrimonioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbPatrimonioInput | tbCadastroCreateOrConnectWithoutTbPatrimonioInput[]
    createMany?: tbCadastroCreateManyTbPatrimonioInputEnvelope
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type tbTipoPatUpdateOneWithoutTbPatrimonioNestedInput = {
    create?: XOR<tbTipoPatCreateWithoutTbPatrimonioInput, tbTipoPatUncheckedCreateWithoutTbPatrimonioInput>
    connectOrCreate?: tbTipoPatCreateOrConnectWithoutTbPatrimonioInput
    upsert?: tbTipoPatUpsertWithoutTbPatrimonioInput
    disconnect?: tbTipoPatWhereInput | boolean
    delete?: tbTipoPatWhereInput | boolean
    connect?: tbTipoPatWhereUniqueInput
    update?: XOR<XOR<tbTipoPatUpdateToOneWithWhereWithoutTbPatrimonioInput, tbTipoPatUpdateWithoutTbPatrimonioInput>, tbTipoPatUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbStatusPatUpdateOneWithoutTbPatrimonioNestedInput = {
    create?: XOR<tbStatusPatCreateWithoutTbPatrimonioInput, tbStatusPatUncheckedCreateWithoutTbPatrimonioInput>
    connectOrCreate?: tbStatusPatCreateOrConnectWithoutTbPatrimonioInput
    upsert?: tbStatusPatUpsertWithoutTbPatrimonioInput
    disconnect?: tbStatusPatWhereInput | boolean
    delete?: tbStatusPatWhereInput | boolean
    connect?: tbStatusPatWhereUniqueInput
    update?: XOR<XOR<tbStatusPatUpdateToOneWithWhereWithoutTbPatrimonioInput, tbStatusPatUpdateWithoutTbPatrimonioInput>, tbStatusPatUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbCCustoUpdateOneWithoutTbPatrimonioNestedInput = {
    create?: XOR<tbCCustoCreateWithoutTbPatrimonioInput, tbCCustoUncheckedCreateWithoutTbPatrimonioInput>
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbPatrimonioInput
    upsert?: tbCCustoUpsertWithoutTbPatrimonioInput
    disconnect?: tbCCustoWhereInput | boolean
    delete?: tbCCustoWhereInput | boolean
    connect?: tbCCustoWhereUniqueInput
    update?: XOR<XOR<tbCCustoUpdateToOneWithWhereWithoutTbPatrimonioInput, tbCCustoUpdateWithoutTbPatrimonioInput>, tbCCustoUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbCadastroUpdateManyWithoutTbPatrimonioNestedInput = {
    create?: XOR<tbCadastroCreateWithoutTbPatrimonioInput, tbCadastroUncheckedCreateWithoutTbPatrimonioInput> | tbCadastroCreateWithoutTbPatrimonioInput[] | tbCadastroUncheckedCreateWithoutTbPatrimonioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbPatrimonioInput | tbCadastroCreateOrConnectWithoutTbPatrimonioInput[]
    upsert?: tbCadastroUpsertWithWhereUniqueWithoutTbPatrimonioInput | tbCadastroUpsertWithWhereUniqueWithoutTbPatrimonioInput[]
    createMany?: tbCadastroCreateManyTbPatrimonioInputEnvelope
    set?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    disconnect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    delete?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    update?: tbCadastroUpdateWithWhereUniqueWithoutTbPatrimonioInput | tbCadastroUpdateWithWhereUniqueWithoutTbPatrimonioInput[]
    updateMany?: tbCadastroUpdateManyWithWhereWithoutTbPatrimonioInput | tbCadastroUpdateManyWithWhereWithoutTbPatrimonioInput[]
    deleteMany?: tbCadastroScalarWhereInput | tbCadastroScalarWhereInput[]
  }

  export type tbCadastroUncheckedUpdateManyWithoutTbPatrimonioNestedInput = {
    create?: XOR<tbCadastroCreateWithoutTbPatrimonioInput, tbCadastroUncheckedCreateWithoutTbPatrimonioInput> | tbCadastroCreateWithoutTbPatrimonioInput[] | tbCadastroUncheckedCreateWithoutTbPatrimonioInput[]
    connectOrCreate?: tbCadastroCreateOrConnectWithoutTbPatrimonioInput | tbCadastroCreateOrConnectWithoutTbPatrimonioInput[]
    upsert?: tbCadastroUpsertWithWhereUniqueWithoutTbPatrimonioInput | tbCadastroUpsertWithWhereUniqueWithoutTbPatrimonioInput[]
    createMany?: tbCadastroCreateManyTbPatrimonioInputEnvelope
    set?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    disconnect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    delete?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    connect?: tbCadastroWhereUniqueInput | tbCadastroWhereUniqueInput[]
    update?: tbCadastroUpdateWithWhereUniqueWithoutTbPatrimonioInput | tbCadastroUpdateWithWhereUniqueWithoutTbPatrimonioInput[]
    updateMany?: tbCadastroUpdateManyWithWhereWithoutTbPatrimonioInput | tbCadastroUpdateManyWithWhereWithoutTbPatrimonioInput[]
    deleteMany?: tbCadastroScalarWhereInput | tbCadastroScalarWhereInput[]
  }

  export type tbPatrimonioCreateNestedManyWithoutTbTipoPatInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbTipoPatInput, tbPatrimonioUncheckedCreateWithoutTbTipoPatInput> | tbPatrimonioCreateWithoutTbTipoPatInput[] | tbPatrimonioUncheckedCreateWithoutTbTipoPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbTipoPatInput | tbPatrimonioCreateOrConnectWithoutTbTipoPatInput[]
    createMany?: tbPatrimonioCreateManyTbTipoPatInputEnvelope
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
  }

  export type tbPatrimonioUncheckedCreateNestedManyWithoutTbTipoPatInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbTipoPatInput, tbPatrimonioUncheckedCreateWithoutTbTipoPatInput> | tbPatrimonioCreateWithoutTbTipoPatInput[] | tbPatrimonioUncheckedCreateWithoutTbTipoPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbTipoPatInput | tbPatrimonioCreateOrConnectWithoutTbTipoPatInput[]
    createMany?: tbPatrimonioCreateManyTbTipoPatInputEnvelope
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
  }

  export type tbPatrimonioUpdateManyWithoutTbTipoPatNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbTipoPatInput, tbPatrimonioUncheckedCreateWithoutTbTipoPatInput> | tbPatrimonioCreateWithoutTbTipoPatInput[] | tbPatrimonioUncheckedCreateWithoutTbTipoPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbTipoPatInput | tbPatrimonioCreateOrConnectWithoutTbTipoPatInput[]
    upsert?: tbPatrimonioUpsertWithWhereUniqueWithoutTbTipoPatInput | tbPatrimonioUpsertWithWhereUniqueWithoutTbTipoPatInput[]
    createMany?: tbPatrimonioCreateManyTbTipoPatInputEnvelope
    set?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    disconnect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    delete?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    update?: tbPatrimonioUpdateWithWhereUniqueWithoutTbTipoPatInput | tbPatrimonioUpdateWithWhereUniqueWithoutTbTipoPatInput[]
    updateMany?: tbPatrimonioUpdateManyWithWhereWithoutTbTipoPatInput | tbPatrimonioUpdateManyWithWhereWithoutTbTipoPatInput[]
    deleteMany?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
  }

  export type tbPatrimonioUncheckedUpdateManyWithoutTbTipoPatNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbTipoPatInput, tbPatrimonioUncheckedCreateWithoutTbTipoPatInput> | tbPatrimonioCreateWithoutTbTipoPatInput[] | tbPatrimonioUncheckedCreateWithoutTbTipoPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbTipoPatInput | tbPatrimonioCreateOrConnectWithoutTbTipoPatInput[]
    upsert?: tbPatrimonioUpsertWithWhereUniqueWithoutTbTipoPatInput | tbPatrimonioUpsertWithWhereUniqueWithoutTbTipoPatInput[]
    createMany?: tbPatrimonioCreateManyTbTipoPatInputEnvelope
    set?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    disconnect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    delete?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    update?: tbPatrimonioUpdateWithWhereUniqueWithoutTbTipoPatInput | tbPatrimonioUpdateWithWhereUniqueWithoutTbTipoPatInput[]
    updateMany?: tbPatrimonioUpdateManyWithWhereWithoutTbTipoPatInput | tbPatrimonioUpdateManyWithWhereWithoutTbTipoPatInput[]
    deleteMany?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
  }

  export type tbPatrimonioCreateNestedManyWithoutTbStatusPatInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbStatusPatInput, tbPatrimonioUncheckedCreateWithoutTbStatusPatInput> | tbPatrimonioCreateWithoutTbStatusPatInput[] | tbPatrimonioUncheckedCreateWithoutTbStatusPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbStatusPatInput | tbPatrimonioCreateOrConnectWithoutTbStatusPatInput[]
    createMany?: tbPatrimonioCreateManyTbStatusPatInputEnvelope
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
  }

  export type tbPatrimonioUncheckedCreateNestedManyWithoutTbStatusPatInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbStatusPatInput, tbPatrimonioUncheckedCreateWithoutTbStatusPatInput> | tbPatrimonioCreateWithoutTbStatusPatInput[] | tbPatrimonioUncheckedCreateWithoutTbStatusPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbStatusPatInput | tbPatrimonioCreateOrConnectWithoutTbStatusPatInput[]
    createMany?: tbPatrimonioCreateManyTbStatusPatInputEnvelope
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
  }

  export type tbPatrimonioUpdateManyWithoutTbStatusPatNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbStatusPatInput, tbPatrimonioUncheckedCreateWithoutTbStatusPatInput> | tbPatrimonioCreateWithoutTbStatusPatInput[] | tbPatrimonioUncheckedCreateWithoutTbStatusPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbStatusPatInput | tbPatrimonioCreateOrConnectWithoutTbStatusPatInput[]
    upsert?: tbPatrimonioUpsertWithWhereUniqueWithoutTbStatusPatInput | tbPatrimonioUpsertWithWhereUniqueWithoutTbStatusPatInput[]
    createMany?: tbPatrimonioCreateManyTbStatusPatInputEnvelope
    set?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    disconnect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    delete?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    update?: tbPatrimonioUpdateWithWhereUniqueWithoutTbStatusPatInput | tbPatrimonioUpdateWithWhereUniqueWithoutTbStatusPatInput[]
    updateMany?: tbPatrimonioUpdateManyWithWhereWithoutTbStatusPatInput | tbPatrimonioUpdateManyWithWhereWithoutTbStatusPatInput[]
    deleteMany?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
  }

  export type tbPatrimonioUncheckedUpdateManyWithoutTbStatusPatNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbStatusPatInput, tbPatrimonioUncheckedCreateWithoutTbStatusPatInput> | tbPatrimonioCreateWithoutTbStatusPatInput[] | tbPatrimonioUncheckedCreateWithoutTbStatusPatInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbStatusPatInput | tbPatrimonioCreateOrConnectWithoutTbStatusPatInput[]
    upsert?: tbPatrimonioUpsertWithWhereUniqueWithoutTbStatusPatInput | tbPatrimonioUpsertWithWhereUniqueWithoutTbStatusPatInput[]
    createMany?: tbPatrimonioCreateManyTbStatusPatInputEnvelope
    set?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    disconnect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    delete?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    update?: tbPatrimonioUpdateWithWhereUniqueWithoutTbStatusPatInput | tbPatrimonioUpdateWithWhereUniqueWithoutTbStatusPatInput[]
    updateMany?: tbPatrimonioUpdateManyWithWhereWithoutTbStatusPatInput | tbPatrimonioUpdateManyWithWhereWithoutTbStatusPatInput[]
    deleteMany?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
  }

  export type tbCCustoCreateNestedManyWithoutTbEmpresaInput = {
    create?: XOR<tbCCustoCreateWithoutTbEmpresaInput, tbCCustoUncheckedCreateWithoutTbEmpresaInput> | tbCCustoCreateWithoutTbEmpresaInput[] | tbCCustoUncheckedCreateWithoutTbEmpresaInput[]
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbEmpresaInput | tbCCustoCreateOrConnectWithoutTbEmpresaInput[]
    createMany?: tbCCustoCreateManyTbEmpresaInputEnvelope
    connect?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
  }

  export type tbCCustoUncheckedCreateNestedManyWithoutTbEmpresaInput = {
    create?: XOR<tbCCustoCreateWithoutTbEmpresaInput, tbCCustoUncheckedCreateWithoutTbEmpresaInput> | tbCCustoCreateWithoutTbEmpresaInput[] | tbCCustoUncheckedCreateWithoutTbEmpresaInput[]
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbEmpresaInput | tbCCustoCreateOrConnectWithoutTbEmpresaInput[]
    createMany?: tbCCustoCreateManyTbEmpresaInputEnvelope
    connect?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
  }

  export type tbCCustoUpdateManyWithoutTbEmpresaNestedInput = {
    create?: XOR<tbCCustoCreateWithoutTbEmpresaInput, tbCCustoUncheckedCreateWithoutTbEmpresaInput> | tbCCustoCreateWithoutTbEmpresaInput[] | tbCCustoUncheckedCreateWithoutTbEmpresaInput[]
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbEmpresaInput | tbCCustoCreateOrConnectWithoutTbEmpresaInput[]
    upsert?: tbCCustoUpsertWithWhereUniqueWithoutTbEmpresaInput | tbCCustoUpsertWithWhereUniqueWithoutTbEmpresaInput[]
    createMany?: tbCCustoCreateManyTbEmpresaInputEnvelope
    set?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    disconnect?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    delete?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    connect?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    update?: tbCCustoUpdateWithWhereUniqueWithoutTbEmpresaInput | tbCCustoUpdateWithWhereUniqueWithoutTbEmpresaInput[]
    updateMany?: tbCCustoUpdateManyWithWhereWithoutTbEmpresaInput | tbCCustoUpdateManyWithWhereWithoutTbEmpresaInput[]
    deleteMany?: tbCCustoScalarWhereInput | tbCCustoScalarWhereInput[]
  }

  export type tbCCustoUncheckedUpdateManyWithoutTbEmpresaNestedInput = {
    create?: XOR<tbCCustoCreateWithoutTbEmpresaInput, tbCCustoUncheckedCreateWithoutTbEmpresaInput> | tbCCustoCreateWithoutTbEmpresaInput[] | tbCCustoUncheckedCreateWithoutTbEmpresaInput[]
    connectOrCreate?: tbCCustoCreateOrConnectWithoutTbEmpresaInput | tbCCustoCreateOrConnectWithoutTbEmpresaInput[]
    upsert?: tbCCustoUpsertWithWhereUniqueWithoutTbEmpresaInput | tbCCustoUpsertWithWhereUniqueWithoutTbEmpresaInput[]
    createMany?: tbCCustoCreateManyTbEmpresaInputEnvelope
    set?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    disconnect?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    delete?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    connect?: tbCCustoWhereUniqueInput | tbCCustoWhereUniqueInput[]
    update?: tbCCustoUpdateWithWhereUniqueWithoutTbEmpresaInput | tbCCustoUpdateWithWhereUniqueWithoutTbEmpresaInput[]
    updateMany?: tbCCustoUpdateManyWithWhereWithoutTbEmpresaInput | tbCCustoUpdateManyWithWhereWithoutTbEmpresaInput[]
    deleteMany?: tbCCustoScalarWhereInput | tbCCustoScalarWhereInput[]
  }

  export type tbEmpresaCreateNestedOneWithoutTbCCustoInput = {
    create?: XOR<tbEmpresaCreateWithoutTbCCustoInput, tbEmpresaUncheckedCreateWithoutTbCCustoInput>
    connectOrCreate?: tbEmpresaCreateOrConnectWithoutTbCCustoInput
    connect?: tbEmpresaWhereUniqueInput
  }

  export type tbPatrimonioCreateNestedManyWithoutTbCCustoInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbCCustoInput, tbPatrimonioUncheckedCreateWithoutTbCCustoInput> | tbPatrimonioCreateWithoutTbCCustoInput[] | tbPatrimonioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbCCustoInput | tbPatrimonioCreateOrConnectWithoutTbCCustoInput[]
    createMany?: tbPatrimonioCreateManyTbCCustoInputEnvelope
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
  }

  export type tbFuncionarioCreateNestedManyWithoutTbCCustoInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbCCustoInput, tbFuncionarioUncheckedCreateWithoutTbCCustoInput> | tbFuncionarioCreateWithoutTbCCustoInput[] | tbFuncionarioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbCCustoInput | tbFuncionarioCreateOrConnectWithoutTbCCustoInput[]
    createMany?: tbFuncionarioCreateManyTbCCustoInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbPatrimonioUncheckedCreateNestedManyWithoutTbCCustoInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbCCustoInput, tbPatrimonioUncheckedCreateWithoutTbCCustoInput> | tbPatrimonioCreateWithoutTbCCustoInput[] | tbPatrimonioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbCCustoInput | tbPatrimonioCreateOrConnectWithoutTbCCustoInput[]
    createMany?: tbPatrimonioCreateManyTbCCustoInputEnvelope
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
  }

  export type tbFuncionarioUncheckedCreateNestedManyWithoutTbCCustoInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbCCustoInput, tbFuncionarioUncheckedCreateWithoutTbCCustoInput> | tbFuncionarioCreateWithoutTbCCustoInput[] | tbFuncionarioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbCCustoInput | tbFuncionarioCreateOrConnectWithoutTbCCustoInput[]
    createMany?: tbFuncionarioCreateManyTbCCustoInputEnvelope
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
  }

  export type tbEmpresaUpdateOneWithoutTbCCustoNestedInput = {
    create?: XOR<tbEmpresaCreateWithoutTbCCustoInput, tbEmpresaUncheckedCreateWithoutTbCCustoInput>
    connectOrCreate?: tbEmpresaCreateOrConnectWithoutTbCCustoInput
    upsert?: tbEmpresaUpsertWithoutTbCCustoInput
    disconnect?: tbEmpresaWhereInput | boolean
    delete?: tbEmpresaWhereInput | boolean
    connect?: tbEmpresaWhereUniqueInput
    update?: XOR<XOR<tbEmpresaUpdateToOneWithWhereWithoutTbCCustoInput, tbEmpresaUpdateWithoutTbCCustoInput>, tbEmpresaUncheckedUpdateWithoutTbCCustoInput>
  }

  export type tbPatrimonioUpdateManyWithoutTbCCustoNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbCCustoInput, tbPatrimonioUncheckedCreateWithoutTbCCustoInput> | tbPatrimonioCreateWithoutTbCCustoInput[] | tbPatrimonioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbCCustoInput | tbPatrimonioCreateOrConnectWithoutTbCCustoInput[]
    upsert?: tbPatrimonioUpsertWithWhereUniqueWithoutTbCCustoInput | tbPatrimonioUpsertWithWhereUniqueWithoutTbCCustoInput[]
    createMany?: tbPatrimonioCreateManyTbCCustoInputEnvelope
    set?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    disconnect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    delete?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    update?: tbPatrimonioUpdateWithWhereUniqueWithoutTbCCustoInput | tbPatrimonioUpdateWithWhereUniqueWithoutTbCCustoInput[]
    updateMany?: tbPatrimonioUpdateManyWithWhereWithoutTbCCustoInput | tbPatrimonioUpdateManyWithWhereWithoutTbCCustoInput[]
    deleteMany?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
  }

  export type tbFuncionarioUpdateManyWithoutTbCCustoNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbCCustoInput, tbFuncionarioUncheckedCreateWithoutTbCCustoInput> | tbFuncionarioCreateWithoutTbCCustoInput[] | tbFuncionarioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbCCustoInput | tbFuncionarioCreateOrConnectWithoutTbCCustoInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbCCustoInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbCCustoInput[]
    createMany?: tbFuncionarioCreateManyTbCCustoInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbCCustoInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbCCustoInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbCCustoInput | tbFuncionarioUpdateManyWithWhereWithoutTbCCustoInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbPatrimonioUncheckedUpdateManyWithoutTbCCustoNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbCCustoInput, tbPatrimonioUncheckedCreateWithoutTbCCustoInput> | tbPatrimonioCreateWithoutTbCCustoInput[] | tbPatrimonioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbCCustoInput | tbPatrimonioCreateOrConnectWithoutTbCCustoInput[]
    upsert?: tbPatrimonioUpsertWithWhereUniqueWithoutTbCCustoInput | tbPatrimonioUpsertWithWhereUniqueWithoutTbCCustoInput[]
    createMany?: tbPatrimonioCreateManyTbCCustoInputEnvelope
    set?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    disconnect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    delete?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    connect?: tbPatrimonioWhereUniqueInput | tbPatrimonioWhereUniqueInput[]
    update?: tbPatrimonioUpdateWithWhereUniqueWithoutTbCCustoInput | tbPatrimonioUpdateWithWhereUniqueWithoutTbCCustoInput[]
    updateMany?: tbPatrimonioUpdateManyWithWhereWithoutTbCCustoInput | tbPatrimonioUpdateManyWithWhereWithoutTbCCustoInput[]
    deleteMany?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbCCustoNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbCCustoInput, tbFuncionarioUncheckedCreateWithoutTbCCustoInput> | tbFuncionarioCreateWithoutTbCCustoInput[] | tbFuncionarioUncheckedCreateWithoutTbCCustoInput[]
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbCCustoInput | tbFuncionarioCreateOrConnectWithoutTbCCustoInput[]
    upsert?: tbFuncionarioUpsertWithWhereUniqueWithoutTbCCustoInput | tbFuncionarioUpsertWithWhereUniqueWithoutTbCCustoInput[]
    createMany?: tbFuncionarioCreateManyTbCCustoInputEnvelope
    set?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    disconnect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    delete?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    connect?: tbFuncionarioWhereUniqueInput | tbFuncionarioWhereUniqueInput[]
    update?: tbFuncionarioUpdateWithWhereUniqueWithoutTbCCustoInput | tbFuncionarioUpdateWithWhereUniqueWithoutTbCCustoInput[]
    updateMany?: tbFuncionarioUpdateManyWithWhereWithoutTbCCustoInput | tbFuncionarioUpdateManyWithWhereWithoutTbCCustoInput[]
    deleteMany?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
  }

  export type tbPatrimonioCreateNestedOneWithoutTbCadastroInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbCadastroInput, tbPatrimonioUncheckedCreateWithoutTbCadastroInput>
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbCadastroInput
    connect?: tbPatrimonioWhereUniqueInput
  }

  export type tbFuncionarioCreateNestedOneWithoutTbCadastroInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbCadastroInput, tbFuncionarioUncheckedCreateWithoutTbCadastroInput>
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbCadastroInput
    connect?: tbFuncionarioWhereUniqueInput
  }

  export type tbPatrimonioUpdateOneWithoutTbCadastroNestedInput = {
    create?: XOR<tbPatrimonioCreateWithoutTbCadastroInput, tbPatrimonioUncheckedCreateWithoutTbCadastroInput>
    connectOrCreate?: tbPatrimonioCreateOrConnectWithoutTbCadastroInput
    upsert?: tbPatrimonioUpsertWithoutTbCadastroInput
    disconnect?: tbPatrimonioWhereInput | boolean
    delete?: tbPatrimonioWhereInput | boolean
    connect?: tbPatrimonioWhereUniqueInput
    update?: XOR<XOR<tbPatrimonioUpdateToOneWithWhereWithoutTbCadastroInput, tbPatrimonioUpdateWithoutTbCadastroInput>, tbPatrimonioUncheckedUpdateWithoutTbCadastroInput>
  }

  export type tbFuncionarioUpdateOneWithoutTbCadastroNestedInput = {
    create?: XOR<tbFuncionarioCreateWithoutTbCadastroInput, tbFuncionarioUncheckedCreateWithoutTbCadastroInput>
    connectOrCreate?: tbFuncionarioCreateOrConnectWithoutTbCadastroInput
    upsert?: tbFuncionarioUpsertWithoutTbCadastroInput
    disconnect?: tbFuncionarioWhereInput | boolean
    delete?: tbFuncionarioWhereInput | boolean
    connect?: tbFuncionarioWhereUniqueInput
    update?: XOR<XOR<tbFuncionarioUpdateToOneWithWhereWithoutTbCadastroInput, tbFuncionarioUpdateWithoutTbCadastroInput>, tbFuncionarioUncheckedUpdateWithoutTbCadastroInput>
  }

  export type tbUserCreateNestedOneWithoutTbAccontsInput = {
    create?: XOR<tbUserCreateWithoutTbAccontsInput, tbUserUncheckedCreateWithoutTbAccontsInput>
    connectOrCreate?: tbUserCreateOrConnectWithoutTbAccontsInput
    connect?: tbUserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type tbUserUpdateOneRequiredWithoutTbAccontsNestedInput = {
    create?: XOR<tbUserCreateWithoutTbAccontsInput, tbUserUncheckedCreateWithoutTbAccontsInput>
    connectOrCreate?: tbUserCreateOrConnectWithoutTbAccontsInput
    upsert?: tbUserUpsertWithoutTbAccontsInput
    connect?: tbUserWhereUniqueInput
    update?: XOR<XOR<tbUserUpdateToOneWithWhereWithoutTbAccontsInput, tbUserUpdateWithoutTbAccontsInput>, tbUserUncheckedUpdateWithoutTbAccontsInput>
  }

  export type tbUserCreateNestedOneWithoutSessionInput = {
    create?: XOR<tbUserCreateWithoutSessionInput, tbUserUncheckedCreateWithoutSessionInput>
    connectOrCreate?: tbUserCreateOrConnectWithoutSessionInput
    connect?: tbUserWhereUniqueInput
  }

  export type tbUserUpdateOneRequiredWithoutSessionNestedInput = {
    create?: XOR<tbUserCreateWithoutSessionInput, tbUserUncheckedCreateWithoutSessionInput>
    connectOrCreate?: tbUserCreateOrConnectWithoutSessionInput
    upsert?: tbUserUpsertWithoutSessionInput
    connect?: tbUserWhereUniqueInput
    update?: XOR<XOR<tbUserUpdateToOneWithWhereWithoutSessionInput, tbUserUpdateWithoutSessionInput>, tbUserUncheckedUpdateWithoutSessionInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type tbFuncionarioCreateWithoutTbUserInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    tbStatusFun?: tbStatusFunCreateNestedOneWithoutTbFuncionarioInput
    tbFuncao?: tbFuncaoCreateNestedOneWithoutTbFuncionarioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbFuncionarioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUncheckedCreateWithoutTbUserInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioCreateOrConnectWithoutTbUserInput = {
    where: tbFuncionarioWhereUniqueInput
    create: XOR<tbFuncionarioCreateWithoutTbUserInput, tbFuncionarioUncheckedCreateWithoutTbUserInput>
  }

  export type tbFuncionarioCreateManyTbUserInputEnvelope = {
    data: tbFuncionarioCreateManyTbUserInput | tbFuncionarioCreateManyTbUserInput[]
  }

  export type tbAccontCreateWithoutTbUserInput = {
    idAccont?: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    sesseion_state?: string | null
  }

  export type tbAccontUncheckedCreateWithoutTbUserInput = {
    idAccont?: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    sesseion_state?: string | null
  }

  export type tbAccontCreateOrConnectWithoutTbUserInput = {
    where: tbAccontWhereUniqueInput
    create: XOR<tbAccontCreateWithoutTbUserInput, tbAccontUncheckedCreateWithoutTbUserInput>
  }

  export type tbAccontCreateManyTbUserInputEnvelope = {
    data: tbAccontCreateManyTbUserInput | tbAccontCreateManyTbUserInput[]
  }

  export type SessionCreateWithoutTbUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutTbUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutTbUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutTbUserInput, SessionUncheckedCreateWithoutTbUserInput>
  }

  export type SessionCreateManyTbUserInputEnvelope = {
    data: SessionCreateManyTbUserInput | SessionCreateManyTbUserInput[]
  }

  export type tbFuncionarioUpsertWithWhereUniqueWithoutTbUserInput = {
    where: tbFuncionarioWhereUniqueInput
    update: XOR<tbFuncionarioUpdateWithoutTbUserInput, tbFuncionarioUncheckedUpdateWithoutTbUserInput>
    create: XOR<tbFuncionarioCreateWithoutTbUserInput, tbFuncionarioUncheckedCreateWithoutTbUserInput>
  }

  export type tbFuncionarioUpdateWithWhereUniqueWithoutTbUserInput = {
    where: tbFuncionarioWhereUniqueInput
    data: XOR<tbFuncionarioUpdateWithoutTbUserInput, tbFuncionarioUncheckedUpdateWithoutTbUserInput>
  }

  export type tbFuncionarioUpdateManyWithWhereWithoutTbUserInput = {
    where: tbFuncionarioScalarWhereInput
    data: XOR<tbFuncionarioUpdateManyMutationInput, tbFuncionarioUncheckedUpdateManyWithoutTbUserInput>
  }

  export type tbFuncionarioScalarWhereInput = {
    AND?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
    OR?: tbFuncionarioScalarWhereInput[]
    NOT?: tbFuncionarioScalarWhereInput | tbFuncionarioScalarWhereInput[]
    idF?: StringFilter<"tbFuncionario"> | string
    idMatFun?: StringFilter<"tbFuncionario"> | string
    nomeFun?: StringFilter<"tbFuncionario"> | string
    cpfFun?: StringNullableFilter<"tbFuncionario"> | string | null
    dataAdmFun?: DateTimeNullableFilter<"tbFuncionario"> | Date | string | null
    dataDesFun?: DateTimeNullableFilter<"tbFuncionario"> | Date | string | null
    avatarFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idFuncaoFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idUserFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idStatusFun?: StringNullableFilter<"tbFuncionario"> | string | null
    idCustoFun?: StringNullableFilter<"tbFuncionario"> | string | null
  }

  export type tbAccontUpsertWithWhereUniqueWithoutTbUserInput = {
    where: tbAccontWhereUniqueInput
    update: XOR<tbAccontUpdateWithoutTbUserInput, tbAccontUncheckedUpdateWithoutTbUserInput>
    create: XOR<tbAccontCreateWithoutTbUserInput, tbAccontUncheckedCreateWithoutTbUserInput>
  }

  export type tbAccontUpdateWithWhereUniqueWithoutTbUserInput = {
    where: tbAccontWhereUniqueInput
    data: XOR<tbAccontUpdateWithoutTbUserInput, tbAccontUncheckedUpdateWithoutTbUserInput>
  }

  export type tbAccontUpdateManyWithWhereWithoutTbUserInput = {
    where: tbAccontScalarWhereInput
    data: XOR<tbAccontUpdateManyMutationInput, tbAccontUncheckedUpdateManyWithoutTbUserInput>
  }

  export type tbAccontScalarWhereInput = {
    AND?: tbAccontScalarWhereInput | tbAccontScalarWhereInput[]
    OR?: tbAccontScalarWhereInput[]
    NOT?: tbAccontScalarWhereInput | tbAccontScalarWhereInput[]
    idAccont?: StringFilter<"tbAccont"> | string
    userID?: StringFilter<"tbAccont"> | string
    type?: StringFilter<"tbAccont"> | string
    provider?: StringFilter<"tbAccont"> | string
    providerAccontId?: StringFilter<"tbAccont"> | string
    refresh_token?: StringNullableFilter<"tbAccont"> | string | null
    access_token?: StringNullableFilter<"tbAccont"> | string | null
    expires_at?: IntNullableFilter<"tbAccont"> | number | null
    token_type?: StringNullableFilter<"tbAccont"> | string | null
    scope?: StringNullableFilter<"tbAccont"> | string | null
    id_token?: StringNullableFilter<"tbAccont"> | string | null
    sesseion_state?: StringNullableFilter<"tbAccont"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutTbUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutTbUserInput, SessionUncheckedUpdateWithoutTbUserInput>
    create: XOR<SessionCreateWithoutTbUserInput, SessionUncheckedCreateWithoutTbUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutTbUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutTbUserInput, SessionUncheckedUpdateWithoutTbUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutTbUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutTbUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type tbStatusFunCreateWithoutTbFuncionarioInput = {
    idStatusFun?: string
    descricaoStatusFun: string
  }

  export type tbStatusFunUncheckedCreateWithoutTbFuncionarioInput = {
    idStatusFun?: string
    descricaoStatusFun: string
  }

  export type tbStatusFunCreateOrConnectWithoutTbFuncionarioInput = {
    where: tbStatusFunWhereUniqueInput
    create: XOR<tbStatusFunCreateWithoutTbFuncionarioInput, tbStatusFunUncheckedCreateWithoutTbFuncionarioInput>
  }

  export type tbUserCreateWithoutTbFuncioanrioInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbAcconts?: tbAccontCreateNestedManyWithoutTbUserInput
    Session?: SessionCreateNestedManyWithoutTbUserInput
  }

  export type tbUserUncheckedCreateWithoutTbFuncioanrioInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbAcconts?: tbAccontUncheckedCreateNestedManyWithoutTbUserInput
    Session?: SessionUncheckedCreateNestedManyWithoutTbUserInput
  }

  export type tbUserCreateOrConnectWithoutTbFuncioanrioInput = {
    where: tbUserWhereUniqueInput
    create: XOR<tbUserCreateWithoutTbFuncioanrioInput, tbUserUncheckedCreateWithoutTbFuncioanrioInput>
  }

  export type tbFuncaoCreateWithoutTbFuncionarioInput = {
    idFuncao?: string
    nomeFuncao: string
  }

  export type tbFuncaoUncheckedCreateWithoutTbFuncionarioInput = {
    idFuncao?: string
    nomeFuncao: string
  }

  export type tbFuncaoCreateOrConnectWithoutTbFuncionarioInput = {
    where: tbFuncaoWhereUniqueInput
    create: XOR<tbFuncaoCreateWithoutTbFuncionarioInput, tbFuncaoUncheckedCreateWithoutTbFuncionarioInput>
  }

  export type tbCCustoCreateWithoutTbFuncionarioInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    tbEmpresa?: tbEmpresaCreateNestedOneWithoutTbCCustoInput
    tbPatrimonio?: tbPatrimonioCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoUncheckedCreateWithoutTbFuncionarioInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    idEmp_Custo?: string | null
    tbPatrimonio?: tbPatrimonioUncheckedCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoCreateOrConnectWithoutTbFuncionarioInput = {
    where: tbCCustoWhereUniqueInput
    create: XOR<tbCCustoCreateWithoutTbFuncionarioInput, tbCCustoUncheckedCreateWithoutTbFuncionarioInput>
  }

  export type tbCadastroCreateWithoutTbFuncionarioInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbPatrimonio?: tbPatrimonioCreateNestedOneWithoutTbCadastroInput
  }

  export type tbCadastroUncheckedCreateWithoutTbFuncionarioInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPatCad?: string | null
  }

  export type tbCadastroCreateOrConnectWithoutTbFuncionarioInput = {
    where: tbCadastroWhereUniqueInput
    create: XOR<tbCadastroCreateWithoutTbFuncionarioInput, tbCadastroUncheckedCreateWithoutTbFuncionarioInput>
  }

  export type tbCadastroCreateManyTbFuncionarioInputEnvelope = {
    data: tbCadastroCreateManyTbFuncionarioInput | tbCadastroCreateManyTbFuncionarioInput[]
  }

  export type tbStatusFunUpsertWithoutTbFuncionarioInput = {
    update: XOR<tbStatusFunUpdateWithoutTbFuncionarioInput, tbStatusFunUncheckedUpdateWithoutTbFuncionarioInput>
    create: XOR<tbStatusFunCreateWithoutTbFuncionarioInput, tbStatusFunUncheckedCreateWithoutTbFuncionarioInput>
    where?: tbStatusFunWhereInput
  }

  export type tbStatusFunUpdateToOneWithWhereWithoutTbFuncionarioInput = {
    where?: tbStatusFunWhereInput
    data: XOR<tbStatusFunUpdateWithoutTbFuncionarioInput, tbStatusFunUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbStatusFunUpdateWithoutTbFuncionarioInput = {
    idStatusFun?: StringFieldUpdateOperationsInput | string
    descricaoStatusFun?: StringFieldUpdateOperationsInput | string
  }

  export type tbStatusFunUncheckedUpdateWithoutTbFuncionarioInput = {
    idStatusFun?: StringFieldUpdateOperationsInput | string
    descricaoStatusFun?: StringFieldUpdateOperationsInput | string
  }

  export type tbUserUpsertWithoutTbFuncioanrioInput = {
    update: XOR<tbUserUpdateWithoutTbFuncioanrioInput, tbUserUncheckedUpdateWithoutTbFuncioanrioInput>
    create: XOR<tbUserCreateWithoutTbFuncioanrioInput, tbUserUncheckedCreateWithoutTbFuncioanrioInput>
    where?: tbUserWhereInput
  }

  export type tbUserUpdateToOneWithWhereWithoutTbFuncioanrioInput = {
    where?: tbUserWhereInput
    data: XOR<tbUserUpdateWithoutTbFuncioanrioInput, tbUserUncheckedUpdateWithoutTbFuncioanrioInput>
  }

  export type tbUserUpdateWithoutTbFuncioanrioInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbAcconts?: tbAccontUpdateManyWithoutTbUserNestedInput
    Session?: SessionUpdateManyWithoutTbUserNestedInput
  }

  export type tbUserUncheckedUpdateWithoutTbFuncioanrioInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbAcconts?: tbAccontUncheckedUpdateManyWithoutTbUserNestedInput
    Session?: SessionUncheckedUpdateManyWithoutTbUserNestedInput
  }

  export type tbFuncaoUpsertWithoutTbFuncionarioInput = {
    update: XOR<tbFuncaoUpdateWithoutTbFuncionarioInput, tbFuncaoUncheckedUpdateWithoutTbFuncionarioInput>
    create: XOR<tbFuncaoCreateWithoutTbFuncionarioInput, tbFuncaoUncheckedCreateWithoutTbFuncionarioInput>
    where?: tbFuncaoWhereInput
  }

  export type tbFuncaoUpdateToOneWithWhereWithoutTbFuncionarioInput = {
    where?: tbFuncaoWhereInput
    data: XOR<tbFuncaoUpdateWithoutTbFuncionarioInput, tbFuncaoUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbFuncaoUpdateWithoutTbFuncionarioInput = {
    idFuncao?: StringFieldUpdateOperationsInput | string
    nomeFuncao?: StringFieldUpdateOperationsInput | string
  }

  export type tbFuncaoUncheckedUpdateWithoutTbFuncionarioInput = {
    idFuncao?: StringFieldUpdateOperationsInput | string
    nomeFuncao?: StringFieldUpdateOperationsInput | string
  }

  export type tbCCustoUpsertWithoutTbFuncionarioInput = {
    update: XOR<tbCCustoUpdateWithoutTbFuncionarioInput, tbCCustoUncheckedUpdateWithoutTbFuncionarioInput>
    create: XOR<tbCCustoCreateWithoutTbFuncionarioInput, tbCCustoUncheckedCreateWithoutTbFuncionarioInput>
    where?: tbCCustoWhereInput
  }

  export type tbCCustoUpdateToOneWithWhereWithoutTbFuncionarioInput = {
    where?: tbCCustoWhereInput
    data: XOR<tbCCustoUpdateWithoutTbFuncionarioInput, tbCCustoUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbCCustoUpdateWithoutTbFuncionarioInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    tbEmpresa?: tbEmpresaUpdateOneWithoutTbCCustoNestedInput
    tbPatrimonio?: tbPatrimonioUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCCustoUncheckedUpdateWithoutTbFuncionarioInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    idEmp_Custo?: NullableStringFieldUpdateOperationsInput | string | null
    tbPatrimonio?: tbPatrimonioUncheckedUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCadastroUpsertWithWhereUniqueWithoutTbFuncionarioInput = {
    where: tbCadastroWhereUniqueInput
    update: XOR<tbCadastroUpdateWithoutTbFuncionarioInput, tbCadastroUncheckedUpdateWithoutTbFuncionarioInput>
    create: XOR<tbCadastroCreateWithoutTbFuncionarioInput, tbCadastroUncheckedCreateWithoutTbFuncionarioInput>
  }

  export type tbCadastroUpdateWithWhereUniqueWithoutTbFuncionarioInput = {
    where: tbCadastroWhereUniqueInput
    data: XOR<tbCadastroUpdateWithoutTbFuncionarioInput, tbCadastroUncheckedUpdateWithoutTbFuncionarioInput>
  }

  export type tbCadastroUpdateManyWithWhereWithoutTbFuncionarioInput = {
    where: tbCadastroScalarWhereInput
    data: XOR<tbCadastroUpdateManyMutationInput, tbCadastroUncheckedUpdateManyWithoutTbFuncionarioInput>
  }

  export type tbCadastroScalarWhereInput = {
    AND?: tbCadastroScalarWhereInput | tbCadastroScalarWhereInput[]
    OR?: tbCadastroScalarWhereInput[]
    NOT?: tbCadastroScalarWhereInput | tbCadastroScalarWhereInput[]
    idCad?: StringFilter<"tbCadastro"> | string
    dataCadPat?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    dataDevPat?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"tbCadastro"> | Date | string | null
    idPatCad?: StringNullableFilter<"tbCadastro"> | string | null
    idMatFunCad?: StringNullableFilter<"tbCadastro"> | string | null
  }

  export type tbFuncionarioCreateWithoutTbStatusFunInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    tbUser?: tbUserCreateNestedOneWithoutTbFuncioanrioInput
    tbFuncao?: tbFuncaoCreateNestedOneWithoutTbFuncionarioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbFuncionarioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUncheckedCreateWithoutTbStatusFunInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idCustoFun?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioCreateOrConnectWithoutTbStatusFunInput = {
    where: tbFuncionarioWhereUniqueInput
    create: XOR<tbFuncionarioCreateWithoutTbStatusFunInput, tbFuncionarioUncheckedCreateWithoutTbStatusFunInput>
  }

  export type tbFuncionarioCreateManyTbStatusFunInputEnvelope = {
    data: tbFuncionarioCreateManyTbStatusFunInput | tbFuncionarioCreateManyTbStatusFunInput[]
  }

  export type tbFuncionarioUpsertWithWhereUniqueWithoutTbStatusFunInput = {
    where: tbFuncionarioWhereUniqueInput
    update: XOR<tbFuncionarioUpdateWithoutTbStatusFunInput, tbFuncionarioUncheckedUpdateWithoutTbStatusFunInput>
    create: XOR<tbFuncionarioCreateWithoutTbStatusFunInput, tbFuncionarioUncheckedCreateWithoutTbStatusFunInput>
  }

  export type tbFuncionarioUpdateWithWhereUniqueWithoutTbStatusFunInput = {
    where: tbFuncionarioWhereUniqueInput
    data: XOR<tbFuncionarioUpdateWithoutTbStatusFunInput, tbFuncionarioUncheckedUpdateWithoutTbStatusFunInput>
  }

  export type tbFuncionarioUpdateManyWithWhereWithoutTbStatusFunInput = {
    where: tbFuncionarioScalarWhereInput
    data: XOR<tbFuncionarioUpdateManyMutationInput, tbFuncionarioUncheckedUpdateManyWithoutTbStatusFunInput>
  }

  export type tbFuncionarioCreateWithoutTbFuncaoInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    tbStatusFun?: tbStatusFunCreateNestedOneWithoutTbFuncionarioInput
    tbUser?: tbUserCreateNestedOneWithoutTbFuncioanrioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbFuncionarioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUncheckedCreateWithoutTbFuncaoInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioCreateOrConnectWithoutTbFuncaoInput = {
    where: tbFuncionarioWhereUniqueInput
    create: XOR<tbFuncionarioCreateWithoutTbFuncaoInput, tbFuncionarioUncheckedCreateWithoutTbFuncaoInput>
  }

  export type tbFuncionarioCreateManyTbFuncaoInputEnvelope = {
    data: tbFuncionarioCreateManyTbFuncaoInput | tbFuncionarioCreateManyTbFuncaoInput[]
  }

  export type tbFuncionarioUpsertWithWhereUniqueWithoutTbFuncaoInput = {
    where: tbFuncionarioWhereUniqueInput
    update: XOR<tbFuncionarioUpdateWithoutTbFuncaoInput, tbFuncionarioUncheckedUpdateWithoutTbFuncaoInput>
    create: XOR<tbFuncionarioCreateWithoutTbFuncaoInput, tbFuncionarioUncheckedCreateWithoutTbFuncaoInput>
  }

  export type tbFuncionarioUpdateWithWhereUniqueWithoutTbFuncaoInput = {
    where: tbFuncionarioWhereUniqueInput
    data: XOR<tbFuncionarioUpdateWithoutTbFuncaoInput, tbFuncionarioUncheckedUpdateWithoutTbFuncaoInput>
  }

  export type tbFuncionarioUpdateManyWithWhereWithoutTbFuncaoInput = {
    where: tbFuncionarioScalarWhereInput
    data: XOR<tbFuncionarioUpdateManyMutationInput, tbFuncionarioUncheckedUpdateManyWithoutTbFuncaoInput>
  }

  export type tbTipoPatCreateWithoutTbPatrimonioInput = {
    idTipPat?: string
    descricaoTipPat?: string | null
  }

  export type tbTipoPatUncheckedCreateWithoutTbPatrimonioInput = {
    idTipPat?: string
    descricaoTipPat?: string | null
  }

  export type tbTipoPatCreateOrConnectWithoutTbPatrimonioInput = {
    where: tbTipoPatWhereUniqueInput
    create: XOR<tbTipoPatCreateWithoutTbPatrimonioInput, tbTipoPatUncheckedCreateWithoutTbPatrimonioInput>
  }

  export type tbStatusPatCreateWithoutTbPatrimonioInput = {
    idStatusPat?: string
    descricaoStatPat: string
  }

  export type tbStatusPatUncheckedCreateWithoutTbPatrimonioInput = {
    idStatusPat?: string
    descricaoStatPat: string
  }

  export type tbStatusPatCreateOrConnectWithoutTbPatrimonioInput = {
    where: tbStatusPatWhereUniqueInput
    create: XOR<tbStatusPatCreateWithoutTbPatrimonioInput, tbStatusPatUncheckedCreateWithoutTbPatrimonioInput>
  }

  export type tbCCustoCreateWithoutTbPatrimonioInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    tbEmpresa?: tbEmpresaCreateNestedOneWithoutTbCCustoInput
    tbFuncionario?: tbFuncionarioCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoUncheckedCreateWithoutTbPatrimonioInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    idEmp_Custo?: string | null
    tbFuncionario?: tbFuncionarioUncheckedCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoCreateOrConnectWithoutTbPatrimonioInput = {
    where: tbCCustoWhereUniqueInput
    create: XOR<tbCCustoCreateWithoutTbPatrimonioInput, tbCCustoUncheckedCreateWithoutTbPatrimonioInput>
  }

  export type tbCadastroCreateWithoutTbPatrimonioInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbFuncionario?: tbFuncionarioCreateNestedOneWithoutTbCadastroInput
  }

  export type tbCadastroUncheckedCreateWithoutTbPatrimonioInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idMatFunCad?: string | null
  }

  export type tbCadastroCreateOrConnectWithoutTbPatrimonioInput = {
    where: tbCadastroWhereUniqueInput
    create: XOR<tbCadastroCreateWithoutTbPatrimonioInput, tbCadastroUncheckedCreateWithoutTbPatrimonioInput>
  }

  export type tbCadastroCreateManyTbPatrimonioInputEnvelope = {
    data: tbCadastroCreateManyTbPatrimonioInput | tbCadastroCreateManyTbPatrimonioInput[]
  }

  export type tbTipoPatUpsertWithoutTbPatrimonioInput = {
    update: XOR<tbTipoPatUpdateWithoutTbPatrimonioInput, tbTipoPatUncheckedUpdateWithoutTbPatrimonioInput>
    create: XOR<tbTipoPatCreateWithoutTbPatrimonioInput, tbTipoPatUncheckedCreateWithoutTbPatrimonioInput>
    where?: tbTipoPatWhereInput
  }

  export type tbTipoPatUpdateToOneWithWhereWithoutTbPatrimonioInput = {
    where?: tbTipoPatWhereInput
    data: XOR<tbTipoPatUpdateWithoutTbPatrimonioInput, tbTipoPatUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbTipoPatUpdateWithoutTbPatrimonioInput = {
    idTipPat?: StringFieldUpdateOperationsInput | string
    descricaoTipPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbTipoPatUncheckedUpdateWithoutTbPatrimonioInput = {
    idTipPat?: StringFieldUpdateOperationsInput | string
    descricaoTipPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbStatusPatUpsertWithoutTbPatrimonioInput = {
    update: XOR<tbStatusPatUpdateWithoutTbPatrimonioInput, tbStatusPatUncheckedUpdateWithoutTbPatrimonioInput>
    create: XOR<tbStatusPatCreateWithoutTbPatrimonioInput, tbStatusPatUncheckedCreateWithoutTbPatrimonioInput>
    where?: tbStatusPatWhereInput
  }

  export type tbStatusPatUpdateToOneWithWhereWithoutTbPatrimonioInput = {
    where?: tbStatusPatWhereInput
    data: XOR<tbStatusPatUpdateWithoutTbPatrimonioInput, tbStatusPatUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbStatusPatUpdateWithoutTbPatrimonioInput = {
    idStatusPat?: StringFieldUpdateOperationsInput | string
    descricaoStatPat?: StringFieldUpdateOperationsInput | string
  }

  export type tbStatusPatUncheckedUpdateWithoutTbPatrimonioInput = {
    idStatusPat?: StringFieldUpdateOperationsInput | string
    descricaoStatPat?: StringFieldUpdateOperationsInput | string
  }

  export type tbCCustoUpsertWithoutTbPatrimonioInput = {
    update: XOR<tbCCustoUpdateWithoutTbPatrimonioInput, tbCCustoUncheckedUpdateWithoutTbPatrimonioInput>
    create: XOR<tbCCustoCreateWithoutTbPatrimonioInput, tbCCustoUncheckedCreateWithoutTbPatrimonioInput>
    where?: tbCCustoWhereInput
  }

  export type tbCCustoUpdateToOneWithWhereWithoutTbPatrimonioInput = {
    where?: tbCCustoWhereInput
    data: XOR<tbCCustoUpdateWithoutTbPatrimonioInput, tbCCustoUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbCCustoUpdateWithoutTbPatrimonioInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    tbEmpresa?: tbEmpresaUpdateOneWithoutTbCCustoNestedInput
    tbFuncionario?: tbFuncionarioUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCCustoUncheckedUpdateWithoutTbPatrimonioInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    idEmp_Custo?: NullableStringFieldUpdateOperationsInput | string | null
    tbFuncionario?: tbFuncionarioUncheckedUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCadastroUpsertWithWhereUniqueWithoutTbPatrimonioInput = {
    where: tbCadastroWhereUniqueInput
    update: XOR<tbCadastroUpdateWithoutTbPatrimonioInput, tbCadastroUncheckedUpdateWithoutTbPatrimonioInput>
    create: XOR<tbCadastroCreateWithoutTbPatrimonioInput, tbCadastroUncheckedCreateWithoutTbPatrimonioInput>
  }

  export type tbCadastroUpdateWithWhereUniqueWithoutTbPatrimonioInput = {
    where: tbCadastroWhereUniqueInput
    data: XOR<tbCadastroUpdateWithoutTbPatrimonioInput, tbCadastroUncheckedUpdateWithoutTbPatrimonioInput>
  }

  export type tbCadastroUpdateManyWithWhereWithoutTbPatrimonioInput = {
    where: tbCadastroScalarWhereInput
    data: XOR<tbCadastroUpdateManyMutationInput, tbCadastroUncheckedUpdateManyWithoutTbPatrimonioInput>
  }

  export type tbPatrimonioCreateWithoutTbTipoPatInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbStatusPat?: tbStatusPatCreateNestedOneWithoutTbPatrimonioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbPatrimonioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioUncheckedCreateWithoutTbTipoPatInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_StatusPat?: string | null
    idPat_CustoPat?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioCreateOrConnectWithoutTbTipoPatInput = {
    where: tbPatrimonioWhereUniqueInput
    create: XOR<tbPatrimonioCreateWithoutTbTipoPatInput, tbPatrimonioUncheckedCreateWithoutTbTipoPatInput>
  }

  export type tbPatrimonioCreateManyTbTipoPatInputEnvelope = {
    data: tbPatrimonioCreateManyTbTipoPatInput | tbPatrimonioCreateManyTbTipoPatInput[]
  }

  export type tbPatrimonioUpsertWithWhereUniqueWithoutTbTipoPatInput = {
    where: tbPatrimonioWhereUniqueInput
    update: XOR<tbPatrimonioUpdateWithoutTbTipoPatInput, tbPatrimonioUncheckedUpdateWithoutTbTipoPatInput>
    create: XOR<tbPatrimonioCreateWithoutTbTipoPatInput, tbPatrimonioUncheckedCreateWithoutTbTipoPatInput>
  }

  export type tbPatrimonioUpdateWithWhereUniqueWithoutTbTipoPatInput = {
    where: tbPatrimonioWhereUniqueInput
    data: XOR<tbPatrimonioUpdateWithoutTbTipoPatInput, tbPatrimonioUncheckedUpdateWithoutTbTipoPatInput>
  }

  export type tbPatrimonioUpdateManyWithWhereWithoutTbTipoPatInput = {
    where: tbPatrimonioScalarWhereInput
    data: XOR<tbPatrimonioUpdateManyMutationInput, tbPatrimonioUncheckedUpdateManyWithoutTbTipoPatInput>
  }

  export type tbPatrimonioScalarWhereInput = {
    AND?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
    OR?: tbPatrimonioScalarWhereInput[]
    NOT?: tbPatrimonioScalarWhereInput | tbPatrimonioScalarWhereInput[]
    idP?: StringFilter<"tbPatrimonio"> | string
    idPat?: StringFilter<"tbPatrimonio"> | string
    descricaoPat?: StringFilter<"tbPatrimonio"> | string
    descricaoDetalhadaPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    licencaPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    dataEntPat?: DateTimeFilter<"tbPatrimonio"> | Date | string
    dataSaiPat?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    notaFiscalPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    valorPat?: FloatFilter<"tbPatrimonio"> | number
    createdAt?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"tbPatrimonio"> | Date | string | null
    idPat_TipoPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    idPat_StatusPat?: StringNullableFilter<"tbPatrimonio"> | string | null
    idPat_CustoPat?: StringNullableFilter<"tbPatrimonio"> | string | null
  }

  export type tbPatrimonioCreateWithoutTbStatusPatInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbTipoPat?: tbTipoPatCreateNestedOneWithoutTbPatrimonioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbPatrimonioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioUncheckedCreateWithoutTbStatusPatInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_CustoPat?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioCreateOrConnectWithoutTbStatusPatInput = {
    where: tbPatrimonioWhereUniqueInput
    create: XOR<tbPatrimonioCreateWithoutTbStatusPatInput, tbPatrimonioUncheckedCreateWithoutTbStatusPatInput>
  }

  export type tbPatrimonioCreateManyTbStatusPatInputEnvelope = {
    data: tbPatrimonioCreateManyTbStatusPatInput | tbPatrimonioCreateManyTbStatusPatInput[]
  }

  export type tbPatrimonioUpsertWithWhereUniqueWithoutTbStatusPatInput = {
    where: tbPatrimonioWhereUniqueInput
    update: XOR<tbPatrimonioUpdateWithoutTbStatusPatInput, tbPatrimonioUncheckedUpdateWithoutTbStatusPatInput>
    create: XOR<tbPatrimonioCreateWithoutTbStatusPatInput, tbPatrimonioUncheckedCreateWithoutTbStatusPatInput>
  }

  export type tbPatrimonioUpdateWithWhereUniqueWithoutTbStatusPatInput = {
    where: tbPatrimonioWhereUniqueInput
    data: XOR<tbPatrimonioUpdateWithoutTbStatusPatInput, tbPatrimonioUncheckedUpdateWithoutTbStatusPatInput>
  }

  export type tbPatrimonioUpdateManyWithWhereWithoutTbStatusPatInput = {
    where: tbPatrimonioScalarWhereInput
    data: XOR<tbPatrimonioUpdateManyMutationInput, tbPatrimonioUncheckedUpdateManyWithoutTbStatusPatInput>
  }

  export type tbCCustoCreateWithoutTbEmpresaInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    tbPatrimonio?: tbPatrimonioCreateNestedManyWithoutTbCCustoInput
    tbFuncionario?: tbFuncionarioCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoUncheckedCreateWithoutTbEmpresaInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
    tbPatrimonio?: tbPatrimonioUncheckedCreateNestedManyWithoutTbCCustoInput
    tbFuncionario?: tbFuncionarioUncheckedCreateNestedManyWithoutTbCCustoInput
  }

  export type tbCCustoCreateOrConnectWithoutTbEmpresaInput = {
    where: tbCCustoWhereUniqueInput
    create: XOR<tbCCustoCreateWithoutTbEmpresaInput, tbCCustoUncheckedCreateWithoutTbEmpresaInput>
  }

  export type tbCCustoCreateManyTbEmpresaInputEnvelope = {
    data: tbCCustoCreateManyTbEmpresaInput | tbCCustoCreateManyTbEmpresaInput[]
  }

  export type tbCCustoUpsertWithWhereUniqueWithoutTbEmpresaInput = {
    where: tbCCustoWhereUniqueInput
    update: XOR<tbCCustoUpdateWithoutTbEmpresaInput, tbCCustoUncheckedUpdateWithoutTbEmpresaInput>
    create: XOR<tbCCustoCreateWithoutTbEmpresaInput, tbCCustoUncheckedCreateWithoutTbEmpresaInput>
  }

  export type tbCCustoUpdateWithWhereUniqueWithoutTbEmpresaInput = {
    where: tbCCustoWhereUniqueInput
    data: XOR<tbCCustoUpdateWithoutTbEmpresaInput, tbCCustoUncheckedUpdateWithoutTbEmpresaInput>
  }

  export type tbCCustoUpdateManyWithWhereWithoutTbEmpresaInput = {
    where: tbCCustoScalarWhereInput
    data: XOR<tbCCustoUpdateManyMutationInput, tbCCustoUncheckedUpdateManyWithoutTbEmpresaInput>
  }

  export type tbCCustoScalarWhereInput = {
    AND?: tbCCustoScalarWhereInput | tbCCustoScalarWhereInput[]
    OR?: tbCCustoScalarWhereInput[]
    NOT?: tbCCustoScalarWhereInput | tbCCustoScalarWhereInput[]
    idCCusto?: StringFilter<"tbCCusto"> | string
    codigoCCusto?: StringNullableFilter<"tbCCusto"> | string | null
    descricaoCCusto?: StringNullableFilter<"tbCCusto"> | string | null
    idEmp_Custo?: StringNullableFilter<"tbCCusto"> | string | null
  }

  export type tbEmpresaCreateWithoutTbCCustoInput = {
    idEmp?: string
    razaoEmpresa?: string | null
    fantasiaEmpresa?: string | null
    cnpjEmpresa?: string | null
    idCustEmp?: string | null
  }

  export type tbEmpresaUncheckedCreateWithoutTbCCustoInput = {
    idEmp?: string
    razaoEmpresa?: string | null
    fantasiaEmpresa?: string | null
    cnpjEmpresa?: string | null
    idCustEmp?: string | null
  }

  export type tbEmpresaCreateOrConnectWithoutTbCCustoInput = {
    where: tbEmpresaWhereUniqueInput
    create: XOR<tbEmpresaCreateWithoutTbCCustoInput, tbEmpresaUncheckedCreateWithoutTbCCustoInput>
  }

  export type tbPatrimonioCreateWithoutTbCCustoInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbTipoPat?: tbTipoPatCreateNestedOneWithoutTbPatrimonioInput
    tbStatusPat?: tbStatusPatCreateNestedOneWithoutTbPatrimonioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioUncheckedCreateWithoutTbCCustoInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_StatusPat?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbPatrimonioInput
  }

  export type tbPatrimonioCreateOrConnectWithoutTbCCustoInput = {
    where: tbPatrimonioWhereUniqueInput
    create: XOR<tbPatrimonioCreateWithoutTbCCustoInput, tbPatrimonioUncheckedCreateWithoutTbCCustoInput>
  }

  export type tbPatrimonioCreateManyTbCCustoInputEnvelope = {
    data: tbPatrimonioCreateManyTbCCustoInput | tbPatrimonioCreateManyTbCCustoInput[]
  }

  export type tbFuncionarioCreateWithoutTbCCustoInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    tbStatusFun?: tbStatusFunCreateNestedOneWithoutTbFuncionarioInput
    tbUser?: tbUserCreateNestedOneWithoutTbFuncioanrioInput
    tbFuncao?: tbFuncaoCreateNestedOneWithoutTbFuncionarioInput
    tbCadastro?: tbCadastroCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUncheckedCreateWithoutTbCCustoInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
    tbCadastro?: tbCadastroUncheckedCreateNestedManyWithoutTbFuncionarioInput
  }

  export type tbFuncionarioCreateOrConnectWithoutTbCCustoInput = {
    where: tbFuncionarioWhereUniqueInput
    create: XOR<tbFuncionarioCreateWithoutTbCCustoInput, tbFuncionarioUncheckedCreateWithoutTbCCustoInput>
  }

  export type tbFuncionarioCreateManyTbCCustoInputEnvelope = {
    data: tbFuncionarioCreateManyTbCCustoInput | tbFuncionarioCreateManyTbCCustoInput[]
  }

  export type tbEmpresaUpsertWithoutTbCCustoInput = {
    update: XOR<tbEmpresaUpdateWithoutTbCCustoInput, tbEmpresaUncheckedUpdateWithoutTbCCustoInput>
    create: XOR<tbEmpresaCreateWithoutTbCCustoInput, tbEmpresaUncheckedCreateWithoutTbCCustoInput>
    where?: tbEmpresaWhereInput
  }

  export type tbEmpresaUpdateToOneWithWhereWithoutTbCCustoInput = {
    where?: tbEmpresaWhereInput
    data: XOR<tbEmpresaUpdateWithoutTbCCustoInput, tbEmpresaUncheckedUpdateWithoutTbCCustoInput>
  }

  export type tbEmpresaUpdateWithoutTbCCustoInput = {
    idEmp?: StringFieldUpdateOperationsInput | string
    razaoEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    fantasiaEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    cnpjEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    idCustEmp?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbEmpresaUncheckedUpdateWithoutTbCCustoInput = {
    idEmp?: StringFieldUpdateOperationsInput | string
    razaoEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    fantasiaEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    cnpjEmpresa?: NullableStringFieldUpdateOperationsInput | string | null
    idCustEmp?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbPatrimonioUpsertWithWhereUniqueWithoutTbCCustoInput = {
    where: tbPatrimonioWhereUniqueInput
    update: XOR<tbPatrimonioUpdateWithoutTbCCustoInput, tbPatrimonioUncheckedUpdateWithoutTbCCustoInput>
    create: XOR<tbPatrimonioCreateWithoutTbCCustoInput, tbPatrimonioUncheckedCreateWithoutTbCCustoInput>
  }

  export type tbPatrimonioUpdateWithWhereUniqueWithoutTbCCustoInput = {
    where: tbPatrimonioWhereUniqueInput
    data: XOR<tbPatrimonioUpdateWithoutTbCCustoInput, tbPatrimonioUncheckedUpdateWithoutTbCCustoInput>
  }

  export type tbPatrimonioUpdateManyWithWhereWithoutTbCCustoInput = {
    where: tbPatrimonioScalarWhereInput
    data: XOR<tbPatrimonioUpdateManyMutationInput, tbPatrimonioUncheckedUpdateManyWithoutTbCCustoInput>
  }

  export type tbFuncionarioUpsertWithWhereUniqueWithoutTbCCustoInput = {
    where: tbFuncionarioWhereUniqueInput
    update: XOR<tbFuncionarioUpdateWithoutTbCCustoInput, tbFuncionarioUncheckedUpdateWithoutTbCCustoInput>
    create: XOR<tbFuncionarioCreateWithoutTbCCustoInput, tbFuncionarioUncheckedCreateWithoutTbCCustoInput>
  }

  export type tbFuncionarioUpdateWithWhereUniqueWithoutTbCCustoInput = {
    where: tbFuncionarioWhereUniqueInput
    data: XOR<tbFuncionarioUpdateWithoutTbCCustoInput, tbFuncionarioUncheckedUpdateWithoutTbCCustoInput>
  }

  export type tbFuncionarioUpdateManyWithWhereWithoutTbCCustoInput = {
    where: tbFuncionarioScalarWhereInput
    data: XOR<tbFuncionarioUpdateManyMutationInput, tbFuncionarioUncheckedUpdateManyWithoutTbCCustoInput>
  }

  export type tbPatrimonioCreateWithoutTbCadastroInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    tbTipoPat?: tbTipoPatCreateNestedOneWithoutTbPatrimonioInput
    tbStatusPat?: tbStatusPatCreateNestedOneWithoutTbPatrimonioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbPatrimonioInput
  }

  export type tbPatrimonioUncheckedCreateWithoutTbCadastroInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_StatusPat?: string | null
    idPat_CustoPat?: string | null
  }

  export type tbPatrimonioCreateOrConnectWithoutTbCadastroInput = {
    where: tbPatrimonioWhereUniqueInput
    create: XOR<tbPatrimonioCreateWithoutTbCadastroInput, tbPatrimonioUncheckedCreateWithoutTbCadastroInput>
  }

  export type tbFuncionarioCreateWithoutTbCadastroInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    tbStatusFun?: tbStatusFunCreateNestedOneWithoutTbFuncionarioInput
    tbUser?: tbUserCreateNestedOneWithoutTbFuncioanrioInput
    tbFuncao?: tbFuncaoCreateNestedOneWithoutTbFuncionarioInput
    tbCCusto?: tbCCustoCreateNestedOneWithoutTbFuncionarioInput
  }

  export type tbFuncionarioUncheckedCreateWithoutTbCadastroInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
  }

  export type tbFuncionarioCreateOrConnectWithoutTbCadastroInput = {
    where: tbFuncionarioWhereUniqueInput
    create: XOR<tbFuncionarioCreateWithoutTbCadastroInput, tbFuncionarioUncheckedCreateWithoutTbCadastroInput>
  }

  export type tbPatrimonioUpsertWithoutTbCadastroInput = {
    update: XOR<tbPatrimonioUpdateWithoutTbCadastroInput, tbPatrimonioUncheckedUpdateWithoutTbCadastroInput>
    create: XOR<tbPatrimonioCreateWithoutTbCadastroInput, tbPatrimonioUncheckedCreateWithoutTbCadastroInput>
    where?: tbPatrimonioWhereInput
  }

  export type tbPatrimonioUpdateToOneWithWhereWithoutTbCadastroInput = {
    where?: tbPatrimonioWhereInput
    data: XOR<tbPatrimonioUpdateWithoutTbCadastroInput, tbPatrimonioUncheckedUpdateWithoutTbCadastroInput>
  }

  export type tbPatrimonioUpdateWithoutTbCadastroInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbTipoPat?: tbTipoPatUpdateOneWithoutTbPatrimonioNestedInput
    tbStatusPat?: tbStatusPatUpdateOneWithoutTbPatrimonioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateWithoutTbCadastroInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbFuncionarioUpsertWithoutTbCadastroInput = {
    update: XOR<tbFuncionarioUpdateWithoutTbCadastroInput, tbFuncionarioUncheckedUpdateWithoutTbCadastroInput>
    create: XOR<tbFuncionarioCreateWithoutTbCadastroInput, tbFuncionarioUncheckedCreateWithoutTbCadastroInput>
    where?: tbFuncionarioWhereInput
  }

  export type tbFuncionarioUpdateToOneWithWhereWithoutTbCadastroInput = {
    where?: tbFuncionarioWhereInput
    data: XOR<tbFuncionarioUpdateWithoutTbCadastroInput, tbFuncionarioUncheckedUpdateWithoutTbCadastroInput>
  }

  export type tbFuncionarioUpdateWithoutTbCadastroInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbStatusFun?: tbStatusFunUpdateOneWithoutTbFuncionarioNestedInput
    tbUser?: tbUserUpdateOneWithoutTbFuncioanrioNestedInput
    tbFuncao?: tbFuncaoUpdateOneWithoutTbFuncionarioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateWithoutTbCadastroInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbUserCreateWithoutTbAccontsInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbFuncioanrio?: tbFuncionarioCreateNestedManyWithoutTbUserInput
    Session?: SessionCreateNestedManyWithoutTbUserInput
  }

  export type tbUserUncheckedCreateWithoutTbAccontsInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbFuncioanrio?: tbFuncionarioUncheckedCreateNestedManyWithoutTbUserInput
    Session?: SessionUncheckedCreateNestedManyWithoutTbUserInput
  }

  export type tbUserCreateOrConnectWithoutTbAccontsInput = {
    where: tbUserWhereUniqueInput
    create: XOR<tbUserCreateWithoutTbAccontsInput, tbUserUncheckedCreateWithoutTbAccontsInput>
  }

  export type tbUserUpsertWithoutTbAccontsInput = {
    update: XOR<tbUserUpdateWithoutTbAccontsInput, tbUserUncheckedUpdateWithoutTbAccontsInput>
    create: XOR<tbUserCreateWithoutTbAccontsInput, tbUserUncheckedCreateWithoutTbAccontsInput>
    where?: tbUserWhereInput
  }

  export type tbUserUpdateToOneWithWhereWithoutTbAccontsInput = {
    where?: tbUserWhereInput
    data: XOR<tbUserUpdateWithoutTbAccontsInput, tbUserUncheckedUpdateWithoutTbAccontsInput>
  }

  export type tbUserUpdateWithoutTbAccontsInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbFuncioanrio?: tbFuncionarioUpdateManyWithoutTbUserNestedInput
    Session?: SessionUpdateManyWithoutTbUserNestedInput
  }

  export type tbUserUncheckedUpdateWithoutTbAccontsInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbFuncioanrio?: tbFuncionarioUncheckedUpdateManyWithoutTbUserNestedInput
    Session?: SessionUncheckedUpdateManyWithoutTbUserNestedInput
  }

  export type tbUserCreateWithoutSessionInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbFuncioanrio?: tbFuncionarioCreateNestedManyWithoutTbUserInput
    tbAcconts?: tbAccontCreateNestedManyWithoutTbUserInput
  }

  export type tbUserUncheckedCreateWithoutSessionInput = {
    idU?: string
    idUser?: string | null
    nomeUser?: string | null
    emailUser?: string | null
    senhaUser?: string | null
    avatarUser?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tbFuncioanrio?: tbFuncionarioUncheckedCreateNestedManyWithoutTbUserInput
    tbAcconts?: tbAccontUncheckedCreateNestedManyWithoutTbUserInput
  }

  export type tbUserCreateOrConnectWithoutSessionInput = {
    where: tbUserWhereUniqueInput
    create: XOR<tbUserCreateWithoutSessionInput, tbUserUncheckedCreateWithoutSessionInput>
  }

  export type tbUserUpsertWithoutSessionInput = {
    update: XOR<tbUserUpdateWithoutSessionInput, tbUserUncheckedUpdateWithoutSessionInput>
    create: XOR<tbUserCreateWithoutSessionInput, tbUserUncheckedCreateWithoutSessionInput>
    where?: tbUserWhereInput
  }

  export type tbUserUpdateToOneWithWhereWithoutSessionInput = {
    where?: tbUserWhereInput
    data: XOR<tbUserUpdateWithoutSessionInput, tbUserUncheckedUpdateWithoutSessionInput>
  }

  export type tbUserUpdateWithoutSessionInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbFuncioanrio?: tbFuncionarioUpdateManyWithoutTbUserNestedInput
    tbAcconts?: tbAccontUpdateManyWithoutTbUserNestedInput
  }

  export type tbUserUncheckedUpdateWithoutSessionInput = {
    idU?: StringFieldUpdateOperationsInput | string
    idUser?: NullableStringFieldUpdateOperationsInput | string | null
    nomeUser?: NullableStringFieldUpdateOperationsInput | string | null
    emailUser?: NullableStringFieldUpdateOperationsInput | string | null
    senhaUser?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUser?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tbFuncioanrio?: tbFuncionarioUncheckedUpdateManyWithoutTbUserNestedInput
    tbAcconts?: tbAccontUncheckedUpdateManyWithoutTbUserNestedInput
  }

  export type tbFuncionarioCreateManyTbUserInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
  }

  export type tbAccontCreateManyTbUserInput = {
    idAccont?: string
    type: string
    provider: string
    providerAccontId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    sesseion_state?: string | null
  }

  export type SessionCreateManyTbUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type tbFuncionarioUpdateWithoutTbUserInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbStatusFun?: tbStatusFunUpdateOneWithoutTbFuncionarioNestedInput
    tbFuncao?: tbFuncaoUpdateOneWithoutTbFuncionarioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbFuncionarioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateWithoutTbUserInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbUserInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbAccontUpdateWithoutTbUserInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbAccontUncheckedUpdateWithoutTbUserInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbAccontUncheckedUpdateManyWithoutTbUserInput = {
    idAccont?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccontId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    sesseion_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutTbUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutTbUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutTbUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tbCadastroCreateManyTbFuncionarioInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPatCad?: string | null
  }

  export type tbCadastroUpdateWithoutTbFuncionarioInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbPatrimonio?: tbPatrimonioUpdateOneWithoutTbCadastroNestedInput
  }

  export type tbCadastroUncheckedUpdateWithoutTbFuncionarioInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPatCad?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCadastroUncheckedUpdateManyWithoutTbFuncionarioInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPatCad?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbFuncionarioCreateManyTbStatusFunInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idCustoFun?: string | null
  }

  export type tbFuncionarioUpdateWithoutTbStatusFunInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbUser?: tbUserUpdateOneWithoutTbFuncioanrioNestedInput
    tbFuncao?: tbFuncaoUpdateOneWithoutTbFuncionarioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbFuncionarioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateWithoutTbStatusFunInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbStatusFunInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbFuncionarioCreateManyTbFuncaoInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
    idCustoFun?: string | null
  }

  export type tbFuncionarioUpdateWithoutTbFuncaoInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbStatusFun?: tbStatusFunUpdateOneWithoutTbFuncionarioNestedInput
    tbUser?: tbUserUpdateOneWithoutTbFuncioanrioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbFuncionarioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateWithoutTbFuncaoInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbFuncaoInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    idCustoFun?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCadastroCreateManyTbPatrimonioInput = {
    idCad?: string
    dataCadPat?: Date | string | null
    dataDevPat?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idMatFunCad?: string | null
  }

  export type tbCadastroUpdateWithoutTbPatrimonioInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbFuncionario?: tbFuncionarioUpdateOneWithoutTbCadastroNestedInput
  }

  export type tbCadastroUncheckedUpdateWithoutTbPatrimonioInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idMatFunCad?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCadastroUncheckedUpdateManyWithoutTbPatrimonioInput = {
    idCad?: StringFieldUpdateOperationsInput | string
    dataCadPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDevPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idMatFunCad?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbPatrimonioCreateManyTbTipoPatInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_StatusPat?: string | null
    idPat_CustoPat?: string | null
  }

  export type tbPatrimonioUpdateWithoutTbTipoPatInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbStatusPat?: tbStatusPatUpdateOneWithoutTbPatrimonioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbPatrimonioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateWithoutTbTipoPatInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateManyWithoutTbTipoPatInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbPatrimonioCreateManyTbStatusPatInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_CustoPat?: string | null
  }

  export type tbPatrimonioUpdateWithoutTbStatusPatInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbTipoPat?: tbTipoPatUpdateOneWithoutTbPatrimonioNestedInput
    tbCCusto?: tbCCustoUpdateOneWithoutTbPatrimonioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateWithoutTbStatusPatInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateManyWithoutTbStatusPatInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_CustoPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbCCustoCreateManyTbEmpresaInput = {
    idCCusto?: string
    codigoCCusto?: string | null
    descricaoCCusto?: string | null
  }

  export type tbCCustoUpdateWithoutTbEmpresaInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    tbPatrimonio?: tbPatrimonioUpdateManyWithoutTbCCustoNestedInput
    tbFuncionario?: tbFuncionarioUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCCustoUncheckedUpdateWithoutTbEmpresaInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    tbPatrimonio?: tbPatrimonioUncheckedUpdateManyWithoutTbCCustoNestedInput
    tbFuncionario?: tbFuncionarioUncheckedUpdateManyWithoutTbCCustoNestedInput
  }

  export type tbCCustoUncheckedUpdateManyWithoutTbEmpresaInput = {
    idCCusto?: StringFieldUpdateOperationsInput | string
    codigoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
    descricaoCCusto?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbPatrimonioCreateManyTbCCustoInput = {
    idP?: string
    idPat: string
    descricaoPat: string
    descricaoDetalhadaPat?: string | null
    licencaPat?: string | null
    dataEntPat: Date | string
    dataSaiPat?: Date | string | null
    notaFiscalPat?: string | null
    valorPat: number
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
    idPat_TipoPat?: string | null
    idPat_StatusPat?: string | null
  }

  export type tbFuncionarioCreateManyTbCCustoInput = {
    idF?: string
    idMatFun: string
    nomeFun: string
    cpfFun?: string | null
    dataAdmFun?: Date | string | null
    dataDesFun?: Date | string | null
    avatarFun?: string | null
    idFuncaoFun?: string | null
    idUserFun?: string | null
    idStatusFun?: string | null
  }

  export type tbPatrimonioUpdateWithoutTbCCustoInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tbTipoPat?: tbTipoPatUpdateOneWithoutTbPatrimonioNestedInput
    tbStatusPat?: tbStatusPatUpdateOneWithoutTbPatrimonioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateWithoutTbCCustoInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbPatrimonioNestedInput
  }

  export type tbPatrimonioUncheckedUpdateManyWithoutTbCCustoInput = {
    idP?: StringFieldUpdateOperationsInput | string
    idPat?: StringFieldUpdateOperationsInput | string
    descricaoPat?: StringFieldUpdateOperationsInput | string
    descricaoDetalhadaPat?: NullableStringFieldUpdateOperationsInput | string | null
    licencaPat?: NullableStringFieldUpdateOperationsInput | string | null
    dataEntPat?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSaiPat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notaFiscalPat?: NullableStringFieldUpdateOperationsInput | string | null
    valorPat?: FloatFieldUpdateOperationsInput | number
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idPat_TipoPat?: NullableStringFieldUpdateOperationsInput | string | null
    idPat_StatusPat?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tbFuncionarioUpdateWithoutTbCCustoInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbStatusFun?: tbStatusFunUpdateOneWithoutTbFuncionarioNestedInput
    tbUser?: tbUserUpdateOneWithoutTbFuncioanrioNestedInput
    tbFuncao?: tbFuncaoUpdateOneWithoutTbFuncionarioNestedInput
    tbCadastro?: tbCadastroUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateWithoutTbCCustoInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
    tbCadastro?: tbCadastroUncheckedUpdateManyWithoutTbFuncionarioNestedInput
  }

  export type tbFuncionarioUncheckedUpdateManyWithoutTbCCustoInput = {
    idF?: StringFieldUpdateOperationsInput | string
    idMatFun?: StringFieldUpdateOperationsInput | string
    nomeFun?: StringFieldUpdateOperationsInput | string
    cpfFun?: NullableStringFieldUpdateOperationsInput | string | null
    dataAdmFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataDesFun?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    avatarFun?: NullableStringFieldUpdateOperationsInput | string | null
    idFuncaoFun?: NullableStringFieldUpdateOperationsInput | string | null
    idUserFun?: NullableStringFieldUpdateOperationsInput | string | null
    idStatusFun?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}