<?php
/**
 * Admin functions for HRDC Custom Tools
 */

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