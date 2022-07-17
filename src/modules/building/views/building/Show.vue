<template>
  <div class="container">
    <div class="text-center">
      <img
        v-if="service.imgs"
        :src="baseUrl + '/src/assets/imgs/' + service.imgs[0].url"
        :alt="service.typeName"
        style="max-width: 100%; max-height: 250px"
      />
    </div>
    <div class="mt-3">
      {{ service.typeName }}, {{ service.area }} м<sup>2</sup>, {{ service.floor }}/{{ service.floors }} эт.
    </div>
    <div class="lead mb-3">
      {{ $str.money(service.cost) }} <i class="fa-solid fa-ruble-sign"></i>
    </div>
    <div class="border p-2">
      ЖК Привет, 1 литер, 3-10 этаж
    </div>
    <div class="border p-2">
      ЖК Привет, 2 литер, 5,7 этаж
    </div>
  </div>
</template>
<script>
import BuildingService from '../../services/BuildingService';

export default {
  data() {
    return {
      service: new BuildingService(),
      baseUrl: window.location.origin,
    };
  },
  async created() {
    await this.service.show(this.$route.params.id);
    console.log(this.service.imgs);
  },
};
</script>
