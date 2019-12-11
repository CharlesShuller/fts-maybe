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

test("A just value can be unboxed", () => {
    const just5: MaybeNum = Maybe.Just(5);

    const value5: number = Maybe.unbox(just5,
                                       (value) => value,
                                       () => 0);

    expect(value5).toBe(5);
});


test("A nothing value can be unboxed", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    const value0: number = Maybe.unbox(nothing,
                                       (value) => value,
                                       () => 0);

    expect(value0).toBe(0);
});


test("A nothing value can be the same type", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    const value0 = Maybe.unbox(nothing,
                               (value) => value,
                               () => 0);

    expect(value0).toBe(0);
});


test("A nothing value can be a different type", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    const noValue = Maybe.unbox<number, number | string>(nothing,
                                                         (value: number) => value,
                                                         () => "No value returned");

    expect(noValue).toBe("No value returned");
});
