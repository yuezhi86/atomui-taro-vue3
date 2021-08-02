<template>
  <view
    class="atom-page-container"
    :style="{
      paddingTop: paddingTop + 'px',
      backgroundColor: bgColor,
    }"
  >
    <slot></slot>
  </view>
</template>

<script>
import {ref, provide} from 'vue';
import './index.scss';
export default {
  name: 'PageContainer',
  props: {
    // px
    offsetTop: {
      type: Number,
      default: 0,
    },
    bgColor: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const paddingTop = ref(props.offsetTop);

    provide('setPaddingTop', (value) => {
      paddingTop.value = value + props.offsetTop;
    });

    return {
      paddingTop,
    };
  },
};
</script>
