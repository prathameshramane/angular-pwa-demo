import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class IndexDbService {
  private db: any;

  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<MyDBSchema>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore('user-store');
      }
    })
  }

  addUser(name: string) {
    return this.db.put('user-store', name, 'name');
  }

  deleteUser(key: string) {
    return this.db.delete('user-store', key)
  }

}

interface MyDBSchema extends DBSchema {
  'user-store': {
    'key': string,
    'value': string
  }
}
