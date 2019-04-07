<template>
  <div>
    <input
      :name="name"
      ref="st"
      :value="currentValue"
      type="text"
      class="el-input"
      @input="inputText"
      @blur="handlerBlur" />
  </div>
</template>

<script>
import {formItemMixin} from '@/components/common/common'

export default {
  name: 'input-Item',
  mixins: [formItemMixin],
  props: [],
  methods: {
    inputText () {
      this.trigger(this.$refs.st.value)
    }
  }
}
</script>

<style scoped>
.el-input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
</style>
