import Arr from '../../utils/Arr';

export default {
    install: (app, options) => {
        app.config.globalProperties.$arr = Arr;
    }
}