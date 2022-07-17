<template>
  <form>
    <slot></slot>
    <div v-if="Object.keys(service.errors).length > 0" class="alert alert-danger mt-4" role="alert">
      <ul class="mb-0">
        <li v-for="(error, index) of service.errors" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>
    <SpeedDialBtn
      v-if="typeof actions === 'undefined' || actions"
      :actions="actions || ['save']"
      :service="service"
      :isSuccessToast="isSuccessToast"
    />
  </form>
</template>

<script>
import SpeedDialBtn from '../SpeedDialBtn.vue';

export default {
  components: { SpeedDialBtn },
  props: {
    service: Object,
    actions: Array,
    isSuccessToast: Boolean,
  },
};
</script>