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
      minHeight: `${top + 44}px`,
      backgroundColor: bgColor,
    }"
  >
    <view
      v-if="showBack"
      class="atom-topbar--back"
      :style="{
        top: `${top + 6}px`,
      }"
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
      <slot></slot>
    </view>
  </view>
</template>

<script>
import {inject} from 'vue';
import Taro, {eventCenter, getCurrentInstance} from '@tarojs/taro';
import AtomIcon from '../icon/index.vue';
import './index.scss';
export default {
  name: 'YTopbar',
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
  emits: ['ready'],
  setup(props) {
    const setPaddingTop = inject('setPaddingTop');
    return {
      setPaddingTop,
    };
  },
  data() {
    return {
      id: '',
      top: 20,
    };
  },
  computed: {
    arrowColor({toggle, isDef, backColor}) {
      if (!isDef && toggle) return '#000';
      if (backColor === 'block') return '#000';
      if (backColor === 'white') return '#fff';
      return isDef ? '#000' : '#fff';
    },
    isDef({theme}) {
      return theme === 'def';
    },
  },
  watch: {
    toggle(val) {
      this.toggleTheme(val);
    },
  },
  created() {
    this.$instance = getCurrentInstance();
    this.id = this.idName
      ? this.idName
      : 'topbar_' + this.$instance.page.__wxWebviewId__;

    Taro.getSystemInfo().then(({safeArea, statusBarHeight}) => {
      const top = safeArea.top ? safeArea.top : statusBarHeight;
      this.top = top;
      this.$emit('ready', {
        top,
        height: top + 44,
      });
    });
    this.toggleTheme(this.toggle);
  },
  mounted() {
    if (!this.id || !this.setPaddingTop) return;
    const onReadyEventId = this.$instance.router.onReady;
    eventCenter.once(onReadyEventId, () => {
      Taro.createSelectorQuery()
        .select(`#${this.id}`)
        .boundingClientRect()
        .exec((e) => {
          if (e && e[0]) {
            const {height} = e[0];
            this.setPaddingTop(height);
          }
        });
    });
  },
  methods: {
    pageBack(): void {
      Taro.navigateBack({
        delta: this.delta,
      });
    },
    toggleTheme(val) {
      if (this.isDef) return;
      Taro.setNavigationBarColor({
        frontColor: val ? '#000000' : '#ffffff',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn',
        },
      });
    },
  },
};
</script>
