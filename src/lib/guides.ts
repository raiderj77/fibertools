export interface Guide {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  date: string;
  keywords: string[];
  sections: { heading: string; content: string }[];
}

export const guides: Guide[] = [
  {
    slug: "reading-yarn-labels",
    title: "The Complete Guide to Reading Yarn Labels (What Every Number Means)",
    description: "Learn how to read yarn labels like a pro! This comprehensive guide explains yarn weight symbols, washing care instructions, gauge information, and what every number on your yarn label actually means.",
    toolSlug: "yarn-calculator",
    date: "2026-02-23",
    keywords: ["how to read yarn labels", "yarn label symbols", "yarn weight chart", "yarn care instructions", "knitting yarn labels", "crochet yarn labels"],
    sections: [
      { 
        heading: "Why Yarn Labels Matter More Than You Think", 
        content: "Yarn labels aren't just decorative packaging—they're essential technical documents that contain critical information about project compatibility, care requirements, material composition, gauge information, and dye lot numbers. Ignoring these details can lead to disastrous results: sweaters that shrink in the wash, blankets that pill after one use, or projects that simply don't turn out as expected." 
      },
      { 
        heading: "Section 1: Yarn Weight and Thickness", 
        content: "The most prominent information on any yarn label is the weight category. According to the Craft Yarn Council's standardized system (used by most manufacturers worldwide), yarn weights range from 0 to 7. Weight 0 is Lace (1.5–2.25mm), Weight 1 is Super Fine/Fingering (2.25–3.25mm), Weight 2 is Fine/Sport (3.25–3.75mm), Weight 3 is Light/DK (3.75–4.5mm), Weight 4 is Medium/Worsted (4.5–5.5mm), Weight 5 is Bulky/Chunky (5.5–8mm), Weight 6 is Super Bulky (8–12.75mm), and Weight 7 is Jumbo (12.75mm+). Most patterns specify a yarn weight category. If your pattern calls for 'worsted weight' yarn, look for the number 4 on the label." 
      },
      { 
        heading: "Section 2: Fiber Content and Material Composition", 
        content: "The fiber content tells you what your yarn is made of—and this dramatically affects how your finished project will behave. Common fiber abbreviations include WOOL or W (natural sheep's wool), ALP or A (alpaca fiber), COT or C (cotton), ACR or AC (acrylic), NYL or N (nylon), SILK or S (silk), LIN or L (linen), and HEMP or H (hemp). Many yarns are blends (like 75% wool/25% nylon for sock yarns). The percentages matter: a yarn with 80% wool and 20% alpaca will behave differently than one with 20% wool and 80% alpaca." 
      },
      { 
        heading: "Section 3: Yardage and Weight", 
        content: "These numbers tell you how much yarn you're actually getting. Yardage/Meterage is the total length of yarn in the skein (e.g., '200 yards/183 meters'). Weight is the physical weight of the skein (e.g., '100 grams/3.5 ounces'). Different fibers have different densities. A 100-gram skein of lightweight cotton might have 400 yards, while a 100-gram skein of bulky wool might only have 100 yards. Always check yardage when substituting yarns in patterns." 
      },
      { 
        heading: "Section 4: Gauge Information", 
        content: "Gauge (or 'tension' in some countries) is arguably the most important—and most overlooked—information on a yarn label. It tells you the recommended needle/hook size, stitches per 4 inches/10 cm, and rows per 4 inches/10 cm. A typical gauge statement looks like: '18 sts x 24 rows = 4\" (10 cm) on US 8 (5 mm) needles'. Always make a gauge swatch! If your gauge doesn't match the label, your finished project won't match the pattern dimensions." 
      },
      { 
        heading: "Section 5: Care Symbols and Washing Instructions", 
        content: "Those tiny icons aren't just decorative—they're international care symbols that tell you exactly how to care for your finished item. Washing symbols include washtub with number (maximum water temperature), washtub with hand (hand wash only), washtub with X (do not wash). Drying symbols include square with circle (tumble dry), square with circle and X (do not tumble dry). Ironing symbols include iron with dots (iron temperature), iron with X (do not iron). Bleaching symbols include triangle (bleaching allowed), triangle with X (do not bleach). Dry cleaning symbols include circle (dry clean), circle with X (do not dry clean). Always follow care instructions!" 
      },
      { 
        heading: "Section 6: Dye Lot Numbers", 
        content: "That seemingly random number and letter combination (like 'LOT 12345A') is your dye lot number. Yarn is dyed in batches, and even with modern technology, slight color variations can occur between batches. Golden rule: Always buy enough yarn from the same dye lot for your entire project. If you need to buy more later, even if it's the same brand and color name, different dye lots might not match perfectly." 
      },
      { 
        heading: "Section 7: Recommended Needle/Hook Sizes", 
        content: "While gauge information includes recommended sizes, many labels also show this separately with icons: knitting needle icon with size (recommended knitting needle size) and crochet hook icon with size (recommended crochet hook size). These are suggestions, not rules. Your personal tension, the stitch pattern, and the desired fabric drape might require different sizes." 
      },
      { 
        heading: "Common Yarn Label Symbols Decoded", 
        content: "Beyond the standard care symbols, you might encounter specialized icons: Ball of yarn with knitting needles (suitable for knitting), ball of yarn with crochet hook (suitable for crochet), ball of yarn with both (suitable for both knitting and crochet), moth with X (moth-resistant treatment), flame with X (flame-retardant treatment), recycle symbol (contains recycled materials), OEKO-TEX® Standard 100 (certified free from harmful substances), GOTS (Global Organic Textile Standard) (certified organic fibers)." 
      },
      { 
        heading: "How to Use Yarn Label Information for Project Success", 
        content: "Now that you can read labels, here's how to apply this knowledge: 1. Pattern Matching: When choosing yarn for a pattern, compare weight category (should match exactly), gauge (should be similar), and fiber content. 2. Yarn Substitution: When substituting yarns, ensure same weight category, similar yardage per weight unit, compatible fiber properties, and similar care requirements. 3. Care Planning: Before starting a project, check care instructions. 4. Quantity Calculation: Use the yardage information to determine exactly how many skeins you need." 
      },
      { 
        heading: "Troubleshooting Common Yarn Label Issues", 
        content: "If the label doesn't show gauge for your needle size: Create a swatch with your preferred needles and measure. If the care symbols are faded/unreadable: Search online for the yarn brand and colorway—most manufacturers provide label information on their websites. If the yarn weight seems wrong for the category: Some artisanal or novelty yarns don't fit neatly into standard categories. Focus on gauge rather than weight number. If no dye lot number is listed: This usually means the yarn is space-dyed or has no dye variations (common with natural undyed yarns or some synthetics)." 
      },
      { 
        heading: "Expert Tips from Professional Fiber Artists", 
        content: "1. Save your labels—tape them into a notebook or take photos. You'll thank yourself when you need to make repairs or recreate a project. 2. Make notes—jot down needle size, modifications, and washing results on the label or in Ravelry. 3. Consider future care—if making a gift, choose yarns with easy care instructions (machine washable is always appreciated). 4. Test wash your swatch—this reveals how the yarn will behave after washing and whether it will shrink or bleed color." 
      },
      { 
        heading: "Frequently Asked Questions About Yarn Labels", 
        content: "Q: What does 'superwash' mean on a yarn label? A: Superwash wool has been treated to prevent felting, making it machine washable. It's ideal for items that will need frequent washing like socks, baby clothes, and everyday wear. Q: Why do some yarns have multiple weight categories listed? A: Some yarns fall between standard categories or have different recommended uses. A yarn might be labeled as '4-5' if it's between worsted and bulky. Always check the gauge rather than relying solely on the weight number. Q: What if my yarn has no label? A: You can often identify yarn by burn testing a small piece (safely!), examining the fiber under magnification, or comparing it to known samples. When in doubt, assume it needs gentle hand washing and flat drying. Q: Are all yarn labels standardized worldwide? A: Most follow the Craft Yarn Council standards, but there are regional variations. European labels might use different symbols or metric measurements exclusively. Japanese labels often include both metric and US measurements. Q: What does 'lot' or 'dye lot' mean? A: This refers to the specific batch in which the yarn was dyed. Always buy enough yarn from the same lot to ensure color consistency throughout your project. Q: Can I ignore the recommended needle/hook size? A: You can use different sizes, but it will affect your gauge and the finished fabric. Larger needles create looser, drapier fabric; smaller needles create tighter, denser fabric. Always swatch!" 
      },
      { 
        heading: "Conclusion: Your Yarn Label is Your Best Friend", 
        content: "Reading yarn labels might seem daunting at first, but with this guide, you now have the decoder ring for every symbol and number. Remember: your yarn label contains everything you need to know for project success—from choosing the right yarn to caring for your finished masterpiece. The next time you pick up a skein, take a moment to read the label thoroughly. Check the weight, fiber content, care instructions, and gauge. Your future self (and your finished projects) will thank you." 
      }
    ]
  }
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getAllGuides(): Guide[] {
  return guides;
}