import { Hook } from './Hook'
import { HookCodeFactory } from './HookCodeFactory'

class SyncWaterfallHookCodeFactory extends HookCodeFactory {
  content({ onError, onResult, resultReturns, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: (i, err) => onError(err),
      onResult: (i, result, next) => {
        let code = ''
        code += `if(${result} !== undefined) {\n`
        code += `${this._args[0]} = ${result};\n`
        code += `}\n`
        code += next()
        return code
      },
      onDone: () => onResult(this._args[0]),
      doneReturns: resultReturns,
      rethrowIfPossible
    })
  }
}

const factory = new SyncWaterfallHookCodeFactory()

function TAP_ASYNC() {
  throw new Error('tapAsync is not supported on a SyncWaterfallHook')
}

function TAP_PROMISE() {
  throw new Error('tapPromise is not supported on a SyncWaterfallHook')
}

const COMPILE = function (options) {
  factory.setup(this, options)
  return factory.create(options)
}

export function SyncWaterfallHook(args = [], name = undefined) {
  if (args.length < 1)
    throw new Error('Waterfall hooks must have at least one argument')
  const hook = new Hook(args, name)
  hook.constructor = SyncWaterfallHook
  hook.tapAsync = TAP_ASYNC
  hook.tapPromise = TAP_PROMISE
  hook.compile = COMPILE
  return hook
}

SyncWaterfallHook.prototype = null
