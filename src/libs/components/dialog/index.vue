<template>
  <view
    class="y-dialog"
    :class="{
      'y-dialog--show': modelValue,
    }"
  >
    <view
      class="y-dialog-mask"
      :class="{
        'y-dialog-mask--show': modelValue,
      }"
      @tap="onHide"
      @click="onHide"
    ></view>
    <view class="y-dialog-main" :class="[`y-dialog-main--${position}`]">
      <view
        class="y-dialog-body"
        :style="{
          maxHeight: `${maxHeight}px`,
        }"
      >
        <slot>{{ content }}</slot>
      </view>

      <view class="y-dialog-actions">
        <view v-if="type === 'confirm'" class="y-dialog-action y-dialog-cancel">
          <button
            class="y-dialog-btn"
            :class="[`y-dialog-btn--${cancelType}`]"
            @tap="onCancel"
            @click="onCancel"
          >
            {{ cancelText }}
          </button>
        </view>
        <view class="y-dialog-action">
          <button
            class="y-dialog-btn"
            :class="[`y-dialog-btn--${confirmType}`]"
            :open-type="openType"
            @tap="onConfirm"
            @click="onConfirm"
            @getuserinfo="onGetUserInfo"
            @getphonenumber="onGetPhoneNumber"
            @opensetting="onOpenSetting"
            @contact="onContact"
            @error="onError"
          >
            {{ confirmText }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.scss';
export default {
  name: 'YDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'alert',
      validator(value) {
        return ['alert', 'confirm'].includes(value);
      },
    },
    content: {
      type: String,
      default: '',
    },
    position: {
      type: String,
      default: 'center',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelType: {
      type: String,
      default: 'default-text',
    },
    confirmType: {
      type: String,
      default: 'primary-text',
    },
    openType: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: Number,
      default: 300,
    },
    clickMaskHide: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'confirm',
    'cancel',
    'error',
    'getUserInfo',
    'getPhoneNumber',
    'contact',
    'openSetting',
    'update:modelValue',
  ],
  methods: {
    onConfirm() {
      this.$emit('confirm');
      this.$emit('update:modelValue', false);
    },
    onCancel() {
      this.$emit('cancel');
      this.$emit('update:modelValue', false);
    },
    onHide(e) {
      e.stopPropagation();
      if (!this.clickMaskHide) return;
      this.$emit('cancel');
    },
    onGetUserInfo({detail = {}} = {}) {
      this.$emit('getUserInfo', detail);
    },
    onContact({detail = {}} = {}) {
      this.$emit('contact', detail);
    },
    onGetPhoneNumber({detail = {}} = {}) {
      this.$emit('getPhoneNumber', detail);
    },
    onOpenSetting({detail = {}} = {}) {
      this.$emit('openSetting', detail);
    },
    onError({detail = {}} = {}) {
      this.$emit('error', detail);
    },
  },
};
</script>
