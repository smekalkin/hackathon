<template>
  <main class="home-page">
    <div class="home-speeddial text-center">
      <SpeedDialBtn :actions="[{ action: 'create', to: { name: 'ClientCreate' } }]" type="center" />
      <div class="lead" style="margin-top: 70px; margin-left: -40px">Добавить клиента</div>
    </div>
  </main>
</template>

<script>
import SpeedDialBtn from '../components/ui/SpeedDialBtn.vue';

export default {
  components: { SpeedDialBtn },
  data() {
    return {};
  },
};
</script>

<style>
.home-page {
  position: relative;
  height: 700px;
}
.home-page .home-speeddial {
  position: absolute;
  top: calc(40% - 2rem);
  left: calc(50% - 2rem);
}
</style>