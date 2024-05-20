/*
 * @Description:
 * @Version: 2.0
 * @Autor: caohao
 * @Date: 2024-05-14 10:54:53
 * @LastEditors: caohao
 * @LastEditTime: 2024-05-20 14:28:47
 */
const { SyncWaterfallHook } = require('@king-one/tapable')

interface InterPlugin {
  name: string
  install: (app: DragDesign, ...options: any[]) => void
}
class Hooks {
  readonly hooks = {
    addHook: new SyncWaterfallHook(['args']),
    minusHook: new SyncWaterfallHook(['args'])
  }
}

class DragDesign {
  //   Hook: any = null
  Hook: Hooks
  a: number
  b: number
  constructor(a: number, b: number) {
    this.Hook = new Hooks()
    this.a = a
    this.b = b
  }
  get hooks() {
    return this.Hook.hooks
  }
  sum() {
    const res = this.hooks.addHook.call(this.a + this.b)
    return res
  }
  minus() {
    const res = this.hooks.minusHook.call(this.b - this.a)
    return res
  }
  use(plugIn: InterPlugin) {
    plugIn.install.call(undefined, this)
  }
}
const Drag = new DragDesign(1, 2)

class TestPlugin {
  name: string = 'TestPlugin'
  install: (app: DragDesign, ...options: any[]) => void = (app) => {
    app.hooks.addHook.tap('event1', (params: any) => {
      return params + 1
    })
  }
}
class TestPlugin1 {
  name: string = 'TestPlugin1'
  install: (app: DragDesign, ...options: any[]) => void = (app) => {
    app.hooks.addHook.tap('event1', (params: any) => {
      return params + 1
    })
    app.hooks.minusHook.tap('TestPluginMinu', (params: any) => {
      return params - 1
    })
  }
}
Drag.use(new TestPlugin())
Drag.use(new TestPlugin1())
Drag.sum()
Drag.minus()
export default {}
