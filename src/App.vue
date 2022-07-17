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
        <div v-if="pathname !== '/client' || (route && route.path !== '/client')">
          <RouterLink v-if="$store.getters['client/one'].name" class="navbar-brand text-center" :to="{ name: 'Home' }">
            <i class="fa-solid fa-plus me-2"></i>
            <span>{{ $store.getters['client/one'].name }}</span>
          </RouterLink>
        </div>
        <span v-else class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText type="text" v-model="value1" placeholder="Поиск" />
        </span>
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
        <i class="fa-solid fa-magnifying-glass fa-lg"></i>
        <div><small>Искать</small></div>
      </RouterLink>
      <RouterLink class="nav-link text-center" :to="{ name: 'Filter' }">
        <i class="fa-solid fa-clock fa-lg"></i>
        <div><small>История</small></div>
      </RouterLink>
      <a href="/client" class="nav-link text-center">
        <i class="fa-solid fa-user-clock fa-lg"></i>
        <div><small>Клиенты</small></div>
      </a>
      <span class="nav-link text-center" @click="isOther = !isOther">
        <i class="fa-solid fa-bars fa-lg"></i>
        <div><small>Еще</small></div>
      </span>
    </div>
  </nav>

  <div v-if="isOther" class="position-fixed bg-white p-3 border-top border-bottom" style="bottom: 64px; left: 0; right: 0">
    <RouterLink class="nav-link text-center" :to="''">
      <i class="fa-solid fa-graduation-cap fa-lg me-2"></i>
      <small>Обучение</small>
    </RouterLink>
  </div>

  <Toast position="bottom-left" group="bl" />
</template>

<script>
import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import { useRoute } from 'vue-router';

export default {
  components: { Menubar, Toast, InputText },
  data() {
    return {
      route: null,
      pathname: window.location.pathname,
      isOther: false,
    };
  },
  mounted() {
    this.route = useRoute();

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
