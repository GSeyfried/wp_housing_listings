document.addEventListener("hrdcApplyFilters",(function(e){!function(e){const t=document.getElementById("hl-results");if(!t)return;let i="";e.length>0?e.forEach((e=>{const t=e.meta||{};i+=`<div class="listing-box">\n                        <div class="listing-row">\n                            <div class="listing-left">\n                                <div class="listing-title">${e.title}</div>\n                                <div class="listing-info">\n                                    <em>Address:</em> ${t._address}, ${t._city}\n                                </div>\n                                <div class="listing-info">\n                                    <em>Manager:</em> ${t._property_manager}\n                                </div>\n                                <div class="listing-info">\n                                    <em>Phone:</em> ${t._phone}\n                                </div>\n                                <div class="listing-info">\n                                    <em>Website:</em> <a href="${t._website}" target="_blank">${t._website||"N/A"}</a>\n                                </div>\n                                <div class="listing-info">\n                                    <em>Category:</em> ${t._category}\n                                </div>\n                            </div>\n                            <div class="listing-right">\n                                <div class="listing-info">\n                                    <em>Description:</em><br>\n                                    <span>${e.content}</span>\n                                </div>\n                            </div>\n                        </div>\n                    </div>`})):i="<p>No listings match your filters.</p>",t.innerHTML=i,document.getElementById("hl-results").innerHTML=i,document.getElementById("hl-results-count").innerText=`Displaying ${e.length} listings`}(function(e,t){function i(e){return e?"yes"===e.toString().toLowerCase():null}return e.filter((e=>{const n=e.meta||{},o=n._city?n._city.toLowerCase():"",s=n._category?n._category.toLowerCase():"",r=n._reserved_for?n._reserved_for.toLowerCase():"",l=n._application_fee?n._application_fee.toLowerCase():"",c=n._felonies_considered?n._felonies_considered.toLowerCase():"",a=n._credit_check_not_required?n._credit_check_not_required.toLowerCase():"",d=n._unit_types?n._unit_types.toLowerCase():"",u=n._pets_allowed?n._pets_allowed.toLowerCase():"",g=n._social_security_required?n._social_security_required.toLowerCase():"",_=!t.city||""===t.city.toLowerCase()||o.includes(t.city.toLowerCase()),f=!t.reservedFor||""===t.reservedFor.toLowerCase()||function(e,t){function i(e){return e?e.toLowerCase().replace(/person with|people with/gi,"").replace(/and\/or/gi,",").replace(/\bdisab(?:led|ility|ilities|ling)?\b/gi,"disabilities").replace(/\bcondition\b/gi,"").split(",").map((e=>e.trim())).filter((e=>e)):[]}function n(e){const t=e.match(/\d+/);return t?parseInt(t[0],10):null}const o=i(e),s=i(t);return o.includes("none of the above")?s.includes("no"):!!s.includes("no")||0===o.length||o.some((e=>{if(e.includes("senior")){const t=s.find((e=>e.includes("senior")));if(t){const i=n(e),o=n(t);return null!==i&&null!==o&&o<=i}}return!1}))||o.some((e=>s.includes(e)))}(t.reservedFor,r),p=!0,y=!t.felonies||""===t.felonies.toLowerCase()||!0!==i(t.felonies)||"yes"===c,m=!t.creditCheck||""===t.creditCheck.toLowerCase()||!1!==i(t.creditCheck)||"no"===a,h=!t.unitTypes||""===t.unitTypes.toLowerCase()||function(e,t){function i(e){return e?e.toLowerCase().replace(/bedroom(s)?/gi,"").split(",").map((e=>{const t=e.trim().match(/\d+|studio/);return t?t[0]:null})).filter((e=>e)):[]}const n=i(e||""),o=i(t);return!e||"any"===e.toLowerCase()||n.some((e=>o.includes(e)))}(t.unitTypes,d),w=!t.pets||""===t.pets.toLowerCase()||!0!==i(t.pets)||"no"!==u,C=!t.socialSecurity||""===t.socialSecurity.toLowerCase()||!1!==i(t.socialSecurity)||"no"===g,v=!t.category||""===t.category.toLowerCase()||function(e,t){if(!e||"any"===e.toLowerCase())return!0;function i(e){return e.split(",").map((e=>function(e){let t=e.toLowerCase();return/affordable|low\s*income|lihtc|tax\s*credit/.test(t)?"affordable":/subsidized/.test(t)?"subsidized":/market\s*rate/.test(t)?"market_rate":t.trim()}(e.trim()))).filter(Boolean)}const n=i(e),o=i(t||"");return n.some((e=>o.includes(e)))}(t.category,s);return console.log("City:",o,"Filter:",t.city,"Match:",_),console.log("Reserved For:",r,"Filter:",t.reservedFor,"Match:",f),console.log("Application Fee:",l,"Match:",p),console.log("Felonies:",c,"Filter:",t.felonies,"Match:",y),console.log("Credit Check:",a,"Filter:",t.creditCheck,"Match:",m),console.log("Unit Types:",d,"Filter:",t.unitTypes,"Match:",h),console.log("Pets Allowed:",u,"Filter:",t.pets,"Match:",w),console.log("Social Security:",g,"Filter:",t.socialSecurity,"Match:",C),console.log("Category:",s,"Filter:",t.category,"Match:",v),_&&f&&y&&m&&h&&w&&C&&v}))}(hlData,e.detail))}));