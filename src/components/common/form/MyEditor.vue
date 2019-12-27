<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'myEditor',
  props: {
    html: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      editor: null
    }
  },
  created () {
  },
  mounted () {
    let v = this
    // 创建编辑器,必须等待dom已经生成
    v.editor = new E(v.$refs.editor)
    v.editor.customConfig.onchange = (html) => {
      v.html(html)
    }
    v.editor.create()
  },
  methods: {
    initHtml (html) {
      this.editor.txt.html(html)
    }
  }
}
</script>

<style scoped>

</style>
