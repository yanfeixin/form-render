import { label, spinner as load } from '@astrojs/cli-kit'
import { align } from '@astrojs/cli-kit/utils'
export const title = (text: string) => align(label(text), 'end', 7) + ' '
let stdout = process.stdout
/** @internal Used to mock `process.stdout.write` for testing purposes */
export function setStdout(writable: typeof process.stdout) {
  stdout = writable
}
export async function spinner(args: { start: string; end: string; while: (...args: any) => Promise<any> }) {
  await load(args, { stdout })
}
