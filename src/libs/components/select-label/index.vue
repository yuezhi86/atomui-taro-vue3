<template>
  <view
    class="atom-select-label"
    :class="{
      'atom-select-label--placeholder': !value,
    }"
  >
    <view
      class="atom-select-label--content"
      :style="{
        color,
      }"
    >
      {{ value || placeholder }}
    </view>
    <AtomIcon
      v-if="arrow"
      name="arrow-right"
      :size="iconSize"
      :color="iconColor"
      class="atom-select-label--icon"
    />
  </view>
</template>

<script>
import AtomIcon from '../icon/index.vue';
import './index.scss';
export default {
  components: {
    AtomIcon,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: '',
    },
    iconSize: {
      type: String,
      default: '',
    },
  },
};
</script>
