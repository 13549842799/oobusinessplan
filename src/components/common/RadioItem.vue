<template>
  <label
    role="radio"
    :aria-checked="check"
    class="radio_item"
    @click.self="select"
  >
    <span class="icon" :class="{icon_check: check}">
      <span class="icon_inner"></span>
    </span>
    <input
    :name="name"
    ref="st"
    type="radio"
    :checked="check"
    :value="currentValue"
    aria-hidden="true"
    style="display: none"
    />
    <span class="title">{{text}}</span>
  </label>
</template>

<script>
import {formItemMixin} from '@/components/common/common'
// import $ from 'jquery'

export default {
  name: 'radio-Item',
  mixins: [formItemMixin],
  model: {
    prop: 'active',
    event: 'change'
  },
  props: ['active', 'text'],
  data () {
    return {
    }
  },
  methods: {
    select () {
      this.$emit('change', this.currentValue)
    }
  },
  computed: {
    check () {
      return String(this.value) === String(this.active)
    }
  }
}
</script>

<style scoped>
.radio_item {
  cursor: pointer;
  height: 25px;
  display: inline-block;
  line-height: 25px;
  margin: 5px;
}

.icon:hover {
  border: 1px solid #409EFF;
}

.icon, .icon_inner {
  display: inline-block;
  border-radius: 100%;
}

.icon {
  width: 15px;
  height: 15px;
  border: 1px solid #dcdfe6;
  position: relative;
  top: 3px;
}

.icon_check {
  background: #409EFF;
}

.icon_inner {
  background: white;
  width: 6px;
  height: 6px;
  position: absolute;
  left: 5px;
  top: 5px;
}

.title {
  display: inline-block;
  height: 20px;
  margin-left: 3px;
}
</style>
