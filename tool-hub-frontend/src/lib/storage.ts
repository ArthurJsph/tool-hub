/**
 * Storage utility - Uses sessionStorage by default for better security
 * Falls back gracefully if storage is not available (SSR, private mode, etc.)
 */

type StorageType = 'session' | 'local'

class StorageManager {
  private isAvailable(type: StorageType): boolean {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage
      const test = '__storage_test__'
      storage.setItem(test, test)
      storage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  private getStorage(type: StorageType): Storage | null {
    if (typeof window === 'undefined') return null
    return this.isAvailable(type) ? (type === 'session' ? sessionStorage : localStorage) : null
  }

  get(key: string, type: StorageType = 'session'): string | null {
    const storage = this.getStorage(type)
    if (!storage) return null
    
    try {
      return storage.getItem(key)
    } catch {
      return null
    }
  }

  set(key: string, value: string, type: StorageType = 'session'): void {
    const storage = this.getStorage(type)
    if (!storage) return
    
    try {
      storage.setItem(key, value)
    } catch (error) {
      console.warn(`Failed to set ${key} in ${type}Storage:`, error)
    }
  }

  remove(key: string, type: StorageType = 'session'): void {
    const storage = this.getStorage(type)
    if (!storage) return
    
    try {
      storage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from ${type}Storage:`, error)
    }
  }

  clear(type: StorageType = 'session'): void {
    const storage = this.getStorage(type)
    if (!storage) return
    
    try {
      storage.clear()
    } catch (error) {
      console.warn(`Failed to clear ${type}Storage:`, error)
    }
  }

  // JSON helpers
  getJSON<T>(key: string, type: StorageType = 'session'): T | null {
    const value = this.get(key, type)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  setJSON<T>(key: string, value: T, type: StorageType = 'session'): void {
    try {
      this.set(key, JSON.stringify(value), type)
    } catch (error) {
      console.warn(`Failed to stringify and set ${key}:`, error)
    }
  }
}

export const storage = new StorageManager()

// Storage keys constants
export const STORAGE_KEYS = {
  USER_CACHE: 'user_cache',
  FAVORITES: 'toolhub_favorites',
  HISTORY: 'toolhub_history',
  THEME: 'toolhub_theme',
} as const
