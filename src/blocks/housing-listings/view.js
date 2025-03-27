document.addEventListener('hrdcApplyFilters', function(event) {
    // hlData should be localized (an array of listing objects)
    const filteredListings = advancedFilterListings(hlData, event.detail);

    updateListings(filteredListings);
});

function advancedFilterListings(listings, filters) {
	// Normalize a yes/no input.
	function normalizeYesNo(input) {
		if (!input) return null;
		return input.toString().toLowerCase() === 'yes';
	}

	// Compare demographic (reservedFor) values.
	function funReservedForMatch(preferred, allowed) {
		function splitValues(input) {
			if (!input) return [];
			return input.toLowerCase()
				.replace(/person with|people with/gi, "")
				.replace(/and\/or/gi, ",")
				.replace(/\bdisab(?:led|ility|ilities|ling)?\b/gi, "disabilities")
				.replace(/\bcondition\b/gi, "")
				.split(",")
				.map(v => v.trim())
				.filter(v => v);
		}
        function extractAgeIfSenior(input) {
            const match = input.match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
        }

		const preferredList = splitValues(preferred);
		const allowedList = splitValues(allowed);
		if (preferredList.includes("none of the above")) {
			return allowedList.includes("no");
		}
		if (allowedList.includes("no")) return true;
		if (preferredList.length === 0) return true;
		const seniorMatch = preferredList.some(preferredItem => {
            if (preferredItem.includes("senior")) {
                // Look for an allowed item that includes "senior"
                const matchingAllowed = allowedList.find(allowedItem => allowedItem.includes("senior"));
                if (matchingAllowed) {
                    const prefAge = extractAgeIfSenior(preferredItem);
                    const allowedAge = extractAgeIfSenior(matchingAllowed);
                    return (prefAge !== null && allowedAge !== null) ? allowedAge <= prefAge : false;
                }
            }
            return false;
        });        
          return seniorMatch || preferredList.some(pref => allowedList.includes(pref));
        }

	// Compare unit types.
	function funUnitTypesMatch(preferred, allowed) {
		function splitAndCleanUnits(input) {
			return input
				? input.toLowerCase().replace(/bedroom(s)?/gi, "").split(",")
					.map(v => {
						const match = v.trim().match(/\d+|studio/);
						return match ? match[0] : null;
					})
					.filter(v => v)
				: [];
		}
		const preferredList = splitAndCleanUnits(preferred || "");
		const allowedList = splitAndCleanUnits(allowed);
		// If no filter provided, pass
		if (!preferred || preferred.toLowerCase() === "any") {
			return true;
		}
		return preferredList.some(pref => allowedList.includes(pref));
	}

	// Compare housing types.
	function funCategoryMatch(preferred, allowed) {
		if (!preferred || preferred.toLowerCase() === "any") return true;
		function normalizeCategory(str) {
			let lower = str.toLowerCase();
			if (/affordable|low\s*income|lihtc|tax\s*credit/.test(lower)) return "affordable";
			if (/subsidized/.test(lower)) return "subsidized";
			if (/market\s*rate/.test(lower)) return "market_rate";
			return lower.trim();
		}
		function parseCategories(input) {
			return input.split(",").map(item => normalizeCategory(item.trim())).filter(Boolean);
		}
		const preferredList = parseCategories(preferred);
		const allowedList = parseCategories(allowed || "");
		return preferredList.some(pref => allowedList.includes(pref));
	}

	// Hardcode to avoid application fee searches.
	const applicationFeePreferred = 'yes';

	return listings.filter(post => {
		const meta = post.meta || {};
		// Normalize post meta fields.
		const city         = meta._city ? meta._city.toLowerCase() : '';
		const category     = meta._category ? meta._category.toLowerCase() : '';
		const reservedFor  = meta._reserved_for ? meta._reserved_for.toLowerCase() : '';
		const appFee       = meta._application_fee ? meta._application_fee.toLowerCase() : '';
		const felonies     = meta._felonies_considered ? meta._felonies_considered.toLowerCase() : '';
		const creditCheck  = meta._credit_check_not_required ? meta._credit_check_not_required.toLowerCase() : '';
		const unitTypes    = meta._unit_types ? meta._unit_types.toLowerCase() : '';
		const petsAllowed  = meta._pets_allowed ? meta._pets_allowed.toLowerCase() : '';
		const socialSec    = meta._social_security_required ? meta._social_security_required.toLowerCase() : '';

		// Match against filters.
		const cityMatch         = !filters.city || filters.city.toLowerCase() === '' || city.includes(filters.city.toLowerCase());
		const reservedForMatch  = !filters.reservedFor ||filters.reservedFor.toLowerCase() === '' || funReservedForMatch(filters.reservedFor, reservedFor);
		const appFeeMatch       = true;
		const feloniesMatch     = !filters.felonies || filters.felonies.toLowerCase() === ''|| (normalizeYesNo(filters.felonies) === true ? felonies === 'yes' : true);
		const creditCheckMatch  = !filters.creditCheck || filters.creditCheck.toLowerCase() === ''||(normalizeYesNo(filters.creditCheck) === false ? creditCheck === 'no' : true);
		const unitTypesMatch    = !filters.unitTypes || filters.unitTypes.toLowerCase() === '' || funUnitTypesMatch(filters.unitTypes, unitTypes);
		const petsAllowedMatch  = !filters.pets ||filters.pets.toLowerCase() === ''|| (normalizeYesNo(filters.pets) === true ? petsAllowed !== 'no' : true);
		const socialSecMatch    = !filters.socialSecurity || filters.socialSecurity.toLowerCase() === ''|| (normalizeYesNo(filters.socialSecurity) === false ? socialSec === 'no' : true);
		const categoryMatch     = !filters.category || filters.category.toLowerCase() === ''|| funCategoryMatch(filters.category, category);

        console.log("City:", city, "Filter:", filters.city, "Match:", cityMatch);
        console.log("Reserved For:", reservedFor, "Filter:", filters.reservedFor, "Match:", reservedForMatch);
        console.log("Application Fee:", appFee, "Match:", appFeeMatch);
        console.log("Felonies:", felonies, "Filter:", filters.felonies, "Match:", feloniesMatch);
        console.log("Credit Check:", creditCheck, "Filter:", filters.creditCheck, "Match:", creditCheckMatch);
        console.log("Unit Types:", unitTypes, "Filter:", filters.unitTypes, "Match:", unitTypesMatch);
        console.log("Pets Allowed:", petsAllowed, "Filter:", filters.pets, "Match:", petsAllowedMatch);
        console.log("Social Security:", socialSec, "Filter:", filters.socialSecurity, "Match:", socialSecMatch);
        console.log("Category:", category, "Filter:", filters.category, "Match:", categoryMatch);


		return cityMatch && reservedForMatch && appFeeMatch && feloniesMatch && creditCheckMatch &&
			   unitTypesMatch && petsAllowedMatch && socialSecMatch && categoryMatch;
	});
}

function updateListings(filteredListings) {
    const container = document.getElementById('hl-results');
    if (!container) return;

    // Rebuild the container's content.
    let html = '';

    if (filteredListings.length > 0) {
        filteredListings.forEach(post => {
                const meta = post.meta || {};
            html += `<div class="listing-box">
                        <div class="listing-row">
                            <div class="listing-left">
                                <div class="listing-title">${ post.title }</div>
                                <div class="listing-info">
                                    <em>Address:</em> ${ meta._address }, ${ meta._city }
                                </div>
                                <div class="listing-info">
                                    <em>Manager:</em> ${ meta._property_manager }
                                </div>
                                <div class="listing-info">
                                    <em>Phone:</em> ${ meta._phone }
                                </div>
                                <div class="listing-info">
                                    <em>Website:</em> <a href="${ meta._website }" target="_blank">${ meta._website || 'N/A' }</a>
                                </div>
                                <div class="listing-info">
                                    <em>Category:</em> ${ meta._category }
                                </div>
                            </div>
                            <div class="listing-right">
                                <div class="listing-info">
                                    <em>Description:</em><br>
                                    <span>${ post.content }</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });
    } else {
        html = '<p>No listings match your filters.</p>';
    }
    container.innerHTML = html;

    document.getElementById('hl-results').innerHTML = html;
    
    // Update the count banner with the number of filtered listings.
    document.getElementById('hl-results-count').innerText = `Displaying ${ filteredListings.length } listings`;
}