/**
 * 组件的公共属性，方法等
 */

var formItemMixin = {
  props: ['value', 'role', 'name'],
  data () {
    return {
      roles: {
        blur: null,
        change: null
      }
    }
  },
  computed: {
    currentValue () {
      return this.value
    }
  },
  methods: {
    trigger (val) {
      this.$emit('input', val) // 触发 input 事件，并传入新值
    },
    handlerBlur (event) {
      let v = event.target.value
      if (this.roles.blur) {
        for (let i = 0; i < this.roles.blur.length; i++) {
          this.roleAction(this.roles.blur.length[i], v)
        }
      }
    },
    roleAction (role, val) {
      for (let v in role) {
        switch (v) {
          case 'required':
            if (role[v] === true && !val.trim()) {
            }
            break
        }
      }
    }
  },
  mounted () {
    let r = this.role
    if (r) {
      for (let i = 0; i < r.length; i++) {
        if (r[i].trigger) {
          this.roles[r[i].trigger] = r[i]
        }
      }
    }
  }
}

export {formItemMixin}
