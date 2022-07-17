class Arr {

    /**
     * Get sum of elements
     * @param {Array} arr 
     * @returns imt
     */
    sum(arr) {
        let sum = 0;

        for (let i in arr) {
            sum += parseInt(arr[i]);
        }

        return sum;
    }
}

export default new Arr();