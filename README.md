Maybe
===============================================================================
Maybe is a type used extensively in functional programming.  It's chief value
is to represent the return of functions which do not always return a value.

From a different perspective, we use maybe to avoid using sentinal values like
null and undefined.  This has the advantage of being more typesafe, and
allows the compiler to detect a number of errors at run time.

Most of the examples below assume a "find" function is available that returns
a maybe.  That function may be defined as:

```
import * as Maybe from 'maybe';

function find(numArray: number[], val: number): Maybe.Maybe<number> {
    const foundNum = numArray.find( (element) => element === val );
    if(foundNum) {
       return Maybe.Just(foundNum);
   } else {
       return Maybe.Nothing();
   }
}
```

Here is a trivial example, where we may not find 12 in the array.  It
illustrates the basic switch statement used for converting Maybes into errors
or results:

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
deal with flow control at all:

```
const maybeFound = find(someNumberArray, 12);

const foundFromMaybe = Maybe.fromMaybe(maybeFound, 0); //Return the default
const foundFromJust = Maybe.fromJust(maybeFound); //Return value, or raise an Error
```


This is much nicer, and more functional.  We don't have to worry about any flow
control at all.  Though fromJust really only should be used when your
absolutely certain that the value is actually present.

So far, we're about on par with null and undefined from a practical standpoint.
Philosophically, Maybe is still superior, since it's a single type that
represents the two possible values.  This helps the compiler find a lot of bugs
for us.

Lets look at how Maybe helps us in a more sophisticated situation.  Where we
chain together lots of maybes with a "then".   This is almost exactly the
bind function in Haskell (>>=).   We use the "then" function because it's
already present in Promises.

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
(they are supposed to indicate errors in the program), we also have a host of
mutable state (let instead of const).  val is reasigned multiple times, and
retVal is used to provide a default value.

Using maybe is much more obvious, both to human readers, and compilers.

Additionally, instead of having to worry over "null", "undefined", "NaN",
"x.length === 0" etc.... you can now just worry over "Just" or "Nothing"
