'use strict';
/* =========================================================
   Word extraction + dictionary forms (lemmas), fully offline.
   English / Spanish / French: form → lemma lists from michmech/lemmatization-lists (ODbL).
   Turkish: root dictionary from Zemberek (Apache 2.0) + a small suffix grammar.
   Data files are fetched once and kept by the service worker.
   ========================================================= */
const WordTools = (() => {
  const LEMMA_URL = {
    en: 'https://cdn.jsdelivr.net/gh/michmech/lemmatization-lists@943c9d5f04ed714d9a76970fdb00437e94bb9afb/lemmatization-en.txt',
    es: 'https://cdn.jsdelivr.net/gh/michmech/lemmatization-lists@943c9d5f04ed714d9a76970fdb00437e94bb9afb/lemmatization-es.txt',
    fr: 'https://cdn.jsdelivr.net/gh/michmech/lemmatization-lists@943c9d5f04ed714d9a76970fdb00437e94bb9afb/lemmatization-fr.txt',
    tr: 'https://cdn.jsdelivr.net/gh/ahmetaa/zemberek-nlp@037202c7e18b977c95181a76db05cb1e95846554/morphology/src/main/resources/tr/master-dictionary.dict',
  };
  const SIZE_MB = { en: 1, es: 11, fr: 5, tr: 0.4 };

  // Very common words that make poor flashcards.
  const STOP = {
    en: 'the a an and or but of to in on at for with by from is are was were be been being am i you he she it we they me him her us them my your his its our their mine yours this that these those do does did done not no yes so if as than then there here what which who whom whose how when where why can will would should could shall may might must have has had just very too also all any some me myself',
    tr: 've ile bir bu şu o da de mi mı mu mü misin mısın musun müsün miyim mıyım ne ki ama fakat çok daha en için gibi kadar ben sen biz siz onlar beni seni bizi sizi onları bana sana bize size onlara benim senin onun bizim sizin onların bunu şunu onu ona buna şuna her hiç ya veya ise değil evet hayır şey',
    es: 'el la los las un una unos unas y e o u pero de del a al en con por para que qué es son era fue ser yo tú tu él ella nosotros vosotros ellos ellas me te se nos os le les lo mi mis tus su sus no sí si muy más ya también como cuando donde este esta esto estos estas ese esa eso esos esas hay',
    fr: 'le la les l un une des et ou mais de du d à au aux en dans sur pour par avec que qu qui est sont était être je j tu il elle nous vous ils elles me m te t se s lui leur leurs ce c cet cette ces mon ma mes ton ta tes son sa ses notre nos votre vos ne n pas plus très aussi comme quand où y on',
  };
  const stop = Object.fromEntries(Object.entries(STOP).map(([k, v]) => [k, new Set(v.split(' '))]));

  const lower = (s, lang) => s.toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en');

  /* ---------- data loading ---------- */
  const loaded = {};
  function load(lang, onStatus) {
    if (!loaded[lang]) {
      loaded[lang] = (async () => {
        if (onStatus) onStatus(`Loading ${lang.toUpperCase()} dictionary (once, ≈ ${SIZE_MB[lang]} MB)…`);
        const r = await fetch(LEMMA_URL[lang]);
        if (!r.ok) throw new Error('dictionary HTTP ' + r.status);
        const text = (await r.text()).replace(/^﻿/, '');
        return lang === 'tr' ? buildTurkish(text) : buildList(text);
      })();
      loaded[lang].catch(() => delete loaded[lang]);
    }
    return loaded[lang];
  }

  function buildList(text) {
    const map = new Map(), lemmas = new Set();
    for (const line of text.split(/\r?\n/)) {
      const tab = line.indexOf('\t'); if (tab < 1) continue;
      const lemma = line.slice(0, tab).toLowerCase(), form = line.slice(tab + 1).toLowerCase();
      lemmas.add(lemma);
      if (!map.has(form)) map.set(form, lemma);
    }
    // A word that is a dictionary entry itself stays as is ("evening" is not "even").
    return { lemma: w => lemmas.has(w) ? w : map.get(w) || w };
  }

  /* ---------- Turkish ---------- */
  function buildTurkish(text) {
    const nouns = new Set(), verbs = new Set();
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim(); if (!line || line.includes('P:Punc')) continue;
      const w = line.split(' [')[0].trim().toLocaleLowerCase('tr');
      if (!w || w.includes(' ')) continue;
      if (/m[ae]k$/.test(w) && w.length > 4 && !line.includes('P:Noun')) verbs.add(w.slice(0, -3)); else nouns.add(w);
    }
    return { lemma: w => turkishLemma(w, nouns, verbs) };
  }

  // Suffix inventory (A = a/e, I = ı/i/u/ü). An ending is valid if it splits fully into these.
  const V4 = ['ı', 'i', 'u', 'ü'], V2 = ['a', 'e'];
  const expand = t => {
    let out = [t];
    if (t.includes('I')) out = out.flatMap(s => V4.map(v => s.replace('I', v)));
    if (t.includes('A')) out = out.flatMap(s => V2.map(v => s.replace('A', v)));
    return out.flatMap(s => s.includes('I') || s.includes('A') ? expand(s) : [s]);
  };
  const SUFFIX = new Set([
    'lAr', 'I', 'A', 'yA', 'yI', 'dA', 'tA', 'dAn', 'tAn', 'ndA', 'ndAn', 'In', 'nIn', 'm', 'Im', 'n', 'sI', 'mIz', 'ImIz', 'nIz', 'InIz', 'lA', 'ylA',
    'cA', 'çA', 'ki', 'lI', 'sIz', 'lIk', 'cI', 'çI', 'dI', 'tI', 'mIş', 'yor', 'Iyor', 'AcAk', 'yAcAk', 'AcAğ', 'yAcAğ', 'Iz', 'sIn', 'k', 'lIm',
    'AlIm', 'yAlIm', 'mA', 'mAz', 'mAk', 'mAlI', 'Abil', 'yAbil', 'Ar', 'Ir', 'r', 'sA', 'ysA', 'ken', 'yken', 'dIr', 'tIr', 'Ip', 'yIp', 'ArAk',
    'yArAk', 'IncA', 'yIncA', 'An', 'yAn', 'dIk', 'tIk', 'dIğ', 'tIğ', 'Il', 'Iş', 't', 'mI', 'nI', 'nA', 'y', 'yIm', 'yIz', 'sInIz', 'ğ', 'lArI', 'mAm',
  ].flatMap(expand));
  const memo = new Map();
  function parses(r) {
    if (r === '') return true;
    if (memo.has(r)) return memo.get(r);
    let ok = false;
    for (let k = 1; k <= Math.min(8, r.length) && !ok; k++) if (SUFFIX.has(r.slice(0, k)) && parses(r.slice(k))) ok = true;
    memo.set(r, ok);
    return ok;
  }
  const STRONG_V = /^y?([ıiuü]?yor|[ae]?c[ae][kğ]|m[ıiuü]ş|[ae]l[ıi]m|m[ae]l[ıi]|[ae]?b[ıi]l|[ae]r[ae]k|[ae]y[ıi]m|m[ae]y)/;
  const VERB_START = /^y?([dt][ıiuü]|m[ae]|s[ae]|[ıiuü]p|[aeıiuü]r|r|y?[ae]n|[ıiuü]n[ıiuü]z)/;
  const NOUN_STRONG = /^l[ae]r/;
  const NOUN_START = /^([aeıiuü]|y[aeıiuü]|[dt][ae]|n[ıiuü]n|n[ae]|l[aeıiuü]|s[ıiuü]|[cç][ae]|m[ıiuü]z)/;
  const SOFT = { b: 'p', c: 'ç', d: 't', 'ğ': 'k', g: 'k' };
  const infinitive = r => r + (/[aıou][^aeıioöuü]*$/.test(r) ? 'mak' : 'mek');

  function turkishLemma(w, nouns, verbs) {
    if (nouns.has(w)) return w;
    if (verbs.has(w)) return infinitive(w);
    // Try every root + ending split; the ending's type decides between noun and verb readings.
    let best = null;
    const consider = (lemma, score, len) => { if (!best || score > best.score || (score === best.score && len > best.len)) best = { lemma, score, len }; };
    for (let i = w.length - 1; i >= 2; i--) {
      const p = w.slice(0, i), rest = w.slice(i);
      if (!parses(rest)) continue;
      const vowelNext = /^[aeıioöuü]/.test(rest);
      const alts = [[p, 0]];
      const last = p.at(-1);
      if (SOFT[last]) alts.push([p.slice(0, -1) + SOFT[last], vowelNext ? 0 : 0.5]);                                         // kitab+ı → kitap
      if (V4.includes(last) && rest.startsWith('yor')) alts.push([p.slice(0, -1) + 'a', 0.5], [p.slice(0, -1) + 'e', 0.5]);   // isti+yor → iste
      const vs = 3 + (STRONG_V.test(rest) ? 1 : VERB_START.test(rest) ? 0.5 : 0);
      const ns = 3 + (NOUN_STRONG.test(rest) ? 1 : NOUN_START.test(rest) ? 0.5 : 0);
      for (const [a, pen] of alts) {
        if (verbs.has(a)) consider(infinitive(a), vs - pen, i);
        if (nouns.has(a)) consider(a, ns - pen, i);
      }
    }
    if (best) return best.lemma;
    for (let i = 3; i < w.length; i++) if (parses(w.slice(i))) return w.slice(0, i);   // unknown word: strip its endings
    return w;
  }

  /* ---------- public ---------- */
  // Words worth learning from a text: [{word (as written), lemma, sentence}], unique by lemma.
  async function extract(text, lang, onStatus) {
    const dict = await load(lang, onStatus);
    const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(lang, { granularity: 'sentence' }) : null;
    const sentences = text.split('\n').flatMap(line => seg ? [...seg.segment(line)].map(s => s.segment.trim()) : [line.trim()]).filter(Boolean);
    const out = new Map();
    for (const sentence of sentences) {
      const tokens = sentence.match(/\p{L}+(?:['’]\p{L}+)*/gu) || [];
      tokens.forEach((tok, idx) => {
        // Names: capitalised words that do not start the sentence, and Turkish names with an apostrophe.
        if (idx > 0 && /^\p{Lu}/u.test(tok)) return;
        if (lang === 'tr' && /['’]/.test(tok)) return;
        let w = lower(tok, lang);
        if (lang === 'fr' || lang === 'en') { const parts = w.split(/['’]/); w = lang === 'fr' ? parts.at(-1) : parts[0]; }
        if (w.length < 2 || stop[lang].has(w)) return;
        const lemma = dict.lemma(w);
        if (lemma.length < 2 || stop[lang].has(lemma) || out.has(lemma)) return;
        out.set(lemma, { word: tok, lemma, sentence: sentence.length > 160 ? sentence.slice(0, 157) + '…' : sentence });
      });
    }
    return [...out.values()];
  }

  // Dictionary form of a short translated phrase (only single words are reduced).
  async function baseForm(text, lang) {
    let t = text.trim().replace(/^[¿¡"'«\s]+|[.!?;:,"'»\s]+$/g, '');
    if (!t) return t;
    if (/^\p{Lu}\p{Ll}/u.test(t) && !/\s/.test(t)) t = lower(t, lang);
    if (/\s/.test(t)) return t;
    try { return (await load(lang)).lemma(lower(t, lang)); } catch { return t; }
  }

  return { extract, baseForm, load, LEMMA_URL };
})();
