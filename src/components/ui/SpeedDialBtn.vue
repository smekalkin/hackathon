<template>
  <SpeedDial
    v-if="length > 0"
    :ref="(el) => (container = el)"
    :model="visibleModel"
    :direction="type === 'left' ? 'right' : 'left'"
    :showIcon="showIcon"
    @click="length > 1 ? () => {} : onClick(visibleModel[0])"
    :class="'custom-speeddial-' + (type || 'fixed')"
    :buttonClass="buttonClass"
    :rotateAnimation="false"
    :disabled="visibleModel[0].disabled"
  >
    <template #button>
      <Link
        :to="container.disabled || length > 1 ? false : visibleModel[0].to"
        :data="service"
        v-tooltip.left="tooltip"
        role="menuitem"
        @click="container.disabled ? () => {} : container.onClick($event)"
      >
        <Button
          type="button"
          :class="container.buttonClassName"
          :icon="container.iconClassName"
          :disabled="container.disabled"
          :label="label"
        />
      </Link>
    </template>
    <template #item="{ item }">
      <Link
        v-if="length > 1"
        :to="item.to"
        :data="service"
        v-tooltip.top="item.label"
        role="menuitem"
        class="p-speeddial-action"
        @click="onClick(item)"
      >
        <span :class="'p-speeddial-action-icon ' + item.icon"></span>
      </Link>
    </template>
  </SpeedDial>
</template>

<script>
import SpeedDial from 'primevue/speeddial';
import Button from 'primevue/button';
import Link from './Link.vue';

export default {
  components: { SpeedDial, Button, Link },
  props: {
    actions: Array | Function,
    service: Object,
    type: String,
    isSuccessToast: Boolean,
  },
  emits: ['load'],
  data() {
    return {
      container: {},
      confirmMessage: this.$t('Are you sure you want to proceed?'), // выносим в переменные, т.к. почему-то при втором обращении к компоненту $t не срабатывает если его использовать напрямую
      confirmHeader: this.$t('Confirmation'),
      visibleModel: [],
    };
  },
  computed: {
    model() {
      let model = typeof this.actions === 'function' ? this.actions(this.service) : this.actions;

      if (!model) {
        return model;
      }

      for (let i = model.length; i--; ) {
        let item = model[i];

        if (item === 'show' || item === 'create' || item === 'update' || item === 'save' || item === 'delete') {
          item = model[i] = { action: item };
        }

        if (item.action === 'show') {
          model[i].label = item.label || this.$t('Show');
          model[i].icon = item.icon || 'fa-regular fa-eye';
          model[i].to = item.to === undefined ? (service) => this.$str.topPath() + '/' + service.id : item.to;
        } else if (item.action === 'create') {
          if (!this.$store.getters.can(this.$str.topPath().slice(1) + '.store')) {
            model.splice(i, 1);
            continue;
          }

          model[i].label = item.label || this.$t('Create');
          model[i].icon = item.icon || 'fa-solid fa-plus';
          model[i].to = item.to === undefined ? () => this.$str.topPath() + '/create' : item.to;
        } else if (item.action === 'update') {
          if (!this.$store.getters.can(this.$str.topPath().slice(1) + '.update')) {
            model.splice(i, 1);
            continue;
          }

          model[i].label = item.label || this.$t('Edit');
          model[i].icon = item.icon || 'fa-solid fa-pencil';
          model[i].to = item.to === undefined ? (service) => this.$str.topPath() + '/update/' + service.id : item.to;
        } else if (item.action === 'save') {
          model[i].label = item.label || this.$t('Save');
          model[i].icon = item.icon || 'fa-solid fa-check';
          model[i].onClick = item.onClick === undefined ? this.onSave : item.onClick;
        } else if (item.action === 'delete') {
          if (!this.$store.getters.can(this.$str.topPath().slice(1) + '.destroy')) {
            model.splice(i, 1);
            continue;
          }

          model[i].label = item.label || this.$t('Delete');
          model[i].icon = item.icon || 'fa-solid fa-trash-can';
          model[i].onClick = item.onClick === undefined ? this.onDelete : item.onClick;
        }
      }

      return model;
    },
    length() {
      this.visibleModel = [];
      let length = 0;

      if (this.model) {
        for (let i in this.model) {
          if (this.isVisible(this.model[i].visible)) {
            this.visibleModel.push(this.model[i]);
            length++;
          }
        }
      }

      this.$emit('update:length', length);

      return length;
    },
    showIcon() {
      if (this.length === 1) {
        return this.visibleModel[0].icon;
      }

      return 'fa-solid fa-ellipsis-h';
    },
    tooltip() {
      if (this.length === 1 && this.visibleModel[0].isTooltip) {
        return this.visibleModel[0].label;
      }
    },
    label() {
      if (this.length === 1 && this.visibleModel[0].isLabel) {
        return this.visibleModel[0].label;
      }
    },
    buttonClass() {
      if (this.length === 1) {
        let item = this.visibleModel[0];

        if (item.action === 'create' || item.action === 'save') {
          return 'p-button-success';
        } else if (item.action === 'delete') {
          return 'p-button-danger';
        }
      }

      return 'p-button-secondary';
    },
  },
  watch: {
    actions: 'startSet',
  },
  methods: {
    async onSave(service, item) {
      if (await service.save()) {
        if (this.isSuccessToast) {
          this.$toast.add({
            severity: 'success',
            summary: this.$t('Success'),
            detail: 'Сохранено',
            group: 'bl',
            life: 10000,
          });
        }

        this.$router.push(item.to ? (typeof item.to === 'function' ? item.to(service) : item.to) : this.$str.topPath());
      } else {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('Error'),
          detail: service.errors[Object.keys(service.errors)[0]],
          group: 'bl',
          life: 10000,
        });
      }
    },
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async onDelete(service) {
      let skip = false;

      await this.$confirm.require({
        message: this.confirmMessage,
        header: this.confirmHeader,
        icon: 'fa-solid fa-triangle-exclamation',
        accept: async () => {
          if (this.service._selectedItems) {
            let ids = [];
            for (let item of this.service._selectedItems) {
              ids.push(item.id);
            }
            this.service.deleteMass(ids);
          } else {
            await service.delete();
          }

          skip = true;
        },
        reject: () => {
          skip = true;
        },
      });

      while (!skip) {
        // это нужно, т.к. confirm от primeView не работает с асинхронностью
        await this.sleep(500);
      }
    },
    async onClick(item) {
      if (item.onClick) {
        // При загрузке дизейблим кнопку и меняем иконку до конца выполнения функции
        let icon = item.icon;
        item.icon = 'pi pi-spin pi-spinner';
        item.disabled = true;
        await item.onClick(this.service, item);
        item.icon = icon;
        item.disabled = false;
      }

      if (!item.to && item.load !== false) {
        this.$emit('load');
      }
    },
    isVisible(modelVisible) {
      let visible = typeof modelVisible === 'function' ? modelVisible(this.service) : modelVisible;

      if (visible || visible === undefined) {
        return true;
      }

      return false;
    },
  },
};
</script>
