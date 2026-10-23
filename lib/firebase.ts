import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; 

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

type Document = {
    id: string,
    data: object,
    exists: boolean,
    collections?: Collection[]
};

const nullDoc: Document = {
    id: 'null',
    data: {},
    exists: false
};

type Collection = {
    id: string,
    docs: Document[]
};

const nullCollection = {
    id: 'null',
    docs: []
};

type DBCache = { [id: string]: Collection };
type DBPath = [string, ...string[]];

class DBManager {
    #cache: DBCache = {};

    constructor() {
        
    }

    async #getDoc(path: DBPath): Promise<Document> {
        const _doc = await getDoc(doc(db, ...path));
        return {
            id: _doc.id,
            data: _doc.data(),
            exists: true
        } as Document;
    }

    async #getCollection(path: DBPath): Promise<Collection> {
        const _docs = await getDocs(collection(db, ...path));
        const docs: Document[] = [];
        _docs.forEach((d) => {
            docs.push({
                id: d.id,
                data: d.data(),
                exists: true
            } as Document);
        });

        return {
            id: path.pop() ?? 'null',
            docs
        } as Collection;
    }

    async #setDoc(path: DBPath, data: object): Promise<void> {
        await setDoc(doc(db, ...path), data);
    }

    async #updateDoc(path: DBPath, data: object): Promise<void> {
        await updateDoc(doc(db, ...path), data);
    }

    #getCachedDoc(path: DBPath): Document | undefined {
        let cachedCollection = this.#cache[path[0]];

        for (let index = 1; index < path.length; index += 2) {
            const docId = path[index];
            const cachedDoc = cachedCollection?.docs.find((item) => item.id === docId);

            if (!cachedDoc) {
                return { id: docId, data: {}, exists: false };
            }

            if (index === path.length - 1) {
                return cachedDoc;
            }

            const collectionId = path[index + 1];
            cachedCollection = cachedDoc.collections?.find((item) => item.id === collectionId) ?? nullCollection;
        }

        return undefined;
    }

    #setCachedDoc(path: DBPath, data: object): void {
        if (path.length % 2 !== 0) {
            return;
        }

        let cachedCollection = this.#cache[path[0]];
        if (!cachedCollection) {
            cachedCollection = { id: path[0], docs: [] };
            this.#cache[path[0]] = cachedCollection;
        }

        for (let index = 1; index < path.length; index += 2) {
            const docId = path[index];
            let cachedDoc = cachedCollection.docs.find((item) => item.id === docId);

            if (!cachedDoc) {
                cachedDoc = { id: docId, data: {}, exists: false };
                cachedCollection.docs.push(cachedDoc);
            }

            if (index === path.length - 1) {
                cachedDoc.data = data;
                cachedDoc.exists = true;
                return;
            }

            const collectionId = path[index + 1];
            let childCollection = cachedDoc.collections?.find((item) => item.id === collectionId);
            if (!childCollection) {
                childCollection = { id: collectionId, docs: [] };
                cachedDoc.collections ??= [];
                cachedDoc.collections.push(childCollection);
            }
            cachedCollection = childCollection;
        }
    }

    async getDoc(path: DBPath): Promise<Document> {
        return this.#getCachedDoc(path) ?? this.#getDoc(path) ?? nullDoc;
    }

    async setDoc(path: DBPath, data: object) {
        this.#setDoc(path, data);
        this.#setCachedDoc(path, data);
    }

    async updateDoc(path: DBPath, data: object) {
        const d = await this.getDoc(path);
        for (const [k, v] of Object.entries(data)) {
            (d.data as Record<string, unknown>)[k] = v;
        }
        this.setDoc(path, d);
    }
}

export function autoId() {
    return uuidv4();
}