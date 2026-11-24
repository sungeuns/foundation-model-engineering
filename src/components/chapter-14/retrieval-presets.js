// Order follows the four authored query translations in lexical-dense.mjs.
export const retrievalFragments = ['lexical-paraphrase', 'lexical-identifier', 'lexical-product-code', 'lexical-book'];
export const productCodeFragment = 'lexical-product-code';

export function retrievalFragment(hash) {
  if (!hash.startsWith('#')) return undefined;
  try {
    const id = decodeURIComponent(hash.slice(1));
    return retrievalFragments.includes(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

export function retrievalQuery(presets, hash) {
  const fragment = retrievalFragment(hash) ?? productCodeFragment;
  return presets[retrievalFragments.indexOf(fragment)];
}
