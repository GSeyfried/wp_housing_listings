<?php
/* ------------------------------------------------------------------
 *  <hrdc_search_modal> – string‑builder version (no output buffering)
 * -----------------------------------------------------------------*/
add_shortcode( 'hrdc_search_modal', 'hrdc_search_modal_shortcode' );

function hrdc_search_modal_shortcode( $atts ) {

	$atts = shortcode_atts(
		array(
			'button_text'     => __( 'Search by Criteria', 'hrdc-custom-tools' ),
			'container_class' => '',
			'container_style' => '',
		),
		$atts,
		'hrdc_search_modal'
	);

	/* ---- enqueue the tiny JS once per request -------------------- */
	wp_enqueue_script(
		'hrdc-search-modal',
		plugins_url( 'assets/search‑modal.js', __FILE__ ),
		array(),
		'1.0',
		true
	);

	/* ---- start building markup ----------------------------------- */
	$out  = '';

	$out .= '<div class="hrdc-search-modal ' . esc_attr( $atts['container_class'] ) . '"';
	$out .=     ' style="' . esc_attr( $atts['container_style'] ) . '">';

	/* trigger button */
	$out .=   '<button id="hrdc-open-search-modal" class="btn">'
	       .     esc_html( $atts['button_text'] )
	       .  '</button>';

	/* overlay */
	$out .=   '<div id="hrdc-modal-overlay" style="display:none" role="dialog" aria-hidden="true">';
	$out .=     '<div class="hrdc-modal--inner">';

	$out .=       '<button id="hrdc-close-search-modal" class="btn close" aria-label="Close">×</button>';
	$out .=       '<h3>' . esc_html__( 'Filter Listings', 'hrdc-custom-tools' ) . '</h3>';

	/* helper for each <select>  ------------------------------ */
	$add_select = function( $id, $label, $options ) use ( &$out ) {
		$out .= '<div class="modal-field"><label for="hrdc-' . esc_attr( $id ) . '">' . esc_html( $label ) . '</label>';
		$out .= '<select id="hrdc-' . esc_attr( $id ) . '">';
		foreach ( $options as $val => $text ) {
			$val  = is_int( $val ) ? $text : $val;
			$out .= '<option value="' . esc_attr( $val ) . '">' . esc_html( $text ) . '</option>';
		}
		$out .= '</select></div>';
	};

	/* fields ------------------------------------------------- */
	$add_select( 'city', __( 'City', 'hrdc-custom-tools' ),
		array(
			''                => __( 'Any', 'hrdc-custom-tools' ),
			'bozeman'         => 'Bozeman',
			'belgrade'        => 'Belgrade',
			'west yellowstone'=> 'West Yellowstone',
			'livingston'      => 'Livingston',
			'clyde park'      => 'Clyde Park',
			'emigrant'        => 'Emigrant',
		)
	);

	$add_select( 'demographic', __( 'Demographic', 'hrdc-custom-tools' ),
		array(
			''                        => '',
			'none of the above'       => __( 'None of the above', 'hrdc-custom-tools' ),
			'senior (55+)'            => 'Senior (55+)',
			'senior (62+)'            => 'Senior (62+)',
			'person with disabling condition' => 'Person with Disabling Condition',
		)
	);

	$yn = array( '' => '', 'no'=>__( 'No', 'hrdc-custom-tools' ), 'yes'=>__( 'Yes', 'hrdc-custom-tools' ) );
	$add_select( 'felonies',       __( 'Do you have a felony conviction?', 'hrdc-custom-tools' ), $yn );
	$add_select( 'credit',         __( 'Do you have good credit (above 600+)?', 'hrdc-custom-tools' ), $yn );
	$add_select( 'pets',           __( 'Are you looking for pet friendly units (for non‑service animals)?', 'hrdc-custom-tools' ), $yn );
	$add_select( 'social',         __( 'Do you have a social security number?', 'hrdc-custom-tools' ), $yn );

	$add_select( 'unit-types', __( 'Unit Types', 'hrdc-custom-tools' ),
		array(
			''           => __( 'Any', 'hrdc-custom-tools' ),
			'studio'     => 'Studio',
			'1 bedroom'  => '1 bedroom',
			'2 bedrooms' => '2 bedrooms',
			'3 bedrooms' => '3 bedrooms',
			'4+ bedrooms'=> '4+ bedrooms',
		)
	);

	$add_select( 'housing-types', __( 'Housing Types', 'hrdc-custom-tools' ),
		array(
			''                       => '',
			''                       => __( 'Any', 'hrdc-custom-tools' ),
			'low income tax credit'  => 'Low Income Tax Credit',
			'subsidized housing'     => 'Subsidized Housing',
			'market rate'            => 'Market Rate',
		)
	);

	/* buttons */
	$out .= '<div style="margin-top:20px">';
	$out .=   '<button id="hrdc-apply-search"  class="btn primary">'   . esc_html__( 'Apply Filters', 'hrdc-custom-tools' )  . '</button>';
	$out .=   '<button id="hrdc-reset-search"  class="btn secondary">' . esc_html__( 'Reset Filters', 'hrdc-custom-tools' )  . '</button>';
	$out .= '</div>';

	$out .=     '</div>'; // .hrdc-modal--inner
	$out .=   '</div>';   // #hrdc-modal-overlay
	$out .= '</div>';     // .hrdc-search-modal

	echo $out;
}
