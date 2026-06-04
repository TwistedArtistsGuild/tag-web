const COUNTRY_OPTIONS = [
  { value: "", label: "Select country" },
  { value: "US", label: "United States" },
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AG", label: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" },
  { value: "BT", label: "Bhutan" },
  { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BW", label: "Botswana" },
  { value: "BR", label: "Brazil" },
  { value: "BN", label: "Brunei" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "CV", label: "Cabo Verde" },
  { value: "KH", label: "Cambodia" },
  { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" },
  { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoros" },
  { value: "CG", label: "Congo" },
  { value: "CD", label: "Congo (DRC)" },
  { value: "CR", label: "Costa Rica" },
  { value: "CI", label: "Cote d'Ivoire" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czechia" },
  { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egypt" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "SZ", label: "Eswatini" },
  { value: "ET", label: "Ethiopia" },
  { value: "FJ", label: "Fiji" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GA", label: "Gabon" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GR", label: "Greece" },
  { value: "GD", label: "Grenada" },
  { value: "GT", label: "Guatemala" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bissau" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" },
  { value: "HN", label: "Honduras" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KI", label: "Kiribati" },
  { value: "KP", label: "Korea (North)" },
  { value: "KR", label: "Korea (South)" },
  { value: "KW", label: "Kuwait" },
  { value: "KG", label: "Kyrgyzstan" },
  { value: "LA", label: "Laos" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LS", label: "Lesotho" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libya" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MG", label: "Madagascar" },
  { value: "MW", label: "Malawi" },
  { value: "MY", label: "Malaysia" },
  { value: "MV", label: "Maldives" },
  { value: "ML", label: "Mali" },
  { value: "MT", label: "Malta" },
  { value: "MH", label: "Marshall Islands" },
  { value: "MR", label: "Mauritania" },
  { value: "MU", label: "Mauritius" },
  { value: "MX", label: "Mexico" },
  { value: "FM", label: "Micronesia" },
  { value: "MD", label: "Moldova" },
  { value: "MC", label: "Monaco" },
  { value: "MN", label: "Mongolia" },
  { value: "ME", label: "Montenegro" },
  { value: "MA", label: "Morocco" },
  { value: "MZ", label: "Mozambique" },
  { value: "MM", label: "Myanmar" },
  { value: "NA", label: "Namibia" },
  { value: "NR", label: "Nauru" },
  { value: "NP", label: "Nepal" },
  { value: "NL", label: "Netherlands" },
  { value: "NZ", label: "New Zealand" },
  { value: "NI", label: "Nicaragua" },
  { value: "NE", label: "Niger" },
  { value: "NG", label: "Nigeria" },
  { value: "MK", label: "North Macedonia" },
  { value: "NO", label: "Norway" },
  { value: "OM", label: "Oman" },
  { value: "PK", label: "Pakistan" },
  { value: "PW", label: "Palau" },
  { value: "PA", label: "Panama" },
  { value: "PG", label: "Papua New Guinea" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "QA", label: "Qatar" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "RW", label: "Rwanda" },
  { value: "KN", label: "Saint Kitts and Nevis" },
  { value: "LC", label: "Saint Lucia" },
  { value: "VC", label: "Saint Vincent and the Grenadines" },
  { value: "WS", label: "Samoa" },
  { value: "SM", label: "San Marino" },
  { value: "ST", label: "Sao Tome and Principe" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "SN", label: "Senegal" },
  { value: "RS", label: "Serbia" },
  { value: "SC", label: "Seychelles" },
  { value: "SL", label: "Sierra Leone" },
  { value: "SG", label: "Singapore" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "SB", label: "Solomon Islands" },
  { value: "SO", label: "Somalia" },
  { value: "ZA", label: "South Africa" },
  { value: "SS", label: "South Sudan" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "SD", label: "Sudan" },
  { value: "SR", label: "Suriname" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "SY", label: "Syria" },
  { value: "TW", label: "Taiwan" },
  { value: "TJ", label: "Tajikistan" },
  { value: "TZ", label: "Tanzania" },
  { value: "TH", label: "Thailand" },
  { value: "TL", label: "Timor-Leste" },
  { value: "TG", label: "Togo" },
  { value: "TO", label: "Tonga" },
  { value: "TT", label: "Trinidad and Tobago" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Turkey" },
  { value: "TM", label: "Turkmenistan" },
  { value: "TV", label: "Tuvalu" },
  { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "UY", label: "Uruguay" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "VU", label: "Vanuatu" },
  { value: "VA", label: "Vatican City" },
  { value: "VE", label: "Venezuela" },
  { value: "VN", label: "Vietnam" },
  { value: "YE", label: "Yemen" },
  { value: "ZM", label: "Zambia" },
  { value: "ZW", label: "Zimbabwe" },
];

const US_STATE_AND_TERRITORY_OPTIONS = [
  { value: "", label: "Select US state or territory" },
  { value: "US-AL", label: "Alabama" },
  { value: "US-AK", label: "Alaska" },
  { value: "US-AZ", label: "Arizona" },
  { value: "US-AR", label: "Arkansas" },
  { value: "US-CA", label: "California" },
  { value: "US-CO", label: "Colorado" },
  { value: "US-CT", label: "Connecticut" },
  { value: "US-DE", label: "Delaware" },
  { value: "US-DC", label: "District of Columbia" },
  { value: "US-FL", label: "Florida" },
  { value: "US-GA", label: "Georgia" },
  { value: "US-HI", label: "Hawaii" },
  { value: "US-ID", label: "Idaho" },
  { value: "US-IL", label: "Illinois" },
  { value: "US-IN", label: "Indiana" },
  { value: "US-IA", label: "Iowa" },
  { value: "US-KS", label: "Kansas" },
  { value: "US-KY", label: "Kentucky" },
  { value: "US-LA", label: "Louisiana" },
  { value: "US-ME", label: "Maine" },
  { value: "US-MD", label: "Maryland" },
  { value: "US-MA", label: "Massachusetts" },
  { value: "US-MI", label: "Michigan" },
  { value: "US-MN", label: "Minnesota" },
  { value: "US-MS", label: "Mississippi" },
  { value: "US-MO", label: "Missouri" },
  { value: "US-MT", label: "Montana" },
  { value: "US-NE", label: "Nebraska" },
  { value: "US-NV", label: "Nevada" },
  { value: "US-NH", label: "New Hampshire" },
  { value: "US-NJ", label: "New Jersey" },
  { value: "US-NM", label: "New Mexico" },
  { value: "US-NY", label: "New York" },
  { value: "US-NC", label: "North Carolina" },
  { value: "US-ND", label: "North Dakota" },
  { value: "US-OH", label: "Ohio" },
  { value: "US-OK", label: "Oklahoma" },
  { value: "US-OR", label: "Oregon" },
  { value: "US-PA", label: "Pennsylvania" },
  { value: "US-RI", label: "Rhode Island" },
  { value: "US-SC", label: "South Carolina" },
  { value: "US-SD", label: "South Dakota" },
  { value: "US-TN", label: "Tennessee" },
  { value: "US-TX", label: "Texas" },
  { value: "US-UT", label: "Utah" },
  { value: "US-VT", label: "Vermont" },
  { value: "US-VA", label: "Virginia" },
  { value: "US-WA", label: "Washington" },
  { value: "US-WV", label: "West Virginia" },
  { value: "US-WI", label: "Wisconsin" },
  { value: "US-WY", label: "Wyoming" },
  { value: "US-AS", label: "American Samoa" },
  { value: "US-GU", label: "Guam" },
  { value: "US-MP", label: "Northern Mariana Islands" },
  { value: "US-PR", label: "Puerto Rico" },
  { value: "US-UM", label: "US Minor Outlying Islands" },
  { value: "US-VI", label: "US Virgin Islands" },
];

const CANADA_PROVINCE_OPTIONS = [
  { value: "", label: "Select province or territory" },
  { value: "CA-AB", label: "Alberta" },
  { value: "CA-BC", label: "British Columbia" },
  { value: "CA-MB", label: "Manitoba" },
  { value: "CA-NB", label: "New Brunswick" },
  { value: "CA-NL", label: "Newfoundland and Labrador" },
  { value: "CA-NS", label: "Nova Scotia" },
  { value: "CA-ON", label: "Ontario" },
  { value: "CA-PE", label: "Prince Edward Island" },
  { value: "CA-QC", label: "Quebec" },
  { value: "CA-SK", label: "Saskatchewan" },
  { value: "CA-NT", label: "Northwest Territories" },
  { value: "CA-NU", label: "Nunavut" },
  { value: "CA-YT", label: "Yukon" },
];

const AUSTRALIA_STATE_OPTIONS = [
  { value: "", label: "Select state or territory" },
  { value: "AU-ACT", label: "Australian Capital Territory" },
  { value: "AU-NSW", label: "New South Wales" },
  { value: "AU-NT", label: "Northern Territory" },
  { value: "AU-QLD", label: "Queensland" },
  { value: "AU-SA", label: "South Australia" },
  { value: "AU-TAS", label: "Tasmania" },
  { value: "AU-VIC", label: "Victoria" },
  { value: "AU-WA", label: "Western Australia" },
];

const UK_REGION_OPTIONS = [
  { value: "", label: "Select country/region" },
  { value: "GB-ENG", label: "England" },
  { value: "GB-SCT", label: "Scotland" },
  { value: "GB-WLS", label: "Wales" },
  { value: "GB-NIR", label: "Northern Ireland" },
  { value: "GB-IM", label: "Isle of Man" },
  { value: "GB-JE", label: "Jersey" },
  { value: "GB-GG", label: "Guernsey" },
];

const DEFAULT_REGION_OPTIONS = [
  { value: "", label: "Select region / province" },
  { value: "INTL-OTHER", label: "Other / Not Listed" },
];

const REGION_OPTIONS_BY_COUNTRY = {
  US: US_STATE_AND_TERRITORY_OPTIONS,
  CA: CANADA_PROVINCE_OPTIONS,
  AU: AUSTRALIA_STATE_OPTIONS,
  GB: UK_REGION_OPTIONS,
};

export function getCountryLabel(countryCode) {
  const match = COUNTRY_OPTIONS.find((option) => option.value === countryCode);
  return match?.label || "";
}

export function normalizeCountryCode(countryValue) {
  const rawValue = String(countryValue || "").trim();
  if (!rawValue) {
    return "";
  }

  const byCode = COUNTRY_OPTIONS.find((option) => option.value === rawValue);
  if (byCode) {
    return byCode.value;
  }

  const lowerValue = rawValue.toLowerCase();
  const byLabel = COUNTRY_OPTIONS.find((option) => String(option.label || "").trim().toLowerCase() === lowerValue);
  return byLabel?.value || rawValue;
}

export function getRegionLabel(countryCode, regionCode) {
  const options = REGION_OPTIONS_BY_COUNTRY[countryCode] || DEFAULT_REGION_OPTIONS;
  const match = options.find((option) => option.value === regionCode);
  return match?.label || "";
}

export function normalizeRegionCode(countryCode, regionValue) {
  const normalizedCountry = normalizeCountryCode(countryCode);
  const rawValue = String(regionValue || "").trim();
  if (!rawValue) {
    return "";
  }

  const options = REGION_OPTIONS_BY_COUNTRY[normalizedCountry] || DEFAULT_REGION_OPTIONS;
  const byCode = options.find((option) => option.value === rawValue);
  if (byCode) {
    return byCode.value;
  }

  const lowerValue = rawValue.toLowerCase();
  const byLabel = options.find((option) => String(option.label || "").trim().toLowerCase() === lowerValue);
  return byLabel?.value || rawValue;
}

export default function CountryRegionSelector({
  country,
  region,
  onCountryChange,
  onRegionChange,
  countryLabel = "Country",
  regionLabel = "State or Region",
  disabled = false,
  countryName,
  regionName,
  countryAutoComplete,
  regionAutoComplete,
}) {
  const normalizedCountry = normalizeCountryCode(country);
  const normalizedRegion = normalizeRegionCode(normalizedCountry, region);
  const regionOptions = REGION_OPTIONS_BY_COUNTRY[normalizedCountry] || DEFAULT_REGION_OPTIONS;

  return (
    <>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{countryLabel}</span>
        </div>
        <select
          className="select select-bordered w-full"
          value={normalizedCountry}
          name={countryName}
          autoComplete={countryAutoComplete}
          disabled={disabled}
          onChange={(event) => {
            const nextCountry = event.target.value;
            onCountryChange(nextCountry);
          }}
        >
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.value || "empty-country"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{regionLabel}</span>
        </div>
        <select
          className="select select-bordered w-full"
          value={normalizedRegion}
          name={regionName}
          autoComplete={regionAutoComplete}
          disabled={disabled || !normalizedCountry}
          onChange={(event) => onRegionChange(event.target.value)}
        >
          {regionOptions.map((option) => (
            <option key={option.value || "empty-region"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
