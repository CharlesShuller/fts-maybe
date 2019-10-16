import * as Maybe from "../Maybe"

type MaybeNum = Maybe.Maybe<number>

test("Just can construct a value", () => {
    const just5: MaybeNum = Maybe.Just(5);

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

test("Nothing can construct a nothing", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    expect(nothing.kind).toBe("Nothing");
});

test("isJust returns true for just values", () => {
    const just5: MaybeNum = Maybe.Just(5);

    expect( Maybe.isJust(just5) ).toBe(true);
});


test("isJust returns false for Nothing values", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    expect( Maybe.isJust(nothing) ).toBe(false);
});


test("isNothing returns true for Nothing values", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    expect( Maybe.isNothing(nothing) ).toBe(true);
});


test("isNothing returns false for Just values", () => {
    const just5: MaybeNum = Maybe.Just(5);

    expect( Maybe.isNothing(just5) ).toBe(false);
});

test("fromNullable returns a Nothing for a null argument", () => {
    const nullable: number | null | undefined = null;

    const maybeNullable: MaybeNum = Maybe.fromNullable(nullable);

    expect(maybeNullable.kind).toBe("Nothing");
});

test("fromNullable returns a Nothing for an undefined argument", () => {
    const nullable: number | null | undefined = undefined;

    const maybeNullable: MaybeNum = Maybe.fromNullable(nullable);

    expect(maybeNullable.kind).toBe("Nothing");
});

test("fromNullable returns a Just for a non-null and non-undefined argument", () => {
    const nullable: number | null | undefined = 5;

    const maybeNullable: MaybeNum = Maybe.fromNullable(nullable);

    switch(maybeNullable.kind) {
        case "Just": {
            expect(maybeNullable.value).toBe(5);
            break;
        }
        case "Nothing": {
            expect(maybeNullable.kind).toBe("Just");
            break;
        }
    }
});


test("fromJust returns the value of a just", () => {
    const just5 = Maybe.Just(5);

    expect( Maybe.fromJust(just5) ).toBe(5);
});


test("fromJust throws an exception if argument is a nothing", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    expect( () => Maybe.fromJust(nothing) ).toThrow(Error);
});


test("fromMaybe returns the value of a just", () => {
    const just5 = Maybe.Just(5);

    expect( Maybe.fromMaybe(just5, 12) ).toBe(5);
});


test("fromMaybe returns the default value if the maybe arg is Nothing", () => {
    const nothing: MaybeNum = Maybe.Nothing();

    expect( Maybe.fromMaybe(nothing, 12) ).toBe(12);
});
