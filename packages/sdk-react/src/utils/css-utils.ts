export function classNames(...args: (string | undefined | null | false)[]) {
  let result = '';
  for (const arg of args) {
    if (arg) {
      result += arg + ' ';
    }
  }
  return result;
}
