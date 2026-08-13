# Rental and area data plan

## Product wording

The public result is an **indicative rental estimate and area report**, not a formal valuation or guaranteed rent.

## MVP/public sources

### Completed sales

HM Land Registry Price Paid Data:  
https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads

Use for nearby completed-sale and historical sales context. Do not treat a sold price as the current rent or property value. Store source, observation date, retrieval date and required attribution.

### Official rent trends

ONS private rent and house prices:  
https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/latest

Use for Peterborough/local-authority context. This is not a live property-level asking-rent feed and estimates may be provisional/revised.

### Crime context

Police.uk:  
https://data.police.uk/docs/method/crime-street/

Locations are intentionally approximate, data is monthly and records do not prove the safety of a particular home. Present separate categories/trends, not a “safe/unsafe” label or one area score.

### Licensing

Peterborough selective licensing:  
https://www.peterborough.gov.uk/residents/housing/selective-licensing/selective-licensing-overview

Present a cautious “may require a licence” flag plus the current council link. Occupancy, household relationships, exemptions and scheme changes prevent a definitive automated legal determination.

### EPC

Government EPC data guidance:  
https://get-energy-performance-data.communities.gov.uk/guidance/energy-certificate-data-apis

Requires registered access. Address-level data can be personal/restricted. Keep credentials server-side and check permitted purpose, retention and attribution before implementation.

## Production property-level estimate

A credible property-level estimate should combine:

1. Red Brick’s de-identified achieved-rent records
2. A licensed current rental-comparable provider
3. Staff review, especially for unusual, HMO, converted, premium or poor-condition homes

Potential suppliers to evaluate, not pre-approved commitments:

- PropertyData: https://propertydata.co.uk/api/investment-analysis
- Hometrack/Zoopla data services: https://www.hometrack.com/data-services/

Never scrape Rightmove, Zoopla or another portal.

## Estimate/model requirements

- Match type, bedrooms, floor area, locality, condition and recency
- Time-adjust older evidence where a documented method supports it
- Return a range, evidence count and confidence explanation
- Suppress the estimate and request staff review when evidence is weak
- Keep crime/demographics outside pricing and tenant-selection models
- Preserve model/input version for each report
- Back-test by time, property type, bedroom count and area before launch

## Future scenarios

Use low/central/high illustrative scenarios for one and three years. State assumptions. Never call them forecasts, guarantees, returns or financial advice.

## Minimum metadata per figure

- Source name and URL
- Licence/attribution requirement
- Observation date
- Retrieval date
- Geography
- Whether factual or modelled
- Model version where applicable
- Quality/confidence flag
- Last review date

