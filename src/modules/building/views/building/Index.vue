<template>
  <div class="container building-index">
    <DataView :value="items" :layout="layout" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
      <template #grid="{ data }">
        <div>
          <div class="text-center" @click="onClick(data)">
            <img
              v-if="data.imgs"
              :src="baseUrl + '/src/assets/imgs/' + data.imgs[0].url"
              :alt="data.typeName"
              style="max-width: 100%; max-height: 250px"
            />
          </div>
          <div class="d-flex justify-content-between">
            <div @click="onClick(data)">
              <div>
                <span class="lead"> {{ $str.money(data.cost) }} <i class="fa-solid fa-ruble-sign"></i> </span>
                <small class="text-black-50 ms-2">
                  {{ $str.money(Math.trunc(data.cost / data.area)) }}
                  <i class="fa-solid fa-ruble-sign"></i> за м<sup>2</sup>,
                </small>
              </div>
              <div>{{ data.typeName }}, {{ data.area }} м<sup>2</sup>, {{ data.floor }}/{{ data.floors }} эт.</div>
              <div>
                {{ data.districtName }}
              </div>
            </div>
            <div>
              <div>
                <a class="btn" href="#">
                  <i v-if="data.isOtherAgent" class="text-danger fa-solid fa-user-tie me-2"></i>
                </a>
              </div>
              <div>
                <a class="btn" href="#" @click.prevent="onClickAdd(data)">
                  <i v-if="$store.getters['building/isFavorite'](data)" class="fa-solid fa-check fa-lg"></i>
                  <i v-else class="fa-solid fa-plus fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </template>
    </DataView>
  </div>
</template>
<script>
import DataView from 'primevue/dataview';
import BuildingService from '../../services/BuildingService';

export default {
  components: { DataView },
  data() {
    return {
      service: new BuildingService(),
      baseUrl: window.location.origin,
      items: [],
      layout: 'grid',
      sortKey: null,
      sortOrder: null,
      sortField: null,
      sortOptions: [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' },
      ],
    };
  },
  async created() {
    this.items = await this.service.all();
  },
  methods: {
    onClick(data) {
      this.$router.push({ name: 'BuildingShow', params: { id: data.id } });
    },
    onClickAdd(data) {
      if (this.$store.getters['building/isFavorite'](data)) {
        this.$store.commit('building/delFavorite', data);
      } else {
        this.$store.commit('building/addFavorite', data);
      }

      return false;
    },
  },
};
</script>

<style>
.building-index .btn {
  border: none !important;
}
</style>