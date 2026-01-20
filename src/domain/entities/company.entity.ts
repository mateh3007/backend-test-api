import { BaseEntity } from "./base.entity";

export class CompanyEntity extends BaseEntity {
    private _corporateName: string;
    private _cnpj: string;
    private _phone: string;
    private _email: string;

    constructor(company: Partial<CompanyEntity>) {
        super(company);
        Object.assign(this, company);
    }

    get corporateName(): string {
        return this._corporateName;
    }
    
    get cnpj(): string {
        return this._cnpj;
    }

    get phone(): string {
        return this._phone;
    }

    get email(): string {
        return this._email;
    }

    set corporateName(corporateName: string) {
        this._corporateName = corporateName;
    }

    set cnpj(cnpj: string) {
        this._cnpj = cnpj;
    }
    
    set phone(phone: string) {
        this._phone = phone;
    }

    set email(email: string) {
        this._email = email;
    }
}