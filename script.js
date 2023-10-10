'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP


// Data

const account1 =
{
  owner: 'Noor Nissa',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 =
{
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 =
{
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 =
{
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//in this display movements function we defined the sort parameter by default as false
const displayMovements = function (movements, sort = false)// this function should recive one array of the movements then work with that data.
{

    containerMovements.innerHTML = '';// innerHTML is the little bit similar to the textcontent.the difference is that textcontent simply return the text itself whether
                                      // innerHTML returns everything including the html, so all the html texts should be included.so we put this innerhtml to an empty
                                      // string cause there was some values before on the bankist app, so to take it out we had to use it.we can innerhtml for so many
                                      // other things.

    // here if the sort paramter is true, then it will make a shallow copy of the movements variable by slice method then we are going to sort the problem.

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    

    movs.forEach(function (mov, i)
    {
        

        const type = mov > 0 ? 'deposit' : 'withdrawal';// to show the deposit index we need to write it down by all lower case.

        const html =
            `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);// insertAdjacentHTML accepts 2 strings, the 1st string is the position in which we want to attach the 
                                                                 // HTML, and the 2nd is the string that containing the html that we want to insert.so the afterbeging
                                                                 // will start the movements value from the end.

        //containerMovements.insertAdjacentHTML('beforeend', html);//the beforeend will start the movements value from the start section

    });

};


const calcDisplayBalance = function (acc)
{
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance}€`;
}


const calcDisplaySummary = function (acc)
{
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€`;

    const outgoing = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(outgoing)}€`;// math.abs is going to remove the negative sign.

    // so basically the filter method is going to work here as a comparison, I will get the interest from the bank if the calculation of the interest rate is at least a $1.
    const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate / 100).filter(mov => mov >= 1).reduce((acc, mov) => acc + mov, 0);
    labelSumInterest.textContent = `${interest}€`;

}


const createUserNames = function (accs)
{ 
    accs.forEach(function (acc)// we doing the looping here for the each accounts
    {
        acc.username = acc.owner// the username will interact with the account owner since we have all the account in the accounts variable.
            .toLowerCase()
            .split(' ')// it will split the string by steven, thomas, williams.
            .map(name => name[0])// it will position every first index or words from the user string. which will be(stw,js,jd etc).
            .join('');

    });
    
};

createUserNames(accounts);

let currentAccount;

const updateUI = function (acc)
{
    // Display movements

    displayMovements(acc.movements);


    // Display Balance

    calcDisplayBalance(acc);// now the calcdisplaybalance has the entire acc object.

    //Display Summary

    calcDisplaySummary(acc);// so they had different interest rate that's why we had to pass in the entire calcdisplaysummary account.

}


btnLogin.addEventListener('click', function (e)// in html the default behavior when we click the submit button is for the page to reload. somehow we need to stop that for
//for happening and for that we need to give the handler func a event parameter and so on that event we can call a method call
//preventDefault(). and this method will then prevent form from submitting.                                           
{
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value))// with the optional chaining the pin property will only be read if the current account is actually exist
                                                            // in the username, if it doesn't then it will show undefined to the console
    {
        // Display UI a welcome message

        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;// so we used the split method to take the first name of the owner which we defined
                                                                                       // by split(' ')[0].
        //Showed UI
        containerApp.style.opacity = 100;

        // Clear input fields

        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();// with the blur method we can blue the input fields, the pointer from the mouse will go away.

        updateUI(currentAccount);// this updateUI will call the updateUI(acc) function.

    }


});


btnTransfer.addEventListener('click', function (e)
{
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);// so the reciver account will find the person whom we want to transfer the money to.

    inputTransferAmount.value = inputTransferTo.value = '';// this will get rid from the amount that are showing into the transfer to and transfer amount bar.

    // now we will check the amount of money that i can transfer to another person and suppose i have $3000 in my account and i transfered $100 to someone then it would
    // show the checkbalance that i have $2900 left.also we will check that I have enough money to transfer to and also I will check that I can transfer money to my own
    // account.


    if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username)
    // here we put the reciever acc after amount cause if the person username doesn't match with the username given then it will not log to the console
    {
        // doing the transfer
        currentAccount.movements.push(-amount);// so we the did the push negative amount here, so whoever i transfer to it will subtract the current balance.
        recieverAcc.movements.push(amount);// and the positive amount is for that whoever recieves the money it will add their current balance.

        updateUI(currentAccount);

    }



});

btnLoan.addEventListener('click', function (e)
{
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1))// so here i can ask for a loan with the largest ammount that I have.suppose I have 3000 
                                                                                // of that amount which will be 3000*10=30000.
    {
        //Add movement
        currentAccount.movements.push(amount);

        //update UI

        updateUI(currentAccount);

    }

    inputLoanAmount.value = '';

});


btnClose.addEventListener('click', function (e)
{
    e.defaultPrevented();

    

    // so here it will check that whoever wants to close the account it should have to match with current account username and also the close pin should match with the
    // current account pin

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value === currentAccount.pin))
    {
        // The find Index method
        //Find index method works almost as same as the find method, as the name says find index returns the index of the found element and not the element itself.

        const index = accounts.findIndex(acc => acc.username === currentAccount.username);// acc.username means that the account holder whoever has the username as like 
                                                                                        // 'jonas shmedtmann' it should have to match with currentacc.username which is 'js'
        console.log(index);
        // delete account
        accounts.splice(index, 1);// we will remove one element from the current account function by the splice method.

        //Hide UI
        containerApp.style.opacity = 100;// after we delete the person account, the account will not be visible anymore it will take us to the login page.

    }

    inputCloseUsername.value = inputClosePin.value = '';

});


let sorted = false;

btnSort.addEventListener('click', function (e)
{
    e.preventDefault();

    // so here we did the opposite of sorted, basically we set the sorted variable as false, so it will check when sorted is false then we want it to be sorted by the 
    displayMovements(currentAccount.movements, !sorted)//(!)keyword. so here we called the sort function and we set the second parameter as true, since the parameter from 
    sorted = !sorted;//the displaymovements was false. so here the reason for doing this is everytime if we click the sort button it will set the sort button as true to
                    // false and false to true, so whenever we click the sort button it will first sort it in ascending way but it will not go back to the normal but after
                    //doing this it can do both.

});





/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);



//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


//Simple array methods


let arr = ['a', 'b', 'c', 'd', 'e'];


//Slice method

// slice does not mutate the original array
console.log(arr.slice(2));// it will slice the first two element.it does not mutate the original array which is arr, it just makes a new array
console.log(arr.slice(2,4));// it will slice the first two element and the last element from the array and will stay in between c and d.
console.log(arr.slice(-2));// it will take the last two element array and will slice the first 3 array.
console.log(arr.slice(-1));// it will take the last element of the array.
console.log(arr.slice(1, -2));// it will slice the first and last two element from the array.
console.log(arr.slice());// we can also get the exact copy of the original array by slice method.



//spread operator
console.log([...arr]);// we can also get the exact copy by the spread oprator.

//Splice method

// splice mutates the original array

//console.log(arr.splice(2));
//console.log(arr.splice(-1));// it will take away the last element from the original array forever
arr.splice(1, 2);// it will remove the position 1 and two element
console.log(arr);// so splice will only show the first two elements from the original array and it will take the last three elements from the array forever.

//Reverse method

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());// it will reverse the whole array.
console.log(arr2);// reverse method mutates the original array.

//Concat method

//concat does not mutate the original array
const letters = arr.concat(arr2);
console.log(letters);// it will join the both array.
console.log([...arr, ...arr2]);// it will do the same thing as concat method.

//Join method

console.log(letters.join('-'));

*/

//The new at() method

/*
const arr = [23, 11, 64];
console.log(arr[2]);
console.log(arr.at(0));

//Getting the last element

console.log(arr[arr.length - 1]);//here the answer will be 64 cause the length of the array is 3, since array is 0 based it will always start the 1st element as 0,then 
                                 // it will subtract the 3-1, which is arr[2].

console.log(arr.slice(-1)[0]);// it will do the same as arr.length,but here we used the [0]cause we need to take out the array sign from the console then it will simply
                               // show 64.

console.log(arr.at(-1));// the new at method does the sae thing in a simple way.

//at()also works on string

console.log('jonas'.at(0));
console.log('jonas'.at(-1));
*/



// looping arrays:forEach method

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i,movement] of movements.entries())// in for of method we get index number by like this
{
    if (movement > 0)
    {
        console.log(`Movement ${i + 1}: you deposited ${movement}`);
    }
    else
    {
        console.log(`Movement ${i + 1}: you withdrew ${Math.abs(movement)}`);// Math.abs works for absolute values, in here it will remove the negative sign.
    }
}



console.log('_______ FOREACH _______');

movements.forEach(function (movement, i)// the 1st parameter on forEach function is always needs to be current element,the 2nd parameter is alwas needs to be index 
                                      //and the 3rd one always the entire array that we are going to loop over with.
{
    if (movement > 0)
    {
        console.log(`Movement ${i + 1}: you deposited ${movement}`);
    }
    else
    {
        console.log(`Movement ${i + 1}: you withdrew ${Math.abs(movement)}`);// Math.abs works for absolute values, in here it will remove the negative sign.
    }
});

*/



// how the forEach works in each iteration
//0: function(200)
//1: function(450)
//2: function(400)

// the continue and the break statement do not work on the foreach loop at all

// foreach with maps and sets


/*
// foreach with map
const currencies = new Map
    ([
        ['USD', 'United States dollar'],
        ['EUR', 'Euro'],
        ['GBP', 'Pound sterling'],
    ]);

currencies.forEach(function (value, key, map)
{
    console.log(`${key}: ${value}`);
});

//foreach with set

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, key, set)
{
    console.log(`${key}: ${value}`);
});

*/


//Data transformation with the map method

/*
const euroToUsd = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


//const movementsUSD = movements.map(mov => mov * euroToUsd); // the map only returns a new array, it doesn't mutate the original array.
//console.log(movementsUSD);




const movementsUSDfor = [];
for (const mov of movements) {
    movementsUSDfor.push(mov * euroToUsd);
}
console.log(movementsUSDfor);

const movementsUSD = movements.map(mov => mov * euroToUsd);
console.log(movements);
console.log(movementsUSD);

const movementsDescriptions = movements.map((mov, i, arr) =>// this map method will return a new array with the map index

    `Movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`

    /*
    if (mov > 0) {
       return `Movement ${i + 1}: you deposited ${mov}`;
    }
    else {
        return (`Movement ${i + 1}: you withdrew ${Math.abs(mov)}`);// Math.abs works for absolute values, in here it will remove the negative sign.
    }
    
);

console.log(movementsDescriptions);

*/

//Data transformation with the filter method


/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(mov =>mov > 0 );// it will filter out the negative value and will create a new array.filter doesn't mutate the original array either.
console.log(deposits);
console.log(movements);

const withdrawals = movements.filter(mov => mov < 0)
console.log(withdrawals);


const depositsFor = [];
for (const mov of movements)
    if (mov > 0)
    {
        depositsFor.push(mov);// it will push the movements value to the new array which is called depositsFor.
    }
console.log(depositsFor);

*/



//Data transformation with the reduce method



const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);



const balance = movements.reduce((acc, curr) => acc + curr, 0);// easiest way to do the reduce method by the arrow function.
console.log(balance);//3840

/*
const balance = movements.reduce(function (acc, curr, i, arr)//in the callback function of the reduce method the first parameter is actuallly the accumulator, accumulator in 
                                                            // the reduce method adds the every element of an array and simply return it from the array.
                                                        // the 2nd parameter on reduce method is always needs to be current element,the 3rd parameter is always needs to be
                                                            // index and the 4th one always the entire array that we are going to loop over with.
{
    console.log(`iteration ${i}: ${acc}`)
    return acc + curr;// it will add the whole movements array and return a new value.
}, 0);// the reduce method actually has a second parameter and that is the initial value of the accumulator,so the value that we specify here which in this case is gonna be
      // 0 is the initial value of the accumulator in the 1st loop iteration.so in this example, we want to start adding at 0 and so therefore we simply specify 0 here.

console.log(balance);//3840

let balance2 = 0;
for (const mov of movements)
{
    balance2 += mov;
}

console.log(balance2);

*/


//Maximum value

//We can also find the maximum value by using the reduce method

/*

const max = movements.reduce((acc, mov) =>
{
    if (acc > mov)
    {
        return acc;
    }
    else
    {
        return mov;
    }
});// also when we are trying to find the max and min by the reduce method we don't need to initialize it by 0.

console.log(max);

//The magic of chaining methods

/*

const euroToUSD = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
//PIPELINE method:pipeline method is that you can only chain a method after another one if the first one returns a new array. so here filter returns a new array and also 
//map does the same thing, but reduce doesn't returns a new array, insteat it returns a value. so that's why we cannot chain anyting after reduce method.

const totalDepositsUSD = movements.filter(mov => mov > 0)
    .map((mov, i, arr) =>// this was just to show that we can inspect the current array at any stage of the pipeline using the 3rd paramter of the callback function.
    {
        //console.log(arr);
        return mov * euroToUSD;
    })

  //.map(mov => mov * euroToUSD)
    .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

*/

//The find method
// find method:we use the find method to recover one element of an array based on a condition. the find method also accepts a condition and also the find also accepts a
// callback function, which will then be called estimated loops over the array.


/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
const firstWithdrawal = movements.find(mov => mov < 0);// the find method also needs an argument like the filter method. unlike the filter the method the find method will
                                  // not return a new array but it will only return the first element in the array that satisfies the condtion.
console.log(firstWithdrawal);
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

const accs = [];
for (const acc of accounts)
{
    const account = accs.push(acc.owner === 'Jessica Davis');
    
}
console.log(account);

*/

//some and every methods
/*

// some method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

//Includes method only check the equality of an array.for equality we can always use the includes method.
console.log(movements.includes(-130));

// on the some method we can specify a condition

console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 0);// so here the some method will check if there is any deposits in the array and also the deposit is >0 if it's greater
                                                  // then it will log to the console as true.

//const anyDeposits = movements.some(mov => mov > 5000);// so here the deposits will be false cause the movements array doesn't have anykind of amount like that.

console.log(anyDeposits);

//The EVERY Method

// Every only returns true if all of the elements in the array satisfy the condtion that we pass in.

console.log(movements.every(mov => mov > 0));// in this case it will false cause there is some that less than 0.
console.log(account4.movements.every(mov => mov > 0));// in this case it will be true cause all the account 4 movements is greater than 0

// separate callback

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

*/


//The flat and flatmap method

//The flat method
//So in the flat method we can gather the whole nested array into a one single array

/*

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));// with this flat method it will take [1,2] and other deeply nested array and will make a one single array

/*
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);

const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

*/


/*
//const overalBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
//console.log(overalBalance);

//The flatmap method

// flatmap method is essentially combines a map and a flat method into just one method which is better for performance.

const overalBalance = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

*/

// The sort method

//Sort with strings

/*
const owners = ['jonas', 'zach', 'adam', 'martha'];
console.log(owners.sort());// this will alphabetically sort the array from A-Z.sort also mutates the original array.
console.log(owners);// mutated by sort.

// sort with numbers

//Sort method does the sorting based on strings.so if we do only movements.sort() in here it will not sort the whole array in ascending way. that's we need to pass that 
//sort method to a function


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);


// first if we return something <0 in the sort function then A will be before B. 2nd if we return something >0 then B will be before A.

// return <0, A,B (keep order)
// return >0, B,A (Switch order)

//This is sorting in a ascending order

movements.sort((a, b) =>// in this 2 parameters here are essentially the current value and the next value if we imaging the sort value looping over the array.
{
    if (a > b)// switch order// here if the A is greater than B then it will swuutch the order. example-450>-400 then it will switch the order from there.
    {
        return 1; // the number here doesn't really matter as long as it's greater than 0.
    }

    if (b > a)// keep order// if B is greater than A than it will keep the order on that position
    {
        return -1;
    }

});

movements.sort((a, b) =>a-b);// eastiest way to do sort in ascending way.



//sorting in a descending order

// sorting in descending order is the same as ascending but the difference is in ascending order the if the a>b then it will switch the order but in descending order it will 
//keep the order.

// return <0, A,B (Switch order)
// return >0, B,A (keep order)


/*
movements.sort((a, b) =>
{
    if (a > b)
    {
        return -1;// so here it will keep the order
    }

    if (b > a)
    {
        return 1;// here it will switch the order
    }

});

movements.sort((a, b) =>b-a);// easiest way to sort in descending way
console.log(movements);



*/

// more ways of creating and filling arrays

/*

const arr = ([1, 2, 3, 4, 5, 6, 7]);// manual
console.log(new Array(1, 2, 3, 4, 5, 6, 7));// we always define the array by manually like this,then we hardcode these arrays.

// but here we are going to define the array dynamically

// empty arrays+fill method
const x = new Array(7);
console.log(x);// this going to log the array as [empty*7]. also we cannot do any other methods like map, reduce or anything on this method.
//console.log(x.map(() => 5));// here nothing will happen cause the map method doesn't really know what to do with the empty array.but we can do only one method that gonna
                          //work on this array and that is fill method

//x.fill(1);// now we will get the array with full of 1's.

x.fill(1, 3, 5);// it kinda works as the slice method, so in here (1,3) it will only going to start the method with index 3[empty*3,1,1,1,1] like this.
console.log(x);

// fill method also works with other arrays

arr.fill(23, 4, 6);// since we know the array it's going to position the number 23 in between 4 and 6.[1,2,3,4,23,23,7]
console.log(arr);

//Array.from

// on this array.from method we can simply pass an object as and argument and then the second argument is a mapping function
const y = Array.from({ length: 7 }, () => 1);// so in the second argument we don't really need to define nothing over there. so here all we want to return is a 1.
                                   //  that will then return 1 in then return 1 in each of the array position

console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);// in here if we want to log the array from 1-7, then we have to put in the second argument(curr,i)which is the
                                               //current element and the current index.so as always we get access to the current element and the current index. that's why
                                               // in here the index will stay between 0-6.cause array index starts from 0. then all we have to return from this function is
                                               //i+1.which is going to be [1,2,3,4,5,6,7].this call back function here is exactly like the one in a map method.so we can
                                               // simply imaging that we are using this a call back function in calling the map method on an empty array.so adding 1 to
                                               // the index will then give us values from 1-7.so here in the function (curr) is a throw away variable, because we do not
                                               // need this current value at all.but we still of course have to define something as the 1st parameter.because the index
                                               // that we need is the 2nd parameter.so that's why we can put anything on that 1st parameter, but the nicest way to define   
                                               // that is instead of curr we can put (_ underscore).

console.log(z);

labelBalance.addEventListener('click', function ()
{
    const movementsUI = Array.from(document.querySelectorAll('.movements__value'),
        el => Number(el.textContent.replace('€', " ")));// we can also put this entire callback as the second argument,just like mapping.
    console.log(movementsUI);// in here basically all we did is that if we want to see the movements from the account
                                // we need to do it by the textcontent and then what we did just replaced the euro sign with nothing.

    
});

*/

/*
//Array methods practice

//1.
const bankDepositsSum = accounts.flatMap(acc => acc.movements).filter(acc => acc > 0).reduce((cur, i) => cur + i, 0);
console.log(bankDepositsSum);

//2.

//const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(acc => acc >= 1000).length;
// here we doing the same thing as the filter method with the reduce method, we would say in the reduce method that whenever the current value is >=1000?then we want to 
// return count + 1, which is the length of the array or else just if it's not at least 1000 then return the count only.
const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);


// prefixed ++ operator
let a = 10;
//console.log(a++);// here it will still be 10 cause the ++ operator already counted the a variable but still will show the old result, then if we log the console with a
                // again then it will show us the real value.//10
console.log(++a);//so if we add the variable before the operand we will find the result a as 11.
console.log(a);//11

//3.

//reduce with object

const { deposits, withdrawals } = accounts.flatMap(acc => acc.movements).reduce((sums, cur) =>// to destructure the objects we need to write the same as the 
                                                                                             // objects  
{
   // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
    // doing the same thing with bracket notation
    sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
    return sums;

}, { deposits: 0, withdrawals: 0 });// in this callback function the object is simply sums


console.log(deposits, withdrawals);

//4

//this is a nice title->This Is a Nice Title

const convertTitleCase = function (title)
{
    const capitalize = str => str[0].toUpperCase() + str.slice(1);
    const exceptions = ['a', 'an', 'the', 'but', 'and', 'or', 'on', 'in', 'with'];
    // so here what we did is if the current word is includes on the exceptions array then simply return that word.if it's not then capitalize it.
    const titleCase = title.toLowerCase().split(' ').map((word => exceptions.includes(word) ? word : capitalize(word))).join(' ');
    return capitalize(titleCase);
}

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONg title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/*
 
Working With Arrays
Coding Challenge #1

Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
about their dog's age, and stored the data into an array (one array for each). For
now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
ages from that copied array (because it's a bad practice to mutate function
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
�
")
4. Run the function for both test datasets
Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
Hints: Use tools from all lectures in this section so far �
GOOD LUCK �

*/


/*
const checkDogs = function (dogsJulia,dogsKate)
{
    const dogsJuliaCorrected = dogsJulia.slice();
    dogsJuliaCorrected.splice(0, 1);;
    dogsJuliaCorrected.splice(-2);

    console.log(dogsJuliaCorrected);

    const dogs = dogsJulia.concat(dogsKate);
    console.log(dogs);

    dogs.forEach(function (remainingDog, i)
    {
        if (remainingDog >= 3)
        {
            console.log(`Adult ${i + 1}:${remainingDog}`);
        }
        else
        {
            console.log(`puppy ${i + 1}:${remainingDog}`);
        }
    });

}

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

*/


/*
 
 Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is 
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as 
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know 
from other challenges how we calculate averages �)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK �

*/

/*

const calcAvgHumanAge = function (ages)
{
    const humanAge = ages.map(age => age <= 2 ? (2 * age) : (16 + age * 4));
    console.log(humanAge);
    const adults = humanAge.filter(age => (age >= 18));
    console.log(adults);
    //const avgHuman = adults.reduce((acc, curr) => acc + curr, 0) / adults.length;
    const avgHuman = adults.reduce((acc, curr, i, arr) => acc + curr / arr.length , 0);// here we needed all 4 parameters cause we want to add it first then get the avg of
                                                                                       // adding
    return avgHuman;
    

}
const avg1 = calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1);
console.log(avg2);


*/



/*Coding Challenge #3
Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time 
as an arrow function, and using chaining!
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]

*/

/*
const calcAvgHumanAge = ages =>
    ages.map(age => age <= 2 ? (2 * age) : (16 + age * 4)).filter(age => (age >= 18)).reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

const avg1 = calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAvgHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1);
console.log(avg2);

*/

/*
 
 Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are 
eating too much or too little.
Eating too much means the dog's current food portion is larger than the 
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% 
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate 
the recommended food portion and add it to the object as a new property. Do 
not create a new array, simply loop over the array. Forumla: 
recommendedFood = weight ** 0.75 * 28. (The result is in grams of 
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too 
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in 
the owners array, and so this one is a bit tricky (on purpose) �
3. Create an array containing all owners of dogs who eat too much 
('ownersEatTooMuch') and an array with all owners of dogs who eat too little 
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and 
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food 
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food 
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (try 
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food 
portion in an ascending order (keep in mind that the portions are inside the 
array's objects �)
The Complete JavaScript Course 26
Hints:
§ Use many different tools to solve these challenges, you can use the summary 
lecture to choose between them �
§ Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 
1.10). Basically, the current portion should be between 90% and 110% of the 
recommended portion.

*/

/*
const dogs =
    [
        { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
        { weight: 8, curFood: 200, owners: ['Matilda'] },
        { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
        { weight: 32, curFood: 340, owners: ['Michael'] },
    ];

//1.
dogs.forEach((dog => dog.recFood = Math.trunc (dog.weight ** 0.75 * 28)));
console.log(dogs);

//2.

const dogSarah = dogs.find(acc => acc.owners.includes('Sarah'));
console.log(dogSarah);
console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'}`);

//3.

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recFood).flatMap(dog=>dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recFood).flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4.
//`Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"`

console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little!`);

//5.

console.log(dogs.some(dog => dog.curFood === dog.recFood));

//6.
const checkEatingOkay = (dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1);
console.log(dogs.some(checkEatingOkay));

//7.

const okayAmount = dogs.filter(checkEatingOkay);
console.log(okayAmount);

//8.

const shallowCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(shallowCopy);


*/


    
   




