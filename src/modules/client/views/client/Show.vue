<template>
  <div class="container">
    <div class="lead fw-bold mb-3">{{ client.phone }}</div>
    <div class="mb-3">
      <h3>Забронировано</h3>
      <BuildingList :items="buildings" limit="1" />
    </div>
    <div class="mb-3">
      <h3>Выбранные объекты</h3>
      <BuildingList :items="buildings" limit="3" />
    </div>
    <div class="mb-3">
      <h3>История поиска</h3>
      <div class="row">
        <div class="col fw-bold">Цена до:</div>
        <div class="col">15 000 000</div>
      </div>
      <div class="row">
        <div class="col fw-bold">Площадь от:</div>
        <div class="col">50 м<sub>2</sub></div>
      </div>
    </div>
  </div>
</template>
<script>
import BuildingList from '../../../building/components/BuildingList.vue';
import BuildingService from '../../../building/services/BuildingService';

export default {
  components: { BuildingList },
  data() {
    return {
      client: {},
      buildingService: new BuildingService(),
      buildings: [],
    };
  },
  async created() {
    this.client = this.$store.getters['client/one'];
    this.buildings = await this.buildingService.all();
  },
};
</script>