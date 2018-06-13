import 'babel-polyfill';
import { Braindata } from '@braincube/brain-ws-js';

/**
 * Used when validating the data to retrieve, will match the data in order to put them in Tableau
 */
export default class TableauConnector {
    submitData(selectedVariables, memoryBase, startDate, endDate, braincubeName, ssotoken, listOfDatadefs) {
        // add the referenceDate datadef if the checkbox is clicked and it wasn't already in the selected boxes
        if (selectedVariables.indexOf(memoryBase.referenceDate) === -1) {
            selectedVariables.push(memoryBase.referenceDate);
        }
        // map the selected ids to the actual datadefs
        const selectedDatadefs = [];
        for (const i in memoryBase.datadefs) { // eslint-disable-line no-restricted-syntax
            if (selectedVariables.indexOf(memoryBase.datadefs[i].id) !== -1) {
                selectedDatadefs.push(memoryBase.datadefs[i]);
            }
        }

        // map each datadef to a column description
        const cols = [];
        for (const i in selectedDatadefs) { // eslint-disable-line no-restricted-syntax
            if (i !== undefined) {
                cols.push(this.datadefToTableauColumn(selectedDatadefs[i], listOfDatadefs));
            }
        }

        const tableauSchema = {
            id: `${braincubeName}_${memoryBase.name}_data`,
            alias: `${braincubeName}_${memoryBase.name} Data`,
            columns: cols
        };
        tableau.log(tableauSchema); // eslint-disable-line no-undef
        tableau.connectionName = 'Braincube'; // eslint-disable-line no-undef

        // save all important data in an object and place it in Tableau's API
        tableau.connectionData = JSON.stringify({ // eslint-disable-line no-undef
            base: memoryBase,
            braincube: braincubeName,
            date_from: startDate,
            date_to: endDate,
            schema: tableauSchema,
            selected_datadefs: selectedVariables,
            token: ssotoken
        });
        tableau.submit(); // eslint-disable-line no-undef
    }
    /** ******************************
     * TABLEAU REQUIRED METHODS
     ********************************* **/

    /**
     * Function called by tableau to retrieve the database schema.
     * Since we have the schema already determined by what the user selected (see #on_submit_clicked), we just have to return it
     */
    getSchema(schemaCallback) {
        const ctx = JSON.parse(tableau.connectionData); // eslint-disable-line no-undef
        const schema = [ctx.schema];
        schemaCallback(schema);
    }

    /**
     * This function is called for each table to retrieve data from it.
     * You should call the doneCallback when finished. This is the place where we prepare a query to braincube for retrieving
     * all data in a certain interval.
     */
    getData = async (table, doneCallback) => { // eslint-disable-line max-statements
        tableau.log('Data asked'); // eslint-disable-line no-undef
        const ctx = JSON.parse(tableau.connectionData); // eslint-disable-line no-undef
        const mb = ctx.base;
        const datadefArgs = {
            order: mb.referenceDate,
            definitions: ctx.selected_datadefs,
            context: {
                dataSource: mb.name,
                filter: { BETWEEN: [mb.order, ctx.date_from, ctx.date_to] }
            }
        };

        const braindataWs = new Braindata(`${ctx.braincube}.test.mybraincube.com`, ctx.token);
        const data = await new Promise((resolve, reject) => {
            braindataWs.getDataFromContext(mb.name,
                { onSuccess: resolve, onError: reject },
                datadefArgs
            );
        });
        tableau.log(data); // eslint-disable-line no-undef

        // tableau des fonctions de cast pour chaque donnée
        const casting = [];
        for (const i in data.response.datadefs) { // eslint-disable-line no-restricted-syntax
            if (i !== undefined) {
                casting.push(this.getCastFunction(data.response.datadefs[i].id, ctx.schema));
            }
        }
        if (data.response.datadefs.length === 0) {
            tableau.log('No data in table. Skipping'); // eslint-disable-line no-undef
            doneCallback();
            return;
        }

        // nombre d'éléments à insérer:
        const count = data.response.datadefs[0].data.length;
        let rows = [];
        for (let i = 0; i < count; i++) {
            // create a record that contains all values of current iteration
            const record = [];
            for (let dataIdx = 0; dataIdx < data.response.datadefs.length; dataIdx++) {
                record.push(casting[dataIdx](data.response.datadefs[dataIdx].data[i]));
            }
            rows.push(record);

            if (rows.length % 500 === 0) {
                tableau.reportProgress(`Progress:${i}/${count}`); // eslint-disable-line no-undef
                table.appendRows(rows);
                rows = [];
            }
        }
        // the last iteration might not have exactly 1000 elements:
        if (rows.length !== 0) {
            tableau.reportProgress(`Final insert of ${rows.length} elements`); // eslint-disable-line no-undef
            table.appendRows(rows);
        }

        doneCallback();
    };

    /**
     * To convert dates retrieved from Braincube to usable dates
     * @param BCDateString date to format
     * @returns {Date} usable date
     */
    static BCDatetoJSDate(BCDateString) {
        if (BCDateString === 'null') {
            return new Date();
        }
        try {
            const splitted = BCDateString.split('_');
            const yyyymmdd = splitted[0];
            const hhmmdd = splitted[1];

            const year = yyyymmdd.substring(0, 4);
            const month = yyyymmdd.substring(4, 6);
            const day = yyyymmdd.substring(6, 8);

            const hour = hhmmdd.substring(0, 2);
            const minute = hhmmdd.substring(2, 4);

            const dateString = `${year}/${month}/${day} ${hour}:${minute}`;

            return new Date(dateString);
        } catch (e) {
            return new Date();
        }
    }

    /**
     * Convert the Braincube types into a Tableau type
     * @param type the braincube type
     * @returns {*} a tableau type
     */
    braincubeToTableauType(type) {
        if (type === 'NUMERIC') {
            return tableau.dataTypeEnum.float; // eslint-disable-line no-undef
        } else if (type === 'DISCRET') {
            return tableau.dataTypeEnum.string; // eslint-disable-line no-undef
        } else if (type === 'DATETIME') {
            return tableau.dataTypeEnum.datetime; // eslint-disable-line no-undef
        } else {
            return tableau.dataTypeEnum.string; // eslint-disable-line no-undef
        }
    }
    /**
     * Returs a cast function that will interpret values coming from braincube into the format used by tableau.
     * @param DDId the datadef to cast
     * @param schema the tableau schema
     * @returns {*} a function that tries to parse the datadef value into a tableau type.
     */
    getCastFunction(DDId, schema) {
        const tableauType = this.getTableauTypeFromSchema(DDId, schema);
        if (tableauType === tableau.dataTypeEnum.float) { // eslint-disable-line no-undef
            return parseFloat;
        } else if (tableauType === tableau.dataTypeEnum.datetime) { // eslint-disable-line no-undef
            return TableauConnector.BCDatetoJSDate;
        } else {
            return function (a) { // eslint-disable-line func-names
                return a;
            };
        }
    }
    /**
     * Returns the Tableau type of a Datadef id, according to the tableau schema that we returned
     * @param DDId the datadef id
     * @param schema the schema
     * @returns {*} the tableau type of the datadef, or string if unknown.
     */
    getTableauTypeFromSchema(DDId, schema) {
        const cols = schema.columns;
        const tableauId = DDId.replace(/\//g, '_');
        for (let i = 0; i < cols.length; i++) {
            if (cols[i].id === tableauId) {
                return cols[i].dataType;
            }
        }
        return tableau.dataTypeEnum.string; // eslint-disable-line no-undef
    }

    /**
     * Converts a datadef as returned by braincube api to a suitable column description for tableau
     * @param datadef a braincube datadef
     * @param listOfDatadefs the list of datadefs
     * @returns an object that tableau can use for a column description
     */
    datadefToTableauColumn(datadef, listOfDatadefs) {
        const alias = TableauConnector.getDatadefAlias(datadef, listOfDatadefs);
        return {
            id: datadef.id.replace(/\//g, '_'),
            alias: alias,
            dataType: this.braincubeToTableauType(datadef.type),
            description: alias
        };
    }
    /**
     * Returns the datadef name if available in the list of datadefs passed in arguments, otherwise returns the datadef id
     * @param datadef the datadef for which to retrieve the name
     * @param listOfDatadefs the list of datadefs in which to look for the datadef
     * @returns the datadef human name, or datadef.id if not found
     */
    static getDatadefAlias(datadef, listOfDatadefs) {
        const datadefId = parseInt(datadef.id.split('/d')[1]); // eslint-disable-line radix
        for (const i in listOfDatadefs) { // eslint-disable-line no-restricted-syntax
            if (listOfDatadefs[i].id === datadefId) {
                return listOfDatadefs[i].local;
            }
        }
        return datadef.id;
    }
}
