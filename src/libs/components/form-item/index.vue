<template>
  <view
    class="atom-form-item"
    :class="{
      'atom-form-item--border': border,
      'atom-form-item--wrap': (groupProps && groupProps.wrap) || wrap,
    }"
    :style="{
      'align-items': (groupProps && groupProps.alignItems) || alignItems,
    }"
  >
    <view
      v-if="label"
      class="atom-form-item--label"
      :style="{
        width: (groupProps && groupProps.labelWidth) || labelWidth,
      }"
    >
      {{ label }}
      <text v-if="required" class="atom-form-item--required">*</text>
      <view class="atom-form-item--title-aside"
        ><slot name="title"></slot
      ></view>
    </view>

    <view
      class="atom-form-item--content"
      :style="{
        textAlign: (groupProps && groupProps.contentAlign) || contentAlign,
      }"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
import {inject} from 'vue';
import './index.scss';
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: true,
    },
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
  setup() {
    const groupProps = inject('groupProps');
    return {groupProps};
  },
};
</script>
