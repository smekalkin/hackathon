<template>
  <div v-for="client of $store.getters['client/all']" :key="client" class="container">
    <div @click="onClick(client)">
      <div class="row">
        <div class="col fw-bold">Имя:</div>
        <div class="col">{{ client.name }}</div>
      </div>
      <div class="row">
        <div class="col fw-bold">Телефон:</div>
        <div class="col">{{ client.phone }}</div>
      </div>
      <hr />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onClick(client) {
      this.$store.commit('client/set', client);
      // this.$router.push({ name: 'clientCreate' });
    },
  },
};
</script>