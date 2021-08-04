<template>
  <view
    class="atom-page-container"
    :style="{
      paddingTop: customTopbar ? paddingTop : '',
      backgroundColor: bgColor,
    }"
  >
    <view
      class="atom-page-container--inner"
      :style="{
        paddingTop: innerPaddingTop && innerPaddingTop + 'px',
        paddingBottom: safeBottom && 'env(safe-area-inset-bottom, 0)',
      }"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
import {ref, provide} from 'vue';
import './index.scss';
export default {
  name: 'PageContainer',
  props: {
    customTopbar: {
      type: Boolean,
      default: true,
    },
    safeBottom: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: '',
    },
  },
  setup() {
    const paddingTop = ref(0);
    const innerPaddingTop = ref(0);

    provide('setPaddingTop', ({top, height}) => {
      paddingTop.value = height;
      innerPaddingTop.value = top;
    });

    return {
      paddingTop,
      innerPaddingTop,
    };
  },
};
</script>
