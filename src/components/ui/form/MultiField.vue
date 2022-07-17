<template>
  <div v-for="(s, i) in service[group]" :key="i" :class="'row ' + this.class">
    <div class="col">
      <div class="row">
        <template v-for="(col, j) in columns" :key="j">
          <div
            v-if="getIsShow(col.isShow, service[group][i])"
            :class="vertical ? 'col-12' : 'col'"
            :style="
              vertical ? '' : (col.width ? 'max-width:' + col.width : 'width:' + Math.trunc(100 / columns.length)) + '%'
            "
          >
            <FormField
              :service="service[group][i]"
              :field="col.field"
              :label="col.label"
              :margin="margin"
              :type="col.type || null"
              :mask="col.mask"
              :slotChar="col.slotChar"
              :options="col.options"
              :optionValue="col.optionValue"
              :optionLabel="col.optionLabel"
              :falseValue="col.falseValue"
              :disabled="col.disabled"
              :step="col.step"
              :placeholder="col.placeholder"
              @change="$emit('change', $event)"
              @input="$emit('input', $event)"
            />
          </div>
        </template>
      </div>
    </div>
    <div :class="{ 'd-flex justify-content-center': vertical, 'd-flex align-items-center col-1': !vertical }">
      <Button
        v-if="i == 0"
        @click="addInput"
        icon="fa-solid fa-plus"
        class="p-button-rounded p-button-text"
        style="width: 2em; height: 2em"
      />
      <Button
        v-else
        @click="removeInput(i)"
        icon="fa-solid fa-xmark"
        class="p-button-rounded p-button-danger p-button-text"
        style="width: 2em; height: 2em"
      />
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import FormField from './FormField.vue';

export default {
  components: {
    Button,
    FormField,
  },
  props: {
    service: Object,
    columns: Array,
    group: String,
    vertical: Boolean,
    class: String,
    margin: String,
  },
  emits: ['change', 'input'],
  created() {
    this.checkGroup();
  },
  watch: {
    // следим за изменением флага, т.к. почему-то created этого компонента срабатывает быстрее, чем created родительского
    // поэтому проверяем еще раз после загрузки данных, о которых сообщает данный флаг
    'service.isNewRecord': 'checkGroup',
  },
  methods: {
    checkGroup() {
      if (!this.service[this.group] || this.service[this.group].length == 0) {
        this.service[this.group] = [];
        this.addInput();
      }
    },
    addInput: function () {
      let el = {};
      for (let i in this.columns) {
        el[this.columns[i].field] = null;
      }
      this.service[this.group].push(el);
    },
    removeInput(index) {
      this.service[this.group].splice(index, 1);
    },
    getIsShow(isShow, item) {
      if (isShow === undefined) {
        return true;
      }

      if (isShow) {
        if (typeof isShow === 'function') {
          return isShow(item);
        }

        return isShow;
      }

      return false;
    },
  },
};
</script>
