import { Hook } from './Hook'
import { HookCodeFactory } from './HookCodeFactory'

class SyncBailHookCodeFactory extends HookCodeFactory {
  content({ onError, onResult, resultReturns, onDone, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: (i, err) => onError(err),
      onResult: (i, result, next) => `if(${result} !== undefined) {\n${onResult(result)};\n} else {\n${next()}}\n`,
      resultReturns,
      onDone,
      rethrowIfPossible
    })
  }
}

const factory = new SyncBailHookCodeFactory()

function TAP_ASYNC() {
  throw new Error('tapAsync is not supported on a SyncBailHook')
}

function TAP_PROMISE() {
  throw new Error('tapPromise is not supported on a SyncBailHook')
}

const COMPILE = function (options) {
  factory.setup(this, options)
  return factory.create(options)
}

export function SyncBailHook(args = [], name = undefined) {
  const hook = new Hook(args, name)
  hook.constructor = SyncBailHook
  hook.tapAsync = TAP_ASYNC
  hook.tapPromise = TAP_PROMISE
  hook.compile = COMPILE
  return hook
}

SyncBailHook.prototype = null
