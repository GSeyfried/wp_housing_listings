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
import { __, _x } from '@wordpress/i18n';
import { useState } from '@wordpress/element';


const L = ( () => {
    const es = {
        any: 'Cualquiera',
        city: 'Ciudad',
        demo: 'Población objetivo',
        felonyQ: '¿Tiene antecedentes penales?',
        creditQ: '¿Tiene buen crédito (600+)?',
        units: 'Tipos de unidad',
        petsQ: '¿Necesita unidades que acepten mascotas (no animales de servicio)?',
        ssnQ: '¿Tiene número de seguro social?',
        housingType: 'Tipos de vivienda',
        senior55: 'Adultos mayores (55+)',
        senior62: 'Adultos mayores (62+)',
        disabled: 'Persona con discapacidad',
        noneAbove: 'Ninguno de los anteriores',
        studio: 'Estudio',
        oneBed: '1 habitación',
        twoBed: '2 habitaciones',
        threeBed: '3 habitaciones',
        fourBed: '4 o más habitaciones',
        yes: 'Sí',
        no: 'No',
        lowIncome: 'Crédito fiscal para vivienda de bajos ingresos',
        subsidized: 'Viviendas subsidiadas',
        market: 'Precio de mercado',
        modalTitle: 'Filtrar anuncios',
        btnOpen: 'Filtrar viviendas',
        btnApply: 'Aplicar filtros',
        btnReset: 'Restablecer filtros',
    };

    const isEs = window.hrdcBlockAttr?.isSpanish;   // ← same flag you send from PHP
    return key => ( isEs ? es[key] : undefined ) || {
        any:'Any', city:'City', demo:'Demographic',
        felonyQ:'Do you have a felony conviction?',
        creditQ:'Do you have good credit (above 600+)?',
        units:'Unit Types',
        petsQ:'Are you looking for pet friendly units (for non‑service animals)?',
        ssnQ:'Do you have a social security number?',
        housingType:'Housing Types',
        senior55:'Senior (55+)',
        senior62:'Senior (62+)',
        disabled:'Person with Disabling Condition',
        noneAbove:'None of the above',
        studio:'Studio', oneBed:'1 bedroom', twoBed:'2 bedrooms',
        threeBed:'3 bedrooms', fourBed:'4+ bedrooms',
        yes:'Yes', no:'No',
        lowIncome:'Low Income Tax Credit',
        subsidized:'Subsidized Housing',
        market:'Market Rate',
        modalTitle:'Filter Listings',
        btnOpen:'Search by Criteria',
        btnApply:'Apply Filters',
        btnReset:'Reset Filters',
    }[key];
})();


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
		buttonSize = 48,
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
						value={ attributes.buttonSize || 14 }
						onChange={ ( val ) => setAttributes({buttonSize: val }) }
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
						height: `${ buttonSize }px`,
						width:`${ buttonSize * 3 }px`,
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
							{ L('city') }
						</label>
						<SelectControl
							id="hrdc-city"
							value={ filters.city }
							options={[
								{ label: L('any'), value: '' },
								{ label: 'Bozeman', value: 'bozeman' },
								{ label: 'Belgrade', value: 'belgrade' },
								{ label: 'Big Sky', value: 'big sky' },
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
							{ L('demo') }
						</label>
						<SelectControl
							id="hrdc-demographic"
							value={ filters.reservedFor }
							options={[
								{ label: L('noneAbove'), value: '' },
								{ label: L('senior55'), value: 'senior (55+)' },
								{ label: L('senior62'), value: 'senior (62+)' },
								{ label: L('disabled'), value: 'person with disabling condition' },
							]}
							onChange={ ( value ) => setFilters({ ...filters, reservedFor: value }) }
						/>
					</div>
					)}
					{attributes.feloniesShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-felonies" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{ L('felonyQ') }
							</label>
							<SelectControl
								id="hrdc-felonies"
								value={ filters.felonies }
								options={[
									{ label: L('no'), value: 'no' },
									{ label: L('yes'), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, felonies: value }) }
							/>
						</div>
					)}
					{attributes.creditCheckShow && (
					<div className="modal-field">
							<label htmlFor="hrdc-credit" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{L('creditQ')}
							</label>
							<SelectControl
								id="hrdc-credit"
								value={ filters.creditCheck }
								options={[
									{ label: L('no'), value: 'no' },
									{ label: L('yes'), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, creditCheck: value }) }
							/>
						</div>
					)}
					{attributes.unitTypesShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-unit-types" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight}}>
								{L('units')}
							</label>
							<SelectControl
								id="hrdc-unit-types"
								value={ filters.unitTypes }
								options ={[
									{ label: L('any'), value: '' },
									{ label: L('studio'), value: 'studio' },
									{ label: L('oneBed'), value: '1 bedroom' },
									{ label: L('twoBed'), value: '2 bedrooms' },
									{ label: L('threeBed'), value: '3 bedrooms' },
									{ label: L('fourBed'), value: '4 bedrooms' },
								]}
								onChange={ ( val ) => setFilters({ ...filters, unitTypes: val }) }
							/>
						</div>
					)}
					{attributes.petsShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-pets" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{L('petsQ')}
							</label>
							<SelectControl
								id="hrdc-pets"
								value={ filters.pets }
								options={[
									{ label: L('no'), value: 'no' },
									{ label: L('yes'), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, pets: value }) }
							/>
						</div>
					)}
					{attributes.socialSecurityShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-social" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{L('ssnQ')}
							</label>
							<SelectControl
								id="hrdc-social"
								value={ filters.socialSecurity }
								options={[
									{ label: L('no'), value: 'no' },
									{ label: L('yes'), value: 'yes' },
								]}
								onChange={ ( value ) => setFilters({ ...filters, socialSecurity: value }) }
							/>
						</div>
					)}
					{attributes.categoryShow && (
						<div className="modal-field">
							<label htmlFor="hrdc-housing-types" style={  {fontFamily: labelFont, fontSize: labelTextSize, fontWeight:labelFontWeight} }>
								{L('housingType')}
							</label>
							<SelectControl
								id="hrdc-housing-types"
								value={ filters.category }
								options={[
									{ label: L('any'), value: '' },
									{ label: L('lowIncome'), value: 'low income tax credit' },
									{ label: L('subsidized'), value: 'subsidized housing' },
									{ label: L('market'), value: 'market rate' }
								]}
								onChange={ ( value ) => setFilters({ ...filters, category: value }) }
							/>
						</div>
					)}
				
					<div style={ { marginTop: '20px' } }>
						<Button isPrimary onClick={ () => console.log( filters ) } style={ { marginRight: '10px' } }>
							{ L('btnApply') }
						</Button>
						<Button onClick={ () => console.log( 'Reset Filters' ) }>
							{ L('btnReset') }
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
