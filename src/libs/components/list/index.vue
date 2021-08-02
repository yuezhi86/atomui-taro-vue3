<template>
  <LoadingView
    class="atom-list"
    :class="{
      'atom-list--min': loading || error || nodata,
    }"
    :show="isReady || error"
    :is-page="isPage"
  >
    <slot :list-data="list"></slot>

    <view
      v-if="nodata || error"
      class="atom-list--nodata"
      @tap="onRefresh"
      @click="onRefresh"
    >
      <template v-if="showNodataImg">
        <image
          v-if="nodataImg"
          class="atom-list--nodata-img"
          :src="nodataImg"
        />
        <AtomIcon v-else name="nodata" class="atom-list--nodata-icon" />
      </template>
      <view>{{ error ? errorTips : nodataTips }}</view>
    </view>

    <view v-if="isReady && !nodata" v-show="loading" class="atom-list--status">
      <view class="atom-list--loading">
        <Loading class="atom-list--loading-icon" size="40rpx" />
        {{ loadingTips }}
      </view>
    </view>
  </LoadingView>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
} from 'vue';
import {dequal} from 'dequal';
import cloneDeep from 'lodash/cloneDeep';
import Taro from '@tarojs/taro';
import getConfig from '../../utils/getConfig';
import config from '../../config';
import AtomIcon from '../icon';
import Loading from '../loading';
import LoadingView from '../loading-view';
import './index.scss';
const FIELD = 'list.field';
const PAGE_SIZE = 'list.pageSize';
const PAGINATION_MODE = 'list.paginationMode';
const LOADING_TEXT = 'list.loadingText';
const ERROR_TEXT = 'list.errorText';
const NODATA_TEXT = 'list.nodataText';
export default {
  components: {
    LoadingView,
    Loading,
    AtomIcon,
  },
  props: {
    apiFn: {
      type: Function,
      required: true,
    },
    resFormat: {
      type: Function,
      default: null,
    },
    query: {
      type: Object,
      default() {
        return {};
      },
    },
    pageSize: {
      type: Number,
      default: null,
    },
    isPage: {
      type: Boolean,
      default: true,
    },
    // server or client
    paginationMode: {
      type: String,
      default: '',
    },
    // 如果为 false 时，则所有触发数据请求的事件都暂时失效，
    // 如果从 false 变为 true 时，参数发生变化了，则会立即调用 refresh 方法，
    // 该参数一般在同一个页面上有多个实例时使用，且必须自行实现触底翻页，和下拉刷新实现
    keepAlive: {
      type: Boolean,
      default: true,
    },
    nodataText: {
      type: String,
      default: '',
    },
    showNodataImg: {
      type: Boolean,
      default: true,
    },
    onShowRefresh: {
      type: Boolean,
      default: true,
    },
    nodataImg: {
      type: String,
      default: '',
    },
    // 请求接口时的参数名称
    field: {
      type: Object,
      default() {
        return {
          pageSize: 'pageSize',
          pageNo: 'p',
          result: 'list',
        };
      },
    },
  },
  emits: ['render', 'alldata', 'ready', 'fail'],
  setup(props, {emit}) {
    const list = ref([]);
    const pageNo = ref(1);
    const loading = ref(true);
    const error = ref(false);
    const nodata = ref(false);
    const isReady = ref(false);
    const isLastPage = ref(false);

    let listAll = [];
    let oldPageSize;
    let oldApiFn;
    let oldQuery;

    const $atomUIConfig =
      getCurrentInstance()?.appContext.config.globalProperties.$atomUIConfig;
    const field = computed(() => {
      return Object.assign(
        {...getConfig(config, FIELD)},
        {...getConfig($atomUIConfig, FIELD)},
        props.field
      );
    });
    const pageSize = computed(() => {
      return (
        props.pageSize ||
        getConfig($atomUIConfig, PAGE_SIZE) ||
        getConfig(config, PAGE_SIZE)
      );
    });
    const fieldConfig = reactive(field.value);

    watch(
      () => props.apiFn,
      (newVal) => {
        if (newVal && isReady.value && props.keepAlive) {
          refresh();
        }
      }
    );
    watch(
      () => props.query,
      (newVal, oldVal) => {
        if (dequal(newVal, oldVal)) return;
        if (isReady.value && props.keepAlive) {
          listAll = [];
          list.value = [];
          pageNo.value = 1;
          isLastPage.value = false;
          nodata.value = false;
          error.value = false;
          fetchData();
        }
      }
    );
    watch(
      () => props.keepAlive,
      (newVal) => {
        if (newVal) {
          const pageSizeChanged = oldPageSize !== pageSize.value;
          const apiFnChanged = oldApiFn !== props.apiFn;
          const queryChanged = !dequal(oldQuery, props.query);

          if (
            isReady.value &&
            (pageSizeChanged || apiFnChanged || queryChanged)
          ) {
            refresh();
          }
        } else {
          oldPageSize = props.pageSize;
          oldApiFn = props.apiFn;
          oldQuery = cloneDeep(props.query);
        }
      }
    );

    onMounted(() => {
      Taro.nextTick(() => {
        oldPageSize = props.pageSize;
        oldApiFn = props.apiFn;
        oldQuery = cloneDeep(props.query);
        fetchData();
      });
    });

    function fetchData() {
      const fn = props.apiFn;
      const resFormat = props.resFormat;
      const isClient =
        (props.paginationMode ||
          getConfig($atomUIConfig, PAGINATION_MODE) ||
          getConfig(config, PAGINATION_MODE)) === 'client';
      const query = {
        ...props.query,
      };

      // 由服务端接口负责分页
      if (!isClient) {
        if (pageSize.value) query[fieldConfig.pageSize] = pageSize.value;
        query[fieldConfig.pageNo] = pageNo.value;
      }

      // 由客户端负责分页，第二次调用时执行
      if (isClient && listAll.length) {
        const newList = pageSize.value
          ? list.value.concat(
              listAll.slice(
                pageSize.value * (pageNo.value - 1),
                pageSize.value * pageNo.value
              )
            )
          : listAll;

        loading.value = false;
        list.value = newList;
        isLastPage.value = newList.length === listAll.length;

        Taro.hideLoading();
        Taro.stopPullDownRefresh();
        emit('render', {
          list: list.value,
          isLastPage: isLastPage.value,
        });

        return;
      }

      fn(query)
        .then((res) => {
          loading.value = false;
          error.value = false;

          let resData;
          try {
            resData = resFormat ? resFormat(res) : res;
          } catch (e) {
            resData = res;
          }

          if (!isClient) {
            resData = resData || {[fieldConfig.result]: []};
          }

          const result =
            (isClient ? resData : resData[fieldConfig.result]) || [];

          if (!isReady.value) {
            isReady.value = true;
            emit('ready', props.onShowRefresh);
          }

          const empty = !result.length;
          isLastPage.value = pageSize.value
            ? result.length < pageSize.value
            : empty;

          if (pageNo.value === 1 && empty) {
            nodata.value = true;
          }

          if (isClient) {
            listAll = result;
            list.value = pageSize.value
              ? listAll.slice(0, pageSize.value)
              : listAll;
          } else {
            list.value = [...list.value, ...result];
          }

          Taro.hideLoading();
          Taro.stopPullDownRefresh();
          emit('render', {
            list: list.value,
            isLastPage: isLastPage.value,
          });

          if (isClient) {
            emit('alldata', listAll);
          }
        })
        .catch((e) => {
          Taro.hideLoading();
          Taro.stopPullDownRefresh();
          error.value = true;
          emit('fail', e);
        });
    }
    function refresh(scrollToTop = true) {
      listAll = [];
      list.value = [];
      pageNo.value = 1;
      isLastPage.value = false;
      nodata.value = false;
      fetchData();
      if (scrollToTop) {
        Taro.pageScrollTo({
          scrollTop: 0,
        });
      }
    }

    return {
      list,
      nodata,
      loading,
      error,
      isReady,
      loadingTips:
        getConfig($atomUIConfig, LOADING_TEXT) ||
        getConfig(config, LOADING_TEXT),
      errorTips:
        getConfig($atomUIConfig, ERROR_TEXT) || getConfig(config, ERROR_TEXT),
      nodataTips:
        props.nodataText ||
        getConfig($atomUIConfig, NODATA_TEXT) ||
        getConfig(config, NODATA_TEXT),
      refresh,
      onShow: () => {
        if (isReady.value && props.onShowRefresh) refresh();
      },
      onRefresh: () => {
        if (error.value) fetchData();
      },
      nextPage: () => {
        if (!isReady.value || isLastPage.value) return;

        loading.value = true;
        pageNo.value = pageNo.value + 1;
        fetchData();
      },
      onPullDownRefresh: () => {
        Taro.showLoading({
          title: '加载中',
          mask: true,
        });
        refresh();
      },
    };
  },
};
</script>
