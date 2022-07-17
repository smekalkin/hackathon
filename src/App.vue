<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light fixed-top">
    <div class="container-fluid">
      <div>
        <i v-if="$store.getters.historyBack" class="fa-solid fa-angle-left" @click="onClickBack"></i>
      </div>
      <div>
        <RouterLink v-if="$store.getters['client/one'].name" class="navbar-brand text-center" :to="{ name: 'Home' }">
          <i class="fa-solid fa-plus me-2"></i>
          <span>{{ $store.getters['client/one'].name }}</span>
        </RouterLink>
      </div>
      <span>&nbsp;</span>
    </div>
  </nav>

  <div style="margin-top: 70px; margin-bottom: 90px">
    <RouterView />
  </div>

  <nav class="navbar navbar-expand-lg bg-light fixed-bottom">
    <div class="container-fluid">
      <RouterLink class="nav-link text-center" :to="{ name: 'FilterCreate' }">
        <i class="fa-solid fa-magnifying-glass fa-2x"></i>
        <div>Искать</div>
      </RouterLink>
      <RouterLink class="nav-link text-center" :to="{ name: 'Filter' }">
        <i class="fa-solid fa-clock fa-2x"></i>
        <div>История</div>
      </RouterLink>
      <RouterLink class="nav-link text-center" :to="{ name: 'Client' }">
        <i class="fa-solid fa-user-clock fa-2x"></i>
        <div>Клиенты</div>
      </RouterLink>
      <RouterLink class="nav-link text-center" :to="''">
        <i class="fa-solid fa-bars fa-2x"></i>
        <div>Еще</div>
      </RouterLink>
    </div>
  </nav>

  <Toast position="bottom-left" group="bl" />
</template>

<script>
import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';

export default {
  components: { Menubar, Toast },
  data() {
    return {};
  },
  mounted() {
    this.$primevue.config.locale.accept = this.$t('Yes');
    this.$primevue.config.locale.reject = this.$t('No');
    this.$primevue.config.locale.today = this.$t('Today');
    this.$primevue.config.locale.clear = this.$t('Clear');
    this.$primevue.config.locale.monthNames = [
      this.$t('January'),
      this.$t('February'),
      this.$t('March'),
      this.$t('April'),
      this.$t('May'),
      this.$t('June'),
      this.$t('July'),
      this.$t('August'),
      this.$t('September'),
      this.$t('October'),
      this.$t('November'),
      this.$t('December'),
    ];
    this.$primevue.config.locale.dayNamesMin = [
      this.$t('Su'),
      this.$t('Mo'),
      this.$t('Tu'),
      this.$t('We'),
      this.$t('Th'),
      this.$t('Fr'),
      this.$t('Sa'),
    ];
    this.$primevue.config.locale.firstDayOfWeek = 1;
    this.$primevue.config.locale.dateFormat = 'dd.mm.yy';
  },
  methods: {
    onClickBack() {
      window.history.back();
    },
  },
};
</script>
