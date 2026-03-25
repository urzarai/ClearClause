const MONEY_REGEX = /(?:₹|Rs\.?|INR|USD|\$|€|£)\s?[\d,]+(?:\.\d{1,2})?(?:\s?(?:lakhs?|crores?|million|billion|thousand))?/gi;

const DATE_REGEX = /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/gi;

const PARTY_REGEX = /(?:between|by and between|entered into by)\s+([A-Z][A-Za-z\s,.'&]+?)(?:\s*\(["']?(?:the\s+)?(?:Company|Employer|Employee|Client|Vendor|Contractor|Party|Licensor|Licensee|Buyer|Seller|Lender|Borrower|Owner|Tenant|Landlord)\b)/gi;

const ENTITY_LABEL_REGEX = /([A-Z][A-Za-z\s.'&,]+?(?:Ltd\.?|LLC|Inc\.?|Pvt\.?|Corp\.?|Limited|Corporation|LLP|Foundation|Trust|Group)?)\s*\(\s*["']?(?:the\s+)?(?:Company|Employer|Employee|Client|Vendor|Contractor|Party|Licensor|Licensee|Buyer|Seller|Lender|Borrower|Owner|Tenant|Landlord|Service\s+Provider|Developer)["']?\s*\)/gi;

const JURISDICTION_REGEX = /(?:laws?\s+of|courts?\s+of|jurisdiction\s+of|governed\s+by(?:\s+the\s+laws?\s+of)?)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/gi;

const unique = (arr) => [...new Set(arr.filter((v) => v && v.trim().length > 2))];

const extractEntities = (text) => {
  const dates = [];
  const dateRegex = new RegExp(DATE_REGEX.source, 'gi');
  let m;
  while ((m = dateRegex.exec(text)) !== null) {
    dates.push(m[0].trim());
  }

  const amounts = [];
  const moneyRegex = new RegExp(MONEY_REGEX.source, 'gi');
  while ((m = moneyRegex.exec(text)) !== null) {
    amounts.push(m[0].trim());
  }

  const parties = [];

  const entityLabelRegex = new RegExp(ENTITY_LABEL_REGEX.source, 'gi');
  while ((m = entityLabelRegex.exec(text)) !== null) {
    if (m[1]) parties.push(m[1].trim());
  }

  const partyRegex = new RegExp(PARTY_REGEX.source, 'gi');
  while ((m = partyRegex.exec(text)) !== null) {
    if (m[1]) parties.push(m[1].trim());
  }

  const jurisdictions = [];
  const jurRegex = new RegExp(JURISDICTION_REGEX.source, 'gi');
  while ((m = jurRegex.exec(text)) !== null) {
    if (m[1]) jurisdictions.push(m[1].trim());
  }

  return {
    parties: unique(parties).slice(0, 15),
    dates: unique(dates).slice(0, 10),
    amounts: unique(amounts).slice(0, 10),
    jurisdictions: unique(jurisdictions).slice(0, 5),
  };
};

module.exports = { extractEntities };