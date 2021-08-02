<template>
  <view class="list-view">
    <slot v-if="!nodata"></slot>
    <view
      v-if="loading"
      class="list-view--loading"
      :style="{
        backgroundColor: loadingBgColor,
        height: loading || nodata ? minHeight : '',
      }"
    >
      <view>
        <Loading size="56rpx" style="margin-bottom: 5px" />
        <view v-if="loadingText" class="list-view--loading-text">
          {{ loadingText }}
        </view>
      </view>
    </view>
    <Empty v-if="nodata" :height="minHeight" :text="nodataText" />
  </view>
</template>

<script>
import Loading from '../loading';
import Empty from '../empty';
import './index.scss';
export default {
  components: {
    Loading,
    Empty,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    minHeight: {
      type: String,
      default: '200rpx',
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    loadingBgColor: {
      type: String,
      default: '',
    },
    nodataText: {
      type: String,
      default: '',
    },
  },
  computed: {
    nodata({loading, data}) {
      return !loading && !data.length;
    },
  },
};
</script>
