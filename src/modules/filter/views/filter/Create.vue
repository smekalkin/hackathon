<template>
  <div class="container">
    <Form :service="service" :actions="[{ action: 'save', onClick: onClick }]">
      <FormField :service="service" field="cityId" label="Город" type="select" :options="cityList" />
      <div class="row">
        <div class="col">
          <FormField :service="service" field="costFrom" label="Цена от" type="number" />
        </div>
        <div class="col">
          <FormField :service="service" field="costTo" label="Цена до" type="number" />
        </div>
      </div>
      <FormField :service="service" field="area" label="Площадь" type="number" />
      <FormField :service="service" field="date" label="Срок сдачи до" type="calendar" />
      <div class="row">
        <div class="col">
          <FormField :service="service" field="floorFrom" label="Этаж от" type="number" />
        </div>
        <div class="col">
          <FormField :service="service" field="floorTo" label="Этаж до" type="number" />
        </div>
      </div>
    </Form>
  </div>
</template>
<script>
import Form from '../../../../components/ui/form/Form.vue';
import FormField from '../../../../components/ui/form/FormField.vue';
import Service from '../../../../services/Service';

export default {
  components: {
    Form,
    FormField,
  },
  data() {
    return {
      service: new Service(),
      cityList: [
        { id: 1, name: 'Краснодар' },
        { id: 2, name: 'Новороссийск' },
        { id: 3, name: 'Анапа' },
        { id: 4, name: 'Сочи' },
      ],
    };
  },
  created() {
    let filter = this.$store.getters['filter/one'];
    console.log(filter);
    if (filter && Object.keys(filter).length) {
      this.service = filter;
      if (this.service.date) {
        this.service.date = this.$str.date(this.service.date);
      }
    }
  },
  methods: {
    onClick() {
      this.service.client = this.$store.getters['client/one'];
      this.$store.commit('filter/set', this.service);

      this.$router.push({ name: 'Building' });
    },
  },
};
</script>