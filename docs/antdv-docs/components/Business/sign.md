---
outline: deep
---

# Sign 签署插件

<!--@include: ../temp/warning.md-->

::: danger 注意
- 此组件为签署组件 主要使用场景：为入驻[电子印章公告服务平台](https://dzyz.gat.shandong.gov.cn/public/#/)的应用，提供快速实现签署相关的前端功能。
- 没有入驻[电子印章公告服务平台](https://dzyz.gat.shandong.gov.cn/public/#/)，不能使用此组件。
- 申请入驻，请参考[电子印章公告服务平台](https://dzyz.gat.shandong.gov.cn/public/#/)导航中的【[接入管理](https://dzyz.gat.shandong.gov.cn/#/home)】
- 相关功能：拖拽添加印章、签名、日期，添加骑缝章、批量处理，跳转到指定页码。（暂无操作记录功能）
- 因为内置Paas平台相关接口，组件内部需要请求接口，请把业务系统的请求封装挂载到 window.$http
:::

 ### 预览
![签署](/guide/sign.jpg)
