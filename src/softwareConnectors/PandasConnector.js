import 'babel-polyfill';
import { disableClosePandasServer, disablePandasConnection } from '../SessionStorageManagement';

/**
 * Used when validating the data to retrieve, will match the data in order to put them in Tableau
 */
export default class PandasConnector {
    async submitData(selectedVariables, memoryBase, startDate, endDate, braincubeName, ssotoken, listOfDatadefs) {
        const content = {
            selectedVariableList: selectedVariables,
            memoryBaseSelected: memoryBase,
            startDate: startDate,
            endDate: endDate,
            braincubeName: braincubeName,
            ssoToken: ssotoken,
            listOfDatadefs: listOfDatadefs
        };
        await fetch('http://localhost:5000/data', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json' }),
            body: JSON.stringify(content)
        });
        await fetch('http://localhost:5000/close');
        disablePandasConnection();
        disableClosePandasServer();
    }
}
