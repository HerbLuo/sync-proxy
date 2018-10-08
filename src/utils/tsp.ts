type NotA<T, A> = A extends T ? never : A
export type Not<T> = NotA<T, any>
