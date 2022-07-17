<template>
  <div v-for="filter of $store.getters['filter/all']" :key="filter" class="container">
    <div
      v-if="
        filter.cityId ||
        filter.costFrom ||
        filter.costTo ||
        filter.area ||
        filter.date ||
        filter.floorFrom ||
        filter.floorTo
      "
      @click="onClick(filter)"
    >
      <div v-if="filter.cityId" class="row">
        <div class="col fw-bold">Город:</div>
        <div class="col">{{ filter.cityId }}</div>
      </div>
      <div v-if="filter.costFrom" class="row">
        <div class="col fw-bold">Цена от:</div>
        <div class="col">{{ $str.money(filter.costFrom) }}</div>
      </div>
      <div v-if="filter.costTo" class="row">
        <div class="col fw-bold">Цена до:</div>
        <div class="col">{{ $str.money(filter.costTo) }}</div>
      </div>
      <div v-if="filter.area" class="row">
        <div class="col fw-bold">Площадь:</div>
        <div class="col">{{ filter.area }}</div>
      </div>
      <div v-if="filter.date" class="row">
        <div class="col fw-bold">Срок сдачи до:</div>
        <div class="col">{{ $str.date(filter.date) }}</div>
      </div>
      <div v-if="filter.floorFrom" class="row">
        <div class="col fw-bold">Этаж от:</div>
        <div class="col">{{ filter.floorFrom }}</div>
      </div>
      <div v-if="filter.floorTo" class="row">
        <div class="col fw-bold">Этаж до:</div>
        <div class="col">{{ filter.floorTo }}</div>
      </div>
      <div v-if="filter.client && filter.client.phone" class="row">
        <div class="col fw-bold">Клиент:</div>
        <div class="col">{{ filter.client.name }}</div>
      </div>
      <hr />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onClick(filter) {
      this.$store.commit('filter/set', filter);
      this.$router.push({ name: 'FilterCreate' });
    },
  },
};
</script>