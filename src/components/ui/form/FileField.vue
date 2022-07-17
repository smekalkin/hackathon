<template>
  <label v-if="label" :for="fieldStr">{{ label }}</label>
  <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
  <div class="p-fileupload p-fileupload-advanced p-component">
    <div class="p-fileupload-buttonbar" style="padding-left: 0">
      <FileUpload
        ref="fileUpload"
        :id="fieldStr"
        mode="basic"
        v-model="serviceF"
        name="file"
        :url="url || apiUrl + '/' + service.basePath + '/upload'"
        @uploader="onUploader"
        :auto="true"
        :chooseLabel="$t('The attachment')"
        :multiple="multiple"
        :class="
          'p-button p-button-text p-button-secondary p-button-sm w-100 ' +
          [service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : '']
        "
        :maxFileSize="20000000"
        :showUploadButton="false"
        :showCancelButton="false"
        :customUpload="true"
      ></FileUpload>
    </div>
    <template v-if="isGalleria">
      <FileGalleria v-if="multiple" :service="service" :field="field" :edit="true" />
    </template>
  </div>
  <div v-if="helpText">
    <p class="helpText">{{ helpText }}</p>
  </div>
  <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
    {{ service.errors ? service.errors[fieldStr] : null }}
  </div>
</template>

<script>
import FileUpload from 'primevue/fileupload';
import FileGalleria from '../FileGalleria.vue';
import http from '../../../utils/http-common';

export default {
  components: { FileUpload, FileGalleria },
  props: {
    service: Object,
    field: String,
    label: String,
    multiple: Boolean,
    url: String,
    helpText: String,
    tooltip: String,
    isGalleria: Boolean,
  },
  data() {
    return {
      id: Math.random().toString(36).substr(2, 9) + new Date().getTime(),
    };
  },
  computed: {
    fieldStr() {
      if (typeof this.field === 'object') {
        return this.field.join('.');
      }

      return this.field;
    },
    serviceF: {
      get() {
        if (typeof this.field === 'object') {
          let serviceF = this.service;

          for (let f of this.field) {
            if (serviceF[f] === undefined) {
              return null;
            }
            serviceF = serviceF[f];
          }

          return serviceF;
        }

        return this.service[this.field];
      },
      set(v) {
        if (typeof this.field === 'object') {
          // Перебором присвоение не сработало, поэтому сравниваем по кол-ву элементов
          if (this.service[this.field[0]] === undefined) {
            this.service[this.field[0]] = {};
          }
          if (this.field.length === 2) {
            this.service[this.field[0]][this.field[1]] = v;
          } else if (this.field.length === 3) {
            if (this.service[this.field[0]][this.field[1]] === undefined) {
              this.service[this.field[0]][this.field[1]] = {};
            }
            this.service[this.field[0]][this.field[1]][this.field[2]] = v;
          }
        } else {
          this.service[this.field] = v;
        }
      },
    },
  },
  methods: {
    async onUploader(data) {
      let files = data.files;
      let success = true;
      let formData = new FormData();

      this.service.tempId = this.id;
      for (let file of files) {
        formData.set('file', file, file.name);
        formData.append('attribute', this.fieldStr);
        if (this.service.id) {
          formData.append('objectId', this.service.id);
        } else {
          formData.append('tempObjectId', this.service.tempId);
        }

        await http
          .post('/' + this.service.basePath + '/upload', formData)
          .then((response) => {
            if (this.multiple) {
              this.serviceF = this.serviceF || [];
              this.serviceF.push(response.data.data);
            } else {
              this.serviceF = response.data.data;
            }
          })
          .catch((error) => {
            success = false;
            this.$toast.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: file.name + ': ' + error,
              life: 10000,
              group: 'bl',
            });
          });
      }

      if (success) {
        this.$toast.add({
          severity: 'info',
          summary: 'Успешно',
          detail: 'Файл загружен',
          life: 3000,
          group: 'bl',
        });
      }

      this.$refs.fileUpload.clear();
    },
  },
};
</script>
