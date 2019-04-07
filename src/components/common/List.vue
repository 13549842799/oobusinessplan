<template>
  <div>
    <div v-if="onfilter === true" class="el-input">
      <input v-model="filterText" :placeholder="placeholder" class="filterItem" type="text" />
    </div>
    <ol>
      <li v-for="l in array" :key="l.id" >{{l.name}}&nbsp;&nbsp;<span>({{l.code}})</span></li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'listItem',
  props: {
    array: Array,
    placeholder: String,
    onfilter: Boolean,
    filter: Function
  },
  data () {
    return {
      temp: this.array,
      filterText: null
    }
  },
  methods: {
    defaultfilter (text, val) {
      if (!text) {
        return true
      }
      return val.name.indexOf(text) !== -1 || val.code.indexOf(text) !== -1
    }
  },
  computed: {
    filterNode (val) {
      if (!val) {
        return this.array
      }
      let temp = []
      if (this.filter) {
        for (let i = 0; i < this.array.length; i++) {
          temp.push(this.array[i])
        }
      }
      return this.filterText === '' ||
      this.filter ? this.filter(this.filterText, val)
        : this.defaultfilter(this.filterText, val)
    }
  }
}
</script>

<style scoped>

input::-webkit-input-placeholder{
    color:#dcdfe6;
}
input::-moz-placeholder{/* Mozilla Firefox 19+ */
    color:#dcdfe6;
}
input:-moz-placeholder{/* Mozilla Firefox 4 to 18 */
    color:#dcdfe6;
}
input:-ms-input-placeholder{/* Internet Explorer 10-11 */
    color:#dcdfe6;
}

.el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  margin-bottom: 10px;
}

.filterItem {
  display:inline-block;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}

li {
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}

li:hover {
  cursor: pointer;
  background-color: #f5f7fa;
}

</style>
