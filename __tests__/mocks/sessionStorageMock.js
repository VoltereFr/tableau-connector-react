import {pandasIsActive} from "../../src/SessionStorageManagement";

class sessionStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value.toString();
    }

    removeItem(key) {
        delete this.store[key];
    }
    pandasIsActive(){
        return true
    }
}

global.sessionStorage = new sessionStorageMock;
