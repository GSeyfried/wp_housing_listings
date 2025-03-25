import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	BlockAlignmentToolbar,
} from '@wordpress/block-editor';

import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	BaseControl,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Advanced filter -- sorry for the search clutter, I pulled this almost directly from my google sheets filter logic
function advancedFilterListings(listings, filters) {
	// Helper functions
	function normalizeYesNo(input) {
		if (!input) return null;
		return input.toString().toLowerCase() === 'yes';
	}
	function funReservedForMatch(preferred, allowed) {
		function splitValues(input) {
			if (!input) return [];
			return input.toLowerCase()
				.replace(/person with|people with/gi, "")
				.replace(/and\/or/gi, ",")
				.replace(/\bdisab(?:led|ility|ilities|ling)?\b/gi, "disabilities")
				.replace(/\bcondition\b/gi, "")
				.split(",")
				.map(v => v.trim())
				.filter(v => v);
		}
		const preferredList = splitValues(preferred);
		const allowedList = splitValues(allowed);
		if (preferredList.includes("none of the above")) {
			return allowedList.includes("no");
		}
		if (allowedList.includes("no")) return true;
		if (preferredList.length === 0) return true;
		return preferredList.some(pref => allowedList.includes(pref));
	}
	function funUnitTypesMatch(preferred, allowed) {
		function splitAndCleanUnits(input) {
			return input
				? input.toLowerCase().replace(/bedroom(s)?/gi, "").split(",")
					.map(v => {
						const match = v.trim().match(/\d+|studio/);
						return match ? match[0] : null;
					})
					.filter(v => v)
				: [];
		}
		const preferredList = splitAndCleanUnits(preferred || "any");
		const allowedList = splitAndCleanUnits(allowed);
		return !preferred || preferred.toLowerCase() === "any" || preferredList.some(pref => allowedList.includes(pref));
	}
	function funCategoryMatch(preferred, allowed) {
		if (!preferred || preferred.toLowerCase() === "any") return true;
		function normalizeCategory(str) {
			let lower = str.toLowerCase();
			if (/affordable|low\s*income|lihtc|tax\s*credit/.test(lower)) return "affordable";
			if (/subsidized/.test(lower)) return "subsidized";
			if (/market\s*rate/.test(lower)) return "market_rate";
			return lower.trim();
		}
		function parseCategories(input) {
			return input.split(",").map(item => normalizeCategory(item.trim())).filter(Boolean);
		}
		const preferredList = parseCategories(preferred);
		const allowedList = parseCategories(allowed || "");
		return preferredList.some(pref => allowedList.includes(pref));
	}
	
	// I was asked to hardcode this value to 'yes' to prevent people from searching for application fees
	const applicationFeePreferred = 'yes';

	return listings.filter(post => {
		const meta = post.meta || {};
		// Normalize meta values
		const city         = meta._city ? meta._city.toLowerCase() : '';
		const category     = meta._category ? meta._category.toLowerCase() : '';
		const reservedFor  = meta._reserved_for ? meta._reserved_for.toLowerCase() : '';
		const appFee       = meta._application_fee ? meta._application_fee.toLowerCase() : '';
		const felonies     = meta._felonies_considered ? meta._felonies_considered.toLowerCase() : '';
		const creditCheck  = meta._credit_check_not_required ? meta._credit_check_not_required.toLowerCase() : '';
		const unitTypes    = meta._unit_types ? meta._unit_types.toLowerCase() : '';
		const petsAllowed  = meta._pets_allowed ? meta._pets_allowed.toLowerCase() : '';
		const socialSec    = meta._social_security_required ? meta._social_security_required.toLowerCase() : '';

		// Apply filtering criteria (if filter not provided, condition is true)
		const cityMatch         = !filters.city         || filters.city.toLowerCase() === 'any' || city.includes(filters.city.toLowerCase());
		const reservedForMatch  = !filters.reservedFor  || funReservedForMatch(filters.reservedFor, reservedFor);
		const appFeeMatch       = applicationFeePreferred === 'yes' ? appFee === 'no' : true;
		const feloniesMatch     = !filters.felonies     || (normalizeYesNo(filters.felonies) === false ? felonies === 'yes' : true);
		const creditCheckMatch  = !filters.creditCheck  || (normalizeYesNo(filters.creditCheck) === false ? creditCheck === 'yes' : true);
		const unitTypesMatch    = !filters.unitTypes    || funUnitTypesMatch(filters.unitTypes, unitTypes);
		const petsAllowedMatch  = !filters.petsAllowed  || (normalizeYesNo(filters.petsAllowed) === true ? petsAllowed !== 'no' : true);
		const socialSecMatch    = !filters.socialSecurity || (normalizeYesNo(filters.socialSecurity) === true ? socialSec === 'yes' : true);
		const categoryMatch     = !filters.category     || funCategoryMatch(filters.category, category);

		return cityMatch && reservedForMatch && appFeeMatch && feloniesMatch && creditCheckMatch && unitTypesMatch && petsAllowedMatch && socialSecMatch && categoryMatch;
	});
}

export default function HousingListingsBlockEdit( { attributes, setAttributes } ) {


	/* ---------------------------------
	 	Retrieve & Filter housing_listing posts
	 * --------------------------------- */

	// Retrieve housing_listing posts from the REST API.
	const listingsFromApi = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'housing_listing', {
			per_page: -1,
			context: 'edit'
		} ) || [];
	}, [] );

	// If hlData is localized, use it as fallback.
	const initialData = listingsFromApi.length ? listingsFromApi : ( window.hlData || [] );
    const [ allListings, setAllListings ] = useState( initialData );
    const [ filteredListings, setFilteredListings ] = useState( initialData );

    // When API data updates, refresh both states
    useEffect( () => {
        const data = listingsFromApi.length ? listingsFromApi : ( window.hlData || [] );
        setAllListings( data );
        setFilteredListings( data );
    }, [ listingsFromApi ] );

	// Listen for filter events and filter from the original list
	useEffect( () => {
		const handleFilters = ( event ) => {
			const newFiltered = advancedFilterListings( allListings, event.detail );
			setFilteredListings( newFiltered );
		};
		document.addEventListener( 'hrdcApplyFilters', handleFilters );
		return () => document.removeEventListener( 'hrdcApplyFilters', handleFilters );
	}, [ allListings ] );


	/* ---------------------------------
	 	Inspector Controls, Styling, and Display
	 * --------------------------------- */

		 const {
			// Card Layout attributes
			cardInnerPadding,
			cardOuterPadding,
			cardBorder,
			cardWidth,
			cardRadius,
			cardColumns,
			cardBackground,
			// Card Title Layout attributes
			cardTitleFontSize,
			cardTitleFontWeight,
			cardTitleFontStyle,
			cardTitleTextAlign,
			cardTitleColor,
			cardTitlePadding,
			// Card Text Layout attributes
			cardFontFamily,
			cardTextAlign,
			cardValueFontWeight,
			cardValueFontStyle,
			cardLabelFontWeight,
			cardLabelFontStyle,
			// Overall block alignment (if desired)
			align,
		} = attributes;

	const blockProps = useBlockProps();

	const renderNumberControl = ( label, attr, min, max, onChange ) => (
		<TextControl
			type="number"
			label={ label }
			value={ attr }
			onChange={ ( value ) => onChange( Number(value) ) }
			help={ `Min: ${min}, Max: ${max}` }
		/>
	);

	return (
		<>
			<InspectorControls>
				{/* Card Layout Panel */}
				<PanelBody title={ __( 'Card Layout', 'hrdc-custom-tools' ) } initialOpen={ true }>
					{ renderNumberControl(
						__( 'Inner Padding (px)', 'hrdc-custom-tools' ),
						cardInnerPadding,
						5,
						50,
						( val ) => setAttributes({ cardInnerPadding: val })
					) }
					{ renderNumberControl(
						__( 'Outer Padding (px)', 'hrdc-custom-tools' ),
						cardOuterPadding,
						5,
						50,
						( val ) => setAttributes({ cardOuterPadding: val })
					) }
					<TextControl
						label={ __( 'Card Border', 'hrdc-custom-tools' ) }
						value={ cardBorder }
						onChange={ ( value ) => setAttributes({ cardBorder: value }) }
						help={ __( 'Example: 1px solid #ccc', 'hrdc-custom-tools' ) }
					/>
					{ renderNumberControl(
						__( 'Card Width (px)', 'hrdc-custom-tools' ),
						cardWidth,
						200,
						1000,
						( val ) => setAttributes({ cardWidth: val })
					) }
					{ renderNumberControl(
						__( 'Card Radius (px)', 'hrdc-custom-tools' ),
						cardRadius,
						1,
						50,
						( val ) => setAttributes({ cardRadius: val })
					) }
					{ renderNumberControl(
						__( 'Columns', 'hrdc-custom-tools' ),
						cardColumns,
						1,
						4,
						( val ) => setAttributes({ cardColumns: val })
					) }
					<PanelColorSettings
						title={ __( 'Card Background Color', 'hrdc-custom-tools' ) }
						initialOpen={ false }
						colorSettings={[
							{
								value: cardBackground,
								onChange: ( value ) => setAttributes({ cardBackground: value }),
								label: __( 'Background Color', 'hrdc-custom-tools' ),
							},
						]}
					/>
				</PanelBody>

				{/* Card Title Layout Panel */}
				<PanelBody title={ __( 'Card Title Layout', 'hrdc-custom-tools' ) } initialOpen={ false }>
					{ renderNumberControl(
						__( 'Font Size (px)', 'hrdc-custom-tools' ),
						cardTitleFontSize,
						16,
						40,
						( val ) => setAttributes({ cardTitleFontSize: val })
					) }
					<ToggleControl
						label={ __( 'Bold', 'hrdc-custom-tools' ) }
						checked={ cardTitleFontWeight === 'bold' }
						onChange={ ( val ) => setAttributes({ cardTitleFontWeight: val ? 'bold' : 'normal' }) }
					/>
					<ToggleControl
						label={ __( 'Italic', 'hrdc-custom-tools' ) }
						checked={ cardTitleFontStyle === 'italic' }
						onChange={ ( val ) => setAttributes({ cardTitleFontStyle: val ? 'italic' : 'normal' }) }
					/>
					<SelectControl
						label={ __( 'Text Align', 'hrdc-custom-tools' ) }
						value={ cardTitleTextAlign }
						options={[
							{ label: __( 'Left', 'hrdc-custom-tools' ), value: 'left' },
							{ label: __( 'Center', 'hrdc-custom-tools' ), value: 'center' },
							{ label: __( 'Right', 'hrdc-custom-tools' ), value: 'right' },
						]}
						onChange={ ( value ) => setAttributes({ cardTitleTextAlign: value }) }
					/>
					<PanelColorSettings
						title={ __( 'Title Color', 'hrdc-custom-tools' ) }
						initialOpen={ false }
						colorSettings={[
							{
								value: cardTitleColor,
								onChange: ( value ) => setAttributes({ cardTitleColor: value }),
								label: __( 'Title Color', 'hrdc-custom-tools' ),
							},
						]}
					/>
					{ renderNumberControl(
						__( 'Title Padding (px)', 'hrdc-custom-tools' ),
						cardTitlePadding,
						0,
						30,
						( val ) => setAttributes({ cardTitlePadding: val })
					) }
				</PanelBody>

				{/* Card Text Layout Panel */}
				<PanelBody title={ __( 'Card Text Layout', 'hrdc-custom-tools' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Font Family', 'hrdc-custom-tools' ) }
						value={ cardFontFamily }
						onChange={ ( value ) => setAttributes({ cardFontFamily: value }) }
						help={ __( 'e.g., Arial, sans-serif', 'hrdc-custom-tools' ) }
					/>
					<SelectControl
						label={ __( 'Text Align', 'hrdc-custom-tools' ) }
						value={ cardTextAlign }
						options={[
							{ label: __( 'Left', 'hrdc-custom-tools' ), value: 'left' },
							{ label: __( 'Center', 'hrdc-custom-tools' ), value: 'center' },
							{ label: __( 'Right', 'hrdc-custom-tools' ), value: 'right' },
						]}
						onChange={ ( value ) => setAttributes({ cardTextAlign: value }) }
					/>
					{/* Value Text Settings */}
					<ToggleControl
						label={ __( 'Bold', 'hrdc-custom-tools' ) }
						checked={ cardValueFontWeight === 'bold' }
						onChange={ ( val ) => setAttributes({ cardValueFontWeight: val ? 'bold' : 'normal' }) }
					/>
					<ToggleControl
						label={ __( 'Italic', 'hrdc-custom-tools' ) }
						checked={ cardValueFontStyle === 'italic' }
						onChange={ ( val ) => setAttributes({ cardValueFontStyle: val ? 'italic' : 'normal' }) }
					/>
					{/* Label Text Settings */}
					<ToggleControl
						label={ __( 'Bold', 'hrdc-custom-tools' ) }
						checked={ cardLabelFontWeight === 'bold' }
						onChange={ ( val ) => setAttributes({ cardLabelFontWeight: val ? 'bold' : 'normal' }) }
					/>
					<ToggleControl
						label={ __( 'Italic', 'hrdc-custom-tools' ) }
						checked={ cardLabelFontStyle === 'italic' }
						onChange={ ( val ) => setAttributes({ cardLabelFontStyle: val ? 'italic' : 'normal' }) }
					/>
				</PanelBody>

				{/* Example: Block Alignment Toolbar */}
				<PanelBody title={ __( 'Block Alignment', 'hrdc-custom-tools' ) } initialOpen={ false }>
					<BaseControl label={ __( 'Alignment', 'hrdc-custom-tools' ) }>
						<BlockAlignmentToolbar
							value={ align }
							onChange={ ( newAlign ) => setAttributes({ align: newAlign }) }
						/>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div id="hl-results" style={ { display: 'grid', gridTemplateColumns: `repeat(${cardColumns},1fr)`, gap: cardOuterPadding +'px', margin: '0 auto' } }>
					{ filteredListings.length ? (
						filteredListings.map( ( post ) => {
							const meta = post.meta || {};
							return (
								<div key={ post.id } className="listing-box" 
								style={ { 
									border: cardBorder, 
									padding: cardInnerPadding + 'px', 
									backgroundColor: cardBackground, 
									borderRadius: cardRadius +'px' 
									} }
								>
									<div className="listing-row">
										<div className="listing-left">
											<div className="listing-title" 
											style={ { 
												fontSize: cardTitleFontSize + 'px', 
												color: cardTitleColor ,
												textAlign: cardTitleTextAlign,
												padding: cardTitlePadding + 'px',
												fontWeight: cardTitleFontWeight,
												fontStyle: cardTitleFontStyle,
												fontFamily: cardFontFamily

												} }
												>
												{ post.title.rendered }
												</div>
											<div className="listing-info">
												<em
													style={ { 
													fontWeight: cardLabelFontWeight, 
													fontStyle: cardLabelFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ __( 'Address: ', 'hrdc-custom-tools' ) }
												</em>
												<span
													style={ { 
													fontWeight: cardValueFontWeight, 
													fontStyle: cardValueFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ meta._address || 'N/A' }, { meta._city || 'N/A' }
												</span>
											</div>
											<div className="listing-info">
												<em
													style={ { 
													fontWeight: cardLabelFontWeight, 
													fontStyle: cardLabelFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ __( 'Manager: ', 'hrdc-custom-tools' ) }
												</em>
												<span
													style={ { 
													fontWeight: cardValueFontWeight, 
													fontStyle: cardValueFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ meta._property_manager || 'N/A' }
												</span>
											</div>
											<div className="listing-info">
												<em
													style={ { 
													fontWeight: cardLabelFontWeight, 
													fontStyle: cardLabelFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ __( 'Phone: ', 'hrdc-custom-tools' ) }
												</em>
												<span
													style={ { 
													fontWeight: cardValueFontWeight, 
													fontStyle: cardValueFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily 
													} }
												>
													{ meta._phone || 'N/A' }
												</span>
											</div>
											<div className="listing-info">
												<em
													style={ { 
													fontWeight: cardLabelFontWeight, 
													fontStyle: cardLabelFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ __( 'Website: ', 'hrdc-custom-tools' ) }
												</em>
												<span
													style={ { 
													fontWeight: cardValueFontWeight, 
													fontStyle: cardValueFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ meta._website || 'N/A' }
												</span>
											</div>
											<div className="listing-info">
												<em
													style={ { 
													fontWeight: cardLabelFontWeight, 
													fontStyle: cardLabelFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ __( 'Category: ', 'hrdc-custom-tools' ) }
												</em>
												<span
													style={ { 
													fontWeight: cardValueFontWeight, 
													fontStyle: cardValueFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ meta._category || 'N/A' }
												</span>
											</div>
										</div>
										<div className="listing-right">
											<div className="listing-info">
												<em
													style={ { 
													fontWeight: cardLabelFontWeight, 
													fontStyle: cardLabelFontStyle, 
													textAlign: cardTextAlign,
													fontFamily: cardFontFamily
													} }
												>
													{ __( 'Description: ', 'hrdc-custom-tools' ) }
												</em>
												<div
													style={ { 
														fontWeight: cardValueFontWeight, 
														fontStyle: cardValueFontStyle, 
														textAlign: cardTextAlign,
														fontFamily: cardFontFamily,
													} }
													dangerouslySetInnerHTML={ { __html: post.content.rendered } }
													/>
											</div>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<p>{ __( 'No listings found.', 'hrdc-custom-tools' ) }</p>
					) }
				</div>
			</div>
		</>
	);
}
