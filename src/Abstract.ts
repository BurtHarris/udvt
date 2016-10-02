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

