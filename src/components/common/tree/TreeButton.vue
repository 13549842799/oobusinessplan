<template>
  <div>
    <template v-slot:button>
      <button :type="type"><slot>submit</slot></button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'myButton',
  props: ['type']
}
</script>

<style>

</style>
