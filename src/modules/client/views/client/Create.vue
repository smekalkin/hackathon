<template>
  <div class="container" style="padding-top: 130px">
    <h1>Клиент</h1>
    <Form :service="service" :actions="[{ action: 'save', onClick: onClick }]">
      <FormField :service="service" field="name" label="Имя" />
      <FormField :service="service" field="phone" label="Телефон" type="mask" mask="+7(999)999-99-99" />
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
    };
  },
  methods: {
    onClick(service) {
      this.service.errors = {};
      if (!this.service.name) {
        this.service.errors.name = 'Поле Имя обязательно';
      }
      if (!this.service.phone) {
        this.service.errors.phone = 'Поле Телефон обязательно';
      }

      if (!this.service.getError()) {
        this.$store.commit('client/set', service);

        window.location.href = '/filter/create'; // это пока оставляем, чтобы заголовок обновился
      }
    },
  },
};
</script>