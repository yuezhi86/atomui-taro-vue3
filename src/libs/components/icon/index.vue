<template>
  <view
    class="atom-icon"
    :class="[`atom-icon-${name}`]"
    :style="{
      fontSize: size,
      color,
    }"
  />
</template>

<script>
import './index.scss';
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
};
</script>
