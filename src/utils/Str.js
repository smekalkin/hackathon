class Str {

    /**
     * Format unixTimestamp to string
     * @param {int|string} date 
     * @returns {srting}
     */
    date(date) {
        if (!date) {
            return date;
        }

        if (Number.isInteger(date)) {
            date *= 1000;
        }
        if (this.isString(date) && date.indexOf('.') === 2) {
            return date;
        }

        var date = new Date(date);
        var day = '0' + date.getDate();
        var month = '0' + (date.getMonth() + 1);
        var year = date.getFullYear();

        return day.substr(-2) + '.' + month.substr(-2) + '.' + year;
    }

    /**
     * Format unixTimestamp to string
     * @param {int|string} date 
     * @returns {srting}
     */
    datetime(date) {
        if (!date) {
            return date;
        }

        if (Number.isInteger(date)) {
            date *= 1000;
        }
        if (this.isString(date) && date.indexOf('.') === 2) {
            return date;
        }

        var date = new Date(date);
        var day = '0' + date.getDate();
        var month = '0' + (date.getMonth() + 1);
        var year = date.getFullYear();
        var hours = '0' + date.getHours();
        var minutes = '0' + date.getMinutes();

        return day.substr(-2) + '.' + month.substr(-2) + '.' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2);
    }

    /**
     * Format money
     * @param {String} str 
     * @returns 
     */
    money(value) {
        if (!value) {
            return value;
        }

        value = +value
        value = value.toLocaleString('ru-Ru').replace(',', '.');

        let valueA = value.split('.');
        if (valueA[1] && valueA[1].length === 1) {
            value += '0';
        }

        return value;
    }

    /**
     * Format money for cashier report
     * @param {String} str 
     * @returns 
     */
    moneyCashier(value) {
        if (!value) {
            return value;
        }

        value = +value
        // value = value.toLocaleString('ru-Ru').replace(',', '=');
        value = value.toLocaleString('ru-Ru', { style: 'currency', currency: 'RUB' }).replace(',', '=').replace('₽', '')

        let valueA = value.split('.');
        if (valueA[1] && valueA[1].length === 1) {
            value += '0';
        }
        
        // Delete &nbsp
        value = value.trim()

        return value;
    }

    /**
     * Format phone
     * @param {Integer} int 
     * @returns 
     */
    phone(num) {
        if (!num) {
            return num;
        }

        if (typeof num !== String) {
            num = new String(num);
        }
        
        let number = num.match(/\d/g, ''),
            joinedNumber = number.join('')

        if (num.length <= 10) {
            let regex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/,
                result = joinedNumber.replace(regex, '+7 ($1) $2-$3-$4')

            return result;
        } else {
            let regex = /^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/,
                result = joinedNumber.replace(regex, '+7 ($2) $3-$4-$5')

            return result;
        }
    }

    /**
     * Copy
     * @param {String} string 
     * @return
     */
    copy(textId) {
        let copyText = document.querySelector(textId).textContent;
        navigator.clipboard.writeText(copyText);
    }

    /**
     * Format snils
     * @param {Integer} int 
     * @returns 
     */
    snils(num) {
        if (!num) {
            return num;
        }

        let number = num.match(/\d/g, ''),
            joinedNumber = number.join(''),
            regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            result = joinedNumber.replace(regex, '$1-$2-$3 $4')

        return result;
    }

    /**
     * Format numbers (20 symbols)
     * @param {Integer} int 
     * @returns 
     */
    numbers(num) {
        if (!num) {
            return num;
        }

        let number = num.match(/\d/g, ''),
            joinedNumber = number.join(''),
            regex = /^(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/,
            result = joinedNumber.replace(regex, '$1 $2 $3 $4 $5')

        return result;
    }

    /**
     * Format string
     * @param {String} str 
     * @param {String} format 
     * @returns {srting}
     */
    format(str, format) {
        if (format === 'date') {
            return this.date(str);
        } else if (format === 'datetime') {
            return this.datetime(str);
        } else if (format === 'money') {
            return this.money(str);
        } else if (format === 'phone') {
            return this.phone(str);
        } else if (format === 'snils') {
            return this.snils(str);
        }

        return str;
    }

    /**
     * Get pathname without /create.. /update.. /123..
     * @returns {srting}
     */
    topPath() {
        let path = document.location.pathname
        let pathA = path.split('/create')
        path = pathA[0]

        pathA = path.split('/update')
        path = pathA[0]

        pathA = path.split('/')
        if (pathA.length > 2) {
            let last = pathA[pathA.length - 1]
            if (last === '' || !isNaN(+last)) {
                pathA.splice(pathA.length - 1, 1)
                path = pathA.join('/')
            }
        }

        return path
    }

    /**
     * Check string
     *
     * @param string
     * @returns {boolean}
     */
    isString(string) {
        return Object.prototype.toString.call(string) === "[object String]"
    }
}

export default new Str();