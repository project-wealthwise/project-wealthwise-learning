import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc as firebaseGetDoc, getDocs, getFirestore, setDoc as firebaseSetDoc, updateDoc as firebaseUpdateDoc } from 'firebase/firestore';
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
    data: Record<string, unknown>,
    exists: boolean,
    collections?: Collection[]
};

type Collection = {
    id: string,
    docs: Document[]
};

type DBCache = { [id: string]: Collection };
type DBPath = [string, ...string[]];

export class DBManager {
    #cache: DBCache = {};

    async #getDoc(path: DBPath): Promise<Document> {
        const _doc = await firebaseGetDoc(doc(db, ...path));
        return {
            id: _doc.id,
            data: (_doc.data() ?? {}) as Record<string, unknown>,
            exists: _doc.exists()
        };
    }

    async #getCollection(path: DBPath): Promise<Collection> {
        const _docs = await getDocs(collection(db, ...path));
        const docs: Document[] = [];
        _docs.forEach((d) => {
            docs.push({
                id: d.id,
                data: d.data() as Record<string, unknown>,
                exists: true
            });
        });

        return {
            id: path[path.length - 1],
            docs
        };
    }

    #getCachedDoc(path: DBPath): Document | undefined {
        let cachedCollection = this.#cache[path[0]];

        for (let index = 1; index < path.length; index += 2) {
            const docId = path[index];
            const cachedDoc = cachedCollection?.docs.find((item) => item.id === docId);

            if (!cachedDoc)
                return undefined;

            if (index === path.length - 1)
                return cachedDoc;

            const collectionId = path[index + 1];
            const childCollection = cachedDoc.collections?.find((item) => item.id === collectionId);
            if (!childCollection)
                return undefined;
            cachedCollection = childCollection;
        }

        return undefined;
    }

    #setCachedDoc(path: DBPath, data: Record<string, unknown>, exists = true): void {
        if (path.length % 2 !== 0) 
            return;
        

        let cachedCollection = this.#cache[path[0]];
        if (!cachedCollection) {
            cachedCollection = { id: path[0], docs: [] };
            this.#cache[path[0]] = cachedCollection;
        }

        for (let index = 1; index < path.length; index += 2) {
            const docId = path[index];
            let cachedDoc = cachedCollection.docs.find((item) => item.id === docId);

            if (!cachedDoc) {
                cachedDoc = { id: docId, data: {}, exists };
                cachedCollection.docs.push(cachedDoc);
            }

            if (index === path.length - 1) {
                cachedDoc.data = data;
                cachedDoc.exists = exists;
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

    #getCachedCollection(path: DBPath): Collection | undefined {
        let cachedCollection = this.#cache[path[0]];
        if (path.length === 1)
            return cachedCollection;

        for (let index = 1; index < path.length; index += 2) {
            const cachedDoc = cachedCollection?.docs.find((item) => item.id === path[index]);
            if (!cachedDoc)
                return undefined;
            const childCollection = cachedDoc.collections?.find((item) => item.id === path[index + 1]);
            if (!childCollection)
                return undefined;
            cachedCollection = childCollection;
        }
        return cachedCollection;
    }

    #setCachedCollection(path: DBPath, value: Collection): void {
        if (path.length === 1) {
            this.#cache[path[0]] = value;
            return;
        }

        const parentDoc = this.#setCachedDoc(
            path.slice(0, -1) as DBPath,
            {},
            true
        );
        void parentDoc;
        let cachedCollection = this.#cache[path[0]];
        for (let index = 1; index < path.length - 1; index += 2) {
            const cachedDoc = cachedCollection.docs.find((item) => item.id === path[index])!;
            const collectionId = path[index + 1];
            let childCollection = cachedDoc.collections?.find((item) => item.id === collectionId);
            if (!childCollection) {
                childCollection = { id: collectionId, docs: [] };
                cachedDoc.collections ??= [];
                cachedDoc.collections.push(childCollection);
            }
            cachedCollection = childCollection;
        }
        const collectionId = path[path.length - 1];
        const existingIndex = cachedCollection.docs.findIndex((item) => item.id === collectionId);
        // The loop above ends at the collection's parent document; attach the fetched collection there.
        const parentPath = path.slice(0, -1);
        let parentCollection = this.#cache[parentPath[0]];
        for (let index = 1; index < parentPath.length; index += 2) {
            const parent = parentCollection.docs.find((item) => item.id === parentPath[index]);
            if (!parent)
                return;
            if (index === parentPath.length - 1) {
                parent.collections ??= [];
                const childIndex = parent.collections.findIndex((item) => item.id === collectionId);
                if (childIndex >= 0)
                    parent.collections[childIndex] = value;
                else
                    parent.collections.push(value);
                return;
            }
            parentCollection = parent.collections?.find((item) => item.id === parentPath[index + 1])!;
            index++;
        }
        void existingIndex;
    }

    async getDoc(path: DBPath): Promise<Document> {
        if (path.length % 2 !== 0)
            throw new Error('Document paths must have an even number of segments.');
        const cached = this.#getCachedDoc(path);
        if (cached)
            return {...cached};
        const fetched = await this.#getDoc(path);
        this.#setCachedDoc(path, fetched.data, fetched.exists);
        return fetched;
    }

    async getCollection(path: DBPath): Promise<Collection> {
        if (path.length % 2 !== 1)
            throw new Error('Collection paths must have an odd number of segments.');
        const cached = this.#getCachedCollection(path);
        if (cached)
            return {...cached};
        const fetched = await this.#getCollection(path);
        this.#setCachedCollection(path, fetched);
        return fetched;
    }

    async setDoc(path: DBPath, data: Record<string, unknown>): Promise<void> {
        if (path.length % 2 !== 0)
            throw new Error('Document paths must have an even number of segments.');
        await firebaseSetDoc(doc(db, ...path), data);
        this.#setCachedDoc(path, data);
    }

    async updateDoc(path: DBPath, data: Record<string, unknown>): Promise<void> {
        if (path.length % 2 !== 0)
            throw new Error('Document paths must have an even number of segments.');
        await firebaseUpdateDoc(doc(db, ...path), data);
        const current = this.#getCachedDoc(path) ?? await this.#getDoc(path);
        this.#setCachedDoc(path, { ...current.data, ...data }, true);
    }
}

export const dbManager = new DBManager();

export function autoId() {
    return uuidv4();
}

export const collections = ['subjects', 'users']; // must be manually updated