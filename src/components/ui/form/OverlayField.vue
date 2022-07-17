<template>
  <label v-if="label" class="fw-bold mb-2">{{ label }}</label>
  <Button
    type="button"
    :class="[classBtn ? classBtn : 'p-button-outlined p-button-secondary text-start w-100 button-overplay-panel']"
    icon="fa-solid fa-angle-down"
    iconPos="right"
    :label="selectedName"
    @click="toggle"
    aria:haspopup="true"
    aria-controls="overlay_panel"
  />

  <OverlayPanel ref="op" appendTo="body" class="col-md-3" :showCloseIcon="false" id="overlay_panel">
    <ul>
      <li
        v-for="(option, i) in options"
        :key="i"
        :class="
          'cursor-pointer d-flex align-items-center justify-content-between' +
          [!option._edit ? ' overplay-panel-field' : '']
        "
      >
        <template v-if="option._edit">
          <div class="d-flex flex-column-reverse">
            <slot name="leftEdit" :data="option"></slot>
            <FormField
              @btnClick="onClickSave(option)"
              @keyup.enter="onClickSave(option)"
              :service="option"
              field="name"
              class="edit-p-field ml-2 w-75 py-1"
              :appendBtn="true"
              iconBtn="fa-solid fa-check"
              classBtn="p-button-success"
              margin="0"
            />
          </div>
        </template>
        <div v-else @click="onClick(option)" class="w-75 p-3">
          <div class="d-flex">
            <slot name="left" :data="option"></slot>
            <div class="ms-1">{{ option.name }}</div>
          </div>
        </div>
        <div class="d-flex">
          <GoBtn
            :service="option"
            @load="onLoad"
            :actions="[
              { label: $t('Edit'), icon: 'fas fa-cog', to: false, onClick: onClickGoBtnEdit, load: false },
              'delete',
              { action: 'update', to: false, onClick: onClickGoBtnUpdate, load: false },
            ]"
          />
        </div>
      </li>
    </ul>
    <Button
      class="p-button-text w-100"
      icon="fa-solid fa-plus"
      iconPos="right"
      :label="$t('Add')"
      @click="onClickDialog"
      aria:haspopup="true"
      aria-controls="overlay_panel"
    />
  </OverlayPanel>
  <Dialog :header="header" v-model:visible="visibleDialog">
    <slot name="dialog"></slot>
  </Dialog>
</template>

<script>
import Button from 'primevue/button';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import OverlayPanel from 'primevue/overlaypanel';
import GoBtn from '../../../components/ui/GoBtn.vue';
import FormField from '../../../components/ui/form/FormField.vue';

export default {
  components: {
    Button,
    Column,
    Dialog,
    GoBtn,
    OverlayPanel,
    FormField,
  },
  props: {
    service: Object,
    optionService: Object,
    options: Array,
    class: String,
    field: String,
    label: String,
    header: String,
    classBtn: String,
    visibleDialog: Boolean,
  },
  data() {
    return {
      checkbox: [],
    };
  },
  emits: ['load', 'update:options', 'change'],
  computed: {
    selectedName() {
      if (this.service[this.field]) {
        for (let option of this.options) {
          if (option.id == this.service[this.field]) {
            return option.name;
          }
        }
      }
    },
  },
  async created() {
    let options = await this.optionService.collection(await this.optionService.allList());
    this.$emit('update:options', options);
  },
  methods: {
    toggle(event) {
      this.$refs.op.toggle(event);
    },
    onClickGoBtnEdit(option) {
      let routeName;

      for (let route of this.$router.getRoutes()) {
        if ('/' + this.optionService.basePath == route.path) {
          routeName = route.name;
        }
      }

      this.$router.push({
        name: routeName,
        query: { id: option.id },
      })

    },
    onClickGoBtnUpdate(option) {
      option._edit = true;
    },
    onClick(option) {
      this.service[this.field] = option.id;
      this.$emit('change', option.id);
      this.$refs.op.hide();
    },
    onClickSave(option) {
      if (option.save()) {
        option._edit = false;
      }
    },
    onClickDialog() {
      this.$emit('open');
    },
    async onLoad() {
      let options = await this.optionService.collection(await this.optionService.allList());
      this.$emit('update:options', options);
    },
  },
};
</script>
