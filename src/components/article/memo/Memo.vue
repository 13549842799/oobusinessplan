<template>
  <div style="height: 100%;">
    <el-container>
      <el-header height="150px">
        <div style="height:50px">
          备忘录
        </div>
        <div>
          <el-form :inline="true" :model="params">
            <el-form-item>
              <el-button size="medium" type="primary" >查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <template v-for="(m, name) in memos">
          <el-divider content-position="right" :key="name">{{name}}</el-divider>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import util from '@/components/common/objUtil'

import memoApi from '@/components/article/memo/memoApi'

export default {
  components: {},
  data () {
    return {
      memos: {},
      params: {}
    }
  },
  created () {
    let v = this
    memoApi.getList().then(res => {
      v.memos = res
    }).catch(err => { console.log(err) })
  },
  computed: {
  },
  methods: {
  }
}

</script>

<style>
</style>
