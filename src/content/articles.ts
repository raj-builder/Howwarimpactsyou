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

Pass-through rates vary enormously across countries, products, and time periods. In countries with competitive retail sectors and strong consumer protection, pass-through tends to be lower because retailers absorb more of the shock. In countries with concentrated supply chains or limited domestic production, pass-through is higher because there are fewer buffers between global markets and the checkout counter.

For food staples, pass-through tends to be higher than for manufactured goods. Bread, cooking oil, and rice are commodities where the raw input cost is a large share of the final price. A wheat price shock passes through to bread prices much more directly than a steel price shock passes through to car prices, because the car has thousands of other components and layers of value-added processing.

The time dimension matters too. Short-run pass-through is almost always lower than long-run pass-through. A retailer might hold prices steady for a few weeks after an oil shock, absorbing the cost increase temporarily. But over months, the higher input costs become unsustainable and prices adjust upward. The lag can range from days for fuel to 12 months or more for processed foods with long supply chains and stockpiles.

Government intervention can reduce or delay pass-through. Fuel subsidies, price controls, strategic grain reserves, and targeted cash transfers all act as buffers. Egypt's bread subsidy program, for instance, keeps the price of baladi bread almost unchanged regardless of global wheat prices, though the fiscal cost of maintaining this buffer is enormous.

Our simulator uses a 100% pass-through assumption as a deliberate ceiling. This means every estimate shows the maximum possible consumer price impact if all upstream cost changes flow through completely. In practice, actual impacts are typically 55-75% of the ceiling, depending on the country and category.`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'bread' },
      { war: 'ukraine-russia', category: 'oil' },
      { war: 'covid', category: 'basket' },
    ],
  },
  {
    slug: 'how-wars-affect-food-prices',
    title: 'How wars affect food prices',
    description:
      'Wars disrupt food prices through multiple channels: supply destruction, trade route blockages, currency depreciation, and energy cost spikes. This article traces each mechanism.',
    content: `Wars affect food prices through at least four distinct channels, and understanding each channel is crucial for anticipating which countries and products will be hit hardest.

The first channel is direct supply destruction. When conflict damages farms, storage facilities, ports, or processing plants, the physical supply of food decreases. The Russia-Ukraine war is a textbook case: Ukraine was the world's fifth-largest wheat exporter before February 2022, and the war immediately removed millions of tonnes from global markets. This supply shock rippled outward, raising wheat prices for every importing country.

The second channel is trade route disruption. Even when production continues, war can block the routes that move food from surplus regions to deficit regions. The Black Sea grain corridor was a critical example, where naval blockades and mine-laying disrupted shipments through one of the world's busiest agricultural trade routes. The Gaza conflict triggered Houthi attacks on Red Sea shipping, causing container lines to reroute around the Cape of Good Hope, adding weeks of transit time and dramatically increasing freight costs.

The third channel is energy cost transmission. Modern agriculture is deeply energy-intensive. Fertilizer production requires natural gas. Farm machinery runs on diesel. Refrigerated transport depends on fuel. When a war disrupts oil and gas markets, the cost increase cascades through the entire food system. The Russia-Ukraine war caused European natural gas prices to spike over 220%, which raised fertilizer costs globally, which in turn increased production costs for grain farmers in countries far from the conflict.

The fourth channel is currency depreciation. Wars create uncertainty, trigger capital flight, and can destabilize government finances. When a country's currency weakens, every dollar-denominated import becomes more expensive in local terms. Egypt's pound lost nearly half its value in the two years following the Ukraine invasion, which meant that even if global wheat prices returned to pre-war levels, Egyptian importers would still be paying far more in local currency.

These four channels interact and amplify each other. A country that imports most of its wheat (supply exposure), depends on Red Sea shipping routes (trade route exposure), subsidizes fuel domestically (energy cost exposure), and has a weakening currency (FX exposure) will face compounding price pressures across all channels simultaneously. Egypt, Pakistan, and Nigeria consistently rank as the most vulnerable countries in our model because they score high on multiple channels.

The timing of impacts also varies by channel. Energy cost transmission is nearly immediate for fuel prices, while agricultural supply destruction may take a full growing season to fully manifest in consumer prices. Currency depreciation effects depend on how quickly importers exhaust existing contracts priced at the old exchange rate.`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'bread' },
      { war: 'gaza-2023', category: 'oil' },
      { war: 'iran-israel-us', category: 'fuel' },
    ],
  },
  {
    slug: 'commodity-price-shocks',
    title: 'Understanding commodity price shocks',
    description:
      'Commodity price shocks are sudden, large movements in the prices of raw materials like oil, wheat, or metals. They propagate through the global economy in predictable but often underappreciated ways.',
    content: `A commodity price shock occurs when the price of a raw material moves sharply in a short period, typically driven by a supply disruption, demand surge, or speculative repricing of risk. Understanding how these shocks propagate is essential for anyone trying to anticipate consumer price impacts.

Commodity markets are global and interconnected. The price of Brent crude oil, for example, is set in international markets denominated in US dollars. When that price moves, it affects every country that imports oil, regardless of whether they are involved in the conflict that caused the shock. This globalization of commodity pricing means that a war in the Middle East can raise fuel costs in the Philippines within days.

Not all commodities behave the same way during shocks. Energy commodities like oil and natural gas tend to spike quickly and violently, sometimes doubling in weeks. Agricultural commodities like wheat and corn move more slowly because existing stockpiles and alternative suppliers can buffer the initial shock. Metals fall somewhere in between. These different dynamics mean that fuel prices respond to a war almost immediately, while bread prices may take months to fully adjust.

The concept of a price shock also depends on whether a country is a net importer or net exporter of the commodity. For net exporters like Brazil (soybeans, oil) or Indonesia (palm oil), a commodity price shock can actually be beneficial, increasing export revenues and potentially strengthening the currency. For net importers like Egypt or Pakistan, the same shock is devastating, draining foreign exchange reserves and weakening the currency.

Substitution effects can dampen or redirect shocks. When sunflower oil prices spike due to the Ukraine war, consumers and food manufacturers switch to palm oil or soybean oil, causing those prices to rise too. This substitution means that the shock spreads across related commodities, even those not directly affected by the conflict. Economists call this contagion, and it explains why cooking oil prices rose globally even in countries with no trade connection to Ukraine.

Speculative trading amplifies commodity shocks in the short run. When traders anticipate supply disruptions, they buy futures contracts, pushing prices up before the physical shortage materializes. This can cause overshooting, where prices rise more than the fundamental supply-demand shift would justify. Speculative excesses typically correct within weeks or months, but the short-run price spike still flows through to consumers, especially for goods with short supply chains.

Government responses to commodity shocks include releasing strategic reserves, imposing export bans, enacting price controls, and providing consumer subsidies. Each of these tools has tradeoffs. Export bans by major producers like India banning rice exports in 2023 can stabilize domestic prices but worsen the global shock for importing countries.`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'oil' },
      { war: 'covid', category: 'fuel' },
      { war: 'gulf-2003', category: 'fuel' },
    ],
  },
  {
    slug: 'currency-depreciation',
    title: 'Currency depreciation and inflation',
    description:
      'When a country\u2019s currency loses value, imports become more expensive. This article explains how currency depreciation amplifies commodity shocks and drives consumer price inflation.',
    content: `Currency depreciation is one of the most powerful amplifiers of commodity price shocks. When a country's currency weakens against the US dollar, every dollar-priced import becomes more expensive in local terms, even if the dollar price hasn't changed. For import-dependent countries, this creates a double hit: global prices rise and the local currency buys less.

Consider a concrete example. If wheat costs $300 per tonne on global markets and the Egyptian pound trades at 15 EGP per dollar, the local cost is 4,500 EGP per tonne. If the pound then depreciates to 30 EGP per dollar, the same wheat now costs 9,000 EGP per tonne, even if the global dollar price is unchanged. If the global price also rises 30% to $390, the combined local cost becomes 11,700 EGP per tonne, a 160% increase from the original level.

This compounding effect explains why countries with both high import dependency and weak currencies consistently appear at the top of our impact rankings. Egypt, Pakistan, Nigeria, and Turkiye all experienced significant currency depreciation during recent conflicts, which multiplied the impact of global commodity price increases.

The speed of depreciation matters. A gradual 10% decline over a year gives importers time to adjust, hedge, and find alternative sources. A sudden 30% crash, like Egypt's pound devaluation in March 2024, immediately reprices the entire import bill and overwhelms any hedging strategies that were in place.

Not all depreciation is created equal. A depreciation driven by capital flight and loss of confidence tends to be more persistent and damaging than one driven by a deliberate policy adjustment. Managed depreciations, where the central bank gradually allows the currency to weaken, are less disruptive because they are anticipated and priced into contracts. Disorderly depreciations, where the currency collapses faster than expected, catch importers off guard and cause panic buying that exacerbates price spikes.

Countries that maintain currency pegs face a different set of risks. A pegged currency doesn't depreciate gradually, but when pressure becomes unsustainable, the adjustment is sudden and severe. Nigeria's naira experienced this in June 2023 when the peg was removed, causing a 49% crash that instantly repriced all imports.

Central banks fight depreciation by raising interest rates, spending foreign exchange reserves, and imposing capital controls. Each tool has costs. Higher interest rates slow economic growth. Spending reserves depletes the buffer available for future shocks. Capital controls can deter foreign investment and create parallel exchange markets where the unofficial rate is much weaker than the official one.

In our model, the FX adjustment captures this amplification effect. For each country, we apply the observed or estimated depreciation to the local-currency cost of imports. Countries with stable currencies like Brazil or Morocco see their commodity shock impact limited to the global price change. Countries with depreciating currencies see the impact magnified, sometimes doubled or tripled.`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'basket' },
      { war: 'gaza-2023', category: 'bread' },
      { war: 'covid', category: 'oil' },
    ],
  },
  {
    slug: 'reading-impact-ceiling',
    title: 'How to read an impact ceiling estimate',
    description:
      'Our simulator produces impact ceiling estimates, not price forecasts. This article explains what the numbers mean, how to interpret them, and common misreadings to avoid.',
    content: `Every number produced by our simulator is an impact ceiling estimate, not a price forecast. Understanding the difference is crucial for using the tool correctly.

An impact ceiling estimate answers the question: if all upstream cost changes passed through to consumer prices with zero absorption by middlemen, retailers, or government subsidies, how much could the price of this product rise? It is deliberately an upper bound, designed to show the maximum potential exposure rather than the most likely outcome.

Think of it like a flood risk assessment. A flood map might show that a 100-year storm could put water three meters deep in your street. That doesn't mean your street will flood three meters deep this year. But it tells you the exposure level and helps you make informed decisions about insurance, building height, and emergency planning. Our impact ceiling works the same way for price risk.

The ceiling is useful because it reveals relative vulnerability. Even if the actual outcome is 60% of the ceiling, the ranking of countries by vulnerability is usually preserved. A country with a 40% ceiling will almost certainly experience more price pressure than a country with a 10% ceiling, even though neither will hit exactly those numbers.

There are several common misreadings to avoid. First, the ceiling is not a prediction. We are not saying that bread prices in Egypt will rise 41.3%. We are saying that the combination of wheat price shocks, currency depreciation, and energy cost increases creates a ceiling of 41.3% if everything passes through fully. Second, the ceiling does not account for government intervention. Egypt's bread subsidy program, for example, has historically kept baladi bread prices nearly flat despite enormous upstream cost increases. The subsidy absorbs the shock, but at a fiscal cost that shows up elsewhere in the economy. Third, the ceiling assumes a static snapshot of factor changes. In reality, commodity prices fluctuate daily and currencies move continuously. The ceiling reflects a specific scenario with specific input values, not a continuously updating forecast.

To properly interpret the numbers, consider three layers. The first layer is the headline number itself, which tells you the maximum exposure. The second layer is the breakdown by factor, which tells you which upstream drivers matter most for that country and category. A bread impact driven primarily by wheat prices will behave differently from one driven primarily by currency depreciation, even if the ceiling number is similar. The third layer is the country reason text, which provides qualitative context about why that country is more or less vulnerable.

The most actionable use of the ceiling estimate is comparative. Instead of fixating on whether bread in Egypt will rise exactly 41.3%, compare Egypt's 41.3% ceiling to Brazil's 6.1% ceiling and ask: what structural differences between these two countries explain the gap? The answer, which involves import dependency, currency stability, and domestic production capacity, reveals the fundamental drivers of vulnerability and points toward policy solutions.`,
    relatedScenarios: [
      { war: 'ukraine-russia', category: 'bread' },
      { war: 'iran-israel-us', category: 'basket' },
      { war: 'covid', category: 'basket' },
    ],
  },
]

export const ARTICLE_MAP = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a])
) as Record<string, Article>

export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug)
