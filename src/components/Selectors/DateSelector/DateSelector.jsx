import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'babel-polyfill';

export default class DateSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedDate: moment() };
    }

    handleChangeDate = (date) => {
        this.setState({ selectedDate: date }, this.props.onChange(date));
    };

    render() {
        return (
            <DatePicker
                selected={this.state.selectedDate}
                onChange={this.handleChangeDate}
            />
        );
    }
}

DateSelector.propTypes = {
    /** La function à utiliser au changement de date */
    onChange: PropTypes.func.isRequired
};
