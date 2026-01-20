export abstract class JwtAdapter {
  abstract sign(payload: any): Promise<string>;
  abstract verify(token: string): Promise<any>;
}
