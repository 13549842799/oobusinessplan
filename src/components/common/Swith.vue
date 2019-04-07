<template>
  <div class="swith_ui" @click="selected()">
    <input :name="name" :value="currentValue" ref="st" type="text" />
    <div :class="{swith_ui_on:onStatus}">
      <em>{{showText}}</em>
      <i></i>
    </div>
  </div>
</template>

<script>
import {formItemMixin} from '@/components/common/common'

export default {
  name: 'switch-item',
  mixins: [formItemMixin],
  props: ['active', 'inactive', 'onText', 'offText', 'defaultValue'],
  methods: {
    selected () {
      this.$refs.st.value = this.$refs.st.value === this.active
        ? this.inactive : this.active
      this.trigger(this.$refs.st.value)
    }
  },
  computed: {
    showText () {
      return this.onStatus ? this.onText : this.offText
    },
    onStatus () {
      return String(this.active) === String(this.currentValue)
    }
  }
}
</script>

<style scoped>
.swith_ui {
  display: inline-block;
  position: relative;
}
.swith_ui > input {
  display: none;
}
.swith_ui > div {
  height: 22px;
  min-width: 35px;
  line-height: 22px;
  padding: 0 5px;
  border: 1px solid #d2d2d2;
  border-radius: 20px;
  cursor: pointer;
  background-color: #fff;
  transition: .1s linear;
}
.swith_ui > div > em {
  position: relative;
  top: 0;
  width: 25px;
  margin-left: 21px;
  padding: 0!important;
  text-align: center!important;
  color: #999!important;
  font-style: normal!important;
  font-size: 12px;
}
.swith_ui > div > i {
  position: absolute;
  left: 5px;
  top: 3px;
  width: 16px;
  height: 16px;
  border-radius: 20px;
  background-color: #d2d2d2;
  -webkit-transition: .1s linear;
  transition: .1s linear;
}
.swith_ui > .swith_ui_on {
  border-color: #5FB878;
  background-color: #5FB878;
}

.swith_ui > .swith_ui_on em {
  margin-left: 5px;
  margin-right: 21px;
  color: #fff!important;
}
.swith_ui > .swith_ui_on i {
  left: 100%;
  margin-left: -21px;
  background-color: #fff;
}
</style>
