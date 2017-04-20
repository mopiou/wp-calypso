/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import CompactFormToggle from 'components/forms/form-toggle/compact';
import FormLabel from 'components/forms/form-label';
import FormTextArea from 'components/forms/form-textarea';
import FormTextInput from 'components/forms/form-text-input';

export default class ProductFormDetailsCard extends Component {

	static propTypes = {
		product: PropTypes.shape( {
			id: PropTypes.isRequired,
			type: PropTypes.string.isRequired,
			name: PropTypes.string,
		} ),
		editProduct: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( props );

		this.setName = this.setName.bind( this );
		this.setDescription = this.setDescription.bind( this );
		this.toggleFeatured = this.toggleFeatured.bind( this );
	}

	setName( e ) {
		const { product, editProduct } = this.props;
		editProduct( product, { name: e.target.value } );
	}

	setDescription( e ) {
		const { product, editProduct } = this.props;
		editProduct( product, { description: e.target.value } );
	}

	toggleFeatured() {
		const { product, editProduct } = this.props;
		editProduct( product, { featured: ! product.featured } );
	}

	render() {
		const { product } = this.props;
		const __ = i18n.translate;
		return (
			<Card className="products__product-form-details">
				<div className="products__product-form-details-featured">
					<FormLabel>
						{ __( 'Featured' ) }
						<CompactFormToggle
							onChange={ this.toggleFeatured }
							checked={ product.featured }
						/>
					</FormLabel>
				</div>
				<div className="products__product-form-details-wrapper">
					<div className="products__product-form-details-images">

					</div>
					<div className="products__product-form-details-basic">
						<FormLabel>
							<span>{ __( 'Product name' ) }</span>
							<FormTextInput value={ product.name || '' } onChange={ this.setName } />
						</FormLabel>
						<FormLabel className="products__product-form-details-basic-description">
							<span>{ __( 'Description' ) }</span>
							<FormTextArea value={ product.description || '' } onChange={ this.setDescription } />
						</FormLabel>
					</div>
				</div>
			</Card>
		);
	}

}
