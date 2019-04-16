<template>
  <div>
    <div class="diaryHead">
    </div>
    <div class="diary_content">
      <diary-list v-for="d in page.list" :key="d.id" :diary="d">
      </diary-list>
    </div>
  </div>
</template>

<script>
import diaryList from '@/components/my/article/diary/DiaryList'
import {MyPage} from '@/components/common/page'

export default {
  components: {
    diaryList
  },
  data () {
    return {
      page: new MyPage()
    }
  },
  created () {
    this.page.list = [{id: 1, name: '测试日记'}]
  }
}
</script>

<style scoped>
.diaryHead {
  width: 100%;
  height: 80px;
}

.diary_content {
  width:100%;
  height: 350px;
}
</style>
