export default {
  image: {
    cdn: {
      domain: '',
      enableRule: false,
      // 七牛云 rule 示例
      rule: 'imageMogr2/auto-orient/thumbnail/!{w}x{h}r/gravity/Center/crop/{w}x{h}',
      width: null,
      height: null,
    },
    error: {
      def: 'data:image/png;base64,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',
      full: false,
      width: 40,
      height: 40,
    },
  },
  empty: {
    text: '暂无数据',
  },
  loadingView: {
    text: '正在加载...',
  },
  list: {
    paginationMode: 'server', // server or client
    pageSize: null,
    loadingText: '加载中',
    errorText: '加载失败',
    nodataText: '暂无数据',
    field: {
      pageSize: 'pageSize',
      pageNo: 'p',
      result: 'list',
    },
  },
  datepicker: {
    // value 输入输出格式，必须是 YYYY/MM/DD 或 YYYY-MM-DD
    format: 'YYYY-MM-DD',
    weekNames: [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ],
    names: {
      year: '年',
      month: '月',
      date: '日',
    },
    tags: {
      today: '今天',
      tomorrow: '明天',
    },
  },
};
