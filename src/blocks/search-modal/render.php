<?php
/**
 * Render callback for the Search Modal block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */

// Retrieve attributes with defaults.
$button_text     = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : __( 'Search by Criteria', 'hrdc-custom-tools' );
$container_class = isset( $attributes['containerClass'] ) ? $attributes['containerClass'] : '';
$container_style = isset( $attributes['containerStyle'] ) ? $attributes['containerStyle'] : '';
$align           = isset( $attributes['align'] ) ? $attributes['align'] : 'none';
$border_color    = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '#ccc';
$border_radius   = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 4;
$background_color= isset( $attributes['backgroundColor'] ) ? $attributes['backgroundColor'] : '#fff';
$show_fields     = isset( $attributes['showFields'] ) ? $attributes['showFields'] : true;

// Build the block wrapper attributes.
$wrapper_atts = get_block_wrapper_attributes( array( 'class' => "hrdc-search-modal {$container_class} align{$align}" ) );

$output  = '';
$output .= $wrapper_atts;

// Modal markup.
$output .= '<div class="hrdc-search-modal" style="' . esc_attr( $container_style ) . '">';
	$output .= '<button id="hrdc-open-search-modal" class="btn" style="border: 1px solid ' . esc_attr( $border_color ) . '; border-radius: ' . esc_attr( $border_radius ) . 'px; background-color: ' . esc_attr( $background_color ) . ';">' . esc_html( $button_text ) . '</button>';
	$output .= '<div id="hrdc-search-modal-overlay" style="display:none;">';
		$output .= '<div id="hrdc-search-modal-content">';
			$output .= '<button id="hrdc-close-search-modal" class="btn">×</button>';
			$output .= '<h3>' . __( 'Filter Listings', 'hrdc-custom-tools' ) . '</h3>';
			if ( $show_fields ) {
				// Modal fields.
				$output .= '<div class="modal-field">';
					$output .= '<label for="hrdc-city">' . __( 'City', 'hrdc-custom-tools' ) . '</label>';
					$output .= '<select id="hrdc-city">';
						$output .= '<option value="">' . __( 'Any', 'hrdc-custom-tools' ) . '</option>';
						$output .= '<option value="bozeman">Bozeman</option>';
						$output .= '<option value="belgrade">Belgrade</option>';
						$output .= '<option value="west yellowstone">West Yellowstone</option>';
						$output .= '<option value="livingston">Livingston</option>';
						$output .= '<option value="clyde park">Clyde Park</option>';
						$output .= '<option value="emigrant">Emigrant</option>';
					$output .= '</select>';
				$output .= '</div>';
				// Repeat for additional fields (Demographic, Felonies, etc.)
				$output .= '<div class="modal-field">';
					$output .= '<label for="hrdc-demographic">' . __( 'Demographic', 'hrdc-custom-tools' ) . '</label>';
					$output .= '<select id="hrdc-demographic">';
						$output .= '<option value="">' . __( 'None of the above', 'hrdc-custom-tools' ) . '</option>';
						$output .= '<option value="senior (55+)">Senior (55+)</option>';
						$output .= '<option value="senior (62+)">Senior (62+)</option>';
						$output .= '<option value="person with disabling condition">Person with Disabling Condition</option>';
					$output .= '</select>';
				$output .= '</div>';
				// … (continue with other fields for Felonies, Credit, Unit Types, Pets, Social Security, Housing Types)
			}
			// Buttons
			$output .= '<div style="margin-top:20px;">';
				$output .= '<button id="hrdc-apply-search" class="btn">' . __( 'Apply Filters', 'hrdc-custom-tools' ) . '</button>';
				$output .= '<button id="hrdc-reset-search" class="btn">' . __( 'Reset Filters', 'hrdc-custom-tools' ) . '</button>';
			$output .= '</div>';
		$output .= '</div>'; // end modal content
	$output .= '</div>'; // end overlay
$output .= '</div>'; // end main container

// Inline script to attach front end events (directly, no output buffering)
$output .= '<script type="text/javascript">
(function(){
	// Function to dispatch filter event
	function dispatchFilters() {
		var filters = {
			city: document.getElementById("hrdc-city").value,
			reservedFor: document.getElementById("hrdc-demographic").value,
			// Continue with other fields...
		};
		var event = new CustomEvent("hrdcApplyFilters", { detail: filters });
		document.dispatchEvent(event);
	}
	// Attach events
	document.getElementById("hrdc-apply-search").addEventListener("click", function(){
		dispatchFilters();
		document.getElementById("hrdc-search-modal-overlay").style.display = "none";
	});
	document.getElementById("hrdc-reset-search").addEventListener("click", function(){
		document.getElementById("hrdc-city").value = "";
		document.getElementById("hrdc-demographic").value = "";
		// Reset additional fields...
		dispatchFilters();
		document.getElementById("hrdc-search-modal-overlay").style.display = "none";
	});
	// For front end, allow the overlay to always show when button is clicked.
	document.getElementById("hrdc-open-search-modal").addEventListener("click", function(){
		document.getElementById("hrdc-search-modal-overlay").style.display = "block";
	});
	document.getElementById("hrdc-close-search-modal").addEventListener("click", function(){
		document.getElementById("hrdc-search-modal-overlay").style.display = "none";
	});
})();
</script>';

echo $output;
