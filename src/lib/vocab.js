import { db } from './firebase.js';
import { ref, push, onValue, update, remove } from 'firebase/database';

const VOCAB_REF = 'vocabulary';

/** CREATE — push a new word */
export function addWord(data) {
  return push(ref(db, VOCAB_REF), {
    kata: data.kata,
    arti: data.arti,
    pelafalan: data.pelafalan || '',
    contoh: data.contoh || '',
    kategori: data.kategori,
    createdAt: Date.now()
  });
}

/** READ — subscribe to real-time updates, calls callback with array */
export function subscribeWords(callback) {
  const vocabRef = ref(db, VOCAB_REF);
  return onValue(vocabRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return callback([]);
    const words = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    // newest first
    words.sort((a, b) => b.createdAt - a.createdAt);
    callback(words);
  });
}

/** UPDATE — update an existing word by id */
export function updateWord(id, data) {
  return update(ref(db, `${VOCAB_REF}/${id}`), {
    kata: data.kata,
    arti: data.arti,
    pelafalan: data.pelafalan || '',
    contoh: data.contoh || '',
    kategori: data.kategori
  });
}

/** DELETE — remove a word by id */
export function deleteWord(id) {
  return remove(ref(db, `${VOCAB_REF}/${id}`));
}
