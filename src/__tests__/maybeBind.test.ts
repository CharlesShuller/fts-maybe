/*
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
*/

import * as Maybe from "../Maybe"

type MaybeNum = Maybe.Maybe<number>

test("Binding Just with a func yeilds a Just", () => {
    const just5: MaybeNum = Maybe.Just(5);
    const just12: MaybeNum = Maybe.bind( just5,
                                         (val: number) => {
                                             return Maybe.Just(val + 7)
                                         });

    switch(just12.kind) {
        case "Just": {
            expect(just12.value).toBe(12);
            break;
        }
        case "Nothing": {
            expect(just5.kind).toBe("Just");
            break;
        }
    }
});


test("Binding Nothing with a func yields a Nothing", () => {
    const nothing: MaybeNum = Maybe.Nothing();
    const nothingRes: MaybeNum = Maybe.bind(nothing,
                                            (val: number) => {
                                                return Maybe.Just(val + 7);
                                            });

    expect(nothingRes.kind).toBe("Nothing");
});


test("Just.bind can be chained", () => {
    const just1: MaybeNum = Maybe.Just(1);
    const just5: MaybeNum = just1
        .bind( (val: number) => Maybe.Just(val + 1) )
        .bind( (val: number) => Maybe.Just(val + 1) )
        .bind( (val: number) => Maybe.Just(val + 1) )
        .bind( (val: number) => Maybe.Just(val + 1) );


    switch(just5.kind) {
        case "Just": {
            expect(just5.value).toBe(5);
            break;
        }
        case "Nothing": {
            expect(just5.kind).toBe("Just");
            break;
        }
    }
});


test("Nothing.bind can be chained", () => {
    const nothing: MaybeNum = Maybe.Nothing();
    const nothingRes: MaybeNum = nothing
        .bind( (val: number) => Maybe.Nothing<number>() )
        .bind( (val: number) => Maybe.Nothing<number>() )
        .bind( (val: number) => Maybe.Nothing<number>() )
        .bind( (val: number) => Maybe.Nothing<number>() );

    expect(nothingRes.kind).toBe("Nothing");
});



test("Nothing.bind can be chained with Just.bind to yeild Nothing", () => {
    const just1: MaybeNum = Maybe.Just(1);
    const nothingRes: MaybeNum = just1
        .bind( (val: number) => Maybe.Just(val + 1) )
        .bind( (val: number) => Maybe.Just(val + 1) )
        .bind( (val: number) => Maybe.Nothing<number>() )
        .bind( (val: number) => Maybe.Just(val + 1) );


    expect(nothingRes.kind).toBe("Nothing");
});



test("Nothing.then can be chained with Just.bind to yeild Nothing", () => {
    const just1: MaybeNum = Maybe.Just(1);
    const nothingRes: MaybeNum = just1
        .then( (val: number) => Maybe.Just(val + 1) )
        .then( (val: number) => Maybe.Just(val + 1) )
        .then( (val: number) => Maybe.Nothing<number>() )
        .then( (val: number) => Maybe.Just(val + 1) );


    expect(nothingRes.kind).toBe("Nothing");
});
