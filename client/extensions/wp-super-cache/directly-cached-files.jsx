/**
 * External dependencies
 */
import React from 'react';
import { pick } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormTextInputWithAction from 'components/forms/form-text-input-with-action';
import SectionHeader from 'components/section-header';
import WrapSettingsForm from './wrap-settings-form';

const DirectlyCachedFiles = ( {
	fields: {
		cache_direct_pages,
		cache_path,
		cache_readonly,
		cache_writable,
	},
	handleChange,
	siteUrl,
	translate,
} ) => {
	cache_direct_pages = cache_direct_pages || [];

	return (
		<div>
			<SectionHeader label={ translate( 'Directly Cached Files' ) }>
				<Button
					compact={ true }
					primary={ true }
					type="submit">
						{ translate( 'Save Settings' ) }
				</Button>
			</SectionHeader>
			<Card className="wp-super-cache__directly-cached-files">
				{ cache_readonly &&
				<p>
				{ translate(
					'{{strong}}Warning!{{/strong}} You must make %(cache_path)s writable to enable this feature. ' +
					'As this is a security risk, please make it read-only after your page is generated.',
					{
						args: { cache_path: cache_path },
						components: { strong: <strong /> },
					}
				) }
				</p>
				}
				{ cache_writable &&
				<p>
				{ translate(
					'{{strong}}Warning!{{/strong}} %(cache_path)s is writable. Please make it readonly after your ' +
					'page is generated as this is a security risk.',
					{
						args: { cache_path: cache_path },
						components: { strong: <strong /> },
					}
				) }
				</p>
				}
				<p>
					{ translate(
						'Directly cached files are files created directly off %(cache_path)s where your blog lives. This ' +
						'feature is only useful if you are expecting a major Digg or Slashdot level of traffic to one post or page.',
						{
							args: { cache_path: cache_path },
						}
					) }
				</p>
					{ ! cache_readonly &&
					<div>
						<p>
							{ translate(
								'For example: to cache {{em}}%(url)s/about/{{/em}}, you would enter %(url)s/about/ or /about/. ' +
								'The cached file will be generated the next time an anonymous user visits that page.',
								{
									args: { url: siteUrl },
									components: { em: <em /> },
								}
							) }
						</p>
						<p>
							{ translate(
								'Make the textbox blank to remove it from the list of direct pages and delete the cached file.'
						) }
						</p>
						<form>
							<FormFieldset>
								<FormTextInput
									onChange={ handleChange( 'new_direct_page' ) } />
							</FormFieldset>

							{ cache_direct_pages.length > 0 &&
							<FormLabel>
								{ translate(
									'Existing Direct Page',
									'Existing Direct Pages',
									{ count: cache_direct_pages.length }
								) }
							</FormLabel>
							}
							{ cache_direct_pages.map( ( page ) => (
								<FormFieldset key={ page }>
									<FormTextInputWithAction
										action={ translate( 'Delete Cached File' ) }
										defaultValue={ page }
										key={ page } />
								</FormFieldset>
							) ) }
						</form>
					</div>
					}
			</Card>
		</div>
	);
};

const getFormSettings = settings => {
	return pick( settings, [
		'cache_direct_pages',
		'cache_path',
		'cache_readonly',
		'cache_writable',
	] );
};

export default WrapSettingsForm( getFormSettings )( DirectlyCachedFiles );
