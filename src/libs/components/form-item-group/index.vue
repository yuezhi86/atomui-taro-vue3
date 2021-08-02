<template>
  <view class="atom-form-item-group">
    <slot></slot>
  </view>
</template>

<script>
import {reactive, provide} from 'vue';
export default {
  name: 'FormItemGroup',
  props: {
    wrap: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: '',
    },
    alignItems: {
      type: String,
      default: '',
    },
    contentAlign: {
      type: String,
      default: 'right',
      validator(value) {
        return ['left', 'right'].includes(value);
      },
    },
  },
  setup(props) {
    const groupProps = reactive(props);
    provide('groupProps', groupProps);
  },
};
</script>
