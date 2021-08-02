<template>
  <view class="atom-table">
    <view
      class="atom-table--inner"
      :style="{
        'grid-template-columns': columnsWidth,
      }"
    >
      <template v-for="(th, h) in columns" :key="h">
        <view
          class="atom-table--th"
          :style="{
            textAlign: th.align,
            whiteSpace,
          }"
        >
          {{ th.title }}
        </view>
      </template>

      <template v-for="(td, d) in data" :key="d">
        <template v-for="(th, h) in columns" :key="h">
          <view
            class="atom-table--td"
            :style="{
              textAlign: th.align || 'left',
              whiteSpace,
            }"
          >
            <slot :name="th.name" :item="td" :index="d"></slot>
          </view>
        </template>
      </template>
    </view>
  </view>
</template>

<script>
import {computed} from 'vue';
import './index.scss';
export default {
  name: 'Table',
  props: {
    /**
     * @example
     * [
     *  {
     *    title: '微信昵称',
     *    name: 'nickname',
     *    width: '210rpx', // grid-template-columns 能识别的值
     *    align: 'left', // 可选项
     *  }
     * ]
     */
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    whiteSpace: {
      type: String,
      default: 'nowrap',
    },
  },
  setup(props) {
    const columnsWidth = computed(() => {
      const def = props.whiteSpace === 'nowrap' ? 'min-content' : 'auto';
      return props.columns.map(({width}) => width || def).join(' ');
    });

    return {columnsWidth};
  },
};
</script>
