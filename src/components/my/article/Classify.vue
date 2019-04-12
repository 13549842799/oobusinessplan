<template>
  <!-- <div>{{$route.params.type}}</div> -->
  <div>
    <div class="classify_head">
      <el-input
        style="width:200px;"
        placeholder="请输入内容"
        v-model="searchText"
        clearable>
      </el-input>
      <el-button style="margin-left: 30px;" icon="el-icon-search" type="primary">搜索</el-button>
    </div>
    <div class="classify_content">

    </div>
  </div>
</template>

<script>
import router from '@/router'
import http from '@/http.js'
import base from '@/base_variable'
import commonM from '@/components/common/commonMixins'

export default {
  mixins: [commonM],
  data () {
    return {
      childType: null,
      searchText: null,
      page: {
        list: []
      }
    }
  },
  created () {
    let v = this
    v.childType = v.$route.params.type
    // http.$get(base.classifyUrl + '/list.re', {childType: v.childType}).then(res => {
    //   v.simpleDealResult(res.status, function () {
        
    //   }, res.message, null)
    // })
  },
  methods: {
  }
}
</script>

<style scoped>
.classify_head {
  width: 100%;
  height: 100px;
  margin-top: 20px;
}

.classify_content {
  width: 100%;
  height: 350px;
}
</style>
