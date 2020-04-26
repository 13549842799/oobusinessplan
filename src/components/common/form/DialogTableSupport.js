export default {
  props: {
    submitSuccess: {
      type: Function,
      default: () => {}
    },
    submitFail: {
      type: Function,
      default: () => {}
    },
    obj: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      open: false
    }
  },
  methods: {
    submitForm () {
      let v = this
      v.submitSuccess(v.params)
    }
  }
}
