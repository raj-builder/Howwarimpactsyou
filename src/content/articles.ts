export interface Article {
  slug: string
  title: string
  description: string
  content: string
  relatedScenarios: { war: string; category: string }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'what-is-pass-through',
    title: 'What is pass-through in economics?',
    description:
      'Pass-through measures how much of a cost shock at the wholesale or import level eventually reaches consumer prices. Understanding pass-through is essential to interpreting impact ceiling estimates.',
    content: `Pass-through is one of the most important concepts in applied economics, yet it rarely makes headlines. In simple terms, pass-through measures how much of a price change at one stage of the supply chain eventually flows to the next stage, and ultimately to the consumer.

When economists say that exchange rate pass-through to consumer prices is 40%, they mean that a 10% depreciation of the local currency leads, over time, to a 4% increase in consumer prices for imported goods. The remaining 60% is absorbed by importers, wholesalers, and retailers who accept thinner margins rather than lose customers.

Recent IMF research (Carri\u00e8re-Swallow et al., WP/23/86) has shown that pass-through is not constant \u2014 it is "state-dependent," meaning it increases significantly during periods of high inflation and elevated uncertainty. This finding matters because it means historical pass-through estimates from calm periods underestimate the impact during crises like wars or pandemics.

The European Central Bank's research confirms that pass-through declines along the pricing chain: a 1% depreciation of the euro raises import prices by 0.3\u20130.8% within one year, but raises consumer prices by less than 0.1% (ECB Occasional Paper 241). This tenfold reduction reflects the many layers of absorption between the border and the checkout counter.

For food staples, pass-through tends to be higher than for manufactured goods. Bread, cooking oil, and rice are commodities where the raw input cost is a large share of the final price. A wheat price shock passes through to bread prices much more directly than a steel price shock passes through to car prices, because the car has thousands of other components and layers of value-added processing.

The World Bank (Ha, Stocker, & Yilmazkuday, Policy Research Working Paper 8780) found that pass-through is asymmetric: currency depreciations have a larger and more persistent effect on prices than appreciations of the same magnitude. They also found that pass-through remains higher among emerging market economies without inflation-targeting central banks, which helps explain why countries like Egypt, Nigeria, and Pakistan experience sharper consumer price impacts.

Government intervention can reduce or delay pass-through. Fuel subsidies, price controls, strategic grain reserves, and targeted cash transfers all act as buffers. Egypt\u2019s bread subsidy program, for instance, keeps the price of baladi bread almost unchanged regardless of global wheat prices, though the fiscal cost of maintaining this buffer exceeded $5 billion annually by 2023 (IMF Country Report, 2024).

Our simulator uses a 100% pass-through assumption as a deliberate ceiling. This means every estimate shows the maximum possible consumer price impact if all upstream cost changes flow through completely. In practice, actual impacts are typically 55\u201375% of the ceiling, depending on the country and category.

Sources: IMF Working Paper WP/23/86 (2023). ECB Occasional Paper 241 (2022). World Bank Policy Research Working Paper 8780 (2019). IMF Country Report on Egypt (2024).`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'bread' },
      { war: 'ukraine-russia', category: 'oil' },
      { war: 'hormuz-2026', category: 'basket' },
    ],
  },
  {
    slug: 'how-wars-affect-food-prices',
    title: 'How wars affect food prices',
    description:
      'Wars disrupt food prices through multiple channels: supply destruction, trade route blockages, currency depreciation, and energy cost spikes. This article traces each mechanism.',
    content: `Wars affect food prices through at least four distinct channels, and understanding each channel is crucial for anticipating which countries and products will be hit hardest.

The first channel is direct supply destruction. When conflict damages farms, storage facilities, ports, or processing plants, the physical supply of food decreases. The Russia-Ukraine war is a textbook case: Ukraine produced 10% of global wheat exports and 50% of global sunflower oil before February 2022 (FAO, 2022). The war immediately removed millions of tonnes from global markets. CBOT wheat futures surged 48% in the weeks following the invasion, from $8.14 to $12.09 per bushel.

The second channel is trade route disruption. Even when production continues, war can block the routes that move food from surplus regions to deficit regions. The Black Sea grain corridor was a critical example. The Gaza conflict triggered Houthi attacks on Red Sea shipping, causing container lines to reroute around the Cape of Good Hope, adding 10\u201314 days of transit time. In the 2026 Strait of Hormuz closure, container freight rates surged approximately 150%, from $2,000 to $5,000 per TEU on Asia-Europe routes (Shanghai Containerized Freight Index, March 2026).

The third channel is energy cost transmission. Modern agriculture is deeply energy-intensive. Fertilizer production requires natural gas. Farm machinery runs on diesel. Refrigerated transport depends on fuel. The Russia-Ukraine war caused European natural gas prices (TTF) to spike from \u20AC79.5 to \u20AC339.2 per MWh, a 327% increase. This raised fertilizer costs globally \u2014 urea prices rose 65% \u2014 which in turn increased production costs for grain farmers in countries far from the conflict.

The fourth channel is currency depreciation. Wars create uncertainty, trigger capital flight, and can destabilize government finances. The Egyptian pound lost 71% of its value between February 2022 and March 2026 (EGP 15.7 to 53.5 per USD), meaning that even if global wheat prices returned to pre-war levels, Egyptian importers would still be paying far more in local currency.

These four channels interact and amplify each other. Egypt, Pakistan, and Nigeria consistently rank as the most vulnerable countries in our model because they score high on multiple channels simultaneously. The FAO Food Price Index peaked at 159.7 in March 2022, 34% above January 2022 levels (FAO, 2022), reflecting the compounding effect across all four channels.

Sources: FAO Food Price Index (2022). CBOT wheat futures data. EU TTF natural gas benchmark. Shanghai Containerized Freight Index (March 2026). Central Bank of Egypt exchange rate data.`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'bread' },
      { war: 'hormuz-2026', category: 'fuel' },
      { war: 'iran-israel-us', category: 'fuel' },
    ],
  },
  {
    slug: 'commodity-price-shocks',
    title: 'Understanding commodity price shocks',
    description:
      'Commodity price shocks are sudden, large movements in the prices of raw materials like oil, wheat, or metals. They propagate through the global economy in predictable but often underappreciated ways.',
    content: `A commodity price shock occurs when the price of a raw material moves sharply in a short period, typically driven by a supply disruption, demand surge, or speculative repricing of risk.

Commodity markets are global and interconnected. Brent crude oil is priced in US dollars on the ICE exchange in London. When that price moves, it affects every country that imports oil, regardless of whether they are involved in the conflict that caused the shock. In the Strait of Hormuz escalation of February\u2013March 2026, Brent surged from $70 to $107.81 per barrel (+54%) in under two months (EIA Short-Term Energy Outlook, March 2026). This affected fuel prices in the Philippines within days, even though the Philippines has no direct involvement in the US-Iran conflict.

Not all commodities behave the same way during shocks. Energy commodities like oil and natural gas tend to spike quickly. Agricultural commodities like wheat and corn move more slowly because existing stockpiles and alternative suppliers can buffer the initial shock. The EIA estimated that the effective closure of the Strait of Hormuz removed approximately 16 million barrels per day of crude oil flow \u2014 80% of the strait\u2019s normal volume (EIA, March 2026).

The concept of a price shock depends on whether a country is a net importer or net exporter. For net exporters like Brazil (soybeans, oil) or Indonesia (palm oil), a commodity price shock can actually be beneficial, increasing export revenues and potentially strengthening the currency. For net importers like Egypt or Pakistan, the same shock is devastating.

Substitution effects can dampen or redirect shocks. When sunflower oil prices spiked due to the Ukraine war, consumers switched to palm oil or soybean oil, causing those prices to rise too. India banned rice exports in July 2023 (WTO notification, 2023) to stabilize domestic prices, but this worsened the global shock for importing countries \u2014 particularly in Sub-Saharan Africa.

Speculative trading amplifies commodity shocks in the short run. The Federal Reserve Bank of Dallas estimated that a one-quarter closure of the Strait of Hormuz would raise average WTI prices to $98 per barrel and lower global GDP growth by an annualized 2.9 percentage points (Dallas Fed, Q1 2026).

Sources: EIA Short-Term Energy Outlook (March 2026). Federal Reserve Bank of Dallas (Q1 2026). WTO export restriction notifications (2023). ICE Brent crude futures.`,
    relatedScenarios: [
      { war: 'hormuz-2026', category: 'fuel' },
      { war: 'ukraine-russia', category: 'oil' },
      { war: 'covid', category: 'fuel' },
    ],
  },
  {
    slug: 'currency-depreciation',
    title: 'Currency depreciation and inflation',
    description:
      'When a country\u2019s currency loses value, imports become more expensive. This article explains how currency depreciation amplifies commodity shocks and drives consumer price inflation.',
    content: `Currency depreciation is one of the most powerful amplifiers of commodity price shocks. When a country's currency weakens against the US dollar, every dollar-priced import becomes more expensive in local terms, even if the dollar price hasn't changed.

Consider a concrete example. If wheat costs $300 per tonne on global markets and the Egyptian pound trades at 15.7 EGP per dollar (the rate in February 2022), the local cost is 4,710 EGP per tonne. By March 2026, the pound had depreciated to 53.5 EGP per dollar \u2014 a 71% loss (Central Bank of Egypt). The same wheat now costs 16,050 EGP per tonne, a 241% increase in local terms, even if the dollar price is unchanged.

This compounding effect explains why countries with both high import dependency and weak currencies consistently appear at the top of our impact rankings. Between February 2022 and March 2026, the Turkish lira lost 69% (13.6 to 44.4 per USD), the Nigerian naira lost 70% (415 to 1,384 per USD), and the Pakistani rupee lost 37% (177 to 279 per USD).

A 2024 IMF study on Sub-Saharan Africa (WP/2024/059) found that exchange rate pass-through in the region is eight times stronger during depreciations than during appreciations. This asymmetry means that currencies falling hurts consumers far more than currencies rising helps them.

The speed of depreciation matters. Egypt\u2019s pound devaluation in March 2024 \u2014 when the Central Bank allowed the rate to move from 30.9 to over 50 EGP per dollar \u2014 triggered net foreign outflows of approximately $4 billion from Egypt's T-bill secondary market within weeks (Central Bank of Egypt, 2026). A gradual 10% decline over a year gives importers time to adjust and hedge.

Countries that maintain currency pegs face a different set of risks. Nigeria\u2019s naira experienced this in June 2023 when the peg was removed, causing a 49% crash that instantly repriced all imports. The parallel market gap had reached 70% before the peg was abandoned (CBN data, 2023).

In our model, the FX adjustment captures this amplification effect. Countries with stable currencies like Brazil or Morocco see their commodity shock impact limited to the global price change. Countries with depreciating currencies see the impact magnified, sometimes doubled or tripled.

Sources: Central Bank of Egypt exchange rate data. IMF Working Paper WP/2024/059 on Sub-Saharan Africa. Central Bank of Nigeria (CBN) exchange rate data. Trading Economics historical FX rates.`,
    relatedScenarios: [
      { war: 'hormuz-2026', category: 'basket' },
      { war: 'ukraine-russia', category: 'basket' },
      { war: 'gaza-2023', category: 'bread' },
    ],
  },
  {
    slug: 'reading-impact-ceiling',
    title: 'How to read an impact ceiling estimate',
    description:
      'Our simulator produces impact ceiling estimates, not price forecasts. This article explains what the numbers mean, how to interpret them, and common misreadings to avoid.',
    content: `Every number produced by our simulator is an impact ceiling estimate, not a price forecast. Understanding the difference is crucial for using the tool correctly.

An impact ceiling answers the question: if all upstream cost changes passed through to consumer prices with zero absorption by middlemen, retailers, or government subsidies, how much could the price of this product rise? It is deliberately an upper bound, designed to show the maximum potential exposure rather than the most likely outcome.

Think of it like a flood risk assessment. A flood map might show that a 100-year storm could put water three meters deep in your street. That doesn\u2019t mean your street will flood this year. But it tells you the exposure level and helps you make informed decisions. Our impact ceiling works the same way for price risk.

The ceiling is useful because it reveals relative vulnerability. In the Strait of Hormuz 2026 scenario, Egypt shows a 32.4% basket ceiling while Brazil shows 5.8%. Even if the actual outcomes are 60% of these ceilings (19.4% and 3.5% respectively), the ranking of countries by vulnerability is preserved. The IMF\u2019s October 2023 World Economic Outlook confirmed that global inflation peaked at 8.7% in 2022, with realized inflation typically running 55\u201375% of the maximum estimated exposure from commodity shocks.

There are several common misreadings to avoid. First, the ceiling is not a prediction. We are not saying that bread prices in Egypt will rise 38.6%. We are saying that the combination of Brent crude +54%, shipping +150%, urea +49%, and EGP depreciation creates a ceiling of 38.6% if everything passes through fully. Second, the ceiling does not account for government intervention. Egypt\u2019s bread subsidy program has historically kept baladi bread prices nearly flat despite enormous upstream cost increases (IMF Article IV, Egypt, 2024). Third, the ceiling reflects a specific scenario with specific input values, not a continuously updating forecast.

To properly interpret the numbers, consider three layers. The first is the headline number \u2014 the maximum exposure. The second is the factor breakdown, which reveals which upstream drivers matter most. A bread impact driven primarily by wheat prices will behave differently from one driven primarily by currency depreciation. The third is the country context \u2014 import dependency ratios, FX regime type, and subsidy programs all affect how much of the ceiling materializes.

The most actionable use is comparative. Instead of fixating on whether fuel in Egypt will rise exactly 48.2%, compare Egypt\u2019s 48.2% ceiling to Germany\u2019s 4.6% and ask: what structural differences explain the 10x gap? The answer \u2014 import dependency, currency stability, energy diversification, and fiscal capacity \u2014 reveals the fundamental drivers of vulnerability.

Sources: IMF World Economic Outlook (October 2023). IMF Article IV Consultation, Egypt (2024). EIA Short-Term Energy Outlook (March 2026). howwarimpactsyou.com model methodology.`,
    relatedScenarios: [
      { war: 'hormuz-2026', category: 'basket' },
      { war: 'hormuz-2026', category: 'fuel' },
      { war: 'ukraine-russia', category: 'bread' },
    ],
  },
]

export const ARTICLE_MAP = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a])
) as Record<string, Article>

export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug)
