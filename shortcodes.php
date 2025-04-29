<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Render any registered block from PHP and inject custom attributes.
 *
 * @param string $name      Block name  (e.g. 'hrdc-tools/search-modal')
 * @param array  $attrs     Attributes   ( names MUST match block.json )
 * @return string           Final HTML
 */
function hrdc_render_block_via_shortcode( string $name, array $attrs ) : string {

	// Make sure the block type exists (plugin could be deactivated).
	if ( ! WP_Block_Type_Registry::get_instance()->is_registered( $name ) ) {
		return '<p style="color:red;">Block “'. esc_html( $name ) .'” not registered.</p>';
	}

	// Use WP core helper so the block system enqueues CSS/JS automatically.
	return render_block(
		[
			'blockName'  => $name,
			'attrs'      => $attrs,
			'innerBlocks'=> [],
			'innerHTML'  => '',
			'innerContent'=> [],
		]
	);
}
/*********	[hrdc_search_modal] 	*/
add_shortcode( 'hrdc_search_modal', function ( $atts ){

	/* every attribute & default from block.json */
	$atts = shortcode_atts( [
		// button
		'buttonText'       => 'Search by Criteria',
		'buttonColor'      => '#147278',
		'buttonSize'       => 48,
		'buttonTextSize'   => 14,
		'buttonFont'       => 'inherit',
		'buttonAlignment'  => 'left',

		// frame
		'borderColor'      => '#ccc',
		'borderRadius'     => 4,
		'backgroundColor'  => '#fff',

		// show / hide complete field group
		'showFields'       => true,

		// current filter defaults
		'city'             => '',
		'reservedFor'      => '',
		'felonies'         => 'no',
		'creditCheck'      => 'no',
		'unitTypes'        => [],
		'petsAllowed'      => 'no',
		'socialSecurity'   => 'no',
		'category'         => '',

		// label typography
		'labelFont'        => 'inherit',
		'labelFontWeight'  => 'normal',
		'labelTextSize'    => 14,

		// individual field toggles
		'cityShow'         => true,
		'demographicShow'  => true,
		'feloniesShow'     => true,
		'creditShow'       => true,
		'unitTypesShow'    => true,
		'petsShow'         => true,
		'socialSecurityShow'=> true,
		'categoryShow'     => true,

		// wrapper
		'containerClass'   => '',
		'containerStyle'   => '',
		'align'            => 'none',
	], $atts, 'hrdc_search_modal' );

	return hrdc_render_block_via_shortcode(
		'hrdc-tools/search-modal',
		$atts
	);
} );

/*********	[hrdc_housing_listings] 	*/
add_shortcode( 'hrdc_housing_listings', function ( $atts ){

	$atts = shortcode_atts( [
		/* wrapper */
		'containerClass'      => '',
		'containerStyle'      => '',
		'showExtraMeta'       => false,

		/* card box */
		'cardInnerPadding'    => 20,
		'cardOuterPadding'    => 20,
		'cardBorder'          => '2px solid #ccc',
		'cardBackground'      => '#fff',
		'cardRadius'          => 40,
		'cardShadow'          => '0 2px 4px rgba(0,0,0,0.1)',
		'cardWidth'           => 300,
		'cardColumns'         => 2,

		/* title */
		'cardTitleFontSize'   => 24,
		'cardTitleFontWeight' => 'bold',
		'cardTitleFontStyle'  => 'normal',
		'cardTitleTextAlign'  => 'left',
		'cardTitleColor'      => '#333333',
		'cardTitlePadding'    => 10,

		/* text */
		'cardFontFamily'      => 'inherit',
		'cardTextAlign'       => 'left',
		'cardFontSize'        => 16,
		'cardValueFontWeight' => 'normal',
		'cardValueFontStyle'  => 'normal',
		'cardLabelFontWeight' => 'bold',
		'cardLabelFontStyle'  => 'italic',

		/* core alignment support */
		'align'               => 'none',

	], $atts, 'hrdc_housing_listings' );

	return hrdc_render_block_via_shortcode(
		'hrdc-tools/housing-listings',
		$atts
	);
} );
