export const proAreaApis = {
  areaTree: (): Promise<any> =>
    globalThis.$http.get(`/basic/area/setting/tree`)
}
