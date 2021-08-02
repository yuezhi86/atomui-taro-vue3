<template>
  <view
    class="atom-fixedbar"
    :class="{
      'atom-fixedbar--border': border,
    }"
    :style="{
      backgroundColor: bgColor,
      zIndex,
      minHeight,
    }"
  >
    <slot name="before"></slot>

    <view class="atom-fixedbar--inner">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import './index.scss';
export default {
  name: 'FixedBar',
  props: {
    border: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: '',
    },
    zIndex: {
      type: Number,
      default: null,
    },
    minHeight: {
      type: String,
      default: '',
    },
  },
};
</script>
