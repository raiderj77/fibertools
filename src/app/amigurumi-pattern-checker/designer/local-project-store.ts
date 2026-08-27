"use client";

const DATABASE_NAME = "fibertools-stitchproof";
const DATABASE_VERSION = 1;
const STORE_NAME = "designer-projects";
export const LOCAL_PROJECT_ID = "current-designer-project";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Browser-local saving is not available in this browser."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("The local project database could not be opened."));
  });
}

export async function saveLocalProject(project: unknown): Promise<void> {
  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({
        id: LOCAL_PROJECT_ID,
        savedAt: new Date().toISOString(),
        project,
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("The project could not be saved locally."));
      transaction.onabort = () => reject(transaction.error ?? new Error("The local save was cancelled."));
    });
  } finally {
    database.close();
  }
}

export async function loadLocalProject(): Promise<unknown | null> {
  const database = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(LOCAL_PROJECT_ID);
      request.onsuccess = () => resolve(request.result?.project ?? null);
      request.onerror = () => reject(request.error ?? new Error("The local project could not be restored."));
    });
  } finally {
    database.close();
  }
}

export async function deleteLocalProject(): Promise<void> {
  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(LOCAL_PROJECT_ID);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("The local project could not be deleted."));
      transaction.onabort = () => reject(transaction.error ?? new Error("The local deletion was cancelled."));
    });
  } finally {
    database.close();
  }
}
