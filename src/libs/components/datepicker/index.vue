<template>
  <picker
    mode="multiSelector"
    range-key="label"
    :value="value"
    :range="range"
    :disabled="disabled"
    @change="onChange"
    @columnchange="onColumnChange"
  >
    <view
      class="atom-datepicker"
      :class="{
        'atom-datepicker--placeholder': !label,
      }"
    >
      <text class="atom-datepicker--value">
        {{ labelText || placeholder }}
      </text>
      <AtomIcon
        v-if="showIcon"
        :name="iconParams.name"
        :size="iconParams.size"
        :color="iconParams.color"
        class="atom-datepicker--icon"
      />
    </view>
  </picker>
</template>

<script>
import {ref, watch, computed, getCurrentInstance} from 'vue';
import {getDaysInMonth, formatDate, prefixZero} from '../../utils/dateUtils';
import getConfig from '../../utils/getConfig';
import config from '../../config';
import AtomIcon from '../icon';
import './index.scss';

const TAGS = 'datepicker.tags';
const FORMAT = 'datepicker.format';
const NAMES = 'datepicker.names';
const WEEK_NAMES = 'datepicker.weekNames';
export default {
  name: 'Datepicker',
  components: {
    AtomIcon,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    // 开始默认今天
    start: {
      type: [String, Date],
      default: '',
    },
    // 结束默认两年后12月31日
    end: {
      type: [String, Date],
      default: '',
    },
    // 格式化时期显示，不会改变输入和输出值的格式
    formatLabel: {
      type: Function,
      default: null,
    },
    // value 输入输出格式，必须是 YYYY/MM/DD 或 YYYY-MM-DD
    format: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    tagType: {
      type: String,
      default: 'none',
      validator(value) {
        return ['none', 'label', 'week', 'auto'].includes(value);
      },
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    iconParams: {
      type: Object,
      default() {
        return {
          name: 'arrow-right',
          size: '',
          color: '',
        };
      },
    },
  },
  emits: ['update:modelValue', 'confirm'],
  setup(props, {emit}) {
    const range = ref([]);
    const label = ref('');
    const labelValues = ref([]);
    const value = ref([0, 0, 0]);

    const $atomUIConfig =
      getCurrentInstance()?.appContext.config.globalProperties.$atomUIConfig;
    const weekNamesConfig =
      getConfig($atomUIConfig, WEEK_NAMES) || getConfig(config, WEEK_NAMES);
    const namesConfig =
      getConfig($atomUIConfig, NAMES) || getConfig(config, NAMES);
    const tagConfig = getConfig($atomUIConfig, TAGS) || getConfig(config, TAGS);
    const formatConfig =
      props.format ||
      getConfig($atomUIConfig, FORMAT) ||
      getConfig(config, FORMAT);

    const initData = init(props, {
      weekNamesConfig,
      namesConfig,
    });

    labelValues.value = initData.labelValues;
    value.value = initData.value;
    label.value = initData.label;
    range.value = initData.range;

    const labelText = computed(() => {
      let text = props.formatLabel
        ? props.formatLabel(...labelValues.value)
        : label.value;
      if (props.tagType !== 'none') {
        text += getTag(label.value, props.tagType, tagConfig, weekNamesConfig);
      }
      return text;
    });
    const iconConfig = computed(() => {
      return Object.assign(
        {
          name: 'arrow-right',
          color: '',
          size: '',
        },
        props.iconParams
      );
    });

    watch(
      () => props.modelValue,
      (newVal) => {
        if (!newVal) {
          value.value = [0, 0, 0];
          label.value = '';
        }
      }
    );

    const onColumnChange = ({detail: {column, value: index}}) => {
      const now = parseDate(new Date());
      const _range = range.value;
      let _value = [...value.value];
      let year, month;

      _value[column] = index;

      // 年
      if (column === 0) {
        year = _range[0][index].value;

        let _labelValues = [year, 1, 1];

        if (now.year === year) {
          _range[1] = getMonthData(
            `${year}-${now.month}-${now.date}`,
            namesConfig.month
          );
          _range[2] = getDateData(
            year,
            now.month,
            weekNamesConfig,
            namesConfig.date
          );
          _labelValues = [year, now.month, now.date];
        } else {
          _range[1] = getMonthData(`${year}-01-01`, namesConfig.month);
          _range[2] = getDateData(year, 1, weekNamesConfig, namesConfig.date);
        }

        _value = [index, 0, 0];
        labelValues.value = _labelValues;
        range.value = _range;
        value.value = _value;

        return;
      }

      // 月
      if (column === 1) {
        year = labelValues.value[0];
        month = _range[1][index].value;

        labelValues.value = [year, month, 1];
        _range[2] = getDateData(year, month, weekNamesConfig, namesConfig.date);
        _value[2] = 0;

        if (now.year === year && now.month === month) {
          labelValues.value = [year, month, now.date];
        }

        range.value = _range;
        value.value = _value;

        return;
      }

      const date = _range[2][index].value;

      labelValues.value = [labelValues.value[0], labelValues.value[1], date];
      value.value = _value;
    };
    const onChange = ({detail: {value: index}}) => {
      const [_year, _month, _date] = index;
      const [yearList, monthList, dateList] = range.value;
      const year = yearList[_year].value;
      const month = monthList[_month].value;
      const date = dateList[_date].value;
      const inst = new Date(year, month - 1, date, 0, 0, 0, 0);
      const week = inst.getDay();

      const _label = formatDate(inst, formatConfig);

      labelValues.value = [year, month, date];
      label.value = _label;
      value.value = index;
      range.value = [
        yearList,
        monthList,
        getDateData(year, month, weekNamesConfig, namesConfig.date),
      ];

      emit('update:modelValue', _label);
      emit('confirm', {
        index,
        value: _label,
        label: labelText.value,
        oldValue: props.modelValue,
        raw: [year, month, date],
        day: week,
        week: weekNamesConfig[week],
      });
    };

    return {
      range,
      value,
      label,
      labelText,
      iconConfig,
      onColumnChange,
      onChange,
    };
  },
};

function init(props, context) {
  const defEnd = new Date(
    new Date().setFullYear(new Date().getFullYear() + 2, 11, 31)
  );
  const start = props.start ? parseDate(props.start) : parseDate(new Date());
  const end = props.end ? parseDate(props.end) : parseDate(defEnd);
  const yearList = getYearData(start.year, end.year, context.namesConfig.year);
  const monthList = getMonthData(props.modelValue, context.namesConfig.month);
  let dateList = getDateData(
    start.year,
    start.month,
    context.weekNamesConfig,
    context.namesConfig.date
  );
  let value = [0, 0, 0];

  // 假设 value 没有值，或 value 超出日期范围
  let labelValues = [start.year, start.month, start.date];

  if (props.modelValue) {
    const modelValue = parseDate(props.modelValue);
    const valueTimestamp = getTimestamp(modelValue);
    const startTimestamp = getTimestamp(start);
    const endTimestamp = getTimestamp(end);

    // value 在有效范围内
    if (valueTimestamp > startTimestamp && valueTimestamp < endTimestamp) {
      dateList = getDateData(
        modelValue.year,
        modelValue.month,
        context.weekNamesConfig,
        context.namesConfig.date
      );

      const year = getIndex(yearList, modelValue.year);
      const month = getIndex(monthList, modelValue.month);
      const date = getIndex(dateList, modelValue.date);

      value = [year, month, date];
      labelValues = [modelValue.year, modelValue.month, modelValue.date];
    }
  }

  return {
    labelValues,
    value,
    label: props.modelValue,
    range: [yearList, monthList, dateList],
  };
}
function getYearData(startYear, endYear, suffix = '') {
  const ret = [];
  let i = startYear;

  for (i; i <= endYear; i++) {
    ret.push({
      value: i,
      label: `${i}${suffix}`,
    });
  }

  return ret;
}
function getMonthData(value, suffix = '') {
  const now = parseDate(new Date());
  const end = parseDate(value);
  const ret = [];
  let i = now.month;

  if (end) {
    i = end.year <= now.year ? now.month : 1;
  }

  for (i; i <= 12; i++) {
    ret.push({
      value: i,
      label: `${prefixZero(i)}${suffix}`,
    });
  }

  return ret;
}
function getDateData(year, month, weekNames, suffix = '') {
  const now = parseDate(new Date());
  const days = getDaysInMonth(year, month);
  const ret = [];
  let i;

  if (year === now.year && month === now.month) {
    i = now.date;
  } else {
    i = 1;
  }

  let week = new Date(year, month - 1, i, 0, 0, 0, 0).getDay();

  for (i; i <= days; i++) {
    let j = week % 7;

    ret.push({
      value: i,
      label: `${prefixZero(i)}${suffix} ${weekNames[j]}`,
    });

    week++;
  }

  return ret;
}
function parseDate(value) {
  if (!value) return value;

  const date =
    typeof value === 'string'
      ? new Date(formatDate(value, 'YYYY/MM/DD'))
      : value;

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
}
function getIndex(list, key) {
  return list.findIndex(({value}) => value === key);
}
function getTimestamp({year, month, date}) {
  return new Date(year, month, date, 0, 0, 0, 0).valueOf();
}
function getTag(value, tagType, tagConfig, weekConfig) {
  const date = new Date(formatDate(value, 'YYYY/MM/DD'));
  const now = new Date();
  let tag = '';

  if (tagType === 'week' || tagType === 'auto') {
    tag = ` ${weekConfig[date.getDay()]}`;
  }

  if (
    (tagType === 'label' || tagType === 'auto') &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  ) {
    switch (date.getDate()) {
      case now.getDate():
        tag = ` ${tagConfig.today}`;
        break;
      case now.getDate() + 1:
        tag = ` ${tagConfig.tomorrow}`;
    }
  }

  return tag;
}
</script>
