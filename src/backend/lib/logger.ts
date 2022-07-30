export class JamsticLogger {
  static log(...args: string[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(args)
    }
  }
}
