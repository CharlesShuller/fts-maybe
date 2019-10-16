/**
 * Main module for the Maybe type.
 *
 * Copyright 2019 Charles Shuller
 *
 * This file is part of fs-maybe.
 *
 * fs-maybe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * fs-maybe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with fs-maybe.  If not, see <https://www.gnu.org/licenses/>.
 *
 */



/**
 * Type used to define a Maybe.  A Maybe is a _Just or _Nothing, but
 * those classes should not be used directly, instead use the factory
 * methods Just and Nothing.
 *
 * @typeparam V This is the value type of the Maybe
 */
export type Maybe<V> = _Just<V> | _Nothing<V>;



/**
 * Just a few type aliases, since the generic syntax is sometimes irritating
 * and long.
*/
export type MaybeString = Maybe<string>;
export type MaybeNumber = Maybe<number>;
export type MaybeObject = Maybe<object>;
export type MaybeBoolean = Maybe<boolean>;
export type MaybeBool = Maybe<boolean>;
export type MaybeAny = Maybe<any>;
export type MaybeSymbol = Maybe<symbol>;


/**
 * BindFunctions are used for "Binding" a function to a maybe, it's essentially
 * a form of function composition.  The terminology is borrowed from Haskell
 * where it is written as ">>=".
 *
 * Here, it is used to describe a function we pass to "bind" or "then"
 * functions.
 *
 * @typeparam Vi This is the input type, the type of the value of the maybe.
 * @typeparam Vo This is the output type, the type of the value of the
 *               resultant maybe.
 *
 * @param value This is the value of the maybe bind is called against.  Bind
 *              Functions are not called when the maybe is a Nothing.
 */
export type BindFunction<Vi, Vo> = (value: Vi) => Maybe<Vo>;



/**
 * This class represents a "Just" value.  Do not construct it directly, instead
 * use the Just function.
 *
 * @typeparam V This is the type of the value of the Maybe.
 */
class _Just<V> {
    readonly kind = "Just";
    constructor(readonly value: V) {}

    bind<Vo>(bindFun: BindFunction<V, Vo>): Maybe<Vo> {
        return bind(Just<V>(this.value), bindFun);
    }

    then<Vo>(bindFun: BindFunction<V, Vo>): Maybe<Vo> {
        return this.bind(bindFun);
    }
}


/**
 * This class represents a "Nothing" value.  Do not construct it directly,
 * instead use the Nothing function.
 *
 * @typeparam V This is the type of the value of the Maybe.  It is present on
 *              Nothings to avoid excessive type castings (from Nothing to
 *              Maybe<V>) but it does occasionally require an explicit type
 *              parameter to be passed.  I.e. Nothing<number>() instead of
 *              Nothing()
 */
class _Nothing<V> {
    readonly kind = "Nothing";
    constructor() {}

    bind<Vo>(bindFun: BindFunction<V, Vo>): Maybe<Vo> {
        return bind(Nothing<V>(), bindFun);
    }

    then<Vo>(bindFun: BindFunction<V, Vo>): Maybe<Vo> {
        return this.bind(bindFun);
    }
}

export function Just<V>(value: V): Maybe<V> {
    return new _Just<V>(value);
}

export function Nothing<V>(): Maybe<V> {
    return new _Nothing<V>();
}

export function isJust<V>(maybe: Maybe<V>): boolean {
    return maybe.kind === "Just";
}

export function isNothing<V>(maybe: Maybe<V>): boolean {
    return maybe.kind === "Nothing";
}

export function fromNullable<V>(nullable: any): Maybe<V> {
    if(nullable === null || nullable === undefined) {
        return Nothing<V>();
    } else {
        return Just<V>(nullable);
    }
}


export function fromJust<V>(just: Maybe<V>) {
    switch(just.kind) {
        case "Just": {
            return just.value;
        }
        case "Nothing": {
            throw new Error("argument to fromJust was a Maybe.Nothing");
        }
    }
}


export function fromMaybe<V>(maybe: Maybe<V>, defaultValue: V): V {
    switch(maybe.kind) {
        case "Just": {
            return maybe.value;
        }
        case "Nothing": {
            return defaultValue
        }
    }
}

export function bind<Vi, Vo>(maybe: Maybe<Vi>, bindFun: BindFunction<Vi, Vo>): Maybe<Vo> {
    switch(maybe.kind) {
        case "Just": {
            return bindFun(maybe.value);
        }
        case "Nothing": {
            return Nothing();
        }
    }
}
