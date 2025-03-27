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

// Build an array of listings data for use in JavaScript filtering.
$listings_data = array();
if ( $query->have_posts() ) {
    while ( $query->have_posts() ) {
        $query->the_post();
        $post_id = get_the_ID();

        $listings_data[] = array(
            'id'         => $post_id,
            'title'      => get_the_title(),
            'content'    => apply_filters( 'the_content', get_the_content() ),
            'meta'       => array(
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
$cardWidth           = isset( $attributes['cardWidth'] ) ? $attributes['cardWidth'] : 300;
$cardColumns         = isset( $attributes['cardColumns'] ) ? $attributes['cardColumns'] : 2;
$cardFontFamily      = isset( $attributes['cardFontFamily'] ) ? $attributes['cardFontFamily'] : 'inherit';
$cardTextAlign       = isset( $attributes['cardTextAlign'] ) ? $attributes['cardTextAlign'] : 'left';
$cardValueFontWeight = isset( $attributes['cardValueFontWeight'] ) ? $attributes['cardValueFontWeight'] : 'normal';
$cardValueFontStyle  = isset( $attributes['cardValueFontStyle'] ) ? $attributes['cardValueFontStyle'] : 'normal';
$cardLabelFontWeight = isset( $attributes['cardLabelFontWeight'] ) ? $attributes['cardLabelFontWeight'] : 'bold';
$cardLabelFontStyle  = isset( $attributes['cardLabelFontStyle'] ) ? $attributes['cardLabelFontStyle'] : 'italic';

// Output custom styles.
$custom_styles = '<style>
.hrdc-housing-listings {
    display: grid;
    grid-template-columns: repeat(' . esc_attr( $cardColumns ) . ', ' . esc_attr( $cardWidth ) . 'px);
    gap: 20px;
    text-align: ' . esc_attr( $cardTextAlign ) . ';
    font-family: ' . esc_attr( $cardFontFamily ) . ';
}
.hrdc-housing-listings .listing-box {
    border: ' . esc_attr( $cardBorder ) . ';
    padding: ' . esc_attr( $cardInnerPadding ) . 'px;
    margin: ' . esc_attr( $cardOuterPadding ) . 'px;
    background-color: ' . esc_attr( $cardBackground ) . ';
    border-radius: ' . esc_attr( $cardRadius ) . 'px;
    box-shadow: ' . esc_attr( $cardShadow ) . ';
}
.hrdc-housing-listings .listing-title {
    font-size: ' . esc_attr( $cardTitleFontSize ) . 'px;
    color: ' . esc_attr( $cardTitleColor ) . ';
    text-align: ' . esc_attr( $cardTitleTextAlign ) . ';
    margin-bottom: ' . esc_attr( $cardTitlePadding ) . 'px;
    margin-top: 10px;
}
.hrdc-housing-listings .listing-info,
.hrdc-housing-listings .listing-link {
    text-align: ' . esc_attr( $cardTextAlign ) . ';
}

</style>';
echo $custom_styles;

echo '<div id="hl-results-count" style="margin-bottom:10px; font-size:16px; color:#333;"></div>';
// Build block wrapper attributes.
$wrapper_atts = get_block_wrapper_attributes( array( 'class' => 'hrdc-housing-listings ' . esc_attr( $container_class ) ) );
echo '<div ' . $wrapper_atts . '>';
    echo '<div id="hl-results">';
    
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $post_id = get_the_ID();

            // Retrieve meta values.
            $address  = get_post_meta( $post_id, '_address', true );
            $city     = get_post_meta( $post_id, '_city', true );
            $manager  = get_post_meta( $post_id, '_property_manager', true );
            $phone    = get_post_meta( $post_id, '_phone', true );
            $website  = get_post_meta( $post_id, '_website', true );
            $category = get_post_meta( $post_id, '_category', true );

            // Use fallback values if any are empty.
            $address  = ! empty( $address ) ? esc_html( $address ) : 'N/A';
            $city     = ! empty( $city ) ? esc_html( $city ) : '';
            $manager  = ! empty( $manager ) ? esc_html( $manager ) : 'N/A';
            $phone    = ! empty( $phone ) ? esc_html( $phone ) : 'N/A';
            $website_url  = ! empty( $website ) ? esc_url( $website ) : '';
            $website_text = ! empty( $website ) ? esc_html( $website ) : 'N/A';
            $category = ! empty( $category ) ? esc_html( $category ) : 'N/A';

            // Build each listing's HTML.
            echo '<div class="listing-box">';
                echo '<div class="listing-row">';
                    echo '<div class="listing-left">';
                        // Title
                        echo '<div class="listing-title" style="font-size:' . esc_attr( $cardTitleFontSize ) . 'px; color:' . esc_attr( $cardTitleColor ) . '; text-align:' . esc_attr( $cardTitleTextAlign ) . '; font-weight:' . esc_attr( $cardTitleFontWeight ) . '; font-style:' . esc_attr( $cardTitleFontStyle ) . '; padding-bottom:' . esc_attr( $cardTitlePadding ) . 'px;">' . get_the_title() . '</div>';
                        // Address
                        echo '<div class="listing-info" style="font-family:' . esc_attr( $cardFontFamily ) . '; text-align:' . esc_attr( $cardTextAlign ) . ';">';
                            echo '<em style="font-weight:' . esc_attr( $cardLabelFontWeight ) . '; font-style:' . esc_attr( $cardLabelFontStyle ) . ';">' . __( 'Address: ', 'hrdc-custom-tools' ) . '</em> ';
                            echo '<span style="font-weight:' . esc_attr( $cardValueFontWeight ) . '; font-style:' . esc_attr( $cardValueFontStyle ) . ';">' . $address . ', ' . $city . '</span>';
                        echo '</div>';
                        // Manager
                        echo '<div class="listing-info" style="font-family:' . esc_attr( $cardFontFamily ) . '; text-align:' . esc_attr( $cardTextAlign ) . ';">';
                            echo '<em style="font-weight:' . esc_attr( $cardLabelFontWeight ) . '; font-style:' . esc_attr( $cardLabelFontStyle ) . ';">' . __( 'Manager: ', 'hrdc-custom-tools' ) . '</em> ';
                            echo '<span style="font-weight:' . esc_attr( $cardValueFontWeight ) . '; font-style:' . esc_attr( $cardValueFontStyle ) . ';">' . $manager . '</span>';
                        echo '</div>';
                        // Phone
                        echo '<div class="listing-info" style="font-family:' . esc_attr( $cardFontFamily ) . '; text-align:' . esc_attr( $cardTextAlign ) . ';">';
                            echo '<em style="font-weight:' . esc_attr( $cardLabelFontWeight ) . '; font-style:' . esc_attr( $cardLabelFontStyle ) . ';">' . __( 'Phone: ', 'hrdc-custom-tools' ) . '</em> ';
                            echo '<span style="font-weight:' . esc_attr( $cardValueFontWeight ) . '; font-style:' . esc_attr( $cardValueFontStyle ) . ';">' . $phone . '</span>';
                        echo '</div>';
                        // Website
                        echo '<div class="listing-info" style="font-family:' . esc_attr( $cardFontFamily ) . '; text-align:' . esc_attr( $cardTextAlign ) . ';">';
                            echo '<em style="font-weight:' . esc_attr( $cardLabelFontWeight ) . '; font-style:' . esc_attr( $cardLabelFontStyle ) . ';">' . __( 'Website: ', 'hrdc-custom-tools' ) . '</em> ';
                            echo '<span style="font-weight:' . esc_attr( $cardValueFontWeight ) . '; font-style:' . esc_attr( $cardValueFontStyle ) . ';">';
                                echo '<a href="' . $website_url . '" target="_blank" rel="noreferrer">' . $website_text . '</a>';
                            echo '</span>';
                        echo '</div>';
                        // Category
                        echo '<div class="listing-info" style="font-family:' . esc_attr( $cardFontFamily ) . '; text-align:' . esc_attr( $cardTextAlign ) . ';">';
                            echo '<em style="font-weight:' . esc_attr( $cardLabelFontWeight ) . '; font-style:' . esc_attr( $cardLabelFontStyle ) . ';">' . __( 'Category: ', 'hrdc-custom-tools' ) . '</em> ';
                            echo '<span style="font-weight:' . esc_attr( $cardValueFontWeight ) . '; font-style:' . esc_attr( $cardValueFontStyle ) . ';">' . $category . '</span>';
                        echo '</div>';
                    echo '</div>'; // end listing-left

                    echo '<div class="listing-right" style="font-family:' . esc_attr( $cardFontFamily ) . '; text-align:' . esc_attr( $cardTextAlign ) . ';">';
                        // Description
                        echo '<div class="listing-info">';
                            echo '<em style="font-weight:' . esc_attr( $cardLabelFontWeight ) . '; font-style:' . esc_attr( $cardLabelFontStyle ) . ';">' . __( 'Description: ', 'hrdc-custom-tools' ) . '</em><br>';
                            echo '<span style="font-weight:' . esc_attr( $cardValueFontWeight ) . '; font-style:' . esc_attr( $cardValueFontStyle ) . ';">' . get_the_content() . '</span>';
                        echo '</div>';
                    echo '</div>'; // end listing-right
                echo '</div>'; // end listing-row
            echo '</div>'; // end listing-box
        }
        wp_reset_postdata();
    } else {
        echo '<p><strong>No listings found.</strong></p>';
    }
    echo '</div>'; // end hl-results container

// ------------------------------------------------------------------
// Filtering & Event Listening Logic:
// The front-end JavaScript (view.js) listens for a custom event 'hrdcApplyFilters'
// and updates the innerHTML of the container with id "hl-results" based on the filters.
// This enables dynamic filtering without reloading the page.
// ------------------------------------------------------------------

return '';
?>
