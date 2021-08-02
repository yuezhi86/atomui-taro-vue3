<template>
  <view
    class="atom-checkbox"
    :class="{
      'atom-checkbox--radio': isRadio,
      'atom-checkbox--disabled': groupDisabled || disabled,
    }"
    @tap="onClick"
    @click="onClick"
  >
    <view
      class="atom-checkbox--icon"
      :class="{
        'atom-checkbox--checked': checked,
      }"
    />
    <view v-if="label || hasSlots" class="atom-checkbox--label">
      <slot>{{ label }}</slot>
    </view>
  </view>
</template>

<script>
import {ref, inject, nextTick, getCurrentInstance, onMounted} from 'vue';
import './index.scss';
export default {
  name: 'Checkbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'checkbox',
      validator(value) {
        return ['checkbox', 'radio'].includes(value);
      },
    },
    label: {
      type: [String, Number],
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // radio 类型时，再次点击选中项，可以取消选中
    optional: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, {emit, slots}) {
    const inst = getCurrentInstance();
    const addRefs = inject('addRefs');
    const groupType = inject('type');
    const groupDisabled = inject('disabled');
    const groupOptional = inject('optional');
    const groupSize = inject('size');
    const groupOnClick = inject('onClick');
    const isRadio = ref(groupType.value === 'radio' || props.type === 'radio');
    const checked = ref(false);
    const hasSlots = ref(true);

    const setChecked = (value) => {
      checked.value = value;
    };
    const onClick = (e) => {
      e.stopPropagation();
      if (groupDisabled.value || props.disabled) return;

      let value;

      if (isRadio.value) {
        if (checked.value && !(groupOptional.value || props.optional)) return;
        value = !checked.value;
      } else {
        value = !checked.value;
      }

      checked.value = value;

      if (groupOnClick) {
        groupOnClick(props.value, value);
      } else {
        emit('update:modelValue', value);
      }
    };

    addRefs && addRefs(props.value, inst);

    onMounted(() => {
      nextTick(() => {
        hasSlots.value = slots.default && slots.default().length;
      });
    });

    return {
      checked,
      groupDisabled,
      groupSize,
      isRadio,
      hasSlots,
      onClick,
      setChecked,
    };
  },
};
</script>
