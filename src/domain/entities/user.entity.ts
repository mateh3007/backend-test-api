import { StepOnboardingEnum } from "../enum/step-onboarding.enum";
import { BaseEntity } from "./base.entity";
import { RoleEnum } from "../enum/role.enum";

export class UserEntity extends BaseEntity {
    private _name: string;
    private _email: string;
    private _password: string;
    private _phone: string;
    private _stepOnboarding: StepOnboardingEnum;
    private _role: RoleEnum;
    private _companyId?: string;

    constructor(user: Partial<UserEntity>) {
        super(user);
        Object.assign(this, user);
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get phone(): string {
        return this._phone;
    }

    get stepOnboarding(): StepOnboardingEnum {
        return this._stepOnboarding;
    }

    get role(): RoleEnum {
        return this._role;
    }

    get companyId(): string | undefined {
        return this._companyId;
    }

    belongsToCompany(): boolean {
        return !!this._companyId;
      }
    
    linkToCompany(companyId: string) {
        this._companyId = companyId;
    }

    set name(name: string) {
        this._name = name;
    }

    set email(email: string) {
        this._email = email;
    }
    
    set password(password: string) {
        this._password = password;
    }

    set phone(phone: string) {
        this._phone = phone;
    }

    set stepOnboarding(stepOnboarding: StepOnboardingEnum) {
        this._stepOnboarding = stepOnboarding;
    }

    set role(role: RoleEnum) {
        this._role = role;
    }

    set companyId(companyId: string) {
        this._companyId = companyId;
    }
}