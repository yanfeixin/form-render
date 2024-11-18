export const iconProps = {
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 20
  },
  color: {
    type: String,
    default: '#333'
  }
} as const
