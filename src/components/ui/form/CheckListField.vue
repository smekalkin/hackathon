<template>
  <template v-if="service.lists">
    <template v-for="(list, i) in service.lists" :key="i">
      <Form :service="service" :actions="false" @submit.prevent="onSubmitItem(list)" class="my-3 border rounded p-3">
        <div class="task-list__header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <i class="fa-regular fa-square-check fs-5"></i>
            <InplaceField :service="list" @submit="onSubmitList(list)" @delete="onDeleteList(list)" :deleteBtn="false">
              <template #display>
                <div class="fw-bold">
                  {{ list.name }}
                </div>
              </template>
              <template #content>
                <FormField :service="list" field="name" margin="mb-0" class="ms-2" />
              </template>
            </InplaceField>
          </div>
        </div>
        <hr />
        <ul>
          <li v-for="(item, i) in list.items" :key="i" class="my-1">
            <div class="d-flex align-items-center">
              <FormField
                @click="onSubmitItem(item, list)"
                :service="item"
                field="isActive"
                type="checkbox"
                falseValue="0"
                trueValue="1"
                margin="mb-0"
              />
              <InplaceField :service="item" @submit="onSubmitItem(item, list)" @delete="onDelete(item, list)">
                <template #display>
                  <div :class="'ms-2 ' + [item.isActive == '1' ? 'text-decoration-line-through' : '']">
                    {{ item.text }}
                  </div>
                </template>
                <template #content>
                  <FormField :service="item" field="text" margin="mb-0" class="ms-2" />
                </template>
              </InplaceField>
            </div>
          </li>
        </ul>
        <Button
          @click="addTaskListItem(service.lists[i])"
          :label="$t('Add')"
          icon="fa-solid fa-plus"
          class="p-button-sm p-button-text p-button-secondary mb-2"
        />
      </Form>
    </template>
  </template>
</template>

<script>
import Button from 'primevue/button';
import MultiField from './MultiField.vue';
import FormField from './FormField.vue';
import Form from './Form.vue';
import InplaceField from './InplaceField.vue';
import TaskListItemService from '../../../modules/task/services/TaskListItemService';
import TaskListService from '../../../modules/task/services/TaskListService';

export default {
  components: {
    Button,
    MultiField,
    FormField,
    Form,
    InplaceField,
  },
  props: {
    service: Object,
  },
  data() {
    return {
      taskListService: new TaskListService(),
      taskListItemService: new TaskListItemService(),
    };
  },
  methods: {
    async onDeleteList(service) {
      this.$confirm.require({
        message: this.$t('Delete checklist?'),
        header: this.$t('Delete'),
        icon: 'fa-solid fa-triangle-exclamation',
        accept: async () => {
          for (let i in this.service.lists) {
            if (this.service.lists[i].id == service.id) {
              this.service.lists.splice(i, 1);
            }
          }
          await service.delete();
        },
      });
    },
    getTempId() {
      return Math.random().toString(36).substr(2, 9) + new Date().getTime();
    },
    async onSubmitItem(service, list) {
      service.taskListId = list.id;
      await service.save();
    },
    async onSubmitList(service) {
      await service.save();
    },
    async onDelete(service, list) {
      for (let i in list.items) {
        if (list.items[i].id == service.id) {
          list.items.splice(i, 1);
        }
      }
      await service.delete();
    },
    async onSubmitCreate(service, listId) {
      service.taskListId = listId;
      if (await service.save()) {
        this.addItem = false;
        // @todo: После добавления добавить подгрузку сервиса
      }
    },
    addTaskListItem(list) {
      list.items.push(
        new TaskListItemService({
          taskListId: list.id,
          text: '',
        })
      );
    },
  },
};
</script>
