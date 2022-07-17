<template>
  <div class="container building-index">
    <BuildingList :items="items" />
  </div>
</template>
<script>
import BuildingService from '../../services/BuildingService';
import BuildingList from '../../components/BuildingList.vue';

export default {
  components: { BuildingList },
  data() {
    return {
      service: new BuildingService(),
      items: []
    };
  },
  async created() {
    this.items = await this.service.all();
  },
};
</script>
