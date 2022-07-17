<template>
  <div class="container">
    <div class="row mb-3">
      <div class="col">
        <Button label="Новый" class="p-button-success p-button-outlined p-button-sm p-1 w-100" />
      </div>
      <div class="col">
        <Button label="Бронь" class="p-button-danger p-button-outlined p-button-sm p-1 w-100" />
      </div>
      <div class="col">
        <Button label="На&nbsp;оплате" class="p-button-warning p-button-outlined p-button-sm p-1 w-100" />
      </div>
      <div class="col">
        <Button label="Завершено" class="p-button-secondary p-button-outlined p-button-sm p-1 w-100" />
      </div>
    </div>
    <div v-for="client of $store.getters['client/all']" :key="client">
      <div @click="onClick(client)">
        <div class="row">
          <div class="col">
            <div>
              {{ client.name }}
            </div>
            <div class="text-muted">
              {{ client.phone }}
            </div>
          </div>
          <div class="col-3 pt-2">
            <Button label="Новый" class="p-button-success p-button-outlined p-button-sm p-1 w-100" />
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script>
import Button from 'primevue/button';

export default {
  components: { Button },
  methods: {
    onClick(client) {
      this.$store.commit('client/set', client);
      window.location.href = '/client/' + client.id; // это пока оставляем, чтобы заголовок обновился
    },
  },
};
</script>