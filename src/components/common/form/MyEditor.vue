<template>
  <div>
    <div class="editor-title" ref="editor_title"></div>
    <div class="editor-content" ref="editor_content" style="text-align:left" ></div>
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
    v.editor = new E(v.$refs.editor_title, v.$refs.editor_content)
    v.editor.customConfig.height = '700px'
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
.editor-title {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

.editor-content {
  height: 550px;
  border: 1px solid #ccc;
}
</style>
