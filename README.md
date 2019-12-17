Maybe
===============================================================================
Maybe is a type used extensively in functional programming.  It's chief value
is to represent the return of functions which do not always return a value.

From a different perspective, we use maybe to avoid using sentinal values like
null and undefined.  This has the advantage of being more typesafe, and
allows for the compiler and programmer to detect a number of errors at run time.



Quickstart
-------------------------------------------------------------------------------
Install with:
```
npm install --save fts-maybe
```


Import with:
```
import * as Maybe from 'fts-maybe';
```


Know:  Maybes are either "Just" a value or "Nothing".

Create a maybe value:
```
//Alias the whole package
import * as Maybe from 'fts-maybe';

//Import some things we use a lot
import { MaybeNumber, Just, Nothing } from 'fts-maybe';


const justAValue: MaybeNumber = Just(5);
const nothing: MaybeNumber = Nothing();

const nothingFromNull: MaybeNumber = fromNullable( null );
const nothingFromUndefined: MaybeNumber = fromNullable( undefined );

const valueFromNullable: MaybeNumber = fromNullable(12);
```


Unbox a maybe value:
```
// Alias the whole package
import * as Maybe from 'fts-maybe';

// Import some things we use a lot
import { MaybeNumber, Just, Nothing } from 'fts-maybe';


const just5: MaybeNumber = Just(5);
const nothing: MaybeNumber = Nothing();


// value5 will be 5 after the assignment
const value5: number = Maybe.fromJust(just5);

// Maybe.fromJust will raise an exception when it's argument is a Nothing
// So it's best to use it only when you know, but the compiler doesn't, that
// the maybe really is a Just
const raisesException: number = Maybe.fromJust(nothing);


// value5 will be 5 after the assignment because the Maybe argument is a Just.
const value5: number = Maybe.fromMaybe(just5, 0);

// value0 will be 0 after the assignment because the Maybe argument is a Nothing.
const value0: number = Maybe.fromMaybe(nothing, 0);


// numberOrString will be "Maybe Was Nothing"
//
// The first argument is a Maybe
// The second argument is a callback that gets called when the Maybe is a Just
// The third argument is a callback that gets called when the Maybe is a Nothing
//
// All the type noise is because we can return different types, if the
// return value of both callbacks is the same type, type inference works much
// better.
const numberOrString: number | string =
    Maybe.unbox<number, number | string>(nothing,
                                         (value: number) => value,
                                         () => "Maybe Was Nothing")



// Canonical switch statement for uses not covered above
//
// This is the recomended way to handle types like Maybe in the typescript
// handbook and results in completeness checking at compile time, just make sure
// your function has a return type.
//
switch(just5.kind) {
    case "Just": {
       console.log("Justs have a value: " + just5.value);
       break;
    }
    case "Nothing": {
       console.log("Nothings have no value");
       break;
    }
}

// You can also use the following, but generally the compiler won't
// be able to tell if the Maybe is a Just or Nothing in later code,
// requiring some typecasting.
Maybe.isJust(just5); // true
Maybe.isNothing(just5); // false
```


Chaining Maybes together.   This is one of the most powerful things you
can do with a Maybe, letting you specify a long list of functions that
assume the maybe is a Just, and then you only have to worry about the Nothing
at the end.

The "then" callback accepts a value, and is only called when the previous
Maybe is a just.  It MUST return a Maybe, but not necissarily one of the
same type.

```
import * as Maybe from 'fts-maybe';

const maybeFound = find(someNumberArray, 12)
    .then( (val: number) => Maybe.Just(val + 32) )
    .then( (val: number) => find(someNumberArray, val) )
    .then( (val: number) => Maybe.Just(val - 2) );


// if maybeFound is Just, we print it's value
// if maybeFound is Nothing, we print 0
console.log( Maybe.fromMaybe(maybeFound, 0) );
```







Introduction to Using Maybe
-------------------------------------------------------------------------------
Most of our examples will center around a simple find function which returns
a Maybe.

```
import * as Maybe from 'fts-maybe';

function find(numArray: number[], val: number): Maybe.Maybe<number> {
    const foundNum = numArray.find( (element) => element === val );

    if(foundNum) {
       return Maybe.Just(foundNum);
   } else {
       return Maybe.Nothing();
   }
}
```

There are several ways we can make the above function nicer, but the above is
blindingly obvious so long as you know how Array.prototype.find works.  We'll
revisit the function with a bit nicer syntax later, but for now focus on how we
return a "Just" when the number is found, and a "Nothing" when the number is
not found.

Maybe is a union data type in typescript.  There are some other interesting
particulars about it's implementation, and the interested reader is encouraged
to review discriminated unions and algebraic data types.  Additionally, the
Advanced Types section of the typescript handbook is a nice resource as well.

For now, it is sufficient to know that any maybe is exactly one of "Just" a
value or "Nothing".  And that all Maybes have a "kind" property.


Here is a trivial example, where we may not find 12 in the array.  It
illustrates the basic switch statement used for converting Maybes into values
needed for later computation.  Make sure containing functions have a specified
return type for best results:

```
const maybeFound = find(someNumberArray, 12);

switch(maybeFound.kind) {
    case "Just": {
        console.log(maybeFound.value);
        break;
    }
    case "Nothing": {
        console.log("Could not find value");
        break;
    }
}
```


In the example above, the use of Maybe seems like a lot of overhead for not
a lot of benefit.   The real value of Maybe shows up a bit later, but first,
lets look at a couple of functions we can use on a maybe so we don't have to
deal with flow control at all


```
const maybeFound = find(someNumberArray, 12);

// When it makes sense to return a default value if we couldn't find the number
// we can do so with Maybe.fromMaybe.
//
// In the below statement, if maybeFound is a just, foundFromMaybe will
// be the value of that just (in this case 12).
//
// If maybeFound is a Nothing, the value of the second argument will
// be returned.  In this case, 0.
const foundFromMaybe = Maybe.fromMaybe(maybeFound, 0);



// On the other hand, if you are sure that a Maybe is a Just, or it is an
// errors for the Maybe to be a Nothing, you can use fromJust.  This function
// will return the value of the maybe if it is a Just
//
// When it's only argument is a Nothing though, this function will raise an
// error.
const foundFromJust = Maybe.fromJust(maybeFound);


// For really generic functionality, you can use Maybe.unbox.  It accepts
// 3 arguments.
//
// maybe -- The maybe we're examining
// justCallback -- The callback called when maybe is a Just
// nothingCallback -- The callback called when maybe is Nothing
//
// The return of Maybe.unbox is the return of the callback.
//
// The advantage to unbox over switch is that it is a completely defined,
// pure function with a return.
//
// The Just callback accepts a single argument, which is the value of the
// maybe when it is a Just.
//
// The Nothing callback accepts no arguments, and just returns.
//
// The below code has exactly the same result as:
//        Maybe.fromMaybe(maybeFound, 0))
// But is useful for clearly showing how unbox can be used in situations where
// other functions aren't a good fit.
const foundFromUnbox = Maybe.unbox(maybeFound,
                                   (value) => value,
                                   () => 0);
```


This is much nicer, and more functional.  We don't have to worry about any flow
control at all.  Though fromJust really only should be used when your
absolutely certain that the value is actually present.

So far, we're about on par with null and undefined from a practical standpoint.
Philosophically and compile-time error detection wise, Maybe is still superior.
It's a single type that represents the two possible results.  This helps
the compiler find a lot of bugs for us.  It also forces us to handle the
"Nothing" situation explicitly, instead of ignoring it until users find the
errors for us.

Lets look at how Maybe helps us in a more sophisticated situation.  Where we
chain together lots of maybes with a "then".   This is almost exactly the
bind operator in Haskell (>>=).   We use the "then" function because it's
already present in Promises, but Maybes also have a bind function for people
who prefer that terminology.

The only argument to "then" is a callback.  The callback accepts a single
argument, and returns another Maybe.


```
const maybeFound = find(someNumberArray, 12)
    .then( (val: number) => Maybe.Just(val + 32) )
    .then( (val: number) => find(someNumberArray, val) )
    .then( (val: number) => Maybe.Just(val - 2) );

console.log( Maybe.fromMaybe(maybeFound, 0) );
```

In each call to "then" we don't know if we have a value or not.  The initial
call to find may return Nothing.  That's not a problem though.  The "then"
function will never call it's callback for a "Nothing".

Notice, the second "then" call acceps a callback which invokes another find.
Which may fail.  In order to get this using null, we would likely wind up with
a lot of flow control, and probably a mutable state variable.

```
//example without Maybe
let retVar = 0;
const found1 = someNumberArray.find( (element) => element === 12 );
if(found1) {
    const newVal = found1 + 32;
    const found2 = someNumberArray.find( (element) => element === newVal );

    if(found2) {
        const newVal2 = found2 - 2;
        retVar = newVal2;
    }
}


console.log(retVar);
```

Cleaning up the code above is certainly possible, but we quickly loose site
of the "happy path" logic.  In fact, most code I've seen will simply let
exceptions be raised when null is found and ignore them in higher level code,
something like the following:

```
//example without Maybe, using exceptions instead
let retVal = 0;
try {
    let val = someNumberArray.find( (element) => element === 12 );
    val += 32;
    val = someNumberArray.find( (element) => element === val );
    val -= 2;
    retVal = isNaN(val) ? 0 : val;
} catch (e) {
    //Do nothing
}

console.log(retVal);
```

In addition to the fact that we should not use exceptions for flow control
(they are supposed to indicate errors in the program), we also rely heavily on
mutable state (let instead of const).  val is reasigned multiple times, and
retVal is used to provide a default value.

Using maybe is much more obvious, and clean, both to human readers, and
compilers.

Here is the maybe code again for reference:

```
const maybeFound = find(someNumberArray, 12)
    .then( (val: number) => Maybe.Just(val + 32) )
    .then( (val: number) => find(someNumberArray, val) )
    .then( (val: number) => Maybe.Just(val - 2) );

console.log( Maybe.fromMaybe(maybeFound, 0) );
```
