export type Nullable<TValue> = TValue | null;
export type MaybePromise<TValue> = TValue | Promise<TValue>;
export type Unsubscribe = () => void;

export type DeepPartial<TValue> = {
  [TKey in keyof TValue]?: TValue[TKey] extends Array<infer TArray>
    ? Array<DeepPartial<TArray>>
    : TValue[TKey] extends object
      ? DeepPartial<TValue[TKey]>
      : TValue[TKey];
};

export interface ValidationIssue {
  code: string;
  message: string;
  path: string;
  level?: 'error' | 'warning';
}

export interface ValidationResult<TValue> {
  valid: boolean;
  data?: TValue;
  issues: ValidationIssue[];
}

export type Subscriber<TValue> = (value: TValue) => void;
