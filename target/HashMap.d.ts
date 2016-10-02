/**
 * @author Burt Harris
 */
import { HashedValueType, ValueType, JavaMap } from './Abstract';
export declare class HashMap<K extends HashedValueType, V extends ValueType> implements Map<K, V>, JavaMap<K, V> {
    private _comparitor;
    private _valueComparitor;
    private _underlying;
    private _count;
    private _hashWhenReadOnly;
    constructor(_comparitor?: EqualityComparator<K>, _valueComparitor?: EqualityComparator<V>);
    clear(): void;
    private _find(key);
    delete(key: K): boolean;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value?: V): Map<K, V>;
    size: number;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    [Symbol.toStringTag]: "Map";
    clone(): HashMap<K, V>;
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    entrySet(): Set<[K, V]>;
    equals(other: any): boolean;
    hashCode(): number;
    isEmpty(): boolean;
    keySet(): Set<K>;
    put(key: K, value: V): V;
    putAll(m: Map<K, V>): void;
    remove(key: K): V;
    toString(): string;
}
export declare class HashMapEntry<K, V> {
    key: K;
    value: V;
    constructor(key: K, value: V);
    /**
     * @returns a shallow copy of a HashMapEntry
     */
    clone(): HashMapEntry<K, V>;
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
export declare class HashedValueTypeCompaitor<T extends HashedValueType> implements EqualityComparator<T> {
    static INSTANCE: HashedValueTypeCompaitor<HashedValueType>;
    constructor();
    hashCode(obj: T): number;
    equals(a: T, b: any): boolean;
}
export declare class ObjectIdentityCompaitor<T> implements EqualityComparator<T> {
    static INSTANCE: ObjectIdentityCompaitor<{}>;
    constructor();
    hashCode(obj: T): number;
    equals(a: T, b: any): boolean;
}
