import { Hook } from './Hook'
import { HookCodeFactory } from './HookCodeFactory'

class AsyncSeriesLoopHookCodeFactory extends HookCodeFactory {
  content({ onError, onDone }) {
    return this.callTapsLooping({
      onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
      onDone
    })
  }
}

const factory = new AsyncSeriesLoopHookCodeFactory()

const COMPILE = function (options) {
  factory.setup(this, options)
  return factory.create(options)
}

export function AsyncSeriesLoopHook(args = [], name = undefined) {
  const hook = new Hook(args, name)
  hook.constructor = AsyncSeriesLoopHook
  hook.compile = COMPILE
  hook._call = undefined
  hook.call = undefined
  return hook
}

AsyncSeriesLoopHook.prototype = null
