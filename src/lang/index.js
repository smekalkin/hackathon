import { createI18n } from 'vue-i18n';
import { messages } from '../lang/locales';
import { dateTimeFormats } from '../lang/locales';

const i18n = createI18n({
    locale: 'ru', // set locale
    fallbackLocale: 'us', // set fallback locale
    messages, // set locale messages
    dateTimeFormats
});

export function t(str) {
    return i18n.global.t(str);
}

export default i18n;