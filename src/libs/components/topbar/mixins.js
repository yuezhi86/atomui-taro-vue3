export default {
  data() {
    return {
      topbarToggle: false,
    };
  },
  onPageScroll({scrollTop}) {
    if (scrollTop >= 150) {
      if (!this.topbarToggle) {
        this.topbarToggle = true;
      }
    } else {
      if (this.topbarToggle) {
        this.topbarToggle = false;
      }
    }
  },
};
