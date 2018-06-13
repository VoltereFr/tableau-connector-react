import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComboBox from '@braincube/react-components/lib/ComboBox';
import 'babel-polyfill';

export default class MemoryBaseSelector extends Component {
    render() {
        const options = [];
        for (const id in this.props.tab) {  // eslint-disable-line no-restricted-syntax
            if (id !== undefined) {
                options.push({ value: id, label: this.props.tab[id] });
            }
        }
        return (
            <ComboBox
                label="Select Base :"
                onChange={this.props.onChange}
                name="memory_base"
                selectedValue={options[0] === undefined ? '' : options[0].value}
                options={options}
            />
        );
    }
}

MemoryBaseSelector.propTypes = {
    /** La function qui indique l'action à effectuer au changement de selection */
    onChange: PropTypes.func.isRequired,
    /** Le tableau contenant les éléments à afficher */
    tab: PropTypes.object.isRequired
};
