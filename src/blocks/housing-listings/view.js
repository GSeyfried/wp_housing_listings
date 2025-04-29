/**
 * HRDC – front-end logic for the “Housing Listings” block
 * -------------------------------------------------------
 * – Listens for the custom event  ➜  filters the array in hlData
 * – Re-renders the cards with identical structure / styles
 * – Keeps grid, fonts and translation intact after every refresh
 */

if (!window.hrdcBlockAttr) window.hrdcBlockAttr = {}; // Ensure hrdcBlockAttr is defined
const a = window.hrdcBlockAttr || {};

/* --------------------------------------------------------
 *  Helper – grid template driven by block attributes
 * ------------------------------------------------------ */
function applyGridWidth () {
	const a    = window.hrdcBlockAttr || {};          // block attributes passed from PHP
	const wrap = document.querySelector('.hrdc-housing-listings');
	if (!wrap) return;

	const cols  = Number(a.cardColumns) || 1;
	const width = Number(a.cardWidth)   || 900;

	wrap.style.display             = 'grid';
	wrap.style.gridTemplateColumns = `repeat(${cols}, ${width}px)`;
	wrap.style.gap                 = '20px';
}

setTimeout(applyGridWidth,  0);      // after initial paint
window.addEventListener('resize', applyGridWidth);

/* --------------------------------------------------------
 *  Typography helpers (updated on every redraw)
 * ------------------------------------------------------ */
function getFontStyles () {
	const a = window.hrdcBlockAttr || {};
	return {
		title : `font-size:${a.cardTitleFontSize}px;color:${a.cardTitleColor};text-align:${a.cardTitleTextAlign};font-weight:${a.cardTitleFontWeight};font-style:${a.cardTitleFontStyle};padding-bottom:${a.cardTitlePadding}px;`,
		info  : `font-family:${a.cardFontFamily};text-align:${a.cardTextAlign};font-weight:${a.cardValueFontWeight};font-style:${a.cardValueFontStyle};`,
		label : `font-weight:${a.cardLabelFontWeight};font-style:${a.cardLabelFontStyle};`
	};
}

/* updated to handle category name changes*/
function translateCategory(raw) {
	const span = window.hrdcBlockAttr?.isSpanish;     // bool

	/* ---- normalise incoming value ---- */
	const cat = (raw || '').toLowerCase().trim();

	let key;
	if ([
		'low-income tax-credit eligible',
		'low income tax credit eligible',
		'income-restricted affordable rentals',
	].includes(cat)) {
		key = 'affordable';
	} else if (cat === 'income-restricted subsidized rentals') {
		key = 'subsidized';
	} else if (cat === 'property management and market rate apartments') {
		key = 'market';
	}

	const labels = {
		affordable : {
			en: 'Low-Income Tax-Credit Eligible',
			es: 'Viviendas ASEQUIBLES con restricción de ingresos',
		},
		subsidized : {
			en: 'Income-Restricted SUBSIDIZED Rentals',
			es: 'Viviendas SUBSIDIADAS con restricción de ingresos',
		},
		market : {
			en: 'Property Management and Market Rate Apartments',
			es: 'Gestión de propiedades y apartamentos de precio de mercado',
		},
	};

	return key ? labels[key][ span ? 'es' : 'en' ] : raw;
}


function getLabels() {
    const a = window.hrdcBlockAttr || {};
    return a.isSpanish
        ? { address:'Dirección', manager:'Gerente', phone:'Teléfono',
            website:'Sitio web', category:'Categoría', desc:'Descripción',
            noneWeb:'No sitio web', nonePhone:'No número de teléfono' }
        : { address:'Address',   manager:'Manager', phone:'Phone',
            website:'Website',   category:'Category', desc:'Description',
            noneWeb:'No website', nonePhone:'No phone number' };
}

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

		/*
		console.log("City:", city, "Filter:", filters.city, "Match:", cityMatch);
		console.log("Reserved For:", reservedFor, "Filter:", filters.reservedFor, "Match:", reservedForMatch);
		console.log("Application Fee:", appFee, "Match:", appFeeMatch);
		console.log("Felonies:", felonies, "Filter:", filters.felonies, "Match:", feloniesMatch);
		console.log("Credit Check:", creditCheck, "Filter:", filters.creditCheck, "Match:", creditCheckMatch);
		console.log("Unit Types:", unitTypes, "Filter:", filters.unitTypes, "Match:", unitTypesMatch);
		console.log("Pets Allowed:", petsAllowed, "Filter:", filters.pets, "Match:", petsAllowedMatch);
		console.log("Social Security:", socialSec, "Filter:", filters.socialSecurity, "Match:", socialSecMatch);
		console.log("Category:", category, "Filter:", filters.category, "Match:", categoryMatch);
		*/

		return cityMatch && reservedForMatch && appFeeMatch && feloniesMatch && creditCheckMatch &&
				unitTypesMatch && petsAllowedMatch && socialSecMatch && categoryMatch;
	});
}

/* --------------------------------------------------------
 *  Main render routine
 * ------------------------------------------------------ */
function updateListings(list) {

	const style = getFontStyles();    // fresh snapshot for every call
	const LBL   = getLabels();
	const out   = [];

	list.forEach(post => {
		const m      = post.meta || {};
		const hasWeb = m._website && m._website.startsWith('http');

		out.push(`
		<div class="listing-box">
			<div class="listing-row" style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">
				<!-- left column : title + meta -->
				<div class="listing-left" style="flex:1 1 320px; min-width:260px;">
					<div class="listing-title" style="${style.title}">${post.title}</div>

					<div class="listing-info" style="${style.info}">
						<em style="${style.label}">${LBL.address}:</em>
						${m._address || 'N/A'}${m._city ? ', ' + m._city : ''}
					</div>

					<div class="listing-info" style="${style.info}">
						<em style="${style.label}">${LBL.manager}:</em>
						${m._property_manager || 'N/A'}
					</div>

					<div class="listing-info" style="${style.info}">
						<em style="${style.label}">${LBL.phone}:</em>
						${m._phone || LBL.nonePhone}
					</div>

					<div class="listing-info" style="${style.info}">
						<em style="${style.label}">${LBL.website}:</em>
						${ hasWeb ? `<a href="${m._website}" target="_blank">${m._website}</a>` : LBL.noneWeb }
					</div>

					<div class="listing-info" style="${style.info}">
						<em style="${style.label}">${LBL.category}:</em>
						${ translateCategory(m._category || '') }
					</div>
				</div>

				<!-- right column : description -->
				<div class="listing-right" style="flex:1 1 360px;min-width:260px;">
					<div class="listing-info" style="${style.info}">
						<em style="${style.label}">${LBL.desc}:</em><br>
						<span style="${style.info}">${ post.content }</span>
					</div>
				</div>
			</div>
		</div>`);
	});

	const container = document.getElementById('hl-results');
	container.innerHTML = list.length ? out.join('') : '<p>No listings match your filters.</p>';

	applyGridWidth();   // keep grid intact
	document.getElementById('hl-results-count').textContent = `Displaying ${list.length} listings`;
}

/* --------------------------------------------------------
 *  First render = whole list
 * ------------------------------------------------------ */
updateListings(window.hlData || []);

/* --------------------------------------------------------
 *  Listen for filters
 * ------------------------------------------------------ */
document.addEventListener('hrdcApplyFilters', (e) => {
	updateListings( advancedFilterListings(hlData, e.detail) );
});