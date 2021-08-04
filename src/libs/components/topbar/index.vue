<template>
  <view
    :id="id"
    class="atom-topbar"
    :class="{
      'atom-topbar--toggle': toggle,
      'atom-topbar--theme-def': isDef,
      'atom-topbar--theme-plain': !isDef,
      'atom-topbar--show-back': showBack,
    }"
    :style="{
      paddingTop: `${top}px`,
      backgroundColor: bgColor,
    }"
  >
    <view
      class="atom-topbar--inner"
      :style="{
        height,
      }"
    >
      <view
        v-if="showBack"
        class="atom-topbar--back"
        @tap="pageBack"
        @click="pageBack"
      >
        <AtomIcon
          name="arrow-left"
          :size="isDef ? '17px' : '15px'"
          :color="arrowColor"
          class="atom-topbar--icon"
        />
      </view>
      <view class="atom-topbar--title">
        <view
          v-if="title"
          class="atom-topbar--title-text"
          :class="{
            'atom-topbar--title--left': titleAlign === 'left',
          }"
          :style="{
            color: fontColor,
          }"
        >
          {{ title }}
        </view>
      </view>
      <slot name="title"></slot>
    </view>
    <slot></slot>
  </view>
</template>

<script>
import {ref, computed, watch, inject, defineComponent, onMounted} from 'vue';
import Taro, {eventCenter, getCurrentInstance} from '@tarojs/taro';
import AtomIcon from '../icon/index.vue';
import './index.scss';
export default defineComponent({
  name: 'Topbar',
  components: {
    AtomIcon,
  },
  props: {
    // 获取容器高度时必传，且整个项目不能重复
    idName: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    titleAlign: {
      type: String,
      default: 'center',
      validator(value) {
        return ['center', 'left'].includes(value);
      },
    },
    theme: {
      type: String,
      default: 'def',
      validator(value) {
        return ['def', 'plain'].includes(value);
      },
    },
    bgColor: {
      type: String,
      default: '',
    },
    fontColor: {
      type: String,
      default: '',
    },
    backColor: {
      type: String,
      default: 'auto',
      validator(value) {
        // auto 是根据 theme 决定颜色的
        return ['auto', 'block', 'white'].includes(value);
      },
    },
    height: {
      type: String,
      default: '88rpx',
    },
    // theme 为 plain 时，可以控制系统控件样式
    toggle: {
      type: Boolean,
      default: false,
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    delta: {
      type: Number,
      default: 1,
    },
  },
  emits: ['ready', 'getHeight'],
  setup(props, {emit}) {
    const instance = getCurrentInstance();
    const id = ref('');
    const top = ref(20);
    const setPaddingTop = inject('setPaddingTop');
    const isDef = computed(() => props.theme === 'def');
    const arrowColor = computed(() => {
      if (!isDef.value && props.toggle) return '#000';
      if (props.backColor === 'block') return '#000';
      if (props.backColor === 'white') return '#fff';
      return isDef.value ? '#000' : '#fff';
    });

    watch(
      () => props.toggle,
      (newVal) => {
        toggleTheme(newVal);
      }
    );

    function toggleTheme(val) {
      if (isDef.value) return;
      Taro.setNavigationBarColor({
        frontColor: val ? '#000000' : '#ffffff',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn',
        },
      });
    }

    id.value = props.idName
      ? props.idName
      : 'topbar_' + instance.page.__wxWebviewId__;

    Taro.getSystemInfo().then(({safeArea, statusBarHeight}) => {
      const _top = safeArea.top ? safeArea.top : statusBarHeight;
      top.value = _top;
      const data = {
        top: _top,
        height: props.height,
      };
      setPaddingTop && setPaddingTop(data);
      emit('ready', data);
    });
    toggleTheme(props.toggle);

    onMounted(() => {
      if (!id.value || !setPaddingTop) return;
      const onReadyEventId = instance.router.onReady;
      eventCenter.once(onReadyEventId, () => {
        Taro.createSelectorQuery()
          .select(`#${id.value}`)
          .boundingClientRect()
          .exec((e) => {
            if (e && e[0]) {
              const {height} = e[0];
              emit('getHeight', height);
            }
          });
      });
    });

    return {
      id,
      top,
      isDef,
      arrowColor,
      setPaddingTop,
      pageBack() {
        Taro.navigateBack({
          delta: props.delta,
        });
      },
    };
  },
});
</script>
