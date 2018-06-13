import 'babel-polyfill';
import { Fetcher, JSO } from 'jso';
import { Braindata, Braincube, BrainWsEnums } from '@braincube/brain-ws-js';

const BCClientId = WEB_PATH_CONF.BCClientId; // eslint-disable-line
const Domain = WEB_PATH_CONF.Domain; // eslint-disable-line
const RedirectURI = WEB_PATH_CONF.RedirectURI; // eslint-disable-line
const SsoServer = `https://${Domain}`;
const AuthorizationPage = `${SsoServer}/sso-server/vendors/braincube/authorize.jsp`;
const SSOUrl = `${SsoServer}/sso-server/ws/oauth2/me`;
const sessionURL = `${SsoServer}/sso-server/rest/session/openWithToken`;

export default class BraincubeConnector {
    constructor() {
        this.jso = new JSO({
            providerID: 'braincube',
            client_id: BCClientId,
            response_type: 'token',
            redirect_uri: RedirectURI,
            authorization: AuthorizationPage,
            scopes: { request: ['BASE', 'API'] }
        });
        this.BrainDataWs = null;
        this.BraincubeWs = null;
        this.ssoToken = null;
        this.listOfDatadefs = null;
        this.memoryBaseSelected = null;
        this.braincubeName = null;

        this.userInfo = {};
        this.memoryBase = {};
        this.variables = {};
        // check whether the user is coming back from the authorization page with a token. This will pick up the access token
        this.jso.callback();
    }

    /**
     * If a token is already available, show immediatly the "Connected component in the view
     * @returns {Promise<boolean>}
     */
    async isConnected() {
        if (await this.jso.checkToken()) {
            const result = await this.getUserInfo();
            if (result) {
                return true;
            } else {
                return Promise.reject(new Error());
            }
        } else {
            return false;
        }
    }

    async connectToBraincube() {
        await this.jso.getToken(); // eslint-disable-line
        await this.getUserInfo();
        return true;
    }

    disconnectFromBraincube() {
        BraincubeConnector.deleteAllCookies();
        this.jso.wipeTokens();
        return false;
    }

    static deleteAllCookies() {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
    }

    /**
     * Retrieve the informations of the user who login
     * @returns {Promise<void>}
     */
    async getUserInfo() {
        const braincubeList = [];
        const data = await new Fetcher(this.jso).fetch(SSOUrl, {});
        const sso = await new Fetcher(this.jso).fetch(sessionURL, {});
        const userInfos = await data.json();
        const session = await sso.json();
        for (const index in session.accessList) { // eslint-disable-line
            if (session.accessList[index].product.type === 'braincube') {
                braincubeList.push(
                    { name: session.accessList[index].product.name, id: session.accessList[index].product.productId }
                );
            }
        }
        this.ssoToken = session.token;
        this.userInfo = { userFullName: userInfos.userFullName, allowedProducts: braincubeList };
        if (this.userInfo.allowedProducts[0] !== undefined) {
            return await this.onBraincubeSelected(this.userInfo.allowedProducts[0].name);
        }
        return Promise.reject(new Error('No data to select'));
    }

    /**
     * Returns the list of available memoryBases for the braincube selected in the view
     * @param braincube name of the selected braincube
     * @returns {Promise<*>} a list of memoryBases
     */
    async onBraincubeSelected(braincube) {
        this.braincubeName = braincube;
        this.BrainDataWs = new Braindata(`${braincube}.${Domain}`, this.ssoToken);
        this.BraincubeWs = new Braincube(`${braincube}.${Domain}`, this.ssoToken);
        const mbData = await new Promise((resolve, reject) => {
            this.BraincubeWs.getAllMemoryBases(
                { onSuccess: resolve, onError: reject },
                BrainWsEnums.RenderingMode.SELECTOR
            );
        });
        return await this.getMemoryBaseList(mbData);
    }

    /**
     * Sort and format the returned data to display the available MBs
     * @param data
     * @returns {Promise<void>} array of type mb.id = mb.name + mb.nbVariables
     */
    async getMemoryBaseList(data) {
        const mb = data.response.items;
        const memoryBases = {};
        for (const i in mb) {  // eslint-disable-line no-restricted-syntax
            if (!mb[i].quickStudy) {
                memoryBases[mb[i].bcId] = `${mb[i].name} - ${mb[i].numberOfVariables} variables`;
            }
        }
        if (Object.keys(memoryBases).length > 0) {
            this.variables = await this.getVariablesOnMemoryBaseSelected(Object.keys(memoryBases)[0]);
        }
        this.memoryBase = memoryBases;
        return memoryBases;
    }

    /**
     * Ask the list of the available variables for the memoryBase and return a sorted and formatted array to display variables
     * @param mbId the id of the memorybase selected
     * @returns {Promise<void>} array of type var.id = var.name
     */
    async getVariablesOnMemoryBaseSelected(mbId) {
        const variables = {};

        const data = await new Promise((resolve, reject) => {
            this.BrainDataWs.getMemoryBase(
                `mb${mbId}`,
                { onSuccess: (mbData) => {
                    this.memoryBaseSelected = mbData;
                    this.BraincubeWs.getDataProperties(
                        mbId, null, { onSuccess: resolve, onError: reject },
                        BrainWsEnums.RenderingMode.SELECTOR);
                },
                    onError: reject
                },
                BrainWsEnums.BraindataViewType.SIMPLE
            );
        });

        this.listOfDatadefs = data.response.items;
        for (const i in this.listOfDatadefs) {  // eslint-disable-line no-restricted-syntax
            if (i !== undefined) {
                variables[`mb${mbId}/d${this.listOfDatadefs[i].id}`] = this.listOfDatadefs[i].local;
            }
        }
        return variables;
    }

}
