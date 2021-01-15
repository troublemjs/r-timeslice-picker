# 时间片选择器

[TOC]

参考 rc-component 组件发布

以`天`或者`周`的整点选择器

## API

| name | description | type | default |
| :-- | :-- | :-- | :-- | :-- |
| footer | 自定义底部 | `ReactNode` | - |
| week | 是否以周为单位来进行处理 | `boolean` | true |
| defaultValue | 默认数据 | `number[]` | [] |
| value | 以`props.value`为准，`onChange`配合使用 | `number[] | number[][]` | [] |
| onChange | 是否以周为单位来进行处理 | `(value: console.log(value)) => void` | - |

## 显示一天

显示一天可以使用`Row`组件