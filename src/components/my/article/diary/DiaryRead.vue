<template>
  <div class="diary-body">
    <div class="diary-head">
      <el-button type="primary" circle size="mini" class="el-icon-back goback-button" @click="goBack"></el-button>
      <p>{{diary.title}}</p>
      <span>{{diary.createTime}}</span>
    </div>
    <hr>
    <div class="diary-content">
      <page-rolling :downRoll="downRoll" :speed="8">
        <div v-html="diary.content"></div>
      </page-rolling>
    </div>
    <div class="diary-foot"></div>
  </div>
</template>

<script>
import pageRolling from '@/components/common/pageRolling'

export default {
  components: {
    pageRolling
  },
  props: {
    diary: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {
    goBack () {
      this.$emit('goBack')
      console.log('点击goback')
    },
    downRoll (l) {}
  }
}
</script>

<style scoped>
.goback-button {
  position: absolute;
  left: 20px;
  top: 10px;
}

.diary-body {
  padding: 5px 5px;
  height: 500px;
}

.diary-head {
  width: 100%;
  height: 50px;
  position: relative;
  text-align: center;
}

.diary-head p {
  font-size: 17px;
  height: 100%;
  line-height: 50px;
}

.diary-head span {
  position: absolute;
  right: 10px;
  top: 15px;
}

.diary-content {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 10px;
  height: 300px;
}

.diary-foot {
  height: 70px;
  margin-top: 20px;
}
</style>
