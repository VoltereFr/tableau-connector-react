import {pandasIsActive} from "../../src/SessionStorageManagement";

class connectorMoke {
    getSchema(){
        return 'coucou'
    }
    getData(){
            return 'coucou'
        }
}

class tableauMock {
    constructor() {
    }

    makeConnector() {
        return new connectorMoke()
    }

    registerConnector(connector) {
        if(!pandasIsActive())
            connector.init(() => { console.log('ok');});
    }
}

global.tableau = new tableauMock;
