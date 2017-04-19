/**
 * External dependencies
 */
import React, { Component } from 'react';
import { flowRight, isEqual, omit, pick } from 'lodash';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { protectForm } from 'lib/protect-form';
import trackForm from 'lib/track-form';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSettings } from './state/selectors';
import QuerySettings from './query-settings';

const wrapSettingsForm = getFormSettings => SettingsForm => {
	class WrappedSettingsForm extends Component {
		componentWillMount() {
			if ( getFormSettings ) {
				this.props.replaceFields( getFormSettings( this.props.settings ) );
			}
		}

		componentDidUpdate( prevProps ) {
			if ( prevProps.siteId !== this.props.siteId ) {
				const newSiteFields = getFormSettings( this.props.settings );

				this.props.clearDirtyFields();
				this.props.replaceFields( newSiteFields );
			} else if (
				! isEqual( prevProps.settings, this.props.settings ) ||
				! isEqual( prevProps.fields, this.props.fields )
			) {
				this.updateDirtyFields();
			}
		}

		updateDirtyFields() {
			const currentFields = this.props.fields;
			const persistedFields = getFormSettings( this.props.settings );

			// Compute the dirty fields by comparing the persisted and the current fields
			const previousDirtyFields = this.props.dirtyFields;
			/*eslint-disable eqeqeq*/
			const nextDirtyFields = previousDirtyFields.filter( field => ! ( currentFields[ field ] == persistedFields[ field ] ) );
			/*eslint-enable eqeqeq*/

			// Update the dirty fields state without updating their values
			if ( 0 === nextDirtyFields.length ) {
				this.props.markSaved();
			} else {
				this.props.markChanged();
			}

			this.props.clearDirtyFields();
			this.props.updateFields( pick( currentFields, nextDirtyFields ) );

			// Set the new non dirty fields
			const nextNonDirtyFields = omit( persistedFields, nextDirtyFields );
			this.props.replaceFields( nextNonDirtyFields );
		}

		handleChange = field => event => {
			this.props.updateFields( { [ field ]: event.target.value } );
		};

		handleRadio = event => {
			const name = event.currentTarget.name;
			const value = event.currentTarget.value;

			this.props.updateFields( { [ name ]: value } );
		};

		handleSelect = event => {
			const { name, value } = event.currentTarget;
			// Attempt to cast numeric fields value to int.
			const parsedValue = parseInt( value, 10 );

			this.props.updateFields( { [ name ]: isNaN( parsedValue ) ? value : parsedValue } );
		};

		handleToggle = name => () => {
			this.props.updateFields( { [ name ]: ! this.props.fields[ name ] } );
		};

		render() {
			const utils = {
				handleChange: this.handleChange,
				handleRadio: this.handleRadio,
				handleSelect: this.handleSelect,
				handleToggle: this.handleToggle,
			};

			return (
				<div>
					<QuerySettings siteId={ this.props.siteId } />
					<SettingsForm { ...this.props } { ...utils } />
				</div>
			);
		}
	}

	const connectComponent = connect(
		state => {
			const siteId = getSelectedSiteId( state );
			const settings = Object.assign( {}, getSettings( state, siteId ), {
				// Miscellaneous
				cache_compression_disabled: false,
				cache_hello_world: false,

				// Advanced
				cache_disable_locking: false,
				cache_mobile_browsers: 'w3c , w3c-, acs-, alav, alca, amoi, audi, avan, benq, bird, blac, ' +
					'blaz, brew, cell, cldc, cmd-, dang, doco, eric, hipt, htc_, inno, ipaq, ipod, jigs, kddi, ' +
					'keji, leno, lg-c, lg-d, lg-g, lge-, lg/u, maui, maxo, midp, mits, mmef, mobi, mot-, moto, ' +
					'mwbp, nec-, newt, noki, palm, pana, pant, phil, play, port, prox, qwap, sage, sams, sany, ' +
					'sch-, sec-, send, seri, sgh-, shar, sie-, siem, smal, smar, sony, sph-, symb, t-mo, teli, ' +
					'tim-, tosh, tsm-, upg1, upsi, vk-v, voda, wap-, wapa, wapi, wapp, wapr, webc, winw, winw, xda , xda-',
				cache_mobile_prefixes: 'w3c , w3c-, acs-, alav, alca, amoi, audi, avan, benq, bird, blac, ' +
					'blaz, brew, cell, cldc, cmd-, dang, doco, eric, hipt, htc_, inno, ipaq, ipod, jigs, kddi, ' +
					'keji, leno, lg-c, lg-d, lg-g, lge-, lg/u, maui, maxo, midp, mits, mmef, mobi, mot-, moto, ' +
					'mwbp, nec-, newt, noki, palm, pana, pant, phil, play, port, prox, qwap, sage, sams, sany, ' +
					'sch-, sec-, send, seri, sgh-, shar, sie-, siem, smal, smar, sony, sph-, symb, t-mo, teli, ' +
					'tim-, tosh, tsm-, upg1, upsi, vk-v, voda, wap-, wapa, wapi, wapp, wapr, webc, winw, winw, xda , xda-',
				cache_mutex_disabled: false,

				// Expiry Time & Garbage Collection
				cache_gc_email_me: false,
				cache_schedule_interval: 'five_minutes_interval',
				cache_next_gc: '2017-03-23 17:45:16 UTC',

				// Accepted Filenames & Rejected URIs
				accepted_files: 'wp-comments-popup.php',
				rejected_uri: 'wp-.*\.php',

				// Rejected User Agents
				rejected_user_agent: 'bot\nia_archive\nslurp\ncrawl\nspider\nYandex',

				// Lock Down
				lock_down: false,

				// Directly Cached Files
				cache_direct_pages: [
					'/about/',
					'/home/',
				],
				cache_readonly: false,
				cache_writable: false,

				// Preload
				preload_refresh: true,	// New setting for refresh toggle switch.
			} );

			return {
				settings,
				siteId,
			};
		},
	);

	return flowRight(
		connectComponent,
		localize,
		trackForm,
		protectForm,
	)( WrappedSettingsForm );
};

export default wrapSettingsForm;
