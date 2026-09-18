import type { Citation, Composition, Raga, SearchItem, Tutorial } from "@ragavazhi/domain";

const retrievedAt = "2026-09-18";
const wiki = (slug: string, label: string): Citation => ({
  id: `wiki-${slug}`,
  label,
  url: `https://en.wikipedia.org/wiki/${slug}`,
  sourceType: "encyclopedia",
  license: "CC BY-SA 4.0",
  retrievedAt
});

type RagaSeed = [string, string, string, string, string, string, string, string?, number?];
const seeds: RagaSeed[] = [
  ["mayamalavagowla", "Mayamalavagowla", "മായാമാളവഗൗള", "S R₁ G₃ M₁ P D₁ N₃ S", "S N₃ D₁ P M₁ G₃ R₁ S", "The symmetrical scale taught early in Carnatic training makes swara positions unusually clear.", "സമമിതമായ സ്വരക്രമം സ്വരസ്ഥാനങ്ങൾ വ്യക്തമായി കേൾക്കാൻ തുടക്കക്കാരെ സഹായിക്കുന്നു.", "Carnatic", 15],
  ["mohanam", "Mohanam", "മോഹനം", "S R₂ G₃ P D₂ S", "S D₂ P G₃ R₂ S", "A bright pentatonic shape; listen for the open leap between G and P.", "തിളക്കമുള്ള ഔഡവ രാഗം; ഗയിൽ നിന്ന് പയിലേക്കുള്ള തുറന്ന ചാട്ടം ശ്രദ്ധിക്കുക.", "Both", 28],
  ["kalyani", "Kalyani", "കല്യാണി", "S R₂ G₃ M₂ P D₂ N₃ S", "S N₃ D₂ P M₂ G₃ R₂ S", "The prati madhyama gives Kalyani its expansive, luminous colour.", "പ്രതി മധ്യമമാണ് കല്യാണിയുടെ വിശാലവും പ്രകാശമുള്ളതുമായ ഭാവത്തിന് അടിസ്ഥാനം.", "Carnatic", 65],
  ["sankarabharanam", "Shankarabharanam", "ശങ്കരാഭരണം", "S R₂ G₃ M₁ P D₂ N₃ S", "S N₃ D₂ P M₁ G₃ R₂ S", "A complete major-scale framework shaped by distinctly Carnatic gamakas.", "സമ്പൂർണ്ണമായ സ്വരക്രമത്തിന് കർണാടക ഗമകങ്ങൾ നൽകുന്ന വ്യക്തിത്വം ശ്രദ്ധിക്കുക.", "Carnatic", 29],
  ["kharaharapriya", "Kharaharapriya", "ഖരഹരപ്രിയ", "S R₂ G₂ M₁ P D₂ N₂ S", "S N₂ D₂ P M₁ G₂ R₂ S", "Fluid kampita on gandhara and nishada creates its introspective pull.", "ഗാന്ധാരത്തിലും നിഷാദത്തിലും വരുന്ന കമ്പിതം ആഴമുള്ള ഭാവം സൃഷ്ടിക്കുന്നു.", "Carnatic", 22],
  ["todi", "Hanumatodi", "ഹനുമത്തോടി", "S R₁ G₂ M₁ P D₁ N₂ S", "S N₂ D₁ P M₁ G₂ R₁ S", "Dense oscillation and curved movement matter more than a bare scale rendition.", "വെറും സ്വരക്രമത്തേക്കാൾ ഗമകവും വളഞ്ഞ സഞ്ചാരവുമാണ് രാഗസ്വഭാവം നൽകുന്നത്.", "Carnatic", 8],
  ["bhairavi", "Bhairavi", "ഭൈരവി", "S R₂ G₂ M₁ P D₂ N₂ S", "S N₂ D₁ P M₁ G₂ R₂ S", "A majestic bhashanga raga whose phrases use contextual dhaivata shades.", "സന്ദർഭാനുസൃത ധൈവതപ്രയോഗങ്ങളുള്ള ഗാംഭീര്യമേറിയ ഭാഷാംഗരാഗം.", "Carnatic", 20],
  ["hamsadhwani", "Hamsadhwani", "ഹംസധ്വനി", "S R₂ G₃ P N₃ S", "S N₃ P G₃ R₂ S", "Compact, auspicious pentatonic phrases often open concerts.", "കച്ചേരികളുടെ തുടക്കത്തിൽ പതിവായി കേൾക്കുന്ന മംഗളകരമായ ഔഡവരാഗം.", "Both", 29],
  ["abhogi", "Abhogi", "ആഭോഗി", "S R₂ G₂ M₁ D₂ S", "S D₂ M₁ G₂ R₂ S", "The absence of panchama and nishada leaves a spacious, yearning contour.", "പഞ്ചമവും നിഷാദവും ഇല്ലാത്തത് വിശാലവും ആകാംക്ഷാഭരിതവുമായ ഭാവം നൽകുന്നു.", "Both", 22],
  ["arabhi", "Arabhi", "ആരഭി", "S R₂ M₁ P D₂ S", "S N₃ D₂ P M₁ G₃ R₂ S", "Direct ascending movement contrasts with a fuller, ornamented descent.", "നേരിട്ടുള്ള ആരോഹണവും കൂടുതൽ സമ്പൂർണ്ണമായ അവരോഹണവും തമ്മിലുള്ള വ്യത്യാസം ശ്രദ്ധിക്കുക.", "Carnatic", 29],
  ["nattai", "Nattai", "നാട്ട", "S R₃ G₃ M₁ P N₃ S", "S N₃ P M₁ R₃ S", "Bold upper-register phrases and a forceful rishabha create an opening-raga energy.", "താരസ്ഥായിയിലെ ശക്തമായ പ്രയോഗങ്ങളും ഋഷഭവും ഉത്സാഹം നൽകുന്നു.", "Carnatic", 36],
  ["saveri", "Saveri", "സാവേരി", "S R₁ M₁ P D₁ S", "S N₃ D₁ P M₁ G₃ R₁ S", "An austere ascent blooms into a richly ornamented descent.", "ലളിതമായ ആരോഹണം ഗമകസമ്പന്നമായ അവരോഹണത്തിലേക്ക് വിരിയുന്നു.", "Carnatic", 15],
  ["kambhoji", "Kambhoji", "കാംഭോജി", "S R₂ G₃ M₁ P D₂ S", "S N₂ D₂ P M₁ G₃ R₂ S", "Long, stately phrases and characteristic kampita support elaborate improvisation.", "ദീർഘവും ഗാംഭീര്യമുള്ള പ്രയോഗങ്ങൾ വിപുലമായ മനോധർമ്മത്തിന് വഴിയൊരുക്കുന്നു.", "Carnatic", 28],
  ["abheri", "Abheri", "ആഭേരി", "S G₂ M₁ P N₂ S", "S N₂ D₂ P M₁ G₂ R₂ S", "A gentle pentatonic ascent opens into an emotive complete descent.", "മൃദുവായ ആരോഹണം ഭാവസമ്പന്നമായ സമ്പൂർണ്ണ അവരോഹണത്തിലേക്ക് നീളുന്നു.", "Carnatic", 22],
  ["hindolam", "Hindolam", "ഹിന്ദോളം", "S G₂ M₁ D₁ N₂ S", "S N₂ D₁ M₁ G₂ S", "Its rishabha- and panchama-less contour creates a meditative stillness.", "ഋഷഭവും പഞ്ചമവും ഇല്ലാത്ത സ്വരരൂപം ധ്യാനാത്മകമായ നിശ്ചലത നൽകുന്നു.", "Both", 20],
  ["madhyamavati", "Madhyamavati", "മധ്യമാവതി", "S R₂ M₁ P N₂ S", "S N₂ P M₁ R₂ S", "A balanced pentatonic raga traditionally associated with auspicious closure.", "മംഗളകരമായ സമാപനവുമായി ബന്ധപ്പെട്ട സമതുലിതമായ ഔഡവരാഗം.", "Carnatic", 22],
  ["revati", "Revati", "രേവതി", "S R₁ M₁ P N₂ S", "S N₂ P M₁ R₁ S", "Sparse intervals and sustained notes make its contemplative identity immediate.", "വിശാല ഇടവേളകളും നീണ്ട സ്വരങ്ങളും ധ്യാനഭാവം ഉടൻ വ്യക്തമാക്കുന്നു.", "Carnatic", 2],
  ["shanmukhapriya", "Shanmukhapriya", "ഷണ്മുഖപ്രിയ", "S R₂ G₂ M₂ P D₁ N₂ S", "S N₂ D₁ P M₂ G₂ R₂ S", "Prati madhyama against minor swara shades creates a dramatic tension.", "പ്രതി മധ്യമവും കോമളസ്വരഭാവങ്ങളും ചേർന്ന് നാടകീയമായ മുറുക്ക് സൃഷ്ടിക്കുന്നു.", "Carnatic", 56],
  ["charukesi", "Charukesi", "ചാരുകേശി", "S R₂ G₃ M₁ P D₁ N₂ S", "S N₂ D₁ P M₁ G₃ R₂ S", "A bright lower tetrachord and darker upper notes create emotional breadth.", "താഴത്തെ തെളിഞ്ഞ സ്വരങ്ങളും മുകളിലെ ഗാഢസ്വരങ്ങളും വിശാലമായ ഭാവം നൽകുന്നു.", "Carnatic", 26],
  ["keeravani", "Keeravani", "കീരവാണി", "S R₂ G₂ M₁ P D₁ N₃ S", "S N₃ D₁ P M₁ G₂ R₂ S", "Its symmetrical minor contour supports both meditative and dramatic expression.", "സമമിതമായ മൈനർ സ്വരരൂപം ധ്യാനവും നാടകീയതയും ഒരുപോലെ കൈകാര്യം ചെയ്യുന്നു.", "Carnatic", 21],
  ["vasanta", "Vasanta", "വസന്ത", "S M₁ G₃ M₁ D₂ N₃ S", "S N₃ D₂ M₁ G₃ R₁ S", "Vakra movement and the missing panchama give Vasanta a distinctive curl.", "വക്രസഞ്ചാരവും പഞ്ചമമില്ലായ്മയും വസന്തയ്ക്ക് വ്യത്യസ്തമായ ചലനം നൽകുന്നു.", "Carnatic", 17],
  ["anandabhairavi", "Anandabhairavi", "ആനന്ദഭൈരവി", "S G₂ R₂ G₂ M₁ P D₂ P S", "S N₂ D₂ P M₁ G₂ R₂ S", "Graceful vakra phrases and anya swaras produce a tender, expressive identity.", "വക്രപ്രയോഗങ്ങളും അന്യസ്വരങ്ങളും മൃദുവും ഭാവസമ്പന്നവുമായ രൂപം നൽകുന്നു.", "Carnatic", 20],
  ["sindhubhairavi", "Sindhu Bhairavi", "സിന്ധുഭൈരവി", "S R₂ G₂ M₁ G₂ P D₁ N₂ S", "S N₂ D₁ P M₁ G₂ R₁ S", "A flexible light-classical raga whose identity depends on phrase and context.", "പ്രയോഗവും സന്ദർഭവും അനുസരിച്ച് നിറം മാറുന്ന ലളിതശാസ്ത്രീയ രാഗം.", "Both"],
  ["neelambari", "Neelambari", "നീലാംബരി", "S R₂ G₃ M₁ P D₂ P N₃ S", "S N₃ P M₁ G₃ R₂ G₃ S", "Unhurried oscillations and descending repose are strongly associated with lullabies.", "മന്ദഗതിയിലുള്ള ഗമകങ്ങളും ഇറങ്ങിവരുന്ന ശാന്തതയും താരാട്ടുകളുമായി ചേർന്നു കേൾക്കുന്നു.", "Carnatic", 29],
  ["begada", "Begada", "ബേഗഡ", "S G₃ R₂ G₃ M₁ P D₂ N₂ D₂ P S", "S N₃ D₂ P M₁ G₃ R₂ S", "Phrase-led identity and heavy gamaka make a scale-only description insufficient.", "ഗമകസമ്പന്നമായ പ്രത്യേക പ്രയോഗങ്ങളാണ് ബേഗഡയെ നിർവചിക്കുന്നത്; സ്വരക്രമം മാത്രം മതിയാകില്ല.", "Carnatic", 29]
];

const colors = ["#a8452d", "#d98c3f", "#456b5a", "#7b486e", "#304f70"];

export const ragas: Raga[] = seeds.map((seed, index) => {
  const [slug, en, ml, arohana, avarohana, signatureEn, signatureMl, system, melakarta] = seed;
  return {
    id: `raga-${String(index + 1).padStart(2, "0")}`,
    slug,
    name: { en, ml },
    aliases: [en.replace(/\s/g, ""), en.normalize("NFD").replace(/[\u0300-\u036f]/g, "")],
    system: system as Raga["system"],
    melakarta,
    arohana,
    avarohana,
    signature: { en: signatureEn, ml: signatureMl },
    overview: {
      en: `${en} rewards phrase-first listening. Use the scale as a map, then notice how sustained notes and characteristic turns establish the raga.`,
      ml: `${ml} പഠിക്കുമ്പോൾ സ്വരക്രമം ഒരു ഭൂപടമായി ഉപയോഗിച്ച് നീട്ടുന്ന സ്വരങ്ങളും പ്രത്യേക സഞ്ചാരങ്ങളും ശ്രദ്ധിക്കുക.`
    },
    phrases: [arohana.split(" ").slice(0, 4).join(" "), avarohana.split(" ").slice(0, 5).join(" ")],
    importantSwaras: arohana.split(" ").filter((value, position, list) => position > 0 && position < list.length - 1).slice(0, 3),
    mood: { en: index % 2 ? "Reflective · expansive" : "Focused · luminous", ml: index % 2 ? "ചിന്താപരം · വിശാലം" : "ഏകാഗ്രം · പ്രകാശം" },
    relations: [],
    citations: [wiki(slug === "todi" ? "Hanumatodi" : en.replace(/ /g, "_"), `${en} — reference overview`)],
    featured: index < 6,
    color: colors[index % colors.length],
    state: "published"
  };
});

const relation = (from: string, to: string, kind: "similar" | "contrast", en: string, ml: string) => {
  const raga = ragas.find((item) => item.slug === from);
  if (raga) raga.relations.push({ slug: to, kind, reason: { en, ml } });
};
relation("mayamalavagowla", "todi", "contrast", "Both foreground close lower swaras, but gandhara treatment and phrase grammar separate them.", "അടുത്ത സ്വരസ്ഥാനങ്ങൾ ഉണ്ടായാലും ഗാന്ധാരപ്രയോഗവും സഞ്ചാരവും ഇവയെ വേർതിരിക്കുന്നു.");
relation("mohanam", "kalyani", "contrast", "Mohanam shares a bright subset of Kalyani's notes while omitting madhyama and nishada.", "കല്യാണിയിലെ ചില തെളിഞ്ഞ സ്വരങ്ങൾ പങ്കിടുമ്പോഴും മധ്യമവും നിഷാദവും മോഹനത്തിൽ ഇല്ല.");
relation("kharaharapriya", "abheri", "similar", "Abheri's commonly heard form draws a compact ascent from Kharaharapriya-like material.", "ആഭേരിയുടെ പരിചിതമായ രൂപത്തിൽ ഖരഹരപ്രിയയോടടുത്ത സ്വരസാമ്യം കേൾക്കാം.");
relation("hindolam", "mohanam", "contrast", "Both are pentatonic; their different gandhara and dhaivata shades change the emotional centre.", "ഇരുവരും ഔഡവരാഗങ്ങളാണെങ്കിലും ഗാന്ധാര-ധൈവതഭേദം ഭാവകേന്ദ്രം മാറ്റുന്നു.");
relation("neelambari", "sankarabharanam", "similar", "They share much scalar material, but Neelambari is recognized by repose, vakra motion, and gamaka.", "സ്വരസാമ്യം ഉണ്ടെങ്കിലും ശാന്തതയും വക്രസഞ്ചാരവും ഗമകവും നീലാംബരിയെ വ്യക്തമാക്കുന്നു.");

const ytSearch = (id: string, title: string): import("@ragavazhi/domain").ExternalMedia => ({
  id, platform: "youtube", kind: "audio", title: `${title} — search on YouTube`,
  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " Carnatic")}`,
  embeddable: false, verifiedAt: retrievedAt
});

type CompositionSeed = [string, string, string, string, string, string, string, string?];
const compositionSeeds: CompositionSeed[] = [
  ["vatapi-ganapatim", "Vatapi Ganapatim", "വാതാപി ഗണപതിം", "hamsadhwani", "Sanskrit", "Muthuswami Dikshitar", "Adi", "A widely taught kriti that demonstrates Hamsadhwani's direct, auspicious movement."],
  ["nagumomu-ganaleni", "Nagumomu Ganaleni", "നഗുമോമു ഗനലേനി", "abheri", "Telugu", "Tyagaraja", "Adi", "A major Abheri composition for hearing the raga's emotive descent."],
  ["samajavaragamana", "Samajavaragamana", "സാമജവരഗമന", "hindolam", "Telugu", "Tyagaraja", "Adi", "A familiar entry point into Hindolam's pentatonic phrase vocabulary."],
  ["ninnukori-varnam", "Ninnukori Varnam", "നിന്നുകോരി വർണം", "mohanam", "Telugu", "Poochi Srinivasa Iyengar", "Adi", "A foundational varnam for internalising Mohanam across registers."],
  ["viriboni-varnam", "Viriboni Varnam", "വിരിബോണി വർണം", "bhairavi", "Telugu", "Pachimiriyam Adiyappa", "Ata", "A substantial varnam that reveals Bhairavi through phrase and rhythmic architecture."],
  ["mahaganapatim", "Mahaganapatim", "മഹാഗണപതിം", "nattai", "Sanskrit", "Muthuswami Dikshitar", "Adi", "A concert-opening composition with Nattai's energetic upper-register profile."],
  ["sri-subrahmanyaya-namaste", "Sri Subrahmanyaya Namaste", "ശ്രീ സുബ്രഹ്മണ്യായ നമസ്തേ", "kambhoji", "Sanskrit", "Muthuswami Dikshitar", "Rupaka", "An expansive Kambhoji composition suited to phrase-led study."],
  ["adamodi-galade", "Adamodi Galade", "അടമോടി ഗലദേ", "charukesi", "Telugu", "Tyagaraja", "Adi", "A core Charukesi kriti showing its dramatic tension and release."],
  ["devi-neeye-thunai", "Devi Neeye Thunai", "ദേവി നീയേ തുണൈ", "keeravani", "Tamil", "Papanasam Sivan", "Adi", "A lyrical route into Keeravani's symmetrical minor contour."],
  ["bhagyada-lakshmi-baramma", "Bhagyada Lakshmi Baramma", "ഭാഗ്യദ ലക്ഷ്മി ബാരമ്മ", "madhyamavati", "Kannada", "Purandara Dasa", "Adi", "A popular devotional composition often used to approach Madhyamavati."],
  ["brochevarevarura", "Brochevarevarura", "ബ്രോചേവാരെവരുരാ", "anandabhairavi", "Telugu", "Mysore Vasudevachar", "Adi", "A well-known composition showcasing Anandabhairavi's curved melodic movement."],
  ["karunai-deivame", "Karunai Deivame", "കരുണൈ ദൈവമേ", "sindhubhairavi", "Tamil", "Madurai T. Srinivasan", "Adi", "A light-classical composition for exploring Sindhu Bhairavi's flexible vocabulary."]
];

export const compositions: Composition[] = compositionSeeds.map((seed, index) => {
  const [slug, en, ml, raga, language, composer, tala, summary] = seed;
  return {
    id: `composition-${String(index + 1).padStart(2, "0")}`,
    slug,
    title: { en, ml },
    aliases: [en.replace(/\s/g, "")],
    language,
    kind: "carnatic",
    raga,
    ragaConfidence: "high",
    tala,
    credits: [{ person: composer, role: "composer" }],
    recordings: [{ id: `recording-${index + 1}`, title: "Find a verified performance", credits: [], media: [ytSearch(`media-${index + 1}`, en)] }],
    summary: { en: summary || "A curated listening example.", ml: "രാഗത്തിന്റെ സ്വഭാവം ശ്രദ്ധിച്ചു കേൾക്കാൻ തിരഞ്ഞെടുത്ത ഒരു കൃതി." },
    lyrics: { text: "", script: language, publishable: false, sourceUrl: "https://sahityam.net/" },
    citations: [wiki(en.replace(/ /g, "_"), `${en} — reference starting point`)],
    state: "published"
  };
});

export const tutorials: Tutorial[] = [
  {
    id: "tutorial-01", slug: "violin-first-listening", title: { en: "Violin: begin with a listening phrase", ml: "വയലിൻ: ഒരു രാഗപ്രയോഗത്തിൽ നിന്ന് തുടങ്ങാം" },
    raga: "mayamalavagowla", teacher: "Vaikom Padma Krishnan", instrument: "violin", level: "beginner", language: "Malayalam",
    media: { id: "tutorial-media-01", platform: "youtube", kind: "tutorial", title: "Find Vaikom Padma Krishnan violin lessons", url: "https://www.youtube.com/results?search_query=Vaikom+Padma+Krishnan+violin+tutorial", embeddable: false, verifiedAt: retrievedAt },
    state: "published"
  },
  {
    id: "tutorial-02", slug: "vocal-mohanam-basics", title: { en: "Hear Mohanam before you sing", ml: "പാടുന്നതിന് മുമ്പ് മോഹനം കേൾക്കാം" },
    raga: "mohanam", teacher: "RagaVazhi editorial", instrument: "vocal", level: "beginner", language: "Malayalam",
    media: { id: "tutorial-media-02", platform: "academy", kind: "tutorial", title: "Listening guide", url: "/learn", embeddable: false, verifiedAt: retrievedAt },
    state: "published"
  }
];

export const people = [...new Set([...compositions.flatMap((composition) => composition.credits.map((credit) => credit.person)), ...tutorials.map((tutorial) => tutorial.teacher)])]
  .sort()
  .map((name, index) => ({ id: `person-${index + 1}`, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), name }));

export const ragaBySlug = (slug: string) => ragas.find((item) => item.slug === slug && item.state === "published");
export const compositionBySlug = (slug: string) => compositions.find((item) => item.slug === slug && item.state === "published");
export const personBySlug = (slug: string) => people.find((person) => person.slug === slug);

export function buildSearchItems(): SearchItem[] {
  const ragaItems: SearchItem[] = ragas.filter((r) => r.state === "published").map((r) => ({
    id: r.id, slug: r.slug, type: "raga", title: r.name, subtitle: { en: `${r.system} raga · ${r.arohana}`, ml: `${r.system} രാഗം · ${r.arohana}` },
    aliases: r.aliases, raga: r.slug, mediaKinds: [], href: `/ragas/${r.slug}`
  }));
  const compositionItems: SearchItem[] = compositions.filter((c) => c.state === "published").map((c) => ({
    id: c.id, slug: c.slug, type: "composition", title: c.title,
    subtitle: { en: `${ragaBySlug(c.raga)?.name.en || c.raga} · ${c.credits[0]?.person || "Unknown"}`, ml: `${ragaBySlug(c.raga)?.name.ml || c.raga} · ${c.credits[0]?.person || ""}` },
    aliases: [...c.aliases, ...c.credits.map((credit) => credit.person)], raga: c.raga, language: c.language, year: c.year,
    mediaKinds: c.recordings.flatMap((recording) => recording.media.map((media) => media.kind)), href: `/songs/${c.slug}`
  }));
  const tutorialItems: SearchItem[] = tutorials.filter((t) => t.state === "published").map((t) => ({
    id: t.id, slug: t.slug, type: "tutorial", title: t.title, subtitle: { en: `${t.instrument} · ${t.teacher}`, ml: `${t.instrument} · ${t.teacher}` },
    aliases: [t.teacher, t.instrument], raga: t.raga, language: t.language, mediaKinds: ["tutorial"], instrument: t.instrument, level: t.level, href: t.media.url
  }));
  const personItems: SearchItem[] = people.map((person) => {
    const credits = compositions.flatMap((composition) => composition.credits.filter((credit) => credit.person === person.name));
    const roles = [...new Set(credits.map((credit) => credit.role))];
    return { id: person.id, slug: person.slug, type: "person", title: { en: person.name, ml: person.name }, subtitle: { en: `${roles.join(" · ") || "teacher"} · ${credits.length || tutorials.filter((tutorial) => tutorial.teacher === person.name).length} catalog credit(s)`, ml: `${roles.join(" · ") || "teacher"}` }, aliases: [person.name], mediaKinds: [], href: `/people/${person.slug}` };
  });
  return [...ragaItems, ...compositionItems, ...tutorialItems, ...personItems];
}
