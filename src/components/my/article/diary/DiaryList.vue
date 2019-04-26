<template>
  <div class="diary_list_body">
    <div class="diary_list_top">
      <span class="diary_list_status">{{statusArr[diary.status]}}</span>
      <span><router-link to="">{{diary.title}}</router-link></span>
    </div>
    <div class="diary_list_bottom" :class="{'hasBottomBorder': !expand}">
      <div>
        <span>{{diary.date ? diary.date : diary.createTime}}</span>
      </div>
      <div>
        <template v-if="diary.labelList">
          <el-tag size="mini" v-for="(l, index) in diary.labelList" :key="index" style="margin-left: 10px;" type="success">{{l.name}}</el-tag>
        </template>
      </div>
      <div style="float:right">
        <el-button type="text" size="mini" @click="expand = !expand">{{!expand ? '展开' : '收起'}}</el-button>
        <slot></slot>
      </div>
    </div>
    <div v-if="expand" class="diary_session hasBottomBorder">
    </div>
  </div>
</template>

<script>

export default {
  props: {
    diary: {
      type: Object,
      default () {
        return {}
      }
    },
    defaultExpand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: false,
      statusArr: ['草稿', '私密', '发布']
    }
  },
  computed: {
  },
  created () {
    this.expand = this.defaultExpand
  },
  methods: {
  }
}
</script>

<style scoped>
.diary_list_body {
  width: 100%;
  padding: 10px;
  position: relative;
}

.diary_list_top, .diary_list_bottom {
  width: 98%;
  height: 20px;
}

.diary_list_top > span {
  margin-right: 15px;
  font-size: 15px;
}

.diary_list_bottom {
  height: 30px;
  margin-top: 10px;
}

.diary_list_bottom > div {
  float: left;
  margin-right: 10px;
}

.diary_list_status {
  display: inline-block;
  border: 1px solid #E4E7ED;
  width: 30px;
  height: 16px;
  font-size: 13px;
  text-align: center;
}

.hasBottomBorder {
  border-bottom: 1px solid #DCDFE6;
}

.diary_session {
  height: 60px;
}
</style>
