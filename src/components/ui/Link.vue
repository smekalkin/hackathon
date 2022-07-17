<template>
  <a v-if="to && to.href" :href="typeof to.href === 'function' ? to.href(data) : to.href" :target="to.target">
    <slot></slot>
  </a>
  <router-link v-else-if="routerTo" :to="routerTo" :target="routerTo.target">
    <slot></slot>
  </router-link>
  <span v-else>
    <slot></slot>
  </span>
</template>
<script>
export default {
  props: {
    to: String | Object | Function,
    data: Object,
  },
  computed: {
    routerTo() {
      return typeof this.to === 'function' ? this.to(this.data) : this.to;
    },
  },
};
</script>