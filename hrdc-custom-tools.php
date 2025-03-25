<?php 
/**
 * Plugin Name:       HRDC Custom Tools
 * Description:       Multi-block plugin with housing listings and search modal.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Compliance @ HRDC (Griffin)
 * License:           GPL-2.0-or-later
 * Text Domain:       hrdc-custom-tools
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* =======================================================================
   Utility Logging Function
======================================================================== */
function hrdc_log( $message ) {
    if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
        $log_file = plugin_dir_path( __FILE__ ) . 'hrdc-debug.log';
        $timestamp = date('Y-m-d H:i:s');
        $log_message = "[{$timestamp}] {$message}\n";
        file_put_contents( $log_file, $log_message, FILE_APPEND );
    }
}

/* -----------------------------------------------------------------------
   REST API Logging (verbose; disable or comment out in production)
----------------------------------------------------------------------- */
add_filter( 'rest_pre_dispatch', function ($result, $server, $request) {
    $endpoint = $request->get_route();

    $method = $request->get_method();
    $params = json_encode($request->get_params());
    
    hrdc_log("📡 REST API Call: {$method} {$endpoint} | Params: {$params}");
    return $result;
}, 10, 3);

add_filter( 'rest_post_dispatch', function ($result, $server, $request) {
    $endpoint = $request->get_route();

    $method = $request->get_method();
    $response = json_encode($result->get_data());
    
    hrdc_log("✅ REST API Response: {$method} {$endpoint} | Response: {$response}");
    return $result;
}, 10, 3);

add_filter( 'wp_redirect', function ($location, $status) {
    hrdc_log("🔀 Redirect: {$location} | Status: {$status}");
    return $location;
}, 10, 2);

/* =======================================================================
   Setup: Persistent Data Folder & REST Config
======================================================================== */
register_activation_hook( __FILE__, 'hrdc_activate_plugin' );
add_action('admin_head', 'hrdc_output_rest_config');

function hrdc_activate_plugin() {
    $upload_dir = plugin_dir_path( __FILE__ ) . 'data/uploads';
    if ( ! file_exists( $upload_dir ) ) {
        wp_mkdir_p( $upload_dir );
        chmod( $upload_dir, 0755 );
        hrdc_log("Uploads folder created at: {$upload_dir}"); // Log creation of uploads folder
    }
}

function hrdc_output_rest_config() {
    echo '<script>
        var hrdcApiSettings = {
            root: "' . esc_url_raw( rest_url() ) . '",
            nonce: "' . wp_create_nonce( 'wp_rest' ) . '"
        };
    </script>';
}

/* =======================================================================
   Block Registration
======================================================================== */
add_action( 'init', 'hrdc_register_blocks' );
add_filter( 'block_categories_all', 'hrdc_register_custom_category', 10, 2 );

function hrdc_register_blocks() {
    $custom_blocks = array(
        'housing-listings',
        'search-modal',
    );
    
    foreach ( $custom_blocks as $block ) {
        register_block_type( __DIR__ . '/build/blocks/' . $block );
    }
}

function hrdc_register_custom_category( $categories ) {
    return array_merge( $categories, array(
        array(
            'slug'  => 'hrdc-tools',
            'title' => __( "HRDC Tools", 'hrdc-custom-tools' ),
        ),
    ) );
}

/* =======================================================================
    Register Custom Post Type for Housing Listings & Meta Registration
======================================================================== */
add_action('init', 'hrdc_register_meta');
add_action( 'init', 'hrdc_register_housing_listing_cpt' );

function hrdc_register_meta() {

    $meta_fields = [
        '_address'                => 'string',
        '_city'                   => 'string',
        '_county'                 => 'string',
        '_property_manager'       => 'string',
        '_phone'                  => 'string',
        '_website'                => 'string',
        '_category'               => 'string',
        '_reserved_for'           => 'string', // For filtering
        '_application_fee'        => 'string', // For filtering
        '_felonies_considered'    => 'string', // For filtering
        '_credit_check_not_required' => 'string', // For filtering
        '_unit_types'             => 'string', // For filtering
        '_pets_allowed'           => 'string', // For filtering
        '_social_security_required' => 'string', //For filtering
        '_universal_application'  => 'string', // For filtering
    ];

    foreach ($meta_fields as $key => $type) {
        register_post_meta('housing_listing', $key, [
            'type' => $type,
            'single' => true,
            'show_in_rest'  => [
                'schema'        => [ 'type' => $type ],
                'auth_callback' => '__return_true',
            ],
        ]);
    }
}

function hrdc_register_housing_listing_cpt() {
    $labels = array(
        'name'                  => __( 'Housing Listings', 'hrdc-custom-tools' ),
        'singular_name'         => __( 'Housing Listing', 'hrdc-custom-tools' ),
        'menu_name'             => __( 'Housing Listings', 'hrdc-custom-tools' ),
        'edit_item'             => __( 'Edit Housing Listing', 'hrdc-custom-tools' ),
        'view_item'             => __( 'View Housing Listing', 'hrdc-custom-tools' ),
        'search_items'          => __( 'Search Listings', 'hrdc-custom-tools' ),
        'not_found'             => __( 'No housing listings found', 'hrdc-custom-tools' ),
        'not_found_in_trash'    => __( 'No housing listings found in Trash', 'hrdc-custom-tools' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'show_in_rest'       => true,
        'supports'           => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'capability_type'    => 'post',
        'exclude_from_search' => true,
        'map_meta_cap'       => true,
        'capabilities'       => array(
            'create_posts' => TRUE,
        ),
        'menu_icon' => 'dashicons-building',
    );

    register_post_type( 'housing_listing', $args );

    // Remove "Add New" from admin menu.
    add_action('admin_menu', function() {
        global $submenu;
        unset($submenu['edit.php?post_type=housing_listing'][10]);
    });
}

/* =======================================================================
    REST Endpoints (upload, update, delete, list, refresh nonce) & processing functions
======================================================================== */
add_action( 'rest_api_init', 'hrdc_register_rest_routes' );

function hrdc_register_rest_routes() {
    // Upload endpoint.
    register_rest_route( 'hrdc-custom-tools/v1', '/upload', array(
        'methods'             => 'POST',
        'callback'            => 'hrdc_handle_file_upload',
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ) );

    // Update endpoints (supporting an optional file parameter).
    register_rest_route( 'hrdc-custom-tools/v1', '/update', array(
        'methods'             => 'POST',
        'callback'            => 'hrdc_handle_update',
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ) );
    register_rest_route( 'hrdc-custom-tools/v1', '/update/(?P<file>[^/]+)', array(
        'methods'             => 'POST',
        'callback'            => 'hrdc_handle_update',
        'permission_callback' => function() { 
            return current_user_can( 'manage_options' ); 
        },
    ) );

    // Delete endpoint.
    register_rest_route( 'hrdc-custom-tools/v1', '/delete/(?P<file>[^/]+)', array(
        'methods'             => 'DELETE',
        'callback'            => 'hrdc_handle_delete',
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ) );

    // List endpoint.
    register_rest_route( 'hrdc-custom-tools/v1', '/list', array(
        'methods'             => 'GET',
        'callback'            => 'hrdc_list_files',
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ) );
    
    // Refresh nonce endpoint.
    register_rest_route('hrdc-custom-tools/v1', '/refresh-nonce', array(
        'methods' => 'GET',
        'callback' => 'hrdc_refresh_nonce',
        'permission_callback' => '__return_true'
    ));
}

// Supported data types.
define('supported_data_types', ['housing_listings', 'ami_matrix']);

// Upload function.
function hrdc_handle_file_upload( WP_REST_Request $request ) {
    $data_type = $request->get_param( 'data_type' );

    // Validate data type.
    if (!in_array($data_type, supported_data_types)) {
        error_log('Invalid data type: ' . $data_type);
        return new WP_Error('invalid_data_type', 'Only housing listings and AMI matrix supported.', array('status' => 400));
    }

    if ( empty( $_FILES['file'] ) || $_FILES['file']['error'] !== 0 ) {
        error_log( 'File upload error: ' . $_FILES['file']['error'] );
        return new WP_Error( 'upload_error', 'File upload error.', array( 'status' => 400 ) );
    }

    $upload_dir = plugin_dir_path( __FILE__ ) . 'data/uploads';
    // Force file name to be "data_type.json" regardless of original file name.
    $filename = $data_type . '.json';
    $target = trailingslashit( $upload_dir ) . $filename;

    if ( move_uploaded_file( $_FILES['file']['tmp_name'], $target ) ) {
        error_log("File uploaded to: {$target}");
        // Parse and import posts.
        hrdc_parse_housing_listings( $target );
        return rest_ensure_response( array( 'success' => true, 'message' => 'File uploaded and data imported.' ) );
    } else {
        return new WP_Error( 'upload_failed', 'Could not move file.', array( 'status' => 500 ) );
    }
}

function hrdc_handle_update( WP_REST_Request $request ) {
    $data_type = $request->get_param( 'data_type' );
    $file = $request->get_param( 'file' );
    if (!in_array($data_type, supported_data_types)) {
        error_log('Invalid data type: ' . $data_type);
        return new WP_Error('invalid_data_type', 'Only housing listings and AMI matrix supported.', array('status' => 400));
    }
    if ( empty( $file ) ) {
        $file = $data_type . '.json';
    }
    // Delete all existing housing_listing posts.
    $posts = get_posts( array(
        'post_type'      => 'housing_listing',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ) );
    if ( $posts ) {
        foreach ( $posts as $post_id ) {
            wp_delete_post( $post_id, true );
        }
    }
    $upload_dir = plugin_dir_path( __FILE__ ) . 'data/uploads';
    $json_file  = trailingslashit( $upload_dir ) . $file;
    if ( file_exists( $json_file ) ) {
        // No need to re-register meta here; already hooked on init.
        hrdc_parse_housing_listings( $json_file );
        // Consolidated logging: log for each created post whether each meta field is set (true) or empty (false).
        $new_posts = get_posts(array(
            'post_type'      => 'housing_listing',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ));
        foreach ($new_posts as $post_id) {
            $meta = array(
                '_address' => get_post_meta($post_id, '_address', true),
                '_city' => get_post_meta($post_id, '_city', true),
                '_property_manager' => get_post_meta($post_id, '_property_manager', true),
                '_phone' => get_post_meta($post_id, '_phone', true),
                '_website' => get_post_meta($post_id, '_website', true),
                '_category' => get_post_meta($post_id, '_category', true),
                '_county'                 => get_post_meta($post_id, '_county', true),
                '_reserved_for'           => get_post_meta($post_id, '_reserved_for', true),
                '_application_fee'        => get_post_meta($post_id, '_application_fee', true),
                '_felonies_considered'    => get_post_meta($post_id, '_felonies_considered', true),
                '_credit_check_not_required' => get_post_meta($post_id, '_credit_check_not_required', true),
                '_unit_types'             => get_post_meta($post_id, '_unit_types', true),
                '_pets_allowed'           => get_post_meta($post_id, '_pets_allowed', true),
                '_social_security_required' => get_post_meta($post_id, '_social_security_required', true),
                '_universal_application'  => get_post_meta($post_id, '_universal_application', true)
            );
            $meta_log = "Post ID: {$post_id} - Meta: ";
            foreach ($meta as $key => $value) {
                $meta_log .= $key . ": " . print_r($value, true) . "; ";
            }
            hrdc_log($meta_log);
        }
        return rest_ensure_response( array( 'success' => true, 'message' => 'Posts updated.' ) );
    } else {
        return new WP_Error( 'no_file', 'Listings JSON not found.', array( 'status' => 404 ) );
    }
}

// Delete function.
function hrdc_handle_delete( WP_REST_Request $request ) {
    $file = $request->get_param( 'file' );
    if ( empty( $file ) ) {
        return new WP_Error( 'no_file', 'No file specified.', array( 'status' => 400 ) );
    }
    $upload_dir = plugin_dir_path( __FILE__ ) . 'data/uploads';
    $target = trailingslashit( $upload_dir ) . basename( $file );
    if ( file_exists( $target ) ) {
        unlink( $target );
        return rest_ensure_response( array( 'success' => true, 'message' => "File {$file} deleted." ) );
    } else {
        return new WP_Error( 'not_found', 'File not found.', array( 'status' => 404 ) );
    }
}

// List function.
function hrdc_list_files( WP_REST_Request $request ) {
    $upload_dir = plugin_dir_path( __FILE__ ) . 'data/uploads';
    $files = glob( $upload_dir . '/*.json' );
    $result = array();
    if ( $files ) {
        foreach ( $files as $file ) {
            $result[] = basename( $file );
        }
    }
    return rest_ensure_response( $result );
}

// Refresh nonce function.
function hrdc_refresh_nonce() {
    return rest_ensure_response(array(
        'nonce' => wp_create_nonce('wp_rest')
    ));
}

/* =======================================================================
   Parse JSON Data and Create Posts
======================================================================== */
function hrdc_parse_housing_listings( $json_file ) {
    $json_data = file_get_contents( $json_file );
    $listings = json_decode( $json_data, true );
    if ( JSON_ERROR_NONE !== json_last_error() ) {
        error_log('JSON decode error: ' . json_last_error_msg());
        return;
    }
    if ( ! is_array( $listings ) ) {
        error_log('Listings data is not an array.');
        return;
    }
    foreach ( $listings as $listing ) {
        if ( empty( $listing["Property Name"] ) ) {
            continue;
        }
        // Only add if a post with the same title doesn't exist.
        $existing = get_page_by_title( $listing["Property Name"], OBJECT, 'housing_listing' );
        if ( $existing ) {
            continue;
        }
        $post_data = array(
            'post_title'   => sanitize_text_field( $listing["Property Name"] ),
            'post_content' => isset($listing["Description (auto)"]) ? wp_kses_post( $listing["Description (auto)"] ) : '',
            'post_status'  => 'publish',
            'post_type'    => 'housing_listing',
            'post_date'    => current_time( 'mysql' ),
            'post_date_gmt'=> current_time( 'mysql', 1 ),
        );
        $post_id = wp_insert_post( $post_data );
        if ( ! is_wp_error( $post_id ) ) {
            // Original meta fields:
            update_post_meta( $post_id, '_address', sanitize_text_field( $listing["Address"] ?? '' ) );
            update_post_meta( $post_id, '_city', sanitize_text_field( $listing["City"] ?? '' ) );
            update_post_meta( $post_id, '_property_manager', sanitize_text_field( $listing["Property Manager"] ?? '' ) );
            update_post_meta( $post_id, '_phone', sanitize_text_field( $listing["Phone"] ?? '' ) );
            update_post_meta( $post_id, '_website', esc_url_raw( $listing["Website"] ?? '' ) );
            update_post_meta( $post_id, '_category', sanitize_text_field( $listing["Category"] ?? '' ) );
            update_post_meta( $post_id, '_county', sanitize_text_field( $listing["County"] ?? '' ) );
            update_post_meta( $post_id, '_reserved_for', sanitize_text_field( $listing["Reserved for:"] ?? '' ) );
            update_post_meta( $post_id, '_application_fee', sanitize_text_field( $listing["Application Fee"] ?? '' ) );
            update_post_meta( $post_id, '_felonies_considered', sanitize_text_field( $listing["Felonies Considered"] ?? '' ) );
            update_post_meta( $post_id, '_credit_check_not_required', sanitize_text_field( $listing["Credit check not required"] ?? '' ) );
            update_post_meta( $post_id, '_unit_types', sanitize_text_field( $listing["Unit Types"] ?? '' ) );
            update_post_meta( $post_id, '_pets_allowed', sanitize_text_field( $listing["Pets allowed"] ?? '' ) );
            update_post_meta( $post_id, '_social_security_required', sanitize_text_field( $listing["Social Security Required"] ?? '' ) );
            update_post_meta( $post_id, '_universal_application', sanitize_text_field( $listing["Universal Application"] ?? '' ) );

            // Log a summary of meta values for debugging.
            error_log("Post ID: {$post_id} - Meta: " . print_r(get_post_meta($post_id), true));
        }
    }
    $created_posts = count(get_posts(array(
        'post_type'      => 'housing_listing',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    )));
    error_log("Total housing_listing posts created: {$created_posts}");
}

/* =======================================================================
   Enqueue front end HL and localize the listings data.
======================================================================== */

add_action( 'wp_enqueue_scripts', 'hrdc_enqueue_frontend_scripts' );

function hrdc_enqueue_frontend_scripts() {
    // Enqueue your main front‑end script
    wp_enqueue_script( 'hrdc-frontend', plugin_dir_url( __FILE__ ) . 'build/blocks/housing-listings/index.js', array(), null, true );

    // Query for housing listing posts.
    $query = new WP_Query( array(
        'post_type'      => 'housing_listing',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
        'no_found_rows'  => true,
    ) );

    $listings_data = array();
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $post_id = get_the_ID();

            // Build an array of data for each listing.
            $listings_data[] = array(
                'property_name'      => get_the_title(),
                'address'            => get_post_meta( $post_id, '_address', true ),
                'city'               => get_post_meta( $post_id, '_city', true ),
                'county'             => get_post_meta( $post_id, '_county', true ), // if registered
                'property_manager'   => get_post_meta( $post_id, '_property_manager', true ),
                'phone'              => get_post_meta( $post_id, '_phone', true ),
                'website'            => get_post_meta( $post_id, '_website', true ),
                'category'           => get_post_meta( $post_id, '_category', true ),
                'reserved_for'       => get_post_meta( $post_id, '_reserved_for', true ),
                'application_fee'    => get_post_meta( $post_id, '_application_fee', true ),
                'felonies_considered'=> get_post_meta( $post_id, '_felonies_considered', true ),
                'credit_check_not_required' => get_post_meta( $post_id, '_credit_check_not_required', true ),
                'unit_types'         => get_post_meta( $post_id, '_unit_types', true ),
                'pets_allowed'       => get_post_meta( $post_id, '_pets_allowed', true ),
                'social_security_required' => get_post_meta( $post_id, '_social_security_required', true ),
                'universal_application' => get_post_meta( $post_id, '_universal_application', true ),
                'unique_id'          => get_post_meta( $post_id, '_unique_id', true ),
                'description'        => get_the_content(),
            );
        }
        wp_reset_postdata();
    }

    // Localize the data to your front‑end script.
    wp_localize_script( 'hrdc-frontend', 'hlData', $listings_data );
}

/* =======================================================================
   Admin Menu Page for File Management (Drag-and-Drop & File List)
======================================================================== */
add_action( 'admin_menu', 'hrdc_add_update_data_menu' );
function hrdc_add_update_data_menu() {
    add_menu_page(
        'Update Data',
        'HL Update Data',
        'manage_options',
        'hrdc-update-data',
        'hrdc_render_update_data_page',
        'dashicons-upload',
        26
    );
}

function hrdc_render_update_data_page() {
    $upload_dir = plugin_dir_path( __FILE__ ) . 'data/uploads';
    $upload_url = plugin_dir_url( __FILE__ ) . 'data/uploads';
    if ( ! file_exists( $upload_dir ) ) {
        wp_mkdir_p( $upload_dir );
    }
    ?>
    <div class="wrap">
        <h1>Update Data</h1>
        <!-- Drag-and-Drop Upload Area with File Preview -->
        <div id="hrdc-upload-area" style="border:2px dashed #ccc; padding:20px; text-align:center; margin-bottom:20px;">
            <p>Drag and drop your JSON file(s) here or click to select.</p>
            <input type="file" id="hrdc-file-input" accept=".json" multiple style="display:none;" />
            <button id="hrdc-browse-btn" class="button">Browse Files</button>
            <button id="hrdc-upload-btn" class="button button-primary">Upload File(s)</button>
            <div id="hrdc-selected-files" style="margin-top:10px;"></div>
        </div>
        <!-- File List Display -->
        <h2>Uploaded Files</h2>
        <div id="hrdc-file-list" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
    </div>
    <script>
    // Helper function: if a REST call returns 403, refresh the nonce and retry.
    async function hrdcSendRestRequest(url, options) {
        return fetch(url, options).then(response => {
            if (response.status === 403) {
                console.warn("Nonce expired. Refreshing...");
                return fetch(`${hrdcApiSettings.root}hrdc-custom-tools/v1/refresh-nonce`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": hrdcApiSettings.nonce
                    }
                })
                .then(res => res.json())
                .then(data => {
                    hrdcApiSettings.nonce = data.nonce;
                    options.headers = Object.assign({}, options.headers, { "X-WP-Nonce": hrdcApiSettings.nonce });
                    return fetch(url, options);
                });
            }
            return response;
        });
    }

    (function(){
        const uploadArea = document.getElementById('hrdc-upload-area');
        const fileInput = document.getElementById('hrdc-file-input');
        const browseBtn = document.getElementById('hrdc-browse-btn');
        const uploadBtn = document.getElementById('hrdc-upload-btn');
        const fileListContainer = document.getElementById('hrdc-file-list');
        const selectedFilesPreview = document.getElementById('hrdc-selected-files');
        let selectedFiles = [];

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('highlight');
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('highlight');
            }, false);
        });
        uploadArea.addEventListener('drop', e => {
            if (e.dataTransfer.files.length) {
                selectedFiles = Array.from(e.dataTransfer.files);
                renderSelectedFiles();
            }
        });
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                selectedFiles = Array.from(fileInput.files);
                renderSelectedFiles();
            }
        });
        function renderSelectedFiles() {
            selectedFilesPreview.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const fileDiv = document.createElement('div');
                fileDiv.style.border = '1px solid #ccc';
                fileDiv.style.padding = '5px';
                fileDiv.style.margin = '5px';
                fileDiv.innerHTML = `<strong>${file.name}</strong>`;
                const select = document.createElement('select');
                select.id = `hrdc-data-type-${index}`;
                select.innerHTML = `
                    <option value="housing_listings">Housing Listings</option>
                    <option value="ami_matrix">AMI Matrix (WIP)</option>
                `;
                fileDiv.appendChild(select);
                selectedFilesPreview.appendChild(fileDiv);
            });
        }
        uploadBtn.addEventListener('click', () => {
            if (selectedFiles.length === 0) {
                alert("Please select file(s) first.");
                return;
            }
            console.log("Using nonce:", hrdcApiSettings.nonce);
            selectedFiles.forEach((file, index) => {
                const dataType = document.getElementById(`hrdc-data-type-${index}`).value;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('data_type', dataType);
                hrdcSendRestRequest(`${hrdcApiSettings.root}hrdc-custom-tools/v1/upload`, {
                    method: 'POST',
                    headers: { "X-WP-Nonce": hrdcApiSettings.nonce },
                    body: formData
                })
                .then(response => response.json().then(data => ({ status: response.status, data })))
                .then(({ status, data }) => {
                    if (status !== 200) {
                        throw new Error(data.message || "Unknown error");
                    }
                    updateFileList();
                })
                .catch(err => {
                    console.error("Upload error:", err);
                    alert(err.message);
                });
            });
            selectedFiles = [];
            selectedFilesPreview.innerHTML = '';
        });
        function updateFileList() {
            hrdcSendRestRequest(`${hrdcApiSettings.root}hrdc-custom-tools/v1/list`, {
                method: 'GET',
                headers: { "X-WP-Nonce": hrdcApiSettings.nonce }
            })
            .then(response => response.json())
            .then(files => renderFileList(files))
            .catch(err => console.error("List fetch error:", err));
        }
        function renderFileList(files) {
            fileListContainer.innerHTML = '';
            if (!files.length) {
                fileListContainer.innerHTML = '<p>No files found.</p>';
                return;
            }
            files.forEach(file => {
                const card = document.createElement('div');
                card.className = 'hrdc-file-card';
                card.style.border = '1px solid #ccc';
                card.style.padding = '10px';
                card.style.margin = '5px';
                card.style.width = '50%';
                card.innerHTML = `<strong>${file}</strong><br>`;
                const select = document.createElement('select');
                select.id = `hrdc-file-data-type-${encodeURIComponent(file)}`;
                let defaultType = file.includes('housing_listings') ? 'housing_listings' : (file.includes('ami_matrix') ? 'ami_matrix' : 'housing_listings');
                select.innerHTML = `
                    <option value="housing_listings" ${defaultType === 'housing_listings' ? 'selected' : ''}>Housing Listings</option>
                    <option value="ami_matrix" ${defaultType === 'ami_matrix' ? 'selected' : ''}>AMI Matrix</option>
                `;
                card.appendChild(select);
                const updateBtn = document.createElement('button');
                updateBtn.className = 'button';
                updateBtn.textContent = 'Update';
                updateBtn.addEventListener('click', () => {
                    const dataType = document.getElementById(`hrdc-file-data-type-${encodeURIComponent(file)}`).value;
                    hrdcSendRestRequest(`${hrdcApiSettings.root}hrdc-custom-tools/v1/update/${encodeURIComponent(file)}`, {
                        method: 'POST',
                        headers: {
                            "X-WP-Nonce": hrdcApiSettings.nonce,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ data_type: dataType })
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => { throw new Error(err.message || "Failed to update."); });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Update response for", file, data);
                        alert("✅ Housing listings have been updated.");
                        updateFileList();
                    })
                    .catch(err => {
                        console.error("Update error for", file, err);
                        alert(`❌ Update failed: ${err.message}`);
                    });
                });
                card.appendChild(updateBtn);
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'button';
                deleteBtn.textContent = 'Delete';
                deleteBtn.style.marginLeft = '5px';
                deleteBtn.addEventListener('click', () => {
                    hrdcSendRestRequest(`${hrdcApiSettings.root}hrdc-custom-tools/v1/delete/${encodeURIComponent(file)}`, {
                        method: 'DELETE',
                        headers: { "X-WP-Nonce": hrdcApiSettings.nonce }
                    })
                    .then(response => response.json().then(data => ({ status: response.status, data })))
                    .then(({ status, data }) => {
                        if (status !== 200) {
                            throw new Error(data.message || "Unknown error");
                        }
                        updateFileList();
                    })
                    .catch(err => {
                        console.error("Delete error for", file, err);
                        alert(err.message);
                    });
                });
                card.appendChild(deleteBtn);
                fileListContainer.appendChild(card);
            });
        }
        updateFileList();
    })();
    </script>
    <style>
        #hrdc-upload-area.highlight {
            border-color: #0073aa;
            background-color: #f1f1f1;
        }
        .hrdc-file-card {
            border-radius: 4px;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }
    </style>
    <?php
}
?>
