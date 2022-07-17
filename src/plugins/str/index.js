import Str from '../../utils/Str';

export default {
    install: (app, options) => {
        app.config.globalProperties.$str = Str;
    }
}