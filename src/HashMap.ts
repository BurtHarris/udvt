/*
 * [The "BSD license"]
 * Copyright (c) 2016 Burt Harris
 * All rights reserved.

 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:

 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 * derived from this software without specific prior written permission.

 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * @author Burt Harris
 */

import {HashedValueType, ValueType, JavaMap} from './Abstract';

// Module private variables - this seems weird, here's the thinking ...
//
// There is no need for thread safety in JavaScript, and briefly stashing key results
// of the _find() module private variables seems like less overhead than creating alternative
// like a new object each time _find() is called...
// 
// These values have limited stability, and are completely private to this module.
//
let _hash: number;
let _bucket: any[];
let _index: number;

export class HashMap<K extends HashedValueType, V extends ValueType> 
    implements Map<K, V>, JavaMap<K, V>
    {
    private _underlying: Map<number, HashMapEntry<K,V>[]>;
    private _count: number;
    private _hashWhenReadOnly: number = undefined;

    constructor(
        private _comparitor: EqualityComparator<K> = HashedValueTypeCompaitor.INSTANCE,
	    private _valueComparitor: EqualityComparator<V> = ObjectIdentityCompaitor.INSTANCE 
	    ) {
	    this.clear();
	}

    clear(): void {
        this._underlying = new Map<number, HashMapEntry<K, V>[]>() ;
        this._count = 0;
    }

    private _find(key: K): boolean {
        let result = false;
        _index = undefined;
		_hash = this._comparitor.hashCode(key);
        _bucket = this._underlying.get(_hash)

        const eq = this._comparitor.equals;

        if (_bucket !== undefined && _bucket !== null) {
            for (_index = 0; _index < _bucket.length; _index++) {
                if (eq(key, _bucket[_index].key)) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    delete(key: K): boolean {
        if (this._find(key)) {
            _bucket.copyWithin(_index, _index + 1);
            _bucket.length--
            this._count--;
            return true;
        }
		return false;
    }

    entries(): IterableIterator<[K, V]> {
        return new HashMapEntryIterable<K,V>(this._underlying.values());
    }

    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void {
        this._underlying.forEach(array =>
            array.forEach(entry =>
                callbackfn(entry.value, entry.key, this as Map<K, V>)));    
    }

    get(key: K): V {
        if (this._find(key)) {
            return _bucket[_index].value;
        } else {
            return undefined;
        }
    }

    has(key: K): boolean {
        return this._find(key);
    }

    keys(): IterableIterator<K> {
        return new HashMapKeyIterable(this._underlying.values())
    }

    set(key: K, value?: V): Map<K, V> {
        if (this._find(key)) {
            _bucket[_index].value = value;
        } else {
            if (_bucket === null || _bucket === undefined) {
                this._underlying.set(this._comparitor.hashCode(key),
                    _bucket = [new HashMapEntry(key, value)]);
            } else {
                _bucket.push(new HashMapEntry(key, value));
            }
            this._count++;
        }
        return this;
    }

    get size(): number {
        return this._count;
    };

    values(): IterableIterator<V> {
        return new HashMapValueIterable( this._underlying.values() );
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return new HashMapEntryIterable( this._underlying.values() );
    }

    [Symbol.toStringTag]: "Map";

    // For compatibility with Java's HashMap

    clone() {
        const result = new HashMap<K,V>(this._comparitor);
        result.putAll(this);
        return result;
    }

    containsKey(key: K): boolean {
        return this._find(key);
    }

    containsValue(value: V): boolean {
        for (let entries of this._underlying.values()) {
            for (let i = 0; i < entries.length; i++) {
                if (this._valueComparitor.equals(entries[i].value, value)) return true;
            }
        }
        return false;
    }

    entrySet(): Set<[K, V]> {
        throw unimplemented();  // Do we really want this?
    }

    equals(other: any): boolean {
        if (this === other) return true;
        if (other instanceof HashMap && this._comparitor === other._comparitor && this._valueComparitor == other._valueComparitor )
        {
            throw unimplemented();
        }
        return false;
    }

    hashCode(): number {
        if (this._hashWhenReadOnly === undefined) throw new Error("hashCode() of a non-immutable object is unstable")
        throw unimplemented();
    }

    isEmpty(): boolean {
        return this._count === 0;
    }

    keySet(): Set<K> {
        return new Set<K>(this.keys())
    }

    put(key: K, value: V): V {
        this.set(key, value);
        return value;
    }

    putAll(m: Map<K, V>): void {
		m.forEach((value, key) => this.set(key, value));
    };

    remove(key: K): V {
        let result: V = this.get(key);

        if (result != undefined) {
            _bucket.copyWithin(_index, _index + 1);
            this._count--;
        }
        return result;
    }

    toString(): string {
        return "{HashMap}"
    }
 }
 
export class HashMapEntry<K,V> {
    constructor(public key: K, public value: V) {}
    /**
     * @returns a shallow copy of a HashMapEntry
     */
    clone():  HashMapEntry<K,V> { 
        return new HashMapEntry<K,V>( this.key, this.value); 
    }
}

class HashMapEntryIterable<K,V> implements Iterator<[K,V]>, IterableIterator<[K,V]> {
    private _bucket: HashMapEntry<K,V>[];
    private _index: number;

    constructor( private _buckets : Iterator<HashMapEntry<K,V>[]> ){
        this._bucket = undefined;
        this._index = undefined;
    }


    [Symbol.iterator]() { return this }
    
  next():  IteratorResult<[K,V]> {
        while (true) {
            if (this._bucket) {
                const i = this._index++;
                if (i < this._bucket.length) {
                    let item = this._bucket[i];
                    return {done: false, value: [item.key, item.value] }
                }
            }
            this._index = 0
            let x = this._buckets.next();
            if (x.done) return {done: true, value: undefined};
            this._bucket = x.value;
            }
        }
    }

class HashMapKeyIterable<K,V> implements Iterator<K>, IterableIterator<K> {
    private _bucket: HashMapEntry<K,V>[];
    private _index: number;

    constructor( private _buckets : Iterator<HashMapEntry<K,V>[]> ){
        this._bucket = undefined;
        this._index = undefined;
    }

    [Symbol.iterator]() { return this }

    next():  IteratorResult<K> {
        while (true) {
            if (this._bucket) {
                const i = this._index++;
                if (i < this._bucket.length) {
                    let item = this._bucket[i];
                    return {done: false, value: item.key}
                }
            }
            this._index = 0
            let x = this._buckets.next();
            if (x.done) return {done: true, value: undefined};
            this._bucket = x.value;
            }
        }
    }

class HashMapValueIterable<K,V> implements Iterator<V>, IterableIterator<V> {
    private _bucket: HashMapEntry<K,V>[];
    private _index: number;

    constructor( private _buckets : Iterator<HashMapEntry<K,V>[]> ){
        this._bucket = undefined;
        this._index = undefined;
    }

    [Symbol.iterator]() { return this }

    next():  IteratorResult<V> {
        while (true) {
            if (this._bucket) {
                const i = this._index++;
                if (i < this._bucket.length) {
                    let item = this._bucket[i];
                    return {done: false, value: item.value}
                }
            }
            this._index = 0
            let x = this._buckets.next();
            if (x.done) return {done: true, value: undefined};
            this._bucket = x.value;
            }
        }
    }

/**
 * Custom Equality comparitors may be useful in defining collection-specific concepts of equality
 */
 
export interface EqualityComparator<T> {
	/**
	 * This method returns a hash code for the specified object.
	 *
	 * @param obj The object.
	 * @return The hash code for {@code obj}.
	 */
	hashCode(obj: T): number;

	/**
	 * This method tests if two objects are equal.
	 *
	 * @param a The first object to compare.
	 * @param b The second object to compare.
	 * @return {@code true} if {@code a} equals {@code b}, otherwise {@code false}.
	 */
	equals(a: T, b: any): boolean;
}

export class HashedValueTypeCompaitor<T extends HashedValueType> implements EqualityComparator<T> {
    static INSTANCE = new HashedValueTypeCompaitor();
    constructor() {};
	hashCode(obj: T) { return obj.hashCode(); }
    equals(a: T, b: any) { return a.equals(b); }
}

export class ObjectIdentityCompaitor<T> implements EqualityComparator<T> {
    static INSTANCE = new ObjectIdentityCompaitor();
    constructor() {};
	hashCode(obj: T): number { throw unimplemented(); }
    equals(a: T, b: any) { return a === b; }
}

function unimplemented() {
    return new Error("Not Implemented");
}
