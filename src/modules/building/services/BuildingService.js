import Service from '../../../services/Service';
import http from '../../../utils/http-common';

class BuildingService extends Service {

    basePath = 'building/index.json';

    newObject() {
        return new BuildingService();
    }

    /**
     * Get item by id
     * @param {int} id
     * @returns {Service}
     */
    async show(id) {
        id = id || this.id;

        await http.get(this.getRoutes().index).then(response => {
            let data = response.data.data;
            // это сделано для теста. Полный бэк конечно будет возвращать конкретный объект, а не коллекцию
            let collection = this.collection(data);
            for (const item of collection) {
                if (item.id == id) {
                    this.setAttributes(item);
                    this.isNewRecord = false;
                    this.errors = {};

                    break;
                }
            }

        }).catch(e => this.catchResponse(e));

        return this;
    }
}

export default BuildingService;