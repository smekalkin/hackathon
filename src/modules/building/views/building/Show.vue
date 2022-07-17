<template>
  <div class="container">
    <div class="text-center position-relative">
      <Button icon="fa-solid fa-percent" class="p-button-secondary position-absolute p-button-outlined" style="top: 10px; right: 0;" />
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
    <div class="lead mb-3 fw-bold">{{ $str.money(service.cost) }} <i class="fa-solid fa-ruble-sign"></i></div>
    <div class="mb-3">
      <div class="border p-2">ЖК Привет, 1 литер, 3-10 этаж</div>
      <div class="border p-2">ЖК Привет, 2 литер, 5,7 этаж</div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <Button label="Бронь" icon="fa-solid fa-calendar-check" class="d-block w-100" />
      </div>
      <div class="col">
        <Button label="Ипотека" icon="fa-solid fa-clock" class="p-button-secondary d-block w-100" />
      </div>
    </div>
    <h3 class="mt-3">Похожие варианты</h3>
    <div class="row">
      <div v-for="building of buildings" class="p-field-radiobutton col-6 mb-3 mt-3" :key="building">
        <div class="text-center">
          <img
            v-if="building.imgs"
            :src="baseUrl + '/src/assets/imgs/' + building.imgs[0].url"
            :alt="building.typeName"
            style="max-width: 100%; height: 150px"
          />
        </div>
        <div>
          <span class="lead"> {{ $str.money(building.cost) }} <i class="fa-solid fa-ruble-sign"></i> </span>
        </div>
        <div>{{ building.typeName }}, {{ building.area }} м<sup>2</sup></div>
      </div>
    </div>
  </div>
</template>
<script>
import Button from 'primevue/button';
import BuildingService from '../../services/BuildingService';

export default {
  components: { Button },
  data() {
    return {
      service: new BuildingService(),
      baseUrl: window.location.origin,
      buildings: [],
    };
  },
  async created() {
    await this.service.show(this.$route.params.id);
    this.buildings = await this.service.all();
  },
};
</script>
