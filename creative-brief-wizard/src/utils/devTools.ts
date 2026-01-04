import { v4 as uuidv4 } from 'uuid';
import type {
  SessionState,
  StickyNote,
  Cluster,
  CustomerDiscovery,
  OneSentenceThreeLenses,
  ViewersInMirror,
  StoryWithoutPictures,
  PromiseProof,
  Constraint,
  RequirementCard,
} from '../types';

// ============================================================================
// Mock Data Generator for EcoBottle Product Launch
// ============================================================================

/**
 * Generates realistic mock data for testing the Creative Brief Wizard.
 * All data is coherent around a fictional "EcoBottle" sustainable water bottle launch.
 */

// ============================================================================
// Project Context Mock Data
// ============================================================================

export const mockProjectContext = {
  projectName: 'EcoBottle Launch Campaign',
  projectDescription:
    'A comprehensive marketing campaign for the launch of EcoBottle, an innovative sustainable water bottle made from 100% ocean-recovered plastic. The campaign will introduce the product to environmentally conscious consumers aged 25-45 across digital and retail channels.',
  stakeholders:
    'Marketing Director (Sarah Chen), Product Manager (David Kim), Creative Director (Maria Rodriguez), Sustainability Officer (James Park), CEO (Linda Thompson), Retail Partners (Target, REI, Whole Foods)',
  constraints:
    'Budget: $250,000 | Timeline: 8 weeks from brief approval to launch | Must align with company sustainability commitments | Cannot make claims not verified by third-party certification | Must work across digital and retail touchpoints',
  timeline:
    'Week 1-2: Creative development | Week 3-4: Asset production | Week 5-6: Campaign testing and refinement | Week 7: Pre-launch buzz building | Week 8: Launch week',
  duration: 90, // 90-minute workshop
  completed: true,
};

// ============================================================================
// Customer Discovery Mock Data
// ============================================================================

export const mockCustomerDiscovery: Partial<CustomerDiscovery> = {
  whoIsThisFor: {
    id: 'who-is-this-for',
    question: "Let's start with your audience. Who is this really for?",
    prompts: [],
    timeLimit: 180,
    answer: `Primary Audience: Environmentally conscious millennials and Gen Z (ages 25-40), urban professionals who prioritize sustainability in purchasing decisions. They're active on social media, follow eco-influencers, and are willing to pay premium prices for products that align with their values.

Secondary Audience: Outdoor enthusiasts and fitness-minded individuals who need durable, reliable hydration solutions and appreciate the environmental angle as a bonus.

Psychographics: They feel guilty about single-use plastics, anxious about climate change, but also want to feel empowered that their choices matter. They value authenticity, transparency, and want brands that "walk the walk" not just "talk the talk." They're skeptical of greenwashing.

Media Consumption: Instagram, TikTok, sustainability podcasts, outdoor lifestyle blogs. They shop at REI, Whole Foods, and support B-Corps and certified sustainable brands.

Who It's NOT For: Price-sensitive consumers who prioritize convenience over sustainability, climate change skeptics, or those who view sustainable products as "less effective" than conventional alternatives.`,
  },
  whatIsBeingOffered: {
    id: 'what-is-being-offered',
    question: "Now, let's talk about what you're actually offering. What are we promoting here?",
    prompts: [],
    timeLimit: 180,
    answer: `We're launching EcoBottle, a premium reusable water bottle made from 100% ocean-recovered plastic. Each bottle is crafted from plastic waste collected from oceans and waterways, then transformed into a durable, insulated, 24oz water bottle.

Core Benefit: Customers get a high-performance hydration solution while directly contributing to ocean cleanup. Every purchase removes 1 pound of ocean plastic beyond what's used in the bottle itself.

Unique Differentiation: Unlike other sustainable bottles, EcoBottle doesn't just avoid creating new plastic - it actively removes existing pollution. Each bottle has a unique ID that tracks which ocean/waterway the plastic came from, giving buyers a personal connection to their environmental impact.

Product Experience: Premium feel with double-wall insulation, keeps drinks cold for 24 hours. Leak-proof design. Available in 5 colors inspired by ocean ecosystems (Coral Reef, Deep Blue, Sea Glass, Coastal Fog, Kelp Forest).

Proof Points: Ocean Conservancy certified, B-Corp pending, partnered with The Ocean Cleanup project, 1% of revenue goes to marine conservation. Third-party tested for BPA-free, food-grade materials.`,
  },
  whyNow: {
    id: 'why-now',
    question: "Here's a critical one: Why does this matter RIGHT NOW? What's the urgency?",
    prompts: [],
    timeLimit: 120,
    answer: `Timing is critical for several converging reasons:

1. Cultural Momentum: Plastic pollution awareness is at an all-time high following recent documentaries and visible ocean cleanup efforts. The "Blue Planet effect" continues to drive consumer behavior changes.

2. Competitive Landscape: Major competitors (Hydro Flask, S'well) are launching sustainability initiatives this quarter. We need to establish EcoBottle as THE authentically ocean-positive brand before the market gets saturated with "eco-lite" alternatives.

3. Seasonal Opportunity: Launch aligns with Earth Month (April) and the start of outdoor/summer season when water bottle purchases peak. Retailers are finalizing summer inventory NOW.

4. Regulatory Pressure: Several cities are implementing single-use plastic bans in Q2, creating perfect timing for reusable alternatives messaging.

5. Internal Momentum: We have celebrity partnerships secured (ocean conservation advocates) who are available for launch period but may not be later. Production capacity is ready, and we've hit our ocean plastic sourcing targets.

Risk of Waiting: Losing Earth Month momentum, missing peak retail buying season, allowing competitors to own the "ocean plastic" narrative, and potentially losing committed retail shelf space to other brands.`,
  },
  whatIsSuccess: {
    id: 'what-is-success',
    question: "Finally, let's get specific about success. How will we actually know this worked?",
    prompts: [],
    timeLimit: 180,
    answer: `Quantitative Success Metrics:

Short-term (First Month):
- 50,000 units sold (against goal of 35,000)
- 10M social media impressions
- 250K website visits
- 5% conversion rate on e-commerce site
- Secured shelf space in 500+ retail locations

Long-term (6 months):
- 200,000 total units sold
- 15% market share in premium sustainable water bottle category
- 40% repeat purchase rate
- Net Promoter Score of 50+
- $3.5M in revenue

Qualitative Success:
- Brand mentioned in "top sustainable products" articles and gift guides
- User-generated content showing EcoBottle in aspirational lifestyle contexts
- Influencer partnerships driving authentic advocacy (not just paid posts)
- Customers sharing their unique bottle ID stories on social media
- Retail partners requesting expanded SKUs and featured placement

Measurement Tools:
- Google Analytics, Shopify analytics for e-commerce
- Social listening tools (Sprout Social) for sentiment and share of voice
- Retail sales data from POS systems
- Post-purchase NPS surveys
- Brand awareness studies (pre and post-launch)

What Failure Looks Like:
- Less than 25,000 units in first month
- High return rates indicating quality issues
- Being perceived as "greenwashing" or inauthentic
- Price resistance preventing conversion
- Inability to compete with established premium brands`,
  },
  completed: true,
};

// ============================================================================
// Sticky Notes Mock Data (Diverge Phase)
// ============================================================================

export const mockStickyNotes: Omit<StickyNote, 'id' | 'createdAt'>[] = [
  { text: 'Every bottle removes ocean plastic pollution', x: 120, y: 100, clusterId: null },
  { text: 'Track your unique bottle origin story', x: 280, y: 130, clusterId: null },
  { text: 'Premium quality meets purpose', x: 440, y: 90, clusterId: null },
  { text: 'Turn guilt into action', x: 600, y: 150, clusterId: null },
  { text: 'Your hydration helps heal oceans', x: 760, y: 110, clusterId: null },
  {
    text: 'Join a community of ocean advocates',
    x: 140,
    y: 280,
    clusterId: null,
  },
  {
    text: 'See exactly where your plastic came from',
    x: 320,
    y: 260,
    clusterId: null,
  },
  { text: 'Beautiful design inspired by the sea', x: 500, y: 290, clusterId: null },
  { text: 'Performance that matches your values', x: 680, y: 250, clusterId: null },
  {
    text: 'Every sip is a statement',
    x: 160,
    y: 420,
    clusterId: null,
  },
  {
    text: 'Certified ocean-positive impact',
    x: 340,
    y: 440,
    clusterId: null,
  },
  {
    text: 'Partner with The Ocean Cleanup',
    x: 520,
    y: 400,
    clusterId: null,
  },
  {
    text: 'Make sustainability personal and traceable',
    x: 700,
    y: 430,
    clusterId: null,
  },
  { text: 'Cold drinks for 24 hours', x: 180, y: 560, clusterId: null },
  {
    text: 'Durable enough for your adventures',
    x: 360,
    y: 580,
    clusterId: null,
  },
  {
    text: 'Leak-proof confidence anywhere',
    x: 540,
    y: 540,
    clusterId: null,
  },
  {
    text: 'Colors inspired by ocean ecosystems',
    x: 720,
    y: 570,
    clusterId: null,
  },
  {
    text: 'Feel good about every purchase',
    x: 200,
    y: 700,
    clusterId: null,
  },
  {
    text: 'Show others sustainable is possible',
    x: 400,
    y: 720,
    clusterId: null,
  },
  {
    text: 'Be part of the solution, not pollution',
    x: 600,
    y: 680,
    clusterId: null,
  },
];

// ============================================================================
// Clusters Mock Data (Converge Phase)
// ============================================================================

export function createMockClusters(notes: StickyNote[]): Cluster[] {
  return [
    {
      id: uuidv4(),
      title: 'Environmental Impact & Purpose',
      noteIds: notes.slice(0, 5).map((n) => n.id),
      aiSummary:
        'This cluster focuses on the core environmental value proposition - how EcoBottle actively removes ocean plastic and turns consumer guilt into meaningful action. Key themes: ocean cleanup, measurable impact, purpose-driven consumption.',
      x: 100,
      y: 80,
      width: 720,
      height: 200,
    },
    {
      id: uuidv4(),
      title: 'Authenticity & Transparency',
      noteIds: notes.slice(5, 9).map((n) => n.id),
      aiSummary:
        'Building trust through transparency and verified credentials. Emphasizes traceability, certification, partnerships with legitimate ocean conservation organizations, and avoiding greenwashing.',
      x: 120,
      y: 240,
      width: 620,
      height: 180,
    },
    {
      id: uuidv4(),
      title: 'Product Performance & Quality',
      noteIds: notes.slice(9, 13).map((n) => n.id),
      aiSummary:
        'Ensuring the sustainable choice is also the best choice from a functional standpoint. Highlights durability, insulation performance, design aesthetics, and premium quality that justifies the price point.',
      x: 140,
      y: 380,
      width: 600,
      height: 220,
    },
    {
      id: uuidv4(),
      title: 'Emotional Connection & Community',
      noteIds: notes.slice(13).map((n) => n.id),
      aiSummary:
        'Creating emotional resonance and social belonging. Focuses on feeling good about choices, being part of a movement, inspiring others, and joining a community of environmentally conscious consumers.',
      x: 180,
      y: 660,
      width: 480,
      height: 180,
    },
  ];
}

// ============================================================================
// Spot Exercises Mock Data
// ============================================================================

export const mockOneSentenceThreeLenses: OneSentenceThreeLenses = {
  makePeopleFeel: 'Empowered that their everyday choices can heal the planet, proud to show their values through beautiful design, and connected to a tangible impact they can see and share.',
  helpOrganization:
    'Establish EcoBottle as the authentic leader in ocean-positive products, drive premium sales while building brand equity, and create a repeatable model for sustainable product launches.',
  showThatWe:
    'Walk the walk on sustainability with verified impact, understand our audience wants performance AND purpose, and are transparent partners in ocean conservation - not just another greenwashing brand.',
};

export const mockViewersInMirror: ViewersInMirror = {
  whereWatching:
    'Scrolling Instagram during morning coffee, browsing gift ideas on retailer websites, watching YouTube reviews while researching sustainable swaps, seeing it in a friend\'s hand at yoga class, walking past the display at Whole Foods',
  feelingBefore:
    'Overwhelmed by plastic waste crisis, guilty about single-use bottles piling up, skeptical of "eco-friendly" claims that seem too good to be true, wanting to make better choices but unsure where to start, tired of compromising quality for sustainability',
  stopWatchingIf:
    'It feels preachy or guilt-trippy, the price seems unjustified, claims feel exaggerated or unverifiable, it looks cheap or performs poorly, the messaging is confusing or contradictory, it seems like every other "green" product making empty promises',
};

export const mockStoryWithoutPictures: StoryWithoutPictures = {
  situation: {
    description:
      'Meet Jenna, a 32-year-old marketing manager who considers herself environmentally conscious. She brings reusable bags to the grocery store, composts, and stays informed about climate issues. She owns a water bottle, but it\'s scratched and old.',
    type: 'required',
  },
  problem: {
    description:
      'One morning, Jenna sees a viral video showing the ocean plastic crisis up close - sea turtles, polluted beaches, the Great Pacific Garbage Patch. She looks at her plastic water bottle collection under the sink - 7 bottles she\'s bought over the years trying to find "the right one." She realizes she\'s part of the problem, and her small actions feel meaningless against such a massive crisis.',
    type: 'required',
  },
  tensionReveal: {
    description:
      'Scrolling Instagram that evening, she sees a friend\'s post about their new EcoBottle - showing the unique tracking code that reveals their bottle was made from plastic pulled from the Pacific near Hawaii. The post has dozens of comments from their friend group asking "Where did you get this?" Jenna clicks through and discovers each bottle removes even MORE ocean plastic beyond what it\'s made from. She hesitates at the $45 price tag.',
    type: 'required',
  },
  productRole: {
    description:
      'She reads verified reviews praising the quality, sees the Ocean Conservancy certification, watches a 60-second video showing the collection and transformation process. She learns her purchase will be tracked and she\'ll get updates on the ongoing impact. Not just buying a bottle - joining a movement. She adds the Coral Reef color to her cart.',
    type: 'required',
  },
  resolution: {
    description:
      'Two weeks later, Jenna brings her EcoBottle to a work meeting. A colleague asks about it, and she shows them the tracking app feature - her bottle came from plastic collected off the coast of Indonesia, and her purchase removed an additional 1.3 pounds of ocean plastic. She\'s shared it on social media twice, switched from disposable to tap water, and already convinced two friends to buy their own. She feels like she finally found a way to make a real difference.',
    type: 'required',
  },
};

export const mockPromisesAndProofs: PromiseProof[] = [
  {
    claim: 'Every EcoBottle removes ocean plastic pollution',
    visualProof:
      'Show before/after footage of ocean cleanup operations, display the unique tracking ID system connecting bottles to their source location, visualize "1 bottle purchased = 1+ pounds removed" equation with actual collected plastic',
  },
  {
    claim: 'Premium quality that keeps drinks cold for 24 hours',
    visualProof:
      'Time-lapse testing showing ice remaining after 24 hours, side-by-side comparison with competitors, thermal imaging showing insulation performance, testimonials from athletes and outdoor enthusiasts',
  },
  {
    claim: 'Verified ocean-positive impact through certified partnerships',
    visualProof:
      'Display Ocean Conservancy certification badge, show partnership logos (The Ocean Cleanup), include third-party verification reports, share transparency documents and impact metrics dashboard',
  },
  {
    claim: 'Track your bottle\'s unique origin story',
    visualProof:
      'Demonstrate the tracking app interface, show map visualization of collection locations, display example bottle ID stories, user-generated content of customers sharing their bottle origins',
  },
  {
    claim: 'Join a community of ocean advocates making real change',
    visualProof:
      'Show community impact numbers (total plastic removed), feature user stories and testimonials, display social media community using hashtag, visualize collective impact of all EcoBottle users',
  },
];

export const mockConstraints: Constraint[] = [
  {
    description: 'Cannot make environmental claims that aren\'t third-party verified',
    styleImplication:
      'Use certified badges and partner logos prominently, include disclaimer text or footnotes for all impact claims, link to verification documentation, maintain tone of humility and transparency rather than boastfulness',
  },
  {
    description: 'Must work across digital (social, web, email) and retail (in-store displays, packaging) touchpoints',
    styleImplication:
      'Create modular visual system that scales from Instagram stories to retail endcaps, ensure key messages are concise enough for point-of-sale, design recognizable brand mark that works at any size',
  },
  {
    description: 'Budget constraints limit video production to 2 hero pieces + social cutdowns',
    styleImplication:
      'Maximize impact of each video shoot, design content to be repurposable, rely more heavily on still photography and motion graphics, leverage user-generated content to extend video library',
  },
  {
    description: 'Timeline requires creative approval within 2 weeks of brief',
    styleImplication:
      'Present clear creative direction with 2-3 concept options max, include production feasibility considerations upfront, build in stakeholder alignment early, avoid concepts requiring complex approvals or new partnerships',
  },
  {
    description: 'Must align with company\'s existing brand guidelines while standing out from category norms',
    styleImplication:
      'Use approved brand colors but introduce ocean-inspired accent palette, maintain brand fonts but allow for dynamic scale and hierarchy, leverage brand photography style but introduce new "ocean impact" visual motifs',
  },
];

export const mockFailures: string[] = [
  'Falling into "guilt-trip" messaging that makes people feel bad instead of empowered - doom and gloom environmental campaigns that paralyze rather than activate',
  'Looking cheap or low-quality in visuals, undermining the premium price point and making sustainability seem like a compromise rather than an upgrade',
  'Being so focused on environmental credentials that we forget to show the product benefits - failing the "would they buy this if it wasn\'t sustainable?" test',
  'Creating messaging that\'s confusing about how the ocean plastic process works, leading to skepticism instead of trust, or accidentally sounding like greenwashing',
  'Copying the look and feel of every other "eco-brand" (kraft paper, hand-drawn leaves, earth tones) and failing to stand out or feel modern and aspirational',
];

// ============================================================================
// Prioritization Mock Data
// ============================================================================

export const mockRequirementCards: {
  willHave: Omit<RequirementCard, 'id'>[];
  couldHave: Omit<RequirementCard, 'id'>[];
  wontHave: Omit<RequirementCard, 'id'>[];
} = {
  willHave: [
    {
      description: 'Hero video showing ocean cleanup to finished product transformation (60 sec)',
      source: 'Promises & Proofs - showing ocean plastic removal process',
    },
    {
      description:
        'Social media campaign highlighting unique bottle tracking ID feature and user stories',
      source: 'Environmental Impact cluster - personal connection to impact',
    },
    {
      description:
        'Product photography showcasing premium quality and ocean-inspired color palette',
      source: 'Product Performance cluster - visual appeal and quality',
    },
    {
      description:
        'Retail displays with certification badges and "Track Your Impact" QR codes',
      source: 'Authenticity & Transparency cluster - verified credentials',
    },
    {
      description:
        'Landing page with impact calculator and bottle origin story showcase',
      source: 'Story Without Pictures - making impact personal and traceable',
    },
    {
      description:
        'Email nurture sequence: discovery → education → conversion → community',
      source: 'Customer Discovery - multi-touchpoint journey',
    },
  ],
  couldHave: [
    {
      description: 'Partnership activations with eco-influencers and ocean advocates',
      source: 'Emotional Connection cluster - community building',
    },
    {
      description: 'Behind-the-scenes content series on plastic collection and manufacturing',
      source: 'Authenticity & Transparency - showing the process',
    },
    {
      description: 'User-generated content campaign with hashtag and rewards program',
      source: 'Emotional Connection cluster - social proof and belonging',
    },
    {
      description: 'Comparison guides positioning EcoBottle vs. major competitors',
      source: 'Product Performance cluster - competitive differentiation',
    },
    {
      description: 'Limited edition artist collaboration bottles for launch momentum',
      source: 'Environmental Impact cluster - collectibility and urgency',
    },
  ],
  wontHave: [
    {
      description: 'Paid TV advertising or OOH billboards (budget constraints)',
      source: 'Budget constraints - focusing on digital and retail',
    },
    {
      description: 'Multi-language versions for international markets (timeline)',
      source: 'Timeline constraints - US market focus for launch',
    },
    {
      description: 'Complex AR experiences or custom app development',
      source: 'Timeline and budget constraints - using existing web platform',
    },
    {
      description: 'Celebrity endorsement deals (budget and authenticity concerns)',
      source: 'Authenticity cluster - grassroots advocacy more credible',
    },
  ],
};

// ============================================================================
// Main Fill Function
// ============================================================================

export interface FillOptions {
  fillAll?: boolean; // Fill all phases vs current phase only
  overwrite?: boolean; // Overwrite existing data
}

/**
 * Fills the session state with realistic mock data for testing.
 * Returns a modified session state.
 */
export function fillMockData(
  currentState: SessionState,
  options: FillOptions = { fillAll: true, overwrite: true }
): SessionState {
  const newState = { ...currentState };

  // Project Context
  if (options.overwrite || !newState.projectContext.completed) {
    newState.projectContext = { ...mockProjectContext };
  }

  // Customer Discovery
  if (options.overwrite || !newState.customerDiscovery.completed) {
    newState.customerDiscovery = {
      ...newState.customerDiscovery,
      ...mockCustomerDiscovery,
      completed: true,
    } as CustomerDiscovery;
  }

  // Sticky Notes - Create notes with IDs
  if (options.overwrite || newState.stickyNoteExercise.notes.length === 0) {
    const notes: StickyNote[] = mockStickyNotes.map((note) => ({
      ...note,
      id: uuidv4(),
      createdAt: Date.now() - Math.random() * 1000000,
    }));

    // Create clusters and assign notes
    const clusters = createMockClusters(notes);

    // Update notes with cluster assignments
    clusters.forEach((cluster) => {
      cluster.noteIds.forEach((noteId) => {
        const note = notes.find((n) => n.id === noteId);
        if (note) {
          note.clusterId = cluster.id;
        }
      });
    });

    newState.stickyNoteExercise = {
      focusPrompt:
        'What makes EcoBottle compelling? Think about: environmental impact, product benefits, emotional drivers, proof points, and reasons to believe.',
      notes,
      clusters,
      completed: true,
    };
  }

  // Spot Exercises
  if (options.overwrite || !newState.spotExercises.completed) {
    newState.spotExercises = {
      oneSentence: mockOneSentenceThreeLenses,
      viewersInMirror: mockViewersInMirror,
      story: mockStoryWithoutPictures,
      failures: mockFailures,
      promisesAndProofs: mockPromisesAndProofs,
      constraints: mockConstraints,
      aiSynthesis: 'Mock AI synthesis would go here',
      completed: true,
    };
  }

  // Prioritization
  if (options.overwrite || newState.prioritization.willHave.length === 0) {
    newState.prioritization = {
      willHave: mockRequirementCards.willHave.map((card) => ({
        ...card,
        id: uuidv4(),
      })),
      couldHave: mockRequirementCards.couldHave.map((card) => ({
        ...card,
        id: uuidv4(),
      })),
      wontHave: mockRequirementCards.wontHave.map((card) => ({
        ...card,
        id: uuidv4(),
      })),
      completed: true,
    };
  }

  return newState;
}
