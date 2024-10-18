import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ScrollBar',
  props: {
    scrollTop: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    return () => <div style={{ height: '100%', overflow: 'scroll' }}>{props.scrollTop}</div>
  }
})
