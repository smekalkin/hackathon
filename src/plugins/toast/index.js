import { t } from '../../lang';

export default {
    install: (app, options) => {
        app.config.globalProperties.$toast.info = (params) => {
            app.config.globalProperties.$toast.add({
                severity: 'info',
                summary: params.summary,
                detail: params.detail,
                group: 'bl',
                life: 7000
            });
        };

        app.config.globalProperties.$toast.success = (params) => {
            app.config.globalProperties.$toast.add({
                severity: 'success',
                summary: params.summary || t('Success'),
                detail: params.detail,
                group: 'bl',
                life: 7000
            });
        };

        app.config.globalProperties.$toast.warn = (params) => {
            app.config.globalProperties.$toast.add({
                severity: 'warn',
                summary: params.summary || t('Attention'),
                detail: params.detail,
                group: 'bl',
                life: 7000
            });
        };

        app.config.globalProperties.$toast.error = (params) => {
            app.config.globalProperties.$toast.add({
                severity: 'error',
                summary: params.summary || t('Error'),
                detail: params.detail,
                group: 'bl',
                life: 7000
            });
        };
    }
}