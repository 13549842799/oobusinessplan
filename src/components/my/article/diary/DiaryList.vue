<template>
  <div>
    <div>
      <span>{{diary.status}}</span>
      <span>{{diary.name}}</span>
    </div>
    <div>
      <div>{{diary.createTime}}</div>
      <div>{{diary.labels}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    diary: Object
  },
  computed: {
    diy () {
      return this.diary ? this.diary : {}
    }
  }
}
</script>

<style scoped>

</style>
