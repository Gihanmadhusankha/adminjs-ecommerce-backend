declare module 'jsonwebtoken' {
  export function sign(payload: any, secretOrPrivateKey: any, options?: any): string;
  export function verify(token: string, secretOrPublicKey: any, options?: any): any;
  export function decode(token: string, options?: any): any;
  export const JsonWebTokenError: any;
  export const NotBeforeError: any;
  export const TokenExpiredError: any;
  export default {} as any;
}
