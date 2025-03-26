import { useBlockProps, InspectorControls, BlockAlignmentToolbar, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	MultiSelectControl,
	BaseControl,
	RangeControl,
	Button
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default function SearchModalBlockEdit( { attributes, setAttributes } ) {
	// Attributes coming from block.json
	const {
		buttonText = __( 'Search by Criteria', 'hrdc-custom-tools' ),
		containerClass = '',
		containerStyle = '',
		align = 'none',
		borderColor = '#ccc',
		borderRadius = 4,
		backgroundColor = '#fff',
		showFields = true,
		// If you want the city and demographic values saved, add them as attributes:
		city = '',
		reservedFor = ''
	} = attributes;

	// Local state for other filter fields (for preview only)
	const [ filters, setFilters ] = useState({
		felonies: 'no',
		creditCheck: 'no',
		// Using an array for multi‑select (bedrooms/unit types)
		unitTypes: [],
		petsAllowed: 'no',
		socialSecurity: 'no',
		category: ''
	});

	const blockProps = useBlockProps();

	// Helper for rendering a number input using RangeControl wrapped in a TextControl style.
	const renderNumberControl = ( label, attr, min, max, onChange ) => (
		<RangeControl
			label={ label }
			value={ attr }
			onChange={ onChange }
			min={ min }
			max={ max }
		/>
	);

	return (
		<>
			<InspectorControls>
				{/* Modal Panel for trigger button styling */}
				<PanelBody title={ __( 'Modal Panel', 'hrdc-custom-tools' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Button Text', 'hrdc-custom-tools' ) }
						value={ buttonText }
						onChange={ ( val ) => setAttributes({ buttonText: val }) }
					/>
					<PanelColorSettings
						title={ __( 'Button Background Color', 'hrdc-custom-tools' ) }
						initialOpen={ false }
						colorSettings={[
							{
								value: backgroundColor,
								onChange: ( val ) => setAttributes({ backgroundColor: val }),
								label: __( 'Background Color', 'hrdc-custom-tools' )
							}
						]}
					/>
					<PanelColorSettings
						title={ __( 'Button Border Color', 'hrdc-custom-tools' ) }
						initialOpen={ false }
						colorSettings={[
							{
								value: borderColor,
								onChange: ( val ) => setAttributes({ borderColor: val }),
								label: __( 'Border Color', 'hrdc-custom-tools' )
							}
						]}
					/>
					{ renderNumberControl( __( 'Button Border Radius (px)', 'hrdc-custom-tools' ), borderRadius, 0, 50, ( val ) => setAttributes({ borderRadius: val }) ) }
					<PanelBody title={ __( 'Block Alignment', 'hrdc-custom-tools' ) } initialOpen={ false }>
						<BaseControl label={ __( 'Alignment', 'hrdc-custom-tools' ) }>
							<BlockAlignmentToolbar
								value={ align }
								onChange={ ( newAlign ) => setAttributes({ align: newAlign }) }
							/>
						</BaseControl>
					</PanelBody>
				</PanelBody>

				{/* Button Panel for meta field label styling */}
				<PanelBody title={ __( 'Button Panel', 'hrdc-custom-tools' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Label Text', 'hrdc-custom-tools' ) }
						value={ reservedFor }
						onChange={ ( val ) => setAttributes({ reservedFor: val }) }
						help={ __( 'This field is used as the label for the demographic question.', 'hrdc-custom-tools' ) }
					/>
					<TextControl
						label={ __( 'Label Font', 'hrdc-custom-tools' ) }
						value={ attributes.labelFont || '' }
						onChange={ ( val ) => setAttributes({ labelFont: val }) }
						help={ __( 'e.g., Arial, sans-serif', 'hrdc-custom-tools' ) }
					/>
					<SelectControl
						label={ __( 'Label Font Weight', 'hrdc-custom-tools' ) }
						value={ attributes.labelFontWeight || 'normal' }
						options={[
							{ label: __( 'Normal', 'hrdc-custom-tools' ), value: 'normal' },
							{ label: __( 'Bold', 'hrdc-custom-tools' ), value: 'bold' }
						]}
						onChange={ ( val ) => setAttributes({ labelFontWeight: val }) }
					/>
					<RangeControl
						label={ __( 'Label Text Size (px)', 'hrdc-custom-tools' ) }
						value={ attributes.labelTextSize || 14 }
						onChange={ ( val ) => setAttributes({ labelTextSize: val }) }
						min={ 10 }
						max={ 36 }
					/>
				</PanelBody>

				{/* Meta Fields Visibility */}
				<PanelBody title={ __( 'Meta Fields Visibility', 'hrdc-custom-tools' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show Meta Fields', 'hrdc-custom-tools' ) }
						checked={ showFields }
						onChange={ ( val ) => setAttributes({ showFields: val }) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{/* Editor Preview: Always show the button */}
				<div className="search-modal-editor-preview" style={ { textAlign: align, marginBottom: '10px' } }>
					<button className="btn" style={ {
						backgroundColor: backgroundColor,
						border: `1px solid ${ borderColor }`,
						borderRadius: `${ borderRadius }px`,
						padding: '10px'
					} }>
						{ buttonText }
					</button>
				</div>
				{/* Editor Preview: Show modal fields below the button if toggled on */}
				{ showFields && (
					<div className="modal-fields-editor-preview" style={ {
						border: '1px solid #eee',
						padding: '10px',
						textAlign: 'center'
					} }>
						{/* City and Demographic fields are saved attributes */}
						<div className="modal-field">
							<label htmlFor="hrdc-city">{ __( 'City', 'hrdc-custom-tools' ) }</label>
							<SelectControl
								id="hrdc-city"
								value={ city }
								options={[
									{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
									{ label: 'Bozeman', value: 'bozeman' },
									{ label: 'Belgrade', value: 'belgrade' },
									{ label: 'West Yellowstone', value: 'west yellowstone' },
									{ label: 'Livingston', value: 'livingston' },
									{ label: 'Clyde Park', value: 'clyde park' },
									{ label: 'Emigrant', value: 'emigrant' },
								]}
								onChange={ ( value ) => setAttributes({ city: value }) }
							/>
						</div>
						<div className="modal-field">
							<label htmlFor="hrdc-demographic">{ __( 'Demographic', 'hrdc-custom-tools' ) }</label>
							<SelectControl
								id="hrdc-demographic"
								value={ reservedFor }
								options={[
									{ label: __( 'None of the above', 'hrdc-custom-tools' ), value: '' },
									{ label: 'Senior (55+)', value: 'senior (55+)' },
									{ label: 'Senior (62+)', value: 'senior (62+)' },
									{ label: 'Person with Disabling Condition', value: 'person with disabling condition' },
								]}
								onChange={ ( value ) => setAttributes({ reservedFor: value }) }
							/>
						</div>
						{/* Additional fields using local state */}
						<SelectControl
							label={ __( 'Do you have a felony conviction?', 'hrdc-custom-tools' ) }
							value={ filters.felonies }
							options={[
								{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
								{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
							]}
							onChange={ ( value ) => setFilters( { ...filters, felonies: value } ) }
						/>
						<SelectControl
							label={ __( 'Do you have good credit (above 600+)?', 'hrdc-custom-tools' ) }
							value={ filters.creditCheck }
							options={[
								{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
								{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
							]}
							onChange={ ( value ) => setFilters( { ...filters, creditCheck: value } ) }
						/>
						<MultiSelectControl
							label={ __( 'Unit Types', 'hrdc-custom-tools' ) }
							value={ filters.unitTypes }
							options={[
								{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
								{ label: 'Studio', value: 'studio' },
								{ label: '1 bedroom', value: '1 bedroom' },
								{ label: '2 bedrooms', value: '2 bedrooms' },
								{ label: '3 bedrooms', value: '3 bedrooms' },
								{ label: '4+ bedrooms', value: '4+ bedrooms' }
							]}
							onChange={ ( value ) => setFilters( { ...filters, unitTypes: value } ) }
						/>
						<SelectControl
							label={ __( 'Are you looking for pet friendly units (for non‑service animals)?', 'hrdc-custom-tools' ) }
							value={ filters.petsAllowed }
							options={[
								{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
								{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
							]}
							onChange={ ( value ) => setFilters( { ...filters, petsAllowed: value } ) }
						/>
						<SelectControl
							label={ __( 'Do you have a social security number?', 'hrdc-custom-tools' ) }
							value={ filters.socialSecurity }
							options={[
								{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
								{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' }
							]}
							onChange={ ( value ) => setFilters( { ...filters, socialSecurity: value } ) }
						/>
						<SelectControl
							label={ __( 'Housing Types', 'hrdc-custom-tools' ) }
							value={ filters.category }
							options={[
								{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
								{ label: 'Low Income Tax Credit', value: 'low income tax credit' },
								{ label: 'Subsidized Housing', value: 'subsidized housing' },
								{ label: 'Market Rate', value: 'market rate' }
							]}
							onChange={ ( value ) => setFilters( { ...filters, category: value } ) }
						/>
						<div style={ { marginTop: '20px' } }>
							<Button isPrimary onClick={ () => console.log( filters ) } style={ { marginRight: '10px' } }>
								{ __( 'Apply Filters', 'hrdc-custom-tools' ) }
							</Button>
							<Button onClick={ () => console.log( 'Reset Filters' ) }>
								{ __( 'Reset Filters', 'hrdc-custom-tools' ) }
							</Button>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
