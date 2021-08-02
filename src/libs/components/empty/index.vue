<template>
  <view
    class="atom-empty"
    :style="{
      height,
    }"
  >
    <template v-if="!textOnly">
      <image
        v-if="image"
        class="atom-empty--img"
        :src="image"
        :style="{
          width: imgWidth,
          height: imgHeight,
        }"
      />
      <AtomIcon
        v-else
        name="nodata"
        :size="iconSize"
        :color="iconColor"
        class="atom-empty--icon"
      />
    </template>
    <view
      v-if="tips"
      class="atom-empty--text"
      :style="{
        fontSize,
      }"
    >
      {{ tips }}
    </view>
  </view>
</template>

<script>
import {computed, getCurrentInstance} from 'vue';
import AtomIcon from '../icon';
import getConfig from '../../utils/getConfig';
import config from '../../config';
import './index.scss';
const TEXT = 'empty.text';
export default {
  name: 'Empty',
  components: {
    AtomIcon,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    fontSize: {
      type: String,
      default: '',
    },
    fontColor: {
      type: String,
      default: '',
    },
    textAlign: {
      type: String,
      default: 'bottom',
      validator(value) {
        return ['bottom', 'right'].includes(value);
      },
    },
    textOnly: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    imgWidth: {
      type: String,
      default: '',
    },
    imgHeight: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const $atomUIConfig =
      getCurrentInstance()?.appContext.config.globalProperties.$atomUIConfig;
    const defaultConfig = getConfig(config, TEXT);
    const customConfig = getConfig($atomUIConfig, TEXT);
    const tips = computed(() => props.text || customConfig || defaultConfig);

    return {tips};
  },
};
</script>
