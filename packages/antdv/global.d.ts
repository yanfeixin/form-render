
// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    ICollapseTranstion: typeof import('@king-one/antdv')['KCollapseTranstion'];
    IForm: typeof import('@king-one/antdv')['KForm'];
    IProDialog: typeof import('@king-one/antdv')['KProDialog'];
    IScrollBar: typeof import('@king-one/antdv')['KScrollBar'];
    IVirtualList: typeof import('@king-one/antdv')['KVirtualList'];
  }
}

export {};
  