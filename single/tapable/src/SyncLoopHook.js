import { Hook } from './Hook'
import { HookCodeFactory } from './HookCodeFactory'

class SyncLoopHookCodeFactory extends HookCodeFactory {
  content({ onError, onDone, rethrowIfPossible }) {
    return this.callTapsLooping({
      onError: (i, err) => onError(err),
      onDone,
      rethrowIfPossible
    })
  }
}

const factory = new SyncLoopHookCodeFactory()

function TAP_ASYNC() {
  throw new Error('tapAsync is not supported on a SyncLoopHook')
}

function TAP_PROMISE() {
  throw new Error('tapPromise is not supported on a SyncLoopHook')
}

const COMPILE = function (options) {
  factory.setup(this, options)
  return factory.create(options)
}

export function SyncLoopHook(args = [], name = undefined) {
  const hook = new Hook(args, name)
  hook.constructor = SyncLoopHook
  hook.tapAsync = TAP_ASYNC
  hook.tapPromise = TAP_PROMISE
  hook.compile = COMPILE
  return hook
}

SyncLoopHook.prototype = null
