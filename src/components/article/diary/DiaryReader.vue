<template>
  <div style="height: 100%;" v-loading="loading" class="diary-read-bg">
    <el-container>
      <el-header height="80px" style="text-align: center">
        <h3>{{obj.title}}</h3>
        <h4>{{obj.dateStr}}</h4>
      </el-header>
      <el-main>
        <el-divider content-position="left">正文</el-divider>
        <page-roll height="820px" :downRoll="dr" :speed="6"><div v-html="obj.content"></div></page-roll>
        <el-divider content-position="left">标签</el-divider>
        <div>
          <template v-if="obj.labels">
            <el-tag v-for="(l, index) in obj.labels" :key="index" effect="plain" size="mini" style="margin-right: 10px">{{l}}</el-tag>
          </template>
          <template v-else>
            <span>暂无标签</span>
          </template>
        </div>
        <div style="text-align: center">
           <el-button type="primary" @click="goBack">返回</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import diaryApi from '@/components/article/diary/diaryApi'

import pageRoll from '@/components/common/pageRolling'

export default {
  props: ['id'],
  components: {
    pageRoll
  },
  data () {
    return {
      loading: false,
      obj: {}
    }
  },
  created () {
    let v = this
    v.loading = true
    diaryApi.getDiary(this.id, {complete: () => { v.loading = false }}).then(res => {
      v.obj = res
    }).catch(err => { console.log(err) })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    dr () {}
  }
}
</script>

<style scoped>
.diary-read-bg {
  background-image: linear-gradient(#CCFFFF, 1%, #FFFFFF);
  overflow: auto;
}
</style>
