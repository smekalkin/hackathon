<template>
  <div class="container">
    <Form :service="service" :actions="[{ action: 'save', onClick: onClick }]">
      <Draggable v-model="draggableList" group="people" @start="drag = true" @end="drag = false" item-key="id">
        <template #item="{ element }">
          <div class="row">
            <div class="col-1">
              <div style="width: 20px; margin-top: 33px" class="text-muted">
                <i class="fa-solid fa-ellipsis-vertical me-1 fa-lg"></i>
                <i class="fa-solid fa-ellipsis-vertical fa-lg"></i>
              </div>
            </div>
            <div class="col">
              <FormField
                v-if="element.name === 'cityId'"
                :service="service"
                field="cityId"
                label="Район"
                type="select"
                :options="cityList"
              />
              <div v-else-if="element.name === 'cost'" class="row">
                <div class="col">
                  <FormField :service="service" field="costFrom" label="Цена от" type="number" />
                </div>
                <div class="col">
                  <FormField :service="service" field="costTo" label="Цена до" type="number" />
                </div>
              </div>
              <FormField
                v-else-if="element.name === 'area'"
                :service="service"
                field="area"
                label="Площадь от"
                type="number"
              />
              <FormField
                v-else-if="element.name === 'date'"
                :service="service"
                field="date"
                label="Срок сдачи до"
                type="calendar"
              />
              <div v-else-if="element.name === 'floor'" class="row">
                <div class="col">
                  <FormField :service="service" field="floorFrom" label="Этаж от" type="number" />
                </div>
                <div class="col">
                  <FormField :service="service" field="floorTo" label="Этаж до" type="number" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Draggable>
    </Form>
  </div>
</template>
<script>
import Form from '../../../../components/ui/form/Form.vue';
import FormField from '../../../../components/ui/form/FormField.vue';
import Service from '../../../../services/Service';
import Draggable from 'vuedraggable';

export default {
  components: {
    Form,
    FormField,
    Draggable,
  },
  data() {
    return {
      service: new Service(),
      cityList: [
        { id: 1, name: 'Центр' },
        { id: 2, name: 'ФМР' },
        { id: 3, name: 'Юбилейный' },
        { id: 4, name: '40 лет Победы' },
        { id: 5, name: 'КМР' },
      ],
      draggableList: [{ name: 'cityId' }, { name: 'cost' }, { name: 'area' }, { name: 'date' }, { name: 'floor' }],
    };
  },
  created() {
    let filter = this.$store.getters['filter/one'];
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