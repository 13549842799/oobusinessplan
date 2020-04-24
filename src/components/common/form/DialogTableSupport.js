export default {
  props: {
    submitSuccess: {
      type: Function,
      default: () => {}
    },
    submitFail: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      formVisible: false
    }
  },
  methods: {
    submitForm () {
      let v = this
      v.submitSuccess(v.params)
    }
  }
}
