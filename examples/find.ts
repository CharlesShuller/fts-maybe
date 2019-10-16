// This modules defines some trivial examples showing how maybe can be used

import * as Maybe from '../src/Maybe';

function find(numArray: number[], val: number): Maybe.Maybe<number> {
    const foundNum = numArray.find( (element) => element === val );
    if(foundNum) {
       return Maybe.Just(foundNum);
   } else {
       return Maybe.Nothing();
   }
}


function findWithMaybe(): void {
    const someNumberArray: number[] = [1, 2, 3, 4, 56, 7, 8, 9, 12];
    const maybeFound = find(someNumberArray, 12);

    switch(maybeFound.kind) {
        case "Just": {
            console.log("findWithMaybe found value: " + maybeFound.value);
            break;
        }
        case "Nothing": {
            console.log("findWithMaybe: Could not find value");
            break;
        }
    }
}


function findWithMaybeNoSwitch(): void {
    const someNumberArray: number[] = [1, 2, 3, 4, 56, 7, 8, 9, 12];
    const maybeFound = find(someNumberArray, 12);

    const foundFromMaybe = Maybe.fromMaybe(maybeFound, 0); //Return the default
    const foundFromJust = Maybe.fromJust(maybeFound); //Return value, or raise an Error

    console.log("foundFromMaybe: " + foundFromMaybe);
    console.log("foundFromJust: " + foundFromJust);
}



function monadicMaybe(): void {
    const someNumberArray: number[] = [1, 2, 3, 4, 56, 7, 8, 9, 12];

    const maybeFound = find(someNumberArray, 12)
        .then( (val: number) => Maybe.Just(val + 32) )
        .then( (val: number) => find(someNumberArray, val) )
        .then( (val: number) => Maybe.Just(val - 2) );

    console.log( "monadicMaybe: " + Maybe.fromMaybe(maybeFound, 0) );
}


function noMaybe(): void {
    const someNumberArray: number[] = [1, 2, 3, 4, 56, 7, 8, 9, 12];

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


    console.log("noMaybe: " + retVar);
}


function exceptionsInsteadOfMaybe(): void {
    const someNumberArray: number[] = [1, 2, 3, 4, 56, 7, 8, 9, 12];

    let retVal = 0;
    try {
        let val: any = someNumberArray.find( (element) => element === 12 );
        val += 32;
        val = someNumberArray.find( (element) => element === val );
        val -= 2;
        retVal = isNaN(val) ? 0 : val;
    } catch (e) {
        //Do nothing
    }

    console.log("exceptionsInsteadOfMaybe: " + retVal);
}

function main(): void {
    findWithMaybe();
    findWithMaybeNoSwitch();
    monadicMaybe();
    noMaybe();
    exceptionsInsteadOfMaybe();
}

main();
