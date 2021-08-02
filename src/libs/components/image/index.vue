<template>
  <view
    class="atom-image"
    :class="{
      'atom-image--error': error,
      'atom-image-loading': loading,
    }"
  >
    <image
      class="atom-image--img"
      :style="{
        width,
        height,
      }"
      :src="url"
      :mode="imgMode"
      :webp="webp"
      :lazy-load="lazyLoad"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="onLoad"
      @error="onError"
    />
  </view>
</template>

<script>
import {ref, reactive, computed, watch, getCurrentInstance} from 'vue';
import getConfig from '../../utils/getConfig';
import config from '../../config';
import './index.scss';
const CDN = 'image.cdn';
const ERROR = 'image.error';
export default {
  name: 'Image',
  props: {
    src: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'aspectFill',
    },
    lazyLoad: {
      type: Boolean,
      default: true,
    },
    webp: {
      type: Boolean,
      default: false,
    },
    showMenuByLongpress: {
      type: Boolean,
      default: false,
    },
    cdnParams: {
      type: Object,
      default() {
        return {};
      },
    },
    errorParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['load', 'error'],
  setup(props, {emit}) {
    const loading = ref(true);
    const error = ref(false);
    const imgMode = ref(props.mode);
    const imgSrc = ref('');

    const $atomUIConfig =
      getCurrentInstance()?.appContext.config.globalProperties.$atomUIConfig;
    const cdnOptions = computed(() => {
      return Object.assign(
        {...getConfig(config, CDN)},
        {...getConfig($atomUIConfig, CDN)},
        props.cdnParams
      );
    });
    const errorOptions = computed(() => {
      return Object.assign(
        {...getConfig(config, ERROR)},
        {
          // 自定义默认图
          img: '',
        },
        {...getConfig($atomUIConfig, ERROR)},
        props.errorParams
      );
    });
    const width = computed(() => widthOrHeight('width'));
    const height = computed(() => widthOrHeight('height'));
    const url = computed(() => {
      return error.value
        ? errorOptions.value.img || errorOptions.value.def
        : imgSrc.value;
    });

    const onLoad = (e) => {
      if (error.value) return;
      error.value = false;
      loading.value = false;
      emit('load', e);
    };
    const onError = (e) => {
      if (error.value) return;
      error.value = true;
      loading.value = false;
      emit('error', e);

      if (errorOptions.value.full) {
        imgMode.value = 'scaleToFill';
      }
    };
    const setState = () => {
      if (!props.src) {
        error.value = true;
        return;
      }

      let src = props.src;

      const config = reactive(cdnOptions.value);
      if (config.enableRule) {
        const rule = cdnOptions.value.rule
          .replace(/{w}/g, config.width)
          .replace(/{h}/g, config.height);
        src = `${config.domain}/` + src + `?${rule}`;
      }

      imgSrc.value = src;
    };

    watch(
      () => props.src,
      () => {
        error.value = false;
        loading.value = false;
        setState();
      }
    );

    setState();

    function widthOrHeight(type) {
      if (error.value) {
        if (errorOptions.value.full) {
          return '100%';
        } else {
          return errorOptions.value[type] + 'px';
        }
      } else {
        return '100%';
      }
    }

    return {
      loading,
      error,
      imgMode,
      url,
      width,
      height,
      onLoad,
      onError,
    };
  },
};
</script>
