<?php
/**
 * Render callback for the Search Modal block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */

// Retrieve persistent attributes with fallbacks.
$container_class    = isset( $attributes['containerClass'] ) ? $attributes['containerClass'] : '';
$container_style    = isset( $attributes['containerStyle'] ) ? $attributes['containerStyle'] : '';
$align              = isset( $attributes['align'] ) ? $attributes['align'] : 'none';
$borderColor        = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '#ccc';
$borderRadius       = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 4;
$backgroundColor    = isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '#fff';

// Button settings
$buttonText         = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : __( 'Search by Criteria', 'hrdc-custom-tools' );
$buttonFont         = isset( $attributes['buttonFont'] ) ? $attributes['buttonFont'] : 'inherit';
$buttonTextSize     = isset( $attributes['buttonTextSize'] ) ? $attributes['buttonTextSize'] : 14;
$buttonFontWeight   = isset( $attributes['buttonFontWeight'] ) ? $attributes['buttonFontWeight'] : 'normal';
$ButtonSize         = isset( $attributes['ButtonSize'] ) ? $attributes['ButtonSize'] : 48;

// Label styling for modal fields
$labelFont          = isset( $attributes['labelFont'] ) ? $attributes['labelFont'] : 'inherit';
$labelTextSize      = isset( $attributes['labelTextSize'] ) ? $attributes['labelTextSize'] : 14;
$labelFontWeight    = isset( $attributes['labelFontWeight'] ) ? $attributes['labelFontWeight'] : 'normal';

// Field visibility toggles.
$cityShow           = isset( $attributes['cityShow'] ) ? $attributes['cityShow'] : true;
$demographicShow    = isset( $attributes['demographicShow'] ) ? $attributes['demographicShow'] : true;
$feloniesShow       = isset( $attributes['feloniesShow'] ) ? $attributes['feloniesShow'] : true;
$creditCheckShow    = isset( $attributes['creditCheckShow'] ) ? $attributes['creditCheckShow'] : true;
$unitTypesShow      = isset( $attributes['unitTypesShow'] ) ? $attributes['unitTypesShow'] : true;
$petsShow           = isset( $attributes['petsShow'] ) ? $attributes['petsShow'] : true;
$socialSecurityShow = isset( $attributes['socialSecurityShow'] ) ? $attributes['socialSecurityShow'] : true;
$categoryShow       = isset( $attributes['categoryShow'] ) ? $attributes['categoryShow'] : true;

// Build inline style for labels.
$labelStyle = 'font-family:' . esc_attr( $labelFont ) . '; font-size:' . esc_attr( $labelTextSize ) . 'px; font-weight:' . esc_attr( $labelFontWeight ) . ';';

// Build block wrapper attributes.
$wrapper_atts = get_block_wrapper_attributes( array( 'class' => 'hrdc-search-modal ' . esc_attr( $container_class ) ) );

// Start building the output string.
$output = '';
$output .= '<div ' . $wrapper_atts . ' style="' . esc_attr( $container_style ) . '">';

// Trigger button.
$output .= '<div class="search-modal-front-trigger" style="text-align:' . esc_attr( $align ) . '; margin-bottom:10px;">';
$output .= '<button id="hrdc-open-search-modal" class="btn" style="
	background-color:' . esc_attr( $backgroundColor ) . ';
	border:1px solid ' . esc_attr( $borderColor ) . ';
	border-radius:' . esc_attr( $borderRadius ) . 'px;
	padding:10px;
	height:' . esc_attr( $ButtonSize ) . 'px;
	width:' . esc_attr( $ButtonSize * 3 ) . 'px;
	font-size:' . esc_attr( $buttonTextSize ) . 'px;
	font-family:' . esc_attr( $buttonFont ) . ';
	font-weight:' . esc_attr( $buttonFontWeight ) . ';
">';
$output .= esc_html( $buttonText );
$output .= '</button>';
$output .= '</div>';

// Modal overlay (hidden by default).
$output .= '<div id="hrdc-modal-overlay" class="hrdc-search-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); z-index:9999;">';
$output .= '<div class="hrdc-search-modal-content" style="
	background:#fff;
	border-radius:' . esc_attr( $borderRadius ) . 'px;
	width:600px;
	max-width:90%;
	margin:60px auto;
	padding:20px;
	position:relative;
">';
$output .= '<button id="hrdc-close-search-modal" style="
	position:absolute; 
	top:8px; 
	right:10px; 
	border:none; 
	background:none; 
	font-size:48px; 
	cursor:pointer;
">×</button>';

// Modal fields container.
$output .= '<div class="modal-fields-front-preview" style="
	border:1px solid #eee;
	padding:10px;
	text-align:center;
	font-family:' . esc_attr( $labelFont ) . ';
	font-weight:' . esc_attr( $labelFontWeight ) . ';
	font-size:' . esc_attr( $labelTextSize ) . 'px;
">';

// City Field.
if ( $cityShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-city" style="' . $labelStyle . '">' . __( 'City', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-city" style="width:90%">';
	$output .= '<option value="">' . __( 'Any', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="bozeman">Bozeman</option>';
	$output .= '<option value="belgrade">Belgrade</option>';
	$output .= '<option value="west yellowstone">West Yellowstone</option>';
	$output .= '<option value="livingston">Livingston</option>';
	$output .= '<option value="clyde park">Clyde Park</option>';
	$output .= '<option value="emigrant">Emigrant</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Demographic Field.
if ( $demographicShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-demographic" style="' . $labelStyle . '">' . __( 'Demographic', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-demographic" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="None of the above">' . __( 'None of the above', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="senior (55+)">' . __( 'Senior (55+)', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="senior (62+)">' . __( 'Senior (62+)', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="person with disabling condition">' . __( 'Person with Disabling Condition', 'hrdc-custom-tools' ) . '<option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Felony Field.
if ( $feloniesShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-felonies" style="' . $labelStyle . '">' . __( 'Do you have a felony conviction?', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-felonies" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . __( 'No', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="yes">' . __( 'Yes', 'hrdc-custom-tools' ) . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Credit Field.
if ( $creditCheckShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-credit" style="' . $labelStyle . '">' . __( 'Do you have good credit (above 600+)?', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-credit" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . __( 'No', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="yes">' . __( 'Yes', 'hrdc-custom-tools' ) . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Unit Types Field.
if ( $unitTypesShow ) {
    $output .= '<div class="modal-field" style="margin-bottom:10px;">';
    $output .= '<label for="hrdc-unit-types" style="' . $labelStyle . '">' . __( 'Unit Types', 'hrdc-custom-tools' ) . '</label><br/>';
    $output .= '<select id="hrdc-unit-types" style="width:90%">';
    $output .= '<option value="">' . __( 'Any', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="studio">' . __( 'Studio', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="1-bedroom">' . __( '1-Bedroom', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="2-bedrooms">' . __( '2-Bedrooms', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="3-bedrooms">' . __( '3-Bedrooms', 'hrdc-custom-tools' ) . '</option>';
    $output .= '<option value="4+-bedrooms">' . __( '4+-Bedrooms', 'hrdc-custom-tools' ) . '</option>';
    $output .= '</select>';
    $output .= '</div>';
}

// Pets Field.
if ( $petsShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-pets" style="' . $labelStyle . '">' . __( 'Are you looking for pet friendly units (for non‑service animals)?', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-pets" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . __( 'No', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="yes">' . __( 'Yes', 'hrdc-custom-tools' ) . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Social Security Field.
if ( $socialSecurityShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-social" style="' . $labelStyle . '">' . __( 'Do you have a social security number?', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-social" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . __( 'No', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="yes">' . __( 'Yes', 'hrdc-custom-tools' ) . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Housing Types Field.
if ( $categoryShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-housing-types" style="' . $labelStyle . '">' . __( 'Housing Types', 'hrdc-custom-tools' ) . '</label><br/>';
	$output .= '<select id="hrdc-housing-types" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="">' . __( 'Any', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="low income tax credit">' . __( 'Low Income Tax Credit', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="subsidized housing">' . __( 'Subsidized Housing', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="market rate">' . __( 'Market Rate', 'hrdc-custom-tools' ) . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Buttons: Apply & Reset.
$output .= '<div style="margin-top:20px; text-align:center;">';
$output .= '<button class="btn" id="hrdc-apply-search" style="
	background-color:#0073aa;
	color:#fff;
	border:none;
	padding:8px 16px;
	border-radius:4px;
	cursor:pointer;
	margin-right:10px;
">' . __( 'Apply Filters', 'hrdc-custom-tools' ) . '</button>';
$output .= '<button class="btn" id="hrdc-reset-search" style="
	background-color:#fff;
	color:#0073aa;
	border:1px solid #0073aa;
	padding:8px 16px;
	border-radius:4px;
	cursor:pointer;
">' . __( 'Reset Filters', 'hrdc-custom-tools' ) . '</button>';
$output .= '</div>';

$output .= '</div>'; // end modal-fields-front-preview
$output .= '</div>'; // end hrdc-search-modal-content
$output .= '</div>'; // end hrdc-modal-overlay
$output .= '</div>'; // end hrdc-search-modal

echo $output;
?>
