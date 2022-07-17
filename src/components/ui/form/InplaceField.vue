<template>
  <template v-if="service">
    <div class="p-inplace p-component w-100">
      <template v-if="!visible && !service.isNewRecord" @keydown.enter="onOpen">
        <div class="d-flex justify-content-between">
          <div @click="onOpen" class="p-inplace-display">
            <slot name="display"></slot>
          </div>
          <div>
            <Button @click="onDelete" class="p-button-danger p-button-text" icon="fa-regular fa-trash-can" />
          </div>
        </div>
      </template>
      <div v-else-if="service.isNewRecord || visible" class="p-inplace-content">
        <slot name="content"></slot>
        <div
          :class="
            'd-flex mt-2 ' + [deleteBtn && !service.isNewRecord ? 'justify-content-between' : 'justify-content-end']
          "
        >
          <Button
            v-if="deleteBtn && !service.isNewRecord"
            @click="onDelete"
            icon="fa-solid fa-trash-can"
            class="p-button-rounded p-button-secondary p-button-text"
          />
          <div class="d-flex">
            <Button @click="onClose" :label="$t('Cancel')" class="p-button-secondary p-button-text p-button-sm" />
            <Button @click="onSubmit" :label="$t('Save')" class="p-button-sm ms-2"></Button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import Button from 'primevue/button';

export default {
  components: {
    Button,
  },
  props: {
    service: Object,
    deleteBtn: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit'],
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    onOpen() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onSubmit(event) {
      this.$emit('submit', event);
      this.visible = false;
    },
    onDelete(event) {
      this.$emit('delete', event);
      this.visible = false;
    },
  },
};
</script>

<style>
.p-inplace .p-inplace-display {
  cursor: pointer;
  /* padding: 0; */
}

.p-inplace .p-inplace-content {
  display: inline;
}

.p-fluid .p-inplace.p-inplace-closable .p-inplace-content {
  display: flex;
}

.p-fluid .p-inplace.p-inplace-closable .p-inplace-content > .p-inputtext {
  flex: 1 1 auto;
  width: 1%;
}
</style>
