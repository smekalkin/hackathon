<template>
  <label v-if="label" class="d-block mb-2 fw-bold">{{ label }}</label>
  <MultiSelect
    v-model="service[field]"
    :options="options"
    :optionValue="optionValue || 'id'"
    :optionLabel="optionLabel || 'name'"
    :optionGroupLabel="optionGroupLabel"
    :optionGroupChildren="optionGroupChildren"
    :class="service.errors && service.errors[field] ? 'p-invalid is-invalid w-100' : 'w-100'"
    :disabled="disabled"
    :display="displayChip"
  >
    <template #optiongroup="data">
      <slot name="optiongroup" :data="data"></slot>
    </template>
    <template #option="data">
      <div class="d-flex justify-content-between w-100">
        <div class="d-flex">
          <slot name="left" :data="data"></slot>
          <div>{{ data.option.name }}</div>
        </div>
        <div>
          <GoBtn
            :service="data.option"
            @load="onLoad"
            :actions="['delete', { action: 'update', to: false, onClick: onClickGoBtnUpdate, load: false }]"
          />
        </div>
      </div>
    </template>
    <template #chip="data">
      <slot name="chip" :data="data"></slot>
    </template>
    <template #content="data">
      <slot name="content" :data="data"></slot>
    </template>
    <template #footer>
      <Button
        class="p-button-text w-100"
        icon="fa-solid fa-plus"
        iconPos="right"
        :label="$t('Add')"
        @click="onClickDialog"
        aria:haspopup="true"
        aria-controls="overlay_panel"
      />
    </template>
  </MultiSelect>
  <Dialog :header="header" v-model:visible="visibleDialogCreate">
    <slot name="dialog"></slot>
  </Dialog>
  <Dialog :header="headerEdit" v-model:visible="visibleDialogUpdate">
    <Form :service="updateService" :actions="false" @submit.prevent="onSubmitUpdate">
      <slot name="leftEdit" :data="updateService"></slot>
      <FormField :service="updateService" field="name" />
      <slot name="rightEdit" :data="updateService"></slot>
      <div class="mt-3">
        <Button :label="$t('Cancel')" icon="fa-solid fa-xmark" @click="visibleDialogUpdate = false" class="p-button-text" />
        <Button type="submit" :label="$t('Save')" icon="fa-solid fa-check" />
      </div>
    </Form>
  </Dialog>
</template>

<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Form from './Form.vue';
import FormField from './FormField.vue';
import MultiSelect from 'primevue/multiselect';
import GoBtn from '../GoBtn.vue';

export default {
  components: {
    Button,
    Dialog,
    Form,
    FormField,
    MultiSelect,
    GoBtn,
  },
  props: {
    service: Object,
    optionService: Object,
    field: String,
    label: String,
    header: String,
    headerEdit: String,
    options: Array,
    visibleDialogCreate: Boolean,
    displayChip: String,
  },
  data() {
    return {
      visibleDialogUpdate: false,
      updateService: [],
    };
  },
  emits: ['update:options'],
  async created() {
    let options = await this.optionService.collection(await this.optionService.allList());
    this.$emit('update:options', options);
  },
  methods: {
    async onSubmitUpdate() {
      if (await this.updateService.save()) {
        this.visibleDialogUpdate = false;
      }
    },
    onClickDialog() {
      this.$emit('open');
    },
    onClickGoBtnUpdate(data) {
      this.updateService = data
      this.visibleDialogUpdate = true;
    },
    onClickSave(data) {
      if (data.save()) {
        data._edit = false;
      }
    },
    async onLoad() {
      let options = await this.optionService.collection(await this.optionService.allList());
      this.$emit('update:options', options);

      if (this.service[this.field]) {
        for (let i = this.service[this.field].length; i--; ) {
          let cont = false;

          for (let option of options) {
            if (option.id === this.service[this.field][i]) {
              cont = true;
              break;
            }
          }

          if (cont) {
            continue;
          }

          this.service[this.field].splice(i, 1);
        }
      }
    },
  },
};
</script>
