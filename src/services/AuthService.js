import http from '../utils/http-common';
import { t } from '../lang';
import Service from './Service';

class AuthService extends Service {

    basePath = 'oauth';

    newObject() {
        return new AuthService();
    }

    /**
     * Get oauth token
     * @returns Object
     */
    async token() {
        let request = {
            client_id: process.env.VUE_APP_API_ID,
            client_secret: process.env.VUE_APP_API_KEY,
            grant_type: process.env.VUE_APP_API_GRANT_TYPE,
            username: this.username,
            password: this.password,
        };

        return await http.post('/' + this.basePath + '/token', request).then(response => {
            return response.data;
        }).catch((error) => {
            if (error.message === 'Network Error') {
                this.errors = { password: t('Network Error') };
            } else if (error.response.status === 401 && error.response.data.error === 'invalid_client') {
                this.errors = { password: t('Invalid client config') };
            } else if (error.response.status === 400 && error.response.data.error === 'invalid_grant') {
                this.errors = { password: t('Invalid login or password') };
            } else {
                this.errors = { password: t('Authorization error') + ': ' + t('Contact your administrator') };
            }

            // return Promise.reject(error)
        });
    }

    /**
     * Delete auth token
     */
    async tokenDelete() {
        // @todo: Добавить запросы к бэку на удаление токена
    }

    /**
     * Get auth info
     */
    async info() {
        return await http.get('/' + this.basePath + '/info').then(async response => {
            return response.data.data;
        });
    }

}

export default AuthService;