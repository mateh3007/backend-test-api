import { RoleEnum } from '../enum/role.enum';
import { StepOnboardingEnum } from '../enum/step-onboarding.enum';

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginOutput {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleEnum;
    stepOnboarding: StepOnboardingEnum;
    companyId?: string;
  };
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface IRegisterOutput {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleEnum;
  stepOnboarding: StepOnboardingEnum;
  accessToken: string;
}
