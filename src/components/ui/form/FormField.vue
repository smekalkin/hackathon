<template>
  <div :class="'p-fluid ' + (margin || 'mb-3')">
    <div v-if="type === 'select'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <Dropdown
        :inputId="fieldStr"
        v-model="serviceF"
        :filter="filter"
        :filterMatchMode="filterMatchMode"
        :filterFields="filterFields"
        @filter="onFilter($event)"
        :options="typeof options === 'function' ? options(service) : options"
        :placeholder="placeholder"
        :showClear="showClear"
        :optionValue="optionValue || 'id'"
        :optionLabel="optionLabel || 'name'"
        :optionGroupLabel="optionGroupLabel"
        :optionGroupChildren="optionGroupChildren"
        @change="
          onInput($event, fieldStr);
          $emit('change', $event);
        "
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
        :editable="editable"
        :panelClass="panelClass"
      >
        <template #optiongroup="data">
          <slot name="optiongroup" :data="data"></slot>
        </template>
        <template #option="data">
          <slot name="option" :data="data"></slot>
        </template>
        <template #value="slotProps">
          <slot v-if="slotProps" name="value" :data="slotProps"></slot>
          <template v-if="!slotProps.value || slotProps.value.length === 0">
            <br />
          </template>
        </template>
      </Dropdown>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'multiselect'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <MultiSelect
        :inputId="fieldStr"
        v-model="serviceF"
        :options="options"
        :optionValue="optionValue || 'id'"
        :optionLabel="optionLabel || 'name'"
        :optionGroupLabel="optionGroupLabel"
        :optionGroupChildren="optionGroupChildren"
        @change="onInput($event, fieldStr)"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
      >
        <template #optiongroup="data">
          <slot name="optiongroup" :data="data"></slot>
        </template>
        <template #option="data">
          <slot name="option" :data="data"></slot>
        </template>
        <template #value="slotProps">
          <slot name="value" :data="slotProps"></slot>
        </template>
        <template #footer="data">
          <slot name="footer" :data="data"></slot>
        </template>
        <template #content="data">
          <slot name="content" :data="data"></slot>
        </template>
      </MultiSelect>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'checkbox'" class="p-field-checkbox">
      <Checkbox
        :id="fieldStr"
        v-model="serviceF"
        :binary="true"
        @input="onInput($event, fieldStr)"
        :falseValue="falseValue || null"
        :trueValue="trueValue || null"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
      />
      <label v-if="label" class="ms-1" :for="fieldStr">{{ label }}</label>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
    </div>

    <div v-else-if="type === 'radio'" class="p-field">
      <label v-if="label">{{ label }}</label
      ><br />
      <span v-for="(option, i) of options" class="p-field-radiobutton" :key="i">
        <RadioButton
          :id="fieldStr + '-' + i"
          v-model="serviceF"
          :name="fieldStr"
          :value="option[optionValue || 'id']"
          @change="onInput($event, fieldStr)"
          :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
          :disabled="disabled"
        />
        <label v-if="label" class="ms-1 me-3" :for="fieldStr + '-' + i">
          {{ option[optionLabel || 'name'] }}
        </label>
        <div v-if="i === options.length - 1 && service.errors[fieldStr]" class="invalid-feedback">
          {{ service.errors ? service.errors[fieldStr] : null }}
        </div>
      </span>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
    </div>

    <div v-else-if="type === 'textarea'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <Textarea
        :id="fieldStr"
        v-model="serviceF"
        :autoResize="true"
        @input="onInput($event, fieldStr)"
        :class="
          (service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : '') +
          (!label ? margin || (!margin ? 'mt-4' : '') : '')
        "
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'password'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <Password
        :id="fieldStr"
        v-model="serviceF"
        @input="onInput($event, fieldStr)"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
        :toggleMask="toggleMask"
        :feedback="feedback"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'mask'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <InputMask
        :id="fieldStr"
        v-model="serviceF"
        @input="onInput($event, fieldStr)"
        :mask="mask"
        :slotChar="slotChar"
        :class="
          (service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : '') + (!label ? margin || 'mt-4' : '')
        "
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'number'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <input
        type="number"
        :id="fieldStr"
        v-model="serviceF"
        :class="
          'p-inputtext p-component p-inputnumber-input p-inputnumber-input ' +
          (service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : '')
        "
        min="0"
        @input="onInput($event, fieldStr)"
        :disabled="disabled"
        :step="stepNumber"
        :maxlength="maxlength"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'calendar'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <Calendar
        :id="fieldStr"
        v-model="serviceF"
        :showIcon="true"
        :monthNavigator="true"
        :yearNavigator="true"
        yearRange="1920:2030"
        @update:modelValue="
          onInput($event, fieldStr, 'date');
          $emit('change', $event);
        "
        :showButtonBar="true"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
        :selectionMode="selectionMode ?? 'single'"
        autocomplete="off"
        dateFormat="dd.mm.yyyy"
        :showTime="showTime"
        :showSeconds="showSeconds"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <!-- <div v-else-if="type === 'v-calendar'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <v-date-picker
        v-model="serviceF"
        :model-config="modelConfig"
        mode="dateTime"
        :is24hr="is24hr"
        class="p-calendar p-component p-inputwrapper p-calendar-w-btn"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <input class="p-inputtext p-component" :value="inputValue" v-on="inputEvents" />
          <Button icon="fa-regular fa-calendar" class="p-button p-button-grey p-component p-button-icon-only p-datepicker-trigger" />
        </template>
      </v-date-picker>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div> -->

    <!-- <div v-else-if="type === 'v-calendar-range'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <v-date-picker
        v-model="serviceF"
        :masks="masks"
        title="YYYY MM DD"
        is-range
        @update:modelValue="onInput($event, fieldStr, 'date')"
        class="p-calendar p-component p-inputwrapper"
      >
        <template v-slot="{ inputValue, inputEvents, isDragging }">
          <div class="d-flex align-items-center">
            <div class="flex flex-col sm:flex-row justify-start items-center">
              <input
                class="p-inputtext p-component"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                v-on="inputEvents.start"
                :value="inputValue.start"
              />
            </div>
            <i class="fa-solid fa-arrow-right mx-1"></i>
            <div class="flex flex-col sm:flex-row justify-start items-center">
              <input
                class="p-inputtext p-component"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.end"
                v-on="inputEvents.end"
              />
            </div>
          </div>
        </template>
      </v-date-picker>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div> -->

    <div v-else-if="type === 'autocomplete'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <AutoComplete
        :id="fieldStr"
        v-model="service['_' + fieldStr]"
        @input="onInput($event, fieldStr)"
        :suggestions="suggestions"
        @complete="$emit('complete', $event)"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
        :field="optionLabel"
        :forceSelection="forceSelection"
        :placeholder="placeholder"
        @item-select="
          ({ value }) => {
            serviceF = value[optionValue];
            $emit('change');
          }
        "
      >
        <template #item="data">
          <slot name="item" :data="data"></slot>
        </template>
      </AutoComplete>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'color'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <ColorPicker
        v-model="serviceF"
        :inline="inline"
        :class="[service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : '', 'd-block']"
        :disabled="disabled"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'chips'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <Chips
        :id="fieldStr"
        v-model="serviceF"
        @input="onInput($event, fieldStr)"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
      />
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <div v-else-if="type === 'selectbtn'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <SelectButton
        :id="fieldStr"
        v-model="serviceF"
        @change="onInput($event, fieldStr)"
        :options="options"
        :placeholder="placeholder"
        :optionValue="optionValue || 'id'"
        :optionLabel="optionLabel || 'name'"
        :class="service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : ''"
        :disabled="disabled"
        :panelClass="panelClass"
      >
        <template #option="data">
          <slot name="option" :data="data"></slot>
        </template>
      </SelectButton>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div>

    <!-- <div v-else-if="type === 'editor'" class="p-field">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <Editor v-model="serviceF" editorStyle="height: 320px">
        <template #toolbar>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
          </span>
          <span class="ql-formats"
            ><button class="ql-list" value="ordered" type="button">
              <svg viewBox="0 0 18 18">
                <line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"></line>
                <line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"></line>
                <line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"></line>
                <line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"></line>
                <path
                  class="ql-fill"
                  d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"
                ></path>
                <path
                  class="ql-stroke ql-thin"
                  d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"
                ></path>
                <path
                  class="ql-stroke ql-thin"
                  d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"
                ></path>
              </svg></button
            ><button class="ql-list" value="bullet" type="button">
              <svg viewBox="0 0 18 18">
                <line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"></line>
                <line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"></line>
                <line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"></line>
                <line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"></line>
                <line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"></line>
                <line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"></line>
              </svg></button
            ><span class="ql-align ql-picker ql-icon-picker"
              ><span
                class="ql-picker-label"
                tabindex="0"
                role="button"
                aria-expanded="false"
                aria-controls="ql-picker-options-4"
                ><svg viewBox="0 0 18 18">
                  <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
                  <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
                  <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line></svg></span
              ><span class="ql-picker-options" aria-hidden="true" tabindex="-1" id="ql-picker-options-4"
                ><span tabindex="0" role="button" class="ql-picker-item"
                  ><svg viewBox="0 0 18 18">
                    <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
                    <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
                    <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line></svg></span
                ><span tabindex="0" role="button" class="ql-picker-item" data-value="center"
                  ><svg viewBox="0 0 18 18">
                    <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
                    <line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
                    <line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line></svg></span
                ><span tabindex="0" role="button" class="ql-picker-item" data-value="right"
                  ><svg viewBox="0 0 18 18">
                    <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
                    <line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
                    <line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line></svg></span
                ><span tabindex="0" role="button" class="ql-picker-item" data-value="justify"
                  ><svg viewBox="0 0 18 18">
                    <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
                    <line class="ql-stroke" x1="15" x2="3" y1="14" y2="14"></line>
                    <line class="ql-stroke" x1="15" x2="3" y1="4" y2="4"></line></svg></span></span></span
            ><select class="ql-align" style="display: none">
              <option defaultvalue=""></option>
              <option value="center"></option>
              <option value="right"></option>
              <option value="justify"></option></select
          ></span>
        </template>
      </Editor>
      <div v-if="helpText">
        <p class="helpText">{{ helpText }}</p>
      </div>
      <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
        {{ service.errors ? service.errors[fieldStr] : null }}
      </div>
    </div> -->

    <!-- <FileField
      v-else-if="type === 'file'"
      :service="service"
      :field="field"
      :label="label"
      :multiple="multiple"
      :url="url"
      :helpText="helpText"
      :tooltip="tooltip"
      :isGalleria="isGalleria"
    /> -->

    <div v-else :class="'p-field ' + [margin ? margin : '']">
      <label v-if="label" :for="fieldStr">{{ label }}</label>
      <small v-if="tooltip" v-tooltip.right="tooltip" class="ms-1"><i class="fa-solid fa-circle-info"></i></small>
      <div :class="[appendBtn || prependBtn ? 'p-inputgroup' : '']">
        <Button v-if="prependBtn" @click="$emit('btnClick', event)" :icon="'pi ' + iconBtn" :class="classBtn" />
        <InputText
          :id="fieldStr"
          :type="type || 'text'"
          v-model="serviceF"
          @input="onInput($event, fieldStr)"
          :class="
            (service.errors && service.errors[fieldStr] ? 'p-invalid is-invalid' : '') +
            (!label ? margin || 'mt-4' : '')
          "
          :disabled="disabled"
          autofocus
          v-maska="maska"
          :placeholder="placeholder"
        />
        <Button v-if="appendBtn" type="submit" @click="$emit('btnClick', event)" :icon="iconBtn" :class="classBtn" />
        <div v-if="helpText">
          <p class="helpText">{{ helpText }}</p>
        </div>
        <div v-if="service.errors && service.errors[fieldStr]" class="invalid-feedback">
          {{ service.errors ? service.errors[fieldStr] : null }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';
import Password from 'primevue/password';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import AutoComplete from 'primevue/autocomplete';
import Chips from 'primevue/chips';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import ColorPicker from 'primevue/colorpicker';
// import Editor from 'primevue/editor';
// import FileField from './FileField.vue';
// import VCalendar from 'v-calendar';

export default {
  components: {
    Button,
    InputText,
    Dropdown,
    MultiSelect,
    Checkbox,
    RadioButton,
    Textarea,
    Password,
    InputMask,
    InputNumber,
    Calendar,
    AutoComplete,
    Chips,
    SelectButton,
    ColorPicker,
    // Editor,
    // FileField,
    // VCalendar,
  },
  props: {
    service: Object,
    type: String,
    field: String,
    label: String,
    options: Array,
    optionValue: String,
    optionLabel: String,
    mask: String,
    maxlength: Number,
    slotChar: String,
    suggestions: Array,
    disabled: Boolean,
    inline: Boolean,
    filter: Boolean,
    filterMatchMode: String,
    filterFields: Array,
    showClear: { type: Boolean, default: true },
    falseValue: String,
    trueValue: String,
    editable: Boolean,
    panelClass: String,
    multiple: Boolean,
    margin: String | Number,
    optionGroupLabel: String,
    optionGroupChildren: String,
    stepNumber: Number,
    url: String,
    maska: Object,
    helpText: String,
    placeholder: String,
    selectionMode: String,
    tooltip: String,
    prependBtn: Boolean,
    appendBtn: Boolean,
    forceSelection: Boolean,
    toggleMask: Boolean,
    feedback: Boolean,
    showTime: Boolean,
    showSeconds: Boolean,
    is24hr: Boolean,
    isRange: Boolean,
    iconBtn: String,
    classBtn: String,
    isGalleria: { type: Boolean, default: true },
  },
  emits: ['complete'],
  data() {
    return {
      modelConfig: {
        type: 'number',
      },
    };
  },
  methods: {
    onFilter(event) {
      this.service.filterValue = event.value;

      this.$emit('filter', event);
    },
    onInput(event, fieldStr, format) {
      if (format === 'date') {
        this.serviceF = this.$str[format](this.serviceF);
      }

      if (event instanceof Object) {
        if (event.start && event.end) {
          let arrS = [];
          arrS[0] = this.$str[format](this.serviceF.start);
          arrS[1] = this.$str[format](this.serviceF.end);
          this.serviceF = arrS;
        }
      }
      if (format && event && !this.selectionMode && !(event instanceof Object)) {
        this.serviceF = this.$str[format](this.serviceF);
      }

      if (this.service.errors) {
        delete this.service.errors[fieldStr];
      }

      this.$emit('input', event);
    },
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
};
</script>

<style scoped>
.helpText {
  color: #808080;
  font-size: 12px;
}
</style>
