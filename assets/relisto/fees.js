/* Marketplace fee maths for the Relisto free tools on mintwavestudio.com.
   Generated pages check their worked examples against this file (relisto/tools/web/site_pages.py).
   Sources (read 2026-11-18): vinted.<cc>/help/342; ebay.fr|ebay.co.uk help id=5595 (buyer protection, private
   sellers); ebay.es help id=4822 (private seller fees); ebay.de help id=4822. */
(function (root) {
  const r2 = x => Math.round((x + 1e-9) * 100) / 100;

  // Vinted fee, paid by the buyer. FR/DE/IT/ES: "usually 5 % + 0.70 €"; PL "zwykle 5% + 2,90 zł";
  // UK: "usually 3% to 8% + £0.3 to £0.8" (range only).
  const VINTED = {
    eu: { pct: 0.05, fix: 0.70, cur: 'EUR' },
    pl: { pct: 0.05, fix: 2.90, cur: 'PLN' },
    uk: { pctMin: 0.03, pctMax: 0.08, fixMin: 0.30, fixMax: 0.80, cur: 'GBP' },
  };

  function vintedFee(price, region) {
    const v = VINTED[region];
    if (region === 'uk') return { min: r2(price * v.pctMin + v.fixMin), max: r2(price * v.pctMax + v.fixMax) };
    const f = r2(price * v.pct + v.fix);
    return { min: f, max: f };
  }

  // Highest item price whose price + Vinted fee stays within the buyer's budget (UK: top of the published range).
  function vintedPriceForBudget(budget, region) {
    const v = VINTED[region];
    const pct = region === 'uk' ? v.pctMax : v.pct, fix = region === 'uk' ? v.fixMax : v.fix;
    return Math.max(0, Math.floor(((budget - fix) / (1 + pct)) * 100 + 1e-6) / 100);
  }

  // eBay Buyer Protection fee (UK; FR and IT for private sellers registered there, since 1 Sep 2026):
  // 0.10 per item + 7 % up to 20 + 4 % of 20–300 + 2 % of 300–4,000, nothing above 4,000. Item price only.
  function ebayBuyerProtection(price) {
    if (price <= 0) return 0;
    const band = (lo, hi) => Math.max(0, Math.min(price, hi) - lo);
    return r2(0.10 + 0.07 * band(0, 20) + 0.04 * band(20, 300) + 0.02 * band(300, 4000));
  }

  // eBay.es private sellers: 11.5 % of the total sale up to 2,000 € + 2 % above, 0.42 % regulatory fee,
  // per-order fee 0.05 € under 10 € total, else 0.35 €. Total = what the buyer pays incl. postage.
  function ebayEsSellerFee(total) {
    if (total <= 0) return 0;
    const fvf = 0.115 * Math.min(total, 2000) + 0.02 * Math.max(0, total - 2000);
    return r2(fvf + 0.0042 * total + (total < 10 ? 0.05 : 0.35));
  }

  // Seller fee and buyer fee per eBay site, for a private seller registered in that country, domestic sale.
  function ebay(site, price, postage) {
    postage = postage || 0;
    let seller = 0, buyer = 0;
    if (site === 'uk' || site === 'fr' || site === 'it') buyer = ebayBuyerProtection(price);
    else if (site === 'es') seller = ebayEsSellerFee(price + postage);
    return { seller, buyer, buyerPays: r2(price + postage + buyer), sellerGets: r2(price + postage - seller) };
  }

  const api = { VINTED, vintedFee, vintedPriceForBudget, ebayBuyerProtection, ebayEsSellerFee, ebay, r2 };
  if (typeof module !== 'undefined') module.exports = api; else root.RelistoFees = api;
})(this);
