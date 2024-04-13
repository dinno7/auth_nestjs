import { SetMetadata } from '@nestjs/common';
import { PolicyHandlerType } from '../types/policy-handler.type';

export const SET_POLICIES_DECORATOR_KEY = 'policies';
export const SetPolicies = (...policies: PolicyHandlerType[]) =>
  SetMetadata(SET_POLICIES_DECORATOR_KEY, policies);
