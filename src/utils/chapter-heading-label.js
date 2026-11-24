// Astro flattens KaTeX's MathML, TeX annotation, and visual text together.
// Use the authored math once for these labels and preserve the rendered IDs.
const mathLabels = {
  '/chapter-6/large-scale-training-stability': new Map([
    ['the-zzz-loss', 'The z-loss'],
    ['zzz-loss', 'z-loss'],
  ]),
  '/chapter-7/zero-redundancy-optimizer': new Map([
    ['stage-1-optimizer-state-partitioning-posp_ospos', 'Stage 1: Optimizer State Partitioning (P_{os})'],
    ['stage-2-gradient-partitioning-posgp_osgposg', 'Stage 2: Gradient Partitioning (P_{os+g})'],
    ['stage-3-parameter-partitioning-posgpp_osgpposgp', 'Stage 3: Parameter Partitioning (P_{os+g+p})'],
  ]),
  '/chapter-12/speculative-decoding': new Map([
    ['choosing-the-lookahead-length-kkk', 'Choosing the Lookahead Length K'],
    ['룩어헤드-길이-kkk-선택', '룩어헤드 길이 K 선택'],
  ]),
};

export function chapterHeadingLabel(route, heading) {
  return mathLabels[route]?.get(heading.slug) ?? heading.text;
}
