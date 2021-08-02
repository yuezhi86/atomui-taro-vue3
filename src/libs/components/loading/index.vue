<template>
  <view class="atom-loading">
    <image
      v-if="image"
      class="atom-loading--image"
      :src="image"
      :style="{
        width: size,
        height: size,
      }"
    />
    <AtomIcon
      v-else
      name="loading"
      :size="size"
      :color="color"
      class="atom-loading--icon"
    />
  </view>
</template>

<script>
import AtomIcon from '../icon';
import './index.scss';
export default {
  name: 'Loading',
  components: {
    AtomIcon,
  },
  props: {
    size: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
};
</script>
