import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ListBox from '@braincube/react-components/lib/ListBox';
import 'babel-polyfill';

export default class AvailableVariables extends Component {
    render() {
        const options = [];
        for (const id in this.props.tab) {  // eslint-disable-line no-restricted-syntax
            if (id !== undefined) {
                options.push({ key: id, value: this.props.tab[id] });
            }
        }

        return (
            <ListBox
                ref={(listBox) => { this.listBox = listBox; }}
                name="variables"
                width={345}
                listHeight={200}
                oneElementHeight={25}
                list={options}
                noResultLabel="No result available"
                noDataLabel="No data"
                scrollbarThickness={30}
            />
        );
    }
}

AvailableVariables.propTypes = {
    /** Un tableau contenant les éléments à afficher dans la listBox */
    tab: PropTypes.object.isRequired
};
