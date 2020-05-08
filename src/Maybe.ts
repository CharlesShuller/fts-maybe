/**
 * Main module for the Maybe type.
 *
 * Copyright 2019 Charles Shuller
 *
 * This file is part of fts-maybe.
 *
 * fts-maybe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * fts-maybe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with fts-maybe.  If not, see <https://www.gnu.org/licenses/>.
 *
 */


import { Monad, BindFunction, SequenceFunction, defaultThen } from 'fts-monad';
import { Functor, FmapFunction } from 'fts-functor';


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
export type MaybeError = Maybe<Error>;

export interface JustMatchFunction<Vi, Vo> {
    (value: Vi): Vo;
}

export interface NothingMatchFunction<Vi, Vo> {
    (): Vo;
}



/**
 * This class represents a "Just" value.  Do not construct it directly, instead
 * use the Just function.
 *
 * @typeparam V This is the type of the value of the Maybe.
 */
class _Just<V> implements Monad<V> {
    readonly kind = "Just";
    constructor(readonly value: V) {}

    fmap<Vo>( fmapFunction: FmapFunction<V, Vo> ): Maybe<Vo> {
        return Just( fmapFunction(this.value) );
    }

    bind<Vo>(bindFun: BindFunction<V, Vo>): Monad<Vo> {
        return bind(Just<V>(this.value), bindFun);
    }

    seq<Vo>(sequenceFunction: SequenceFunction<Vo>): Monad<Vo>{
        return sequenceFunction();
    }


    then<Vo>(
        bindOrSequenceFunction: BindFunction<V, Vo>
                              | SequenceFunction<Vo>
    ): Monad<Vo> {
        return defaultThen(this.value, bindOrSequenceFunction);
    }

    match<Vo>(
        justMatchFunction: JustMatchFunction<V, Vo>,
        nothingMatchFunction: NothingMatchFunction<V, Vo>
    ): Vo {
        return justMatchFunction(this.value);
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
class _Nothing<V> implements Monad<V> {
    readonly kind = "Nothing";
    constructor() {}

    fmap<Vo>( fmapFunction: FmapFunction<V, Vo> ): Maybe<Vo> {
        return Nothing<Vo>();
    }


    bind<Vo>(bindFun: BindFunction<V, Vo>): Monad<Vo> {
        return bind(Nothing<V>(), bindFun);
    }

    seq<Vo>(sequenceFunction: SequenceFunction<Vo>): Monad<Vo>{
        return sequenceFunction();
    }


    then<Vo>(
        bindOrSequenceFunction: BindFunction<V, Vo>
                              | SequenceFunction<Vo>
    ): Monad<Vo> {
        return bindOrSequenceFunction.length === 0 ?
            this.seq(bindOrSequenceFunction as SequenceFunction<Vo>) :
            this.bind(bindOrSequenceFunction as BindFunction<V, Vo>);
    }

    match<Vo>(
        justMatchFunction: JustMatchFunction<V, Vo>,
        nothingMatchFunction: NothingMatchFunction<V, Vo>
    ): Vo {
        return nothingMatchFunction();
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

export function bind<Vi, Vo>(maybe: Maybe<Vi>, bindFun: BindFunction<Vi, Vo>): Monad<Vo> {
    switch(maybe.kind) {
        case "Just": {
            return bindFun(maybe.value);
        }
        case "Nothing": {
            return Nothing();
        }
    }
}


export function unbox<Vi, Vo>(maybe: Maybe<Vi>,
                              justCallback: JustMatchFunction<Vi, Vo>,
                              nothingCallback: NothingMatchFunction<Vi, Vo>): Vo {
    switch(maybe.kind) {
        case "Just": {
            return justCallback(maybe.value);
        }
        case "Nothing": {
            return nothingCallback();
        }
    }
}
