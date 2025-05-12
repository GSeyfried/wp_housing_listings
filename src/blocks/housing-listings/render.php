<?php
/**
 * Render callback for the Housing Listings block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */

// Query housing listings.
$query = new WP_Query( array(
    'post_type'      => 'housing_listing',
    'posts_per_page' => -1,
    'orderby'        => 'title',
    'order'          => 'ASC',
) );

if ( $query->have_posts() ) {
    while ( $query->have_posts() ) {
        $query->the_post();
        $post_id = get_the_ID();

        //Desciption vs Descripcion
        if ( $is_spanish ) {
            $desc_raw  = get_post_meta( $post_id, '_description_es', true );
            $desc_html = nl2br( wp_kses_post( $desc_raw ) );   // show <br>
        } else {
            $desc_raw  = apply_filters( 'the_content', get_the_content() );
            $desc_html = wp_kses_post( $desc_raw );            // already HTML
        }
        $raw_title  = get_the_title();
        $clean_title = preg_replace( '/^\s*Private:\s*/i', '', $raw_title );

        $listings_data[] = array(
            'id'      => $post_id,
            'title'   => $clean_title,
            'content' => $desc_html,        // <— real HTML
            'meta'    => array(
                '_address'                => get_post_meta( $post_id, '_address', true ) ?: '',
                '_city'                   => get_post_meta( $post_id, '_city', true ) ?: '',
                '_property_manager'       => get_post_meta( $post_id, '_property_manager', true ) ?: '',
                '_phone'                  => get_post_meta( $post_id, '_phone', true ) ?: '',
                '_website'                => get_post_meta( $post_id, '_website', true ) ?: '',
                '_category'               => get_post_meta( $post_id, '_category', true ) ?: '',
                '_reserved_for'           => get_post_meta( $post_id, '_reserved_for', true ) ?: '',
                '_application_fee'        => get_post_meta( $post_id, '_application_fee', true ) ?: '',
                '_felonies_considered'    => get_post_meta( $post_id, '_felonies_considered', true ) ?: '',
                '_credit_check_not_required' => get_post_meta( $post_id, '_credit_check_not_required', true ) ?: '',
                '_unit_types'             => get_post_meta( $post_id, '_unit_types', true ) ?: '',
                '_pets_allowed'           => get_post_meta( $post_id, '_pets_allowed', true ) ?: '',
                '_social_security_required' => get_post_meta( $post_id, '_social_security_required', true ) ?: '',
                '_hrdc_property'            => get_post_meta( $post_id, '_universal_application', true ) ?: '',

            )
        );
    }
    wp_reset_postdata();
}

// --------------------------------------------------------------------
// Output a <script> tag to define hlData for front‑end filtering.
// This ensures that your view.js code (which references hlData) has the data.
// --------------------------------------------------------------------
echo '<script>var hlData = ' . wp_json_encode( $listings_data ) . ';</script>';

// Retrieve attributes (with fallbacks).
$container_class    = isset( $attributes['containerClass'] ) ? $attributes['containerClass'] : '';

$cardInnerPadding    = isset( $attributes['cardInnerPadding'] ) ? $attributes['cardInnerPadding'] : 20;
$cardOuterPadding    = isset( $attributes['cardOuterPadding'] ) ? $attributes['cardOuterPadding'] : 20;
$cardBorder          = isset( $attributes['cardBorder'] ) ? $attributes['cardBorder'] : '1px solid #ccc';
$cardTitleColor      = isset( $attributes['cardTitleColor'] ) ? $attributes['cardTitleColor'] : '#333333';
$cardTitleTextAlign  = isset( $attributes['cardTitleTextAlign'] ) ? $attributes['cardTitleTextAlign'] : 'left';
$cardTitleFontSize   = isset( $attributes['cardTitleFontSize'] ) ? $attributes['cardTitleFontSize'] : 24;
$cardTitleFontStyle  = isset( $attributes['cardTitleFontStyle'] ) ? $attributes['cardTitleFontStyle'] : 'normal';
$cardTitleFontWeight = isset( $attributes['cardTitleFontWeight'] ) ? $attributes['cardTitleFontWeight'] : 'bold';
$cardTitlePadding    = isset( $attributes['cardTitlePadding'] ) ? $attributes['cardTitlePadding'] : 10;
$cardBackground      = isset( $attributes['cardBackground'] ) ? $attributes['cardBackground'] : '#fff';
$cardRadius          = isset( $attributes['cardRadius'] ) ? $attributes['cardRadius'] : 10;
$cardShadow          = isset( $attributes['cardShadow'] ) ? $attributes['cardShadow'] : '0 2px 4px rgba(0,0,0,0.1)';
$cardWidth           = isset( $attributes['cardWidth'] ) ? $attributes['cardWidth'] : 900;
$cardColumns         = isset( $attributes['cardColumns'] ) ? $attributes['cardColumns'] : 2;
$cardFontFamily      = isset( $attributes['cardFontFamily'] ) ? $attributes['cardFontFamily'] : 'inherit';
$cardTextAlign       = isset( $attributes['cardTextAlign'] ) ? $attributes['cardTextAlign'] : 'left';
$cardValueFontWeight = isset( $attributes['cardValueFontWeight'] ) ? $attributes['cardValueFontWeight'] : 'normal';
$cardValueFontStyle  = isset( $attributes['cardValueFontStyle'] ) ? $attributes['cardValueFontStyle'] : 'normal';
$cardLabelFontWeight = isset( $attributes['cardLabelFontWeight'] ) ? $attributes['cardLabelFontWeight'] : 'bold';
$cardLabelFontStyle  = isset( $attributes['cardLabelFontStyle'] ) ? $attributes['cardLabelFontStyle'] : 'normal';

/**
 * ------------------------------------------------------------------
 * PASS BLOCK ATTRIBUTES & LOCALE TO view.js
 * ------------------------------------------------------------------
 */


// Build the object for JS.
$js_attr = array(
	'isSpanish'           => $is_spanish,
	'cardFontFamily'      => $cardFontFamily,
	'cardTextAlign'       => $cardTextAlign,
	'cardValueFontWeight' => $cardValueFontWeight,
	'cardValueFontStyle'  => $cardValueFontStyle,
	'cardLabelFontWeight' => $cardLabelFontWeight,
	'cardLabelFontStyle'  => $cardLabelFontStyle,
	'cardTitleFontSize'   => $cardTitleFontSize,
	'cardTitleColor'      => $cardTitleColor,
	'cardTitleTextAlign'  => $cardTitleTextAlign,
	'cardTitleFontWeight' => $cardTitleFontWeight,
	'cardTitleFontStyle'  => $cardTitleFontStyle,
	'cardTitlePadding'    => $cardTitlePadding,
    'cardColumns' => $cardColumns,
    'cardWidth'   => $cardWidth,
);

$lbl = $is_spanish
    ? [ 'addr'=>'Dirección:', 'man'=>'Gerente:', 'phone'=>'Teléfono:',
        'web'=>'Sitio web:', 'cat'=>'Categoría:', 'desc'=>'Descripción:' ]
    : [ 'addr'=>'Address:',   'man'=>'Manager:', 'phone'=>'Phone:',
        'web'=>'Website:',    'cat'=>'Category:',  'desc'=>'Description:' ];

wp_add_inline_script(
    'hrdc-tools-housing-listings-script',
    'window.hrdcBlockAttr = ' . wp_json_encode( $js_attr ) . ';' .
    'window.hrdcLbl        = ' . wp_json_encode( $lbl) . ';',
    'before'
);

// Handle auto‑registered from block.json →  namespace/block + "-script".
// For hrdc-tools/housing-listings it is:
$handle = 'hrdc-tools-housing-listings-script';
wp_enqueue_script( $handle );

echo $custom_styles;

echo '<div id="hl-results-count" style="margin-bottom:10px; font-size:16px; color:#333;"></div>';
// Build block wrapper attributes.
$wrapper_atts = get_block_wrapper_attributes( array( 'class' => 'hrdc-housing-listings ' . esc_attr( $container_class ) ) );
echo '<div ' . $wrapper_atts . '>';
    echo '<div id="hl-results">';
    echo '</div>'; 

// ------------------------------------------------------------------
// Filtering & Event Listening Logic:
// The front-end JavaScript (view.js) listens for a custom event 'hrdcApplyFilters'
// and updates the innerHTML of the container with id "hl-results" based on the filters.
// This enables dynamic filtering without reloading the page.
// ------------------------------------------------------------------

return '';
?>
