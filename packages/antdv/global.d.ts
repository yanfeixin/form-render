
// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    ICollapseTranstion: typeof import('@king-one/antdv')['KCollapseTranstion'];
    IForm: typeof import('@king-one/antdv')['KForm'];
    IProArea: typeof import('@king-one/antdv')['KProArea'];
    IProModal: typeof import('@king-one/antdv')['KProModal'];
    IProPicker: typeof import('@king-one/antdv')['KProPicker'];
    IProTag: typeof import('@king-one/antdv')['KProTag'];
    IProTitle: typeof import('@king-one/antdv')['KProTitle'];
    IScaleVirtualList: typeof import('@king-one/antdv')['KScaleVirtualList'];
    IScrollBar: typeof import('@king-one/antdv')['KScrollBar'];
  }
}

export {};
  