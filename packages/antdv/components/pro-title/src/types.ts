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
  color: {
    type: String,
    default: '#0e74ff'
  },
  size: {
    type: Number,
    default: 20
  }
} as const

export type TitlePropsTypes = ExtractPropTypes<typeof TitleProps>
export type OutTitlePropsTypes = ExtractPublicPropTypes<typeof TitleProps>
