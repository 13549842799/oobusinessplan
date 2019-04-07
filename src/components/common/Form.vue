<template>
  <div>
    <form @submit.prevent="submit($event)">
      <slot></slot>
    </form>

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'form-item',
  props: ['form'],
  methods: {
    submit (ev) {
      console.log(this.form.headers)
      let t = this.form
      let formDate = new FormData(ev.target)
      $.ajax({
        type: 'POST',
        url: t.action,
        headers: t.headers,
        dataType: t.dataType ? 'JSON' : t.dataType,
        contentType: false,
        processData: false,
        data: formDate,
        success: t.success,
        error: t.error
      })
    }
  }
}

</script>

<style scoped>

</style>
