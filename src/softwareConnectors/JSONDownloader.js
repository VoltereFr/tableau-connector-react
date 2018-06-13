import 'babel-polyfill';
import { Braindata } from '@braincube/brain-ws-js';

/**
 * Used when validating the data to retrieve, construct a json object downloadable by the user
 */
export default class JSONDownloader {
    async submitData(selectedVariables, memoryBase, startDate, endDate, braincubeName, ssotoken, listOfDatadefs) {
        if (selectedVariables.indexOf(memoryBase.referenceDate) === -1) {
            selectedVariables.push(memoryBase.referenceDate);
        }
        const braindataWs = new Braindata(`${braincubeName}.test.mybraincube.com`, ssotoken);
        const context = {
            order: memoryBase.referenceDate,
            definitions: selectedVariables,
            context: {
                dataSource: memoryBase.name,
                filter: { BETWEEN: [memoryBase.order, startDate, endDate] }
            }
        };
        const data = await new Promise((resolve, reject) => {
            braindataWs.getDataFromContext(memoryBase.name,
                { onSuccess: resolve, onError: reject },
                context
            );
        });
        const result = this.getFormattedJson(data.response, listOfDatadefs);
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result))}`;
        const downloadLink = document.getElementById('downloadJson');
        downloadLink.setAttribute('href', dataStr);
        downloadLink.setAttribute('download', `${braincubeName}_${memoryBase.name}.json`);
        downloadLink.click();
    }
    getFormattedJson(data, listOfDatadefs) {
        const format = document.getElementById('jsonFormat');
        if (format.elements['json'].value === 'json1') {  // eslint-disable-line dot-notation
            return this.constructJson1(data, listOfDatadefs);
        } else {
            return this.constructJson2(data, listOfDatadefs);
        }
    }
    constructJson1(data, listOfDatadefs) {
        const result = {};
        for (const i in data.datadefs) { // eslint-disable-line no-restricted-syntax
            if (i !== undefined) {
                result[this.getNameFromId(data.datadefs[i], listOfDatadefs)] = data.datadefs[i];
            }
        }
        return result;
    }
    constructJson2(data, listOfDatadefs) {
        const result = {};
        for (const i in data.datadefs) { // eslint-disable-line no-restricted-syntax
            if (i !== undefined) {
                result[this.getNameFromId(data.datadefs[i], listOfDatadefs)] = data.datadefs[i].data;
            }
        }
        return result;
    }
    getNameFromId(datadef, listOfDatadefs) {
        const id = datadef.id.split('/d')[1];
        for (const i in listOfDatadefs) { // eslint-disable-line no-restricted-syntax
            if (listOfDatadefs[i].id.toString() === id) {
                return listOfDatadefs[i].local;
            }
        }
        return null;
    }
}
