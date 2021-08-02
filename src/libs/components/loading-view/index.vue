<template>
  <view
    class="atom-loading-view"
    :class="{
      'atom-loading-view--page': isPage,
    }"
  >
    <slot v-if="show"></slot>

    <view v-else class="atom-loading-view--loading">
      <Loading :size="loadingSize" style="margin-bottom: 10px" />
      <text class="atom-loading-view--text">{{ tips }}</text>
    </view>
  </view>
</template>

<script>
import {computed, getCurrentInstance} from 'vue';
import Loading from '../loading/index.vue';
import config from '../../config';
import getConfig from '../../utils/getConfig';
import './index.scss';
const TEXT = 'loadingView.text';
export default {
  name: 'LoadingView',
  components: {
    Loading,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
    isPage: {
      type: Boolean,
      default: true,
    },
    loadingSize: {
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
