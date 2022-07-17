import http from '../utils/http-common';
import { t } from '../lang';

/**
 * Main service class
 */
class Service {

    /**
     * Base path to controller
     */
    basePath = null;

    /**
     * Is new record flag
     */
    isNewRecord = true;

    /**
     * Response data
     */
    responseData = {};

    /**
     * Errors after validate
     */
    errors = {};

    /**
     * total count on page
     */
    metaTotal = 0;

    /**
     * Count rows on page
     */
    metaPerPage = 0;

    /**
     * Expanded attributes
     */
    expand = [];

    /**
     * Whether to make a request for lists
     */
    // loadLists = [];

    /**
     * Loaded lists from set
     */
    // lists = {};

    /**
     * Labels from lists
     */
    // labels = {};

    /**
     * Values from lists
     */
    // values = {};

    /**
     * Settings data: labels, rules, lists
     */
    // _setData = {};

    /**
    * Whether to make a request for settings
    */
    // _isLoadSet = false;

    /**
     * Init constructor attributes
     */
    _attributes = null;

    /**
     * Set attributes when initializing a class
     * @param {Object} attributes 
     */
    constructor(attributes) {
        this.initAttributes(attributes);
    }

    /**
     * Initialization constructor attributes
     * @param {Object} attributes 
     */
    initAttributes(attributes) {
        this._attributes = attributes;

        this.setAttributes(attributes);
    }

    /**
     * Set attributes
     * @param {Object} attributes 
     */
    setAttributes(attributes) {
        if (attributes) {
            for (let i in attributes) {
                this[i] = attributes[i];
            }
        }
    }

    /**
     * Get new object
     * @returns {Service}
     */
    newObject() {
        return new Service();
    }

    /**
     * Get new object with attributes
     * @returns {Service}
     */
    newObjectAttr() {
        let newObject = this.newObject();
        newObject.initAttributes(this._attributes);

        return newObject;
    }

    /**
     * Reset to initialized data
     */
    reset() {
        let newObject = this.newObjectAttr();

        for (let i in this) {
            if (newObject[i] === undefined) {
                delete this[i];
            } else {
                this[i] = newObject[i];
            }
        }
    }

    /**
     * Routes
     * @returns {array}
     */
    getRoutes() {
        return {
            set: '/' + this.basePath + '/set',
            index: '/' + this.basePath,
            allList: '/' + this.basePath + '/all-list',
            store: '/' + this.basePath,
            show: '/' + this.basePath + '/{id}',
            update: '/' + this.basePath + '/{id}',
            delete: '/' + this.basePath + '/{id}',
            deleteMass: '/' + this.basePath + '/destroy',
        }
    }

    /**
     * Get all list items
     * @returns {Object}
     */
    // async set() {
    //     if (Object.keys(this._setData).length > 0) {
    //         return this._setData;
    //     }

    //     return await http.get(this.getRoutes().set).then(async response => {
    //         this._setData = response.data.data;

    //         await this.getLists();
    //         this.getLabels();
    //         this.getValues();

    //         return this._setData;
    //     }).catch(e => this.catchResponse(e));
    // }

    /**
     * Get _isLoadSet flag
     * @returns {bool}
     */
    // getIsLoadSet() {
    //     // если указано запрашивать списки, то set тоже запрашиваем
    //     if (Object.keys(this.loadLists).length > 0) {
    //         return true;
    //     }

    //     return this._isLoadSet;
    // }

    /**
     * Get and set lists
     * @returns {array}
     */
    // async getLists() {
    //     if (Object.keys(this.loadLists).length === 0) {
    //         return {};
    //     }

    //     var set = await this.set();

    //     this.lists = {};

    //     if (set.lists) {
    //         for (let i in set.lists) {
    //             let list = set.lists[i];

    //             if (this.loadLists.includes(i) && !list.items && list.url) {
    //                 let params = {};
    //                 // проставляем зависимости в список параметров к запросу
    //                 if (list.depends) {
    //                     for (let j in list.depends) {
    //                         if (list.depends[j].value) { // статическая зависимость
    //                             params[list.depends[j].key] = list.depends[j].value;
    //                         } else if (list.depends[j].attr) { // динамическая зависимость
    //                             // todo: Добавить слушатель изменений на переменную - при изменении перезапрашивать список
    //                             params[list.depends[j].key] = this[list.depends[j].attr];
    //                         }
    //                     }
    //                 }

    //                 list.items = await http.get(list.url, { params: params }).then(response => {
    //                     return response.data.data;
    //                 }).catch(e => this.catchResponse(e));
    //             }

    //             this.lists[i] = list.items ? list.items : [];
    //         }

    //     }

    //     return this.lists;
    // }

    /**
     * Get and set labels
     * @returns {Object}
     */
    // async getLabels() {
    //     let set = await this.set();

    //     if (set.labels) {
    //         this.labels = set.labels;
    //     }

    //     return this.labels;
    // }

    /**
     * Get and set values
     * @returns {Object}
     */
    // async getValues() {
    //     let lists = await this.getLists();

    //     if (lists) {
    //         for (let i in lists) {
    //             if (lists[i].items) {
    //                 this.values[i] = this.getNameById(lists[i].items, this[i]);
    //             }
    //         }
    //     }

    //     return this.values;
    // }

    /**
     * Get all items
     * @returns {array}
     */
    async all() {
        return await http.get(this.getRoutes().index, { params: this.prepareRequest() }).then(/*async*/ response => {
            this.responseData = response.data;
            this.errors = {};

            if (response.data.meta) {
                this.metaTotal = response.data.meta.total;
                this.metaPerPage = response.data.meta.per_page;
            }

            let data = response.data.data;

            return this.collection(data);
        }).catch(e => this.catchResponse(e));
    }

    /**
     * Get all list items
     * @returns {array}
     */
    async allList() {
        return await http.get(this.getRoutes().allList, { params: this.prepareRequest() }).then(response => {
            this.errors = {};

            return response.data.data;
        }).catch(e => this.catchResponse(e));
    }

    /**
     * Get item by id
     * @param {int} id
     * @returns {Service}
     */
    async show(id) {
        id = id || this.id;

        await http.get(this.getRoutes().show.replace('{id}', id), { params: this.prepareRequest() }).then(/*async*/ response => {
            this.applyResponse(response)

            // if (this.getIsLoadSet()) {
            //     await this.set();
            // }
        }).catch(e => this.catchResponse(e));

        return this;
    }

    /**
     * Insert or update item
     * @param {array} attributes 
     * @returns {bool}
     */
    async save(attributes) {
        var request = attributes ? this.prepareRequestAttributes(attributes) : this.prepareRequest();

        if (this.isNewRecord) {
            return await http.post(this.getRoutes().store, request).then(response => {
                this.applyResponse(response);

                return true;
            }).catch(e => this.catchResponse(e));
        } else {
            return await http.put(this.getRoutes().update.replace('{id}', this.id), request).then(response => {
                this.applyResponse(response);

                return true;
            }).catch(e => this.catchResponse(e));
        }
    }

    /**
     * Delete item by id
     * @param {int} id
     * @returns {bool}
     */
    async delete(id) {
        id = id || this.id;

        return await http.delete(this.getRoutes().delete.replace('{id}', id), { params: this.prepareRequestAttributes() }).then(response => {
            this.reset(); // clear object after delete

            this.responseData = response.data;

            return true;
        }).catch(e => this.catchResponse(e));
    }

    /**
     * Soft Delete item by id
     * @param {int} id
     * @returns {bool}
     */
    async softDelete(id) {
        id = id || this.id;

        return await http.delete(this.getRoutes().delete.replace('{id}', id), { params: this.prepareRequestAttributes() }).then(response => {
            this.reset(); // clear object after delete

            this.applyResponse(response);

            return true;
        }).catch(e => this.catchResponse(e));
    }

    /**
     * Delete mass items by id
     * @param {int} id
     * @returns {bool}
     */
    async deleteMass(id) {
        await http.delete(this.getRoutes().deleteMass, { params: { id: id } }).then(response => {
            this.errors = {};
        }).catch(e => this.catchResponse(e));

        return true;
    }

    /**
     * Parse params from url and apply
     */
    parseRequest() {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            let realKey = key.replace('[]', '');

            if (value === '') {
                return;
            }

            // если в строке число, то к нему и приводим
            value = isNaN(+value) ? value : +value;

            if (key === 'per_page') {
                this.metaPerPage = value;
            } else if (realKey === key) {
                this[key] = value;
            } else {
                this[realKey] = this[realKey] ? this[realKey] : [];
                this[realKey].push(value);
            }
        });
    }

    /**
     * Prepare this object for send request
     * @param {bool} isRouteArrays
     * @returns {Object}
     */
    prepareRequest(isRouteArrays) {
        var request = Object.assign({}, this);

        // удаляем дефолтные переменные, чтобы не отправлялись в запросе
        delete request.basePath;
        delete request.isNewRecord;
        delete request.responseData;
        delete request.errors;
        delete request.metaTotal;
        delete request.metaPerPage;
        delete request.expand;
        // delete request.loadLists;
        // delete request.lists;
        // delete request.labels;
        // delete request.values;

        // удаляем переменные начинающиеся с _
        for (let i in request) {
            if (i.startsWith('_')) {
                delete request[i]
            }
        }

        if (this.metaPerPage) {
            request.per_page = this.metaPerPage;
        }

        // обработка массивов для роутов, т.к. там нужно передавать со скобками
        if (isRouteArrays) {
            for (let i in request) {
                if (Array.isArray(request[i])) {
                    request[i + '[]'] = request[i]
                    delete request[i]
                }
            }
        } else { // то что иначе не идет в обработку запроса для роутов, т.к. отправляется всегда
            if (Object.keys(this.expand).length > 0) {
                request.expand = this.expand.join();
            }
        }

        return request;
    }

    /**
     * Prepare this object for send request with attributes
     * @param {bool} isRouteArrays
     * @returns {Object}
     */
    prepareRequestAttributes(attributes) {
        var request = {};

        if (attributes) {
            for (let attr of attributes) {
                request[attr] = this[attr];
            }
        }

        if (Object.keys(this.expand).length > 0) {
            request.expand = this.expand.join();
        }

        return request;
    }

    /**
     * Apply response data to service
     * @param {Object} response
     */
    applyResponse(response) {
        this.responseData = response.data;

        this.setAttributes(response.data.data);

        this.isNewRecord = false;
        this.errors = {};
    }

    /**
     * Change array to one level
     * @param {array} arr
     * @returns {array}
     */
    arrOneLevel(arr) {
        for (var i in arr) {
            if (typeof arr[i] !== 'string') {
                arr[i] = arr[i].join(', ');
            }
        }

        return arr;
    }

    /**
     * Get name by id in Object
     * @param {array} items
     * @param {int} id
     * @returns {string}
     */
    // getNameById(items, id) {
    //     for (var i in items) {
    //         if (items[i].id === id) {
    //             return items[i].name;
    //         }
    //     }
    // }

    /**
     * Data to service object
     * @param {Object} data
     * @returns {Service}
     */
    /*async*/ item(data) {
        let service = this.newObjectAttr();
        service.isNewRecord = false;
        service.setAttributes(data);

        // if (this.getIsLoadSet()) {
        //     service._setData = await this.set();
        //     service.lists = this.lists;
        //     service.labels = this.labels;
        //     service.values = this.values;
        // }

        return service;
    }

    /**
     * Array to service collection
     * @param {array} items
     * @returns {array}
     */
    /*async*/ collection(items) {
        let collection = [];
        for (let data of items) {
            let item = /*await*/ this.item(data);

            collection.push(item);
        }

        return collection;
    }

    /**
     * Set errors from response error
     * @param {object} error
     */
    catchResponse(error) {
        let response = error.response;
        this.responseData = response.data;

        if (response.status === 422) {
            if (response.data.errors) {
                this.errors = this.arrOneLevel(response.data.errors);
            } else {
                this.errors = { [response.status]: response.status + ': ' + t('Validate error') };
            }
        } else if (response.status === 403) {
            this.errors = { [response.status]: response.status + ': ' + t('Access denied') };
        } else if (response.status === 404) {
            this.errors = { [response.status]: response.status + ': ' + t('Not found') };
        } else {
            this.errors = { [response.status]: response.status + ': ' + t('Error') };
        }
    }

    /**
     * Get first error
     * @param {string} key
     * @returns {string}
     */
    getError(key) {
        if (Object.keys(this.errors).length) {
            key = key || Object.keys(this.errors)[0];
            return this.errors[key];
        }

        return null
    }

}

export default Service;