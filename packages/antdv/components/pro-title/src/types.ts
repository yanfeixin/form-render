import type { ExtractPropTypes, ExtractPublicPropTypes } from 'vue'

export const TitleProps = {
  unBorder: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 16
  }
} as const

export type TitlePropsTypes = ExtractPropTypes<typeof TitleProps>
export type OutTitlePropsTypes = ExtractPublicPropTypes<typeof TitleProps>
