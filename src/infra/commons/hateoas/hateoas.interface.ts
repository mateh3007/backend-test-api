export interface ILink {
  href: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  rel: string;
}

export interface IHateoasLinks {
  self: ILink;
  [key: string]: ILink;
}

export interface IHateoasResponse<T> {
  data: T;
  _links: IHateoasLinks;
}

export class HateoasBuilder {
  private links: IHateoasLinks = {} as IHateoasLinks;
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  self(path: string, method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET'): this {
    this.links.self = { href: `${this.baseUrl}${path}`, method, rel: 'self' };
    return this;
  }

  add(rel: string, path: string, method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'): this {
    this.links[rel] = { href: `${this.baseUrl}${path}`, method, rel };
    return this;
  }

  build(): IHateoasLinks {
    return this.links;
  }
}

