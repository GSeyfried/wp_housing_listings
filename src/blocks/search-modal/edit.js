import { useBlockProps, InspectorControls, BlockAlignmentToolbar, PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	BaseControl,
	RangeControl,
	Button
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default function SearchModalBlockEdit( { attributes, setAttributes } ) {
	// Attributes coming from block.json
	const {
		containerClass = '',
		containerStyle = '',
		align = 'none',
		borderColor = '#ccc',
		borderRadius = 4,
		backgroundColor = '#fff',
		// Button settings
		buttonText = __( 'Search by Criteria', 'hrdc-custom-tools' ),
		buttonFont = 'inherit',
		buttonTextSize = 14,
		buttonFontWeight = 'normal',
		ButtonSize = 48,
		//Label settings
		labelFont = 'inherit',
		labelTextSize = 14,
		labelFontWeight = 'normal',
		cityShow = true,
		demographicShow = true,
		feloniesShow = true,
		creditCheckShow = true,
		unitTypesShow = true,
		petsShow = true,
		socialSecurityShow = true,
		categoryShow = true,


	} = attributes;

	// Local state for other filter fields (for preview only)
	const [ filters, setFilters ] = useState({
		felonies: 'no',
		creditCheck: 'no',
		unitTypes: '',
		pets: 'no',
		socialSecurity: 'no',
		category: 'Any',
		city: 'Any',
		reservedFor: 'None of the above'
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
				<PanelBody title={ __( 'Button Settings', 'hrdc-custom-tools' ) } initialOpen={ true }>
					<RangeControl
						label={ __( 'Button Size (px)', 'hrdc-custom-tools' ) }
						value={ attributes.ButtonSize || 14 }
						onChange={ ( val ) => setAttributes({ButtonSize: val }) }
						min={ 10 }
						max={ 600 }
					/>
					{ renderNumberControl( __( 'Button Border Radius (px)', 'hrdc-custom-tools' ), borderRadius, 0, 50, ( val ) => setAttributes({ borderRadius: val }) ) }
					<TextControl
						label={ __( 'Button Text', 'hrdc-custom-tools' ) }
						value={ buttonText }
						onChange={ ( val ) => setAttributes({ buttonText: val }) }
					/>
					<TextControl
						label={ __( 'Button Font', 'hrdc-custom-tools' ) }
						value={ attributes.buttonFont || '' }
						onChange={ ( val ) => setAttributes({ buttonFont: val }) }
						help={ __( 'e.g., Arial, sans-serif', 'hrdc-custom-tools' ) }
					/>
					<RangeControl
						label={ __( 'Button Font Size (px)', 'hrdc-custom-tools' ) }
						value={ attributes.buttonTextSize || 14 }
						onChange={ ( val ) => setAttributes({ buttonTextSize: val }) }
						min={ 10 }
						max={ 72 }
					/>
					<SelectControl
						label={ __( 'Button Font Weight', 'hrdc-custom-tools' ) }
						value={ attributes.buttonFontWeight || 'normal' }
						options={[
							{ label: __( 'Normal', 'hrdc-custom-tools' ), value: 'normal' },
							{ label: __( 'Bold', 'hrdc-custom-tools' ), value: 'bold' }
						]}
						onChange={ ( val ) => setAttributes({ buttonFontWeight: val }) }
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
					
				</PanelBody>
				<PanelBody title={ __( 'Modal Settings', 'hrdc-custom-tools' ) } initialOpen={ false }>
					<BaseControl label={ __( 'Alignment', 'hrdc-custom-tools' ) }>
						<BlockAlignmentToolbar
							value={ align }
							onChange={ ( newAlign ) => setAttributes({ align: newAlign }) }
						/>
					</BaseControl>
										<TextControl
						label={ __( 'Label Font', 'hrdc-custom-tools' ) }
						value={attributes.labelFont || '' }
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
				<PanelBody title={ __( 'Meta Fields Visibility', 'hrdc-custom-tools' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show City Field', 'hrdc-custom-tools' ) }
						checked={ cityShow }
						onChange={ ( val ) => setAttributes({ cityShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show Demographic Field', 'hrdc-custom-tools' ) }
						checked={ demographicShow }
						onChange={ ( val ) => setAttributes({demographicShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show Felony Field', 'hrdc-custom-tools' ) }
						checked={ feloniesShow }
						onChange={ ( val ) => setAttributes({ feloniesShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show Credit Field', 'hrdc-custom-tools' ) }
						checked={ creditCheckShow }
						onChange={ ( val ) => setAttributes({ creditCheckShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show units Field', 'hrdc-custom-tools' ) }
						checked={ unitTypesShow }
						onChange={ ( val ) => setAttributes({ unitTypesShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show Pets Field', 'hrdc-custom-tools' ) }
						checked={ petsShow }
						onChange={ ( val ) => setAttributes({ petsShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show Social Security Field', 'hrdc-custom-tools' ) }
						checked={ socialSecurityShow }
						onChange={ ( val ) => setAttributes({ socialSecurityShow: val }) }
					/>
					<ToggleControl
						label={ __( 'Show Housing Types Field', 'hrdc-custom-tools' ) }
						checked={ categoryShow }
						onChange={ ( val ) => setAttributes({ categoryShow: val }) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="search-modal-editor-preview" style={ { textAlign: align, marginBottom: '10px' } }>
					<button className="btn" style={ {
						backgroundColor: backgroundColor,
						border: `1px solid ${ borderColor }`,
						borderRadius: `${ borderRadius }px`,
						padding: '10px',
						height: `${ ButtonSize }px`,
						width:`${ ButtonSize * 3 }px`,
						fontSize: `${ buttonTextSize }px`,
						fontFamily: buttonFont,
						fontWeight: buttonFontWeight
					} }>
						{ buttonText }
					</button>
				</div>
					<div className="modal-fields-editor-preview" style={ {
						border: '1px solid #eee',
						padding: '10px',
						textAlign: 'center'
					} }>
						{ attributes.cityShow && (
					<div className="modal-field">
						<label htmlFor="hrdc-city" style={ {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
							{ __( 'City', 'hrdc-custom-tools' ) }
						</label>
						<SelectControl
							id="hrdc-city"
							value={ filters.city }
							options={[
								{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
								{ label: 'Bozeman', value: 'bozeman' },
								{ label: 'Belgrade', value: 'belgrade' },
								{ label: 'West Yellowstone', value: 'west yellowstone' },
								{ label: 'Livingston', value: 'livingston' },
								{ label: 'Clyde Park', value: 'clyde park' },
								{ label: 'Emigrant', value: 'emigrant' },
							]}
							onChange={ ( value ) => setFilters({ ...filters, city: value }) }
						/>
					</div>
					)}
					{attributes.demographicShow && (
					<div className="modal-field">
						<label htmlFor="hrdc-demographic" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
							{ __( 'Demographic', 'hrdc-custom-tools' ) }
						</label>
						<SelectControl
							id="hrdc-demographic"
							value={ filters.reservedFor }
							options={[
								{ label: __( 'None of the above', 'hrdc-custom-tools' ), value: '' },
								{ label: 'Senior (55+)', value: 'senior (55+)' },
								{ label: 'Senior (62+)', value: 'senior (62+)' },
								{ label: 'Person with Disabling Condition', value: 'person with disabling condition' },
							]}
							onChange={ ( value ) => setFilters({ ...filters, reservedFor: value }) }
						/>
					</div>
					)}
					{attributes.feloniesShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-felonies" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{ __( 'Do you have a felony conviction?', 'hrdc-custom-tools' ) }
							</label>
							<SelectControl
								id="hrdc-felonies"
								value={ filters.felonies }
								options={[
									{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
									{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, felonies: value }) }
							/>
						</div>
					)}
					{attributes.creditCheckShow && (
					<div className="modal-field">
							<label htmlFor="hrdc-credit" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{ __( 'Do you have good credit (above 600+)?', 'hrdc-custom-tools' ) }
							</label>
							<SelectControl
								id="hrdc-credit"
								value={ filters.creditCheck }
								options={[
									{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
									{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, creditCheck: value }) }
							/>
						</div>
					)}
					{attributes.unitTypesShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-unit-types" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight}}>
								{ __( 'Unit Types', 'hrdc-custom-tools' ) }
							</label>
							<SelectControl
								id="hrdc-unit-types"
								value={ filters.unitTypes }
								options ={[
									{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
									{ label: 'Studio', value: 'studio' },
									{ label: '1 Bedroom', value: '1 bedroom' },
									{ label: '2 Bedrooms', value: '2 bedrooms' },
									{ label: '3 Bedrooms', value: '3 bedrooms' },
									{ label: '4 Bedrooms', value: '4 bedrooms' },
								]}
								onChange={ ( val ) => setFilters({ ...filters, unitTypes: val }) }
							/>
						</div>
					)}
					{attributes.petsShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-pets" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{ __( 'Are you looking for pet friendly units (for non‑service animals)?', 'hrdc-custom-tools' ) }
							</label>
							<SelectControl
								id="hrdc-pets"
								value={ filters.pets }
								options={[
									{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
									{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, pets: value }) }
							/>
						</div>
					)}
					{attributes.socialSecurityShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-social" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{ __( 'Do you have a social security number?', 'hrdc-custom-tools' ) }
							</label>
							<SelectControl
								id="hrdc-social"
								value={ filters.socialSecurity }
								options={[
									{ label: __( 'No', 'hrdc-custom-tools' ), value: 'no' },
									{ label: __( 'Yes', 'hrdc-custom-tools' ), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, socialSecurity: value }) }
							/>
						</div>
					)}
					{attributes.categoryShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-housing-types" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{ __( 'Housing Types', 'hrdc-custom-tools' ) }
							</label>
							<SelectControl
								id="hrdc-housing-types"
								value={ filters.category }
								options={[
									{ label: __( 'Any', 'hrdc-custom-tools' ), value: '' },
									{ label: 'Low Income Tax Credit', value: 'low income tax credit' },
									{ label: 'Subsidized Housing', value: 'subsidized housing' },
									{ label: 'Market Rate', value: 'market rate' }
								]}
								onChange={ ( value ) => setFilters({ ...filters, category: value }) }
							/>
						</div>
					)}
				
					<div style={ { marginTop: '20px' } }>
						<Button isPrimary onClick={ () => console.log( filters ) } style={ { marginRight: '10px' } }>
							{ __( 'Apply Filters', 'hrdc-custom-tools' ) }
						</Button>
						<Button onClick={ () => console.log( 'Reset Filters' ) }>
							{ __( 'Reset Filters', 'hrdc-custom-tools' ) }
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
