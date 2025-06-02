<?php
/**
 * Render callback for the Search Modal block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
$is_spanish = ( get_locale() === 'es_ES' );     // or switch_to_locale(..)

$lbl = $is_spanish ? [
    'city'       => 'Ciudad',
    'any'        => 'Cualquiera',
    'demo'       => 'Población objetivo',
    'noneAbove'  => 'Ninguno de los anteriores',
    'sen55'      => 'Adultos mayores (55+)',
    'sen62'      => 'Adultos mayores (62+)',
    'disabled'   => 'Persona con discapacidad',
    'felonyQ'    => '¿Tiene antecedentes penales?',
    'creditQ'    => '¿Buen crédito (600+)?',
    'unitTypes'  => 'Tipos de unidad',
    'studio'     => 'Estudio',
    '1bed'       => '1 habitación',
    '2bed'       => '2 habitaciones',
    '3bed'       => '3 habitaciones',
    '4bed'       => '4 o más habitaciones',
    'petsQ'      => '¿Necesita unidades que acepten mascotas?',
    'ssnQ'       => '¿Tiene número de seguro social?',
    'housing'    => 'Tipos de vivienda',
    'lowIncome'  => 'Crédito fiscal‑LIHTC',
    'subsidized' => 'Viviendas subsidiadas',
    'market'     => 'Precio de mercado',
    'yes'        => 'Sí',
    'no'         => 'No',
    'modalTitle' => 'Filtrar anuncios',
    'btnOpen'    => 'Filtrar viviendas',
    'btnApply'   => 'Aplicar filtros',
    'btnReset'   => 'Restablecer filtros',
] : [
    // English
    'city'       => 'City',
    'any'        => 'Any',
    'demo'       => 'Demographic',
    'noneAbove'  => 'None of the above',
    'sen55'      => 'Senior (55+)',
    'sen62'      => 'Senior (62+)',
    'disabled'   => 'Person with Disabling Condition',
    'felonyQ'    => 'Do you have a felony conviction?',
    'creditQ'    => 'Do you have good credit (above 600+)?',
    'unitTypes'  => 'Unit Types',
    'studio'     => 'Studio',
    '1bed'       => '1 bedroom',
    '2bed'       => '2 bedrooms',
    '3bed'       => '3 bedrooms',
    '4bed'       => '4+ bedrooms',
    'petsQ'      => 'Are you looking for pet‑friendly units (non‑service animals)?',
    'ssnQ'       => 'Do you have a social security number?',
    'housing'    => 'Housing Types',
    'lowIncome'  => 'Low Income Tax Credit',
    'subsidized' => 'Subsidized Housing',
    'market'     => 'Market Rate',
    'yes'        => 'Yes',
    'no'         => 'No',
    'modalTitle' => 'Filter Listings',
    'btnOpen'    => 'Search by Criteria',
    'btnApply'   => 'Apply Filters',
    'btnReset'   => 'Reset Filters',
];

// Retrieve persistent attributes with fallbacks.
$container_class    = isset( $attributes['containerClass'] ) ? $attributes['containerClass'] : '';
$container_style    = isset( $attributes['containerStyle'] ) ? $attributes['containerStyle'] : '';
$align              = isset( $attributes['align'] ) ? $attributes['align'] : 'none';
$borderColor        = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '#ccc';
$borderRadius       = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 4;
$backgroundColor    = isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '#fff';

// Button settings
$buttonColor	   = isset( $attributes['buttonColor'] ) ? $attributes['buttonColor'] : '#147278';
$buttonText         = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : $lbl['btnOpen'];
$buttonFont         = isset( $attributes['buttonFont'] ) ? $attributes['buttonFont'] : 'inherit';
$buttonTextSize     = isset( $attributes['buttonTextSize'] ) ? $attributes['buttonTextSize'] : 24;
$buttonFontWeight   = isset( $attributes['buttonFontWeight'] ) ? $attributes['buttonFontWeight'] : 'normal';
$buttonSize         = isset( $attributes['buttonSize'] ) ? $attributes['buttonSize'] : 48;

// Label styling for modal fields
$labelFont          = isset( $attributes['labelFont'] ) ? $attributes['labelFont'] : 'inherit';
$labelTextSize      = isset( $attributes['labelTextSize'] ) ? $attributes['labelTextSize'] : 16;
$labelFontWeight    = isset( $attributes['labelFontWeight'] ) ? $attributes['labelFontWeight'] : '600';

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
	background-color:' . esc_attr( $buttonColor ) . ';
	border:1px solid ' . esc_attr( $borderColor ) . ';
	border-radius:' . esc_attr( $borderRadius ) . 'px;
	color:#fff;
	padding:10px;
	height:' . esc_attr( $buttonSize ) . 'px;
	width:' . esc_attr( $buttonSize * 3 ) . 'px;
	font-size:' . esc_attr( $buttonTextSize ) . 'px;
	font-family:' . esc_attr( $buttonFont ) . ';
	font-weight:' . esc_attr( $buttonFontWeight ) . ';
">';
$output .= esc_html( $buttonText );
$output .= '</button>';
$output .= '</div>';

// Modal overlay (hidden by default).
$output .= '<div id="hrdc-modal-overlay"
	class="hrdc-search-modal-overlay"
	style="
		display:none;
		position:fixed;inset:0;
		background:rgba(0,0,0,.6);
		z-index:9998;
		display:none;align-items:flex-start;justify-content:center;
		width:100%;height:100%;
		overflow:hidden;              /* page can scroll on iOS */
		padding:4vh 10px;
	">';                 
$output .= '<div class="hrdc-search-modal-content" style="
	background:' . esc_attr( $backgroundColor ) . ';
	border-radius:' . esc_attr( $borderRadius ) . 'px;
	width:600px;max-width:90%;
	max-height:calc(100vh - 80px);           /* ❷ keeps it in the window */
	overflow:auto;             /* ❷ gives the panel its own scroll bar */
	margin:60px auto;
	padding:30px 24px 40px;
	position:relative;
	display:flex;flex-direction:column;gap:16px;
">';

$output .= '<button id="hrdc-close-search-modal" style="
    position:absolute;
    top:8px;right:10px;
    width:32px;height:32px;                /* square box */
    border:2px solidrgb(224, 83, 70);              /* red outline */
    background:#c21807;                    /* red fill   */
    color:#fff;                            /* always visible  */
    font-size:20px;line-height:28px;       /* centre the ×   */
    border-radius:4px;                     /* slight rounding */
    cursor:pointer;
    text-align:center;
    padding:0;
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
	$output .= '<label for="hrdc-city" style="' . $labelStyle . '">' . esc_html( $lbl['city'] ). '</label><br/>';
	$output .= '<select id="hrdc-city" multiple style="width:90%">';
	$output .= '<option value="">' . esc_html( $lbl['any'] ) . '</option>';
	$output .= '<option value="bozeman">Bozeman</option>';
	$output .= '<option value="belgrade">Belgrade</option>';
	$output .= '<option value="big sky">Big Sky</option>';
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
	$output .= '<label for="hrdc-demographic" style="' . $labelStyle . '">' . $lbl['demo'] . '</label><br/>';
	$output .= '<select id="hrdc-demographic" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="None of the above">' . $lbl['noneAbove'] . '</option>';
    $output .= '<option value="senior (55+)">' . $lbl['sen55'] . '</option>';
    $output .= '<option value="senior (62+)">' . $lbl['sen62']. '</option>';
    $output .= '<option value="person with disabling condition">' . $lbl['disabled'] . '<option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Felony Field.
if ( $feloniesShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-felonies" style="' . $labelStyle . '">' . $lbl['felonyQ'] . '</label><br/>';
	$output .= '<select id="hrdc-felonies" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . $lbl['no'] . '</option>';
	$output .= '<option value="yes">' . $lbl['yes'] . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Credit Field.
if ( $creditCheckShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-credit" style="' . $labelStyle . '">' . $lbl['creditQ']. '</label><br/>';
	$output .= '<select id="hrdc-credit" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . $lbl['no'] . '</option>';
	$output .= '<option value="yes">' . $lbl['yes'] . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Unit Types Field.
if ( $unitTypesShow ) {
    $output .= '<div class="modal-field" style="margin-bottom:10px;">';
    $output .= '<label for="hrdc-unit-types" style="' . $labelStyle . '">' . __( 'Unit Types', 'hrdc-custom-tools' ) . '</label><br/>';
    $output .= '<select id="hrdc-unit-types" multiple style="width:90%">';
    $output .= '<option value="">' . $lbl['any'] . '</option>';
    $output .= '<option value="studio">' .$lbl['studio'] . '</option>';
    $output .= '<option value="1-bedroom">' . $lbl['1bed'] . '</option>';
    $output .= '<option value="2-bedrooms">' . $lbl['2bed'] . '</option>';
    $output .= '<option value="3-bedrooms">' . $lbl['3bed'] . '</option>';
    $output .= '<option value="4+-bedrooms">' . $lbl['4bed']. '</option>';
    $output .= '</select>';
    $output .= '</div>';
}

// Pets Field.
if ( $petsShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-pets" style="' . $labelStyle . '">' . $lbl['petsQ'] . '</label><br/>';
	$output .= '<select id="hrdc-pets" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . $lbl['no'] . '</option>';
	$output .= '<option value="yes">' . $lbl['yes'] . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Social Security Field.
if ( $socialSecurityShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-social" style="' . $labelStyle . '">' . $lbl['ssnQ']. '</label><br/>';
	$output .= '<select id="hrdc-social" style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="no">' . $lbl['no'] . '</option>';
	$output .= '<option value="yes">' . $lbl['yes'] . '</option>';
	$output .= '</select>';
	$output .= '</div>';
}

// Housing Types Field.
if ( $categoryShow ) {
	$output .= '<div class="modal-field" style="margin-bottom:10px;">';
	$output .= '<label for="hrdc-housing-types" style="' . $labelStyle . '">' . $lbl['housing'] . '</label><br/>';
	$output .= '<select id="hrdc-housing-types" multiple style="width:90%">';
    $output .= '<option value="">' . __( '', 'hrdc-custom-tools' ) . '</option>';
	$output .= '<option value="">' . $lbl['any'] . '</option>';
	$output .= '<option value="low income tax credit">' . $lbl['lowIncome'] . '</option>';
	$output .= '<option value="subsidized housing">' . $lbl['subsidized']. '</option>';
	$output .= '<option value="market rate">' . $lbl['market'] . '</option>';
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
">' . $lbl['btnApply']. '</button>';
$output .= '<button class="btn" id="hrdc-reset-search" style="
	background-color:#fff;
	color:#0073aa;
	border:1px solid #0073aa;
	padding:8px 16px;
	border-radius:4px;
	cursor:pointer;
">' . $lbl['btnReset'] . '</button>';
$output .= '</div>';

$output .= '</div>'; // end modal-fields-front-preview
$output .= '</div>'; // end hrdc-search-modal-content
$output .= '</div>'; // end hrdc-modal-overlay
$output .= '</div>'; // end hrdc-search-modal

echo $output;
?>
