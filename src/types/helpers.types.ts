
// rewrite property type of interface
export type Omit<T, TKey extends keyof T> = Pick<T, Exclude<keyof T, TKey>>
