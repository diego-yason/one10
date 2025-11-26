import { browser } from '$app/environment';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '$lib/services/firebase';
import type { CartItem } from '$types/Cart';
import { writable, get } from 'svelte/store';
import _ from 'lodash';
import type { LocalImageFile } from '$types/LocalImage';


export const photoprintStore = writable<LocalImageFile[]>([]);

let photoStatic: LocalImageFile[];
photoprintStore.subscribe((data) => (photoStatic = data));

let photoSyncUnsubscribe: () => void;

// TODO: Let photos be stored here

if (browser) photoprintStore.set(JSON.parse(localStorage.getItem('photoPrintCart') || '[]'))
if (browser) photoprintStore.subscribe((data) => localStorage.setItem('photoPrintCart', JSON.stringify(data)))

export function addPhoto(item: LocalImageFile) {
  photoprintStore.update((items) => {
    // Check if item is same file
    const idx = items.findIndex(
      (i) => i.id === item.id && _.isEqual(i.file, item.file)
    )

    // If same photo found, do nothing
    if (idx !== -1) {
      return [...items];
    }

    return [...items, item]
  })
}

export function removePhoto(index: number){
  photoprintStore.update((items) => {
    const newItems = items.slice();
    newItems.splice(index, 1);
    return newItems;
  })
}

export function updatePhoto(index: number, photo: LocalImageFile){
  photoprintStore.update((items) => {
    if (photo.file.size > 0) {
      items[index] = {...items[index], }
    } else {
      items.splice(index, 1)
    }
    return items
  })
}

export function clearPhotos() {
  photoprintStore.set([])
}

export function exportPhotos(){
  const currentArray = get(photoprintStore);

  return structuredClone(currentArray)
}