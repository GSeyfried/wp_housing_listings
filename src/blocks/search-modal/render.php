<?php
/**
 * Render callback for the Search Modal block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
$button_text     = isset( $attributes['buttonText'] ) ? $attributes['buttonText'] : 'Search by Criteria';
$container_class = isset( $attributes['containerClass'] ) ? $attributes['containerClass'] : '';
$container_style = isset( $attributes['containerStyle'] ) ? $attributes['containerStyle'] : '';
?>
<div class="hrdc-search-modal <?php echo esc_attr( $container_class ); ?>" style="<?php echo esc_attr( $container_style ); ?>">
    <div id="hrdc-search-modal-overlay" style="display:none;">
        <div id="hrdc-search-modal-content">
            <button id="hrdc-close-search-modal" class="btn">×</button>
            <h3><?php _e( 'Filter Listings', 'hrdc-custom-tools' ); ?></h3>
            <div class="modal-field">
                <label for="hrdc-city"><?php _e( 'City', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-city">
                    <option value=""><?php _e( 'Any', 'hrdc-custom-tools' ); ?></option>
                    <option value="bozeman">Bozeman</option>
                    <option value="belgrade">Belgrade</option>
                    <option value="west yellowstone">West Yellowstone</option>
                    <option value="livingston">Livingston</option>
                    <option value="clyde park">Clyde Park</option>
                    <option value="emigrant">Emigrant</option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-demographic"><?php _e( 'Demographic', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-demographic">
                    <option value=""><?php _e( 'None of the above', 'hrdc-custom-tools' ); ?></option>
                    <option value="senior (55+)">Senior (55+)</option>
                    <option value="senior (62+)">Senior (62+)</option>
                    <option value="person with disabling condition">Person with Disabling Condition</option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-felonies"><?php _e( 'Do you have a felony conviction?', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-felonies">
                    <option value="no"><?php _e( 'No', 'hrdc-custom-tools' ); ?></option>
                    <option value="yes"><?php _e( 'Yes', 'hrdc-custom-tools' ); ?></option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-credit"><?php _e( 'Do you have good credit (above 600+)?', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-credit">
                    <option value="no"><?php _e( 'No', 'hrdc-custom-tools' ); ?></option>
                    <option value="yes"><?php _e( 'Yes', 'hrdc-custom-tools' ); ?></option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-unit-types"><?php _e( 'Unit Types', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-unit-types">
                    <option value=""><?php _e( 'Any', 'hrdc-custom-tools' ); ?></option>
                    <option value="studio">Studio</option>
                    <option value="1 bedroom">1 bedroom</option>
                    <option value="2 bedrooms">2 bedrooms</option>
                    <option value="3 bedrooms">3 bedrooms</option>
                    <option value="4+ bedrooms">4+ bedrooms</option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-pets"><?php _e( 'Are you looking for pet friendly units (for non‑service animals)?', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-pets">
                    <option value="no"><?php _e( 'No', 'hrdc-custom-tools' ); ?></option>
                    <option value="yes"><?php _e( 'Yes', 'hrdc-custom-tools' ); ?></option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-social"><?php _e( 'Do you have a social security number?', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-social">
                    <option value="no"><?php _e( 'No', 'hrdc-custom-tools' ); ?></option>
                    <option value="yes"><?php _e( 'Yes', 'hrdc-custom-tools' ); ?></option>
                </select>
            </div>
            <div class="modal-field">
                <label for="hrdc-housing-types"><?php _e( 'Housing Types', 'hrdc-custom-tools' ); ?></label>
                <select id="hrdc-housing-types">
                    <option value=""><?php _e( 'Any', 'hrdc-custom-tools' ); ?></option>
                    <option value="low income tax credit">Low Income Tax Credit</option>
                    <option value="subsidized housing">Subsidized Housing</option>
                    <option value="market rate">Market Rate</option>
                </select>
            </div>
            <button id="hrdc-apply-search" class="btn"><?php _e( 'Apply Filters', 'hrdc-custom-tools' ); ?></button>
        </div>
    </div>
    <button id="hrdc-open-search-modal" class="btn"><?php echo esc_html( $button_text ); ?></button>
</div>
