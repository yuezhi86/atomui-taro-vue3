<template>
  <view class="atom-checkbox-group">
    <slot></slot>
  </view>
</template>

<script>
import {ref, reactive, provide} from 'vue';
import './index.scss';
export default {
  name: 'CheckboxGroup',
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: '',
    },
    type: {
      type: String,
      default: 'checkbox',
      validator(value) {
        return ['checkbox', 'radio'].includes(value);
      },
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
  setup(props, {emit}) {
    const childRefs = new Map();
    const isRadio = props.type === 'radio';
    const result = new Map();

    provide('type', ref(props.type));
    provide('size', ref(props.size));
    provide('disabled', ref(props.disabled));
    provide('optional', ref(props.optional));
    provide('addRefs', (name, childRef) => {
      childRefs.set(name, childRef);
    });
    provide('onClick', (value, checked) => {
      if (checked) {
        if (isRadio) {
          result.clear();
          childRefs.forEach((item, key) => {
            if (key !== value) {
              item.ctx.setChecked(false);
            }
          });
        }

        result.set(value, checked);
      } else {
        result.delete(value);
      }

      let response = [...result.keys()];

      if (isRadio) {
        response = response.length ? response[0] : '';
      }

      emit('update:modelValue', response);
      emit('change', response);
    });
  },
};
</script>
