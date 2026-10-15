// Runs the translation models off the main thread so the page stays responsive.
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';

env.allowLocalModels = false;
env.useBrowserCache = true;   // model files are kept in Cache Storage → works offline afterwards

const pipes = new Map();      // model id -> Promise<pipeline>

function load(model, dtype) {
  if (!pipes.has(model)) {
    const files = {};
    const p = pipeline('translation', model, {
      dtype,
      device: 'wasm',
      progress_callback: e => {
        if (e.status === 'progress' && e.total) {
          files[e.file] = [e.loaded, e.total];
          let loaded = 0, total = 0;
          for (const [l, t] of Object.values(files)) { loaded += l; total += t; }
          self.postMessage({ type: 'progress', model, loaded, total });
        }
      },
    });
    p.catch(() => pipes.delete(model));
    pipes.set(model, p);
  }
  return pipes.get(model);
}

self.onmessage = async ({ data }) => {
  const { id, type, model, dtype } = data;
  try {
    const translator = await load(model, dtype);
    if (type === 'load') return self.postMessage({ id, type: 'done' });
    const out = await translator(data.texts, { max_new_tokens: 400, num_beams: 1, ...(data.opts || {}) });
    self.postMessage({ id, type: 'done', texts: out.map(o => o.translation_text) });
  } catch (e) {
    self.postMessage({ id, type: 'error', message: String(e && e.message || e) });
  }
};
