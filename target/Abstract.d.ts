/**
 * @author Burt Harris
 */
/**
 * An interface defining requirements to be treated as a value-type.   Equality of value types can be based on their contents, rather than object identity.
 */
export interface ValueType {
    /**
     * Compares values for "equality", a concept which may be object specific.
     */
    equals(other: any): boolean;
}
/**
 * An interface defining requirements making a class eligible for use as  a key in HashMap.
 */
export interface HashedValueType extends ValueType {
    /**
      * The hash code of an object used to speed key lookup.  If any object's hash code is undefined,
      * HashMap treats it as being inelegibel for use as a key in a hash map.
      */
    hashCode(): number;
}
/**
 * Java's concept of a HashMap has slightly different interface than JavaScript's Map.
 * The main difference is Java uses `put()` rather than JavaScripts `set()`.   They have
 *  different return types.
 */
export interface JavaMap<K extends HashedValueType, V extends ValueType> {
    clone(): JavaMap<K, V>;
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    entrySet(): Set<[K, V]>;
    equals(other: any): boolean;
    get(key: K): V;
    hashCode(): number;
    isEmpty(): boolean;
    keySet(): Set<K>;
    put(key: K, value: V): V;
    putAll(m: Map<K, V>): void;
    remove(key: K): V;
    toString(): string;
}
