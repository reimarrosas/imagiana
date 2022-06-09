import { Reducer } from "react";

interface ValidationState<T> {
  state: T;
  isValid: boolean;
}

export interface ValidationAction<T> {
  newState: T;
  validator: (t: T) => boolean;
}

export type ValidationReducer<T> = Reducer<
  ValidationState<T>,
  ValidationAction<T>
>;

const validationReducer = <T>(
  _: ValidationState<T>,
  action: ValidationAction<T>
): ValidationState<T> => ({
  state: action.newState,
  isValid: action.validator(action.newState),
});

export default validationReducer;
