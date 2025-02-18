import { definePropType } from '@king-one/antdv/components/utils/install'

export const ProSignatureProps = {
  width: {
    type: definePropType<number>(Number),
    default: 800
  },
  height: {
    type: Number,
    default: 300
  },
  lineWidth: {
    type: Number,
    default: 4
  },
  bgColor: {
    type: String,
    default: ''
  },
  lineColor: {
    type: String,
    default: '#000000'
  },
  isCrop: {
    type: Boolean
  },
  isClearBgColor: {
    type: Boolean
  },
  format: {
    type: String,
    default: 'image/png'
  },
  quality: {
    type: Number,
    default: 1
  }

}
