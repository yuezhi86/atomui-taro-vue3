export default {
  onShow() {
    this.$refs.list && this.$refs.list.onShow();
  },
  onReachBottom() {
    this.$refs.list && this.$refs.list.nextPage();
  },
  onPullDownRefresh() {
    this.$refs.list && this.$refs.list.onPullDownRefresh();
  },
};
