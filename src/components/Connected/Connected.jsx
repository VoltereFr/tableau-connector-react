import 'babel-polyfill';
import Loader from '@braincube/react-components/lib/Loader';
import NotificationManager from '@braincube/react-components/lib/NotificationManager';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../Button/Button';
import BraincubeSelector from '../Selectors/BraincubeSelector/BraincubeSelector';
import MemoryBaseSelector from '../Selectors/MemoryBaseSelector/MemoryBaseSelector';
import AvailableVariables from '../Selectors/AvailableVariables/AvailableVariables';
import DateSelector from '../Selectors/DateSelector/DateSelector';
import JSONDownloader from '../../softwareConnectors/JSONDownloader';

const row = {
    display: 'inline-block',
    width: '100%',
    margin: '10px',
    minHeight: '30px'
};
const labelRow = {
    display: 'inline-block',
    margin: '4px',
    textAlign: 'right'
};

export default class Connected extends Component {
    constructor(props) {
        super(props);
        this.selectedVariableList = null;
        this._refNotificationManager = new NotificationManager();
        this.onSubmit = this.onSubmit.bind(this);
        this.onBraincubeChange = this.onBraincubeChange.bind(this);
        this.onMBChange = this.onMBChange.bind(this);

        const userInfo = this.props.connector.userInfo;
        const mb = this.props.connector.memoryBase;
        const variables = this.props.connector.variables;
        this.state = {
            isLoading: false,
            username: userInfo.userFullName,
            braincube: userInfo.allowedProducts,
            memoryBase: mb,
            variables: variables,
            startDate: moment(),
            endDate: moment()
        };
    }

    async onSubmit() {
        this.setState({ isLoading: true });
        const startDate = this.state.startDate.format('YYYYMMDD_000000');
        const endDate = this.state.endDate.format('YYYYMMDD_hhmmss');
        try {
            await this.props.softwareConnector.submitData(this.selectedVariableList.getSelection(),
                this.props.connector.memoryBaseSelected.response, startDate, endDate, this.props.connector.braincubeName,
                this.props.connector.ssoToken, this.props.connector.listOfDatadefs);
        } catch (e) {
            this._refNotificationManager.error('Can not communicate with the pandas connector, check that it still running',
                null, { label: 'Try again', callback: this.onSubmit });
        }
        this.setState({ isLoading: false });
    }

    async onBraincubeChange(event) {
        this.setState({ isLoading: true });
        try {
            const memoryBase = await this.props.connector.onBraincubeSelected(event.target.value);
            this.setState({ memoryBase: memoryBase, isLoading: false });
            await this.onMBChange(Object.keys(memoryBase)[0]);
        } catch (e) {
            this._refNotificationManager.error('Unable to access to the selected braincube');
            this.setState({ isLoading: false });
        }
    }

    async onMBChange(selectedValue) {
        this.setState({ isLoading: true });
        try {
            const variables = await this.props.connector.getVariablesOnMemoryBaseSelected(selectedValue);
            this.setState({ variables: variables, isLoading: false });
        } catch (e) {
            this._refNotificationManager.error('Unable to access to your variables');
            this.setState({ isLoading: false });
        }
    }

    render() {
        /* eslint-disable */
        return (
            <div>
                <NotificationManager
                    ref={(elt) => {
                        this._refNotificationManager = elt;
                    }}
                    scrollbarThickness={30}
                    zIndex={120}
                />
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={this.props.onDisconnect} text={'Logout'} disable={false} />
                </div>

                <div style={row}>
                    Welcome, <span>{this.state.username}</span>.
                </div>

                <div style={row}>
                    <label htmlFor="products" style={labelRow}>Select the braincube you want to use : </label>
                    <BraincubeSelector tab={this.state.braincube} onChange={this.onBraincubeChange} />
                </div>

                <div style={{ borderLeft: '3px solid black', marginLeft: 'calc(50% - 200px)' }}>
                    <MemoryBaseSelector tab={this.state.memoryBase} onChange={this.onMBChange} />

                    <div style={{ marginLeft: '5%', marginTop: '10px', marginBottom: '10px', textAlign: 'left' }}>
                        <label> Select Variables : </label> {/* eslint-disable */}
                        <AvailableVariables
                            tab={this.state.variables}
                            ref={(availableVariables) => {
                                availableVariables ?
                                    this.selectedVariableList = availableVariables.listBox
                                    :
                                    this.selectedVariableList = null;
                            }}
                        />
                    </div>
                </div>

                <div style={row}>
                    <label style={labelRow}>From Date</label>
                    <DateSelector onChange={(date) => this.setState({ startDate: date })} />
                </div>

                <div style={row}>
                    <label style={labelRow}>To Date</label>
                    <DateSelector onChange={(date) => this.setState({ endDate: date })} />
                </div>

                {this.props.softwareConnector instanceof JSONDownloader ?
                    <div>
                        <a id='downloadJson' style={{display: 'none'}}> </a>
                        <form id='jsonFormat'>
                            <p style={{marginTop: '5px', marginBottom: '0'}}>Json Format :</p>
                            <input type="radio" name="json" value="json1" defaultChecked/>
                            <label htmlFor="contactChoice1">Format 1</label>
                            <input type="radio" name="json" value="json2" />
                            <label htmlFor="contactChoice2">Format 2</label>
                        </form>
                    </div>
                    :
                    <div/>
                }

                <div style={{ textAlign: 'center'}}>
                    <Button onClick={this.onSubmit} text={'Submit'} disable={this.state.isLoading} />
                </div>
                {this.state.isLoading ?
                    <div style={{ marginLeft: 'calc(50% - 40px)' }}>
                        <Loader
                            loaderSize={40}
                            mainColor="#CCCCCC"
                            spinnerColor="#999999"
                            containerHeight={100}
                            containerWidth={100}
                        />
                    </div>
                    :
                    <div />
                }
            </div>
        );
    }
}

Connected.propTypes = {
    /** La classe communiquant avec l'API de Braincube */
    connector: PropTypes.object.isRequired,
    /** La classe communiquant avec le logiciel */
    softwareConnector: PropTypes.object.isRequired,
    /** La function à utiliser à la déconnexion de l'utilisateur */
    onDisconnect: PropTypes.func.isRequired
};
