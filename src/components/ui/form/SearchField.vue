<template>
  <FormField
    :service="service"
    :field="field"
    :optionLabel="optionLabel"
    type="autocomplete"
    @complete="onFilter($event)"
    :suggestions="suggestions"
    @change="this.$emit('change')"
    :forceSelection="true"
    :placeholder="placeholder"
  >
    <template #item="{ data }">
      <slot name="item" :data="data"></slot>
    </template>
  </FormField>
</template>

<script>
import AutoComplete from 'primevue/autocomplete';
import FormField from '../../../components/ui/form/FormField.vue';

export default {
  components: {
    AutoComplete,
    FormField,
  },
  props: {
    service: Object,
    field: String,
    searchService: Object,
    optionLabel: String,
    placeholder: String,
  },
  emits: ['change'],
  data() {
    return {
      suggestions: null,
      result: null,
    };
  },
  methods: {
    async onFilter(e) {
      setTimeout(async () => {
        this.searchService.ss = e.query;
        let result = await this.searchService.all();
        this.suggestions = result.filter((data) => {
          return data;
        });
      }, 250);
    },
  },
};
</script>
