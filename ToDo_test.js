const {quotesSchema} = require('schemas/validationSchema.js')
Feature('ToDo');

Scenario('Check Quote list', async ({ I }) => {
    //token
    I.amBearerAuthenticated(secret('ff55ec16cc47633aa948bdad7a3d93e2'));
   
    //Get a list of quotes
    let list = await I.sendGetRequest('/quotes');
    I.seeResponseCodeIsSuccessful();

    //show the list of quotes printed in the terminal (in visual studio)
    I.seeResponseContainsKeys(['quotes']);
    I.say("Showing the list of quotes in the terminal")
    console.log("THE LIST> ", list.data)
    const quoteKeys = Object.keys(list.data.quotes);
    console.log("Lenght of quotes list: ",quoteKeys.length)

    //SCHEMA VALIDATION. Check for all quotes, each key should show corresponding value format.
    I.say("Validation test for the keys of each quote")
    for (let i =0; i<quoteKeys.length; i++ ){
        let theQuote = quoteKeys[i];
        let allQuotes = list.data.quotes[theQuote]


        //validating all keys for each quote
        const { error, value } = quotesSchema.validate(allQuotes)
        if (error){
            console.log(error.message);
        }else {
            console.log("Validation schema-all good! ",value);
            I.say("Validation schema done - all good")
        }
    }
});

Scenario('Create an session- to select a fav quote', async ({ I }) => {
    //token
    I.amBearerAuthenticated(secret('ff55ec16cc47633aa948bdad7a3d93e2'));
    let myUser = {
      "user": {
      "login": "henyi.carvajal@gmail.com",
      "password": "Testing@4me"
    }
    }
    //here a second valid user. We can login in the frontend, but we cannot do a session from API.
    //I.amBearerAuthenticated(secret('da37a2d3d6a4585c995b2def1c9552d7'));//it has his own token key
    // let secondUser = {
    //     "user": {
    //     "login": "newtest1_User@newtestUser.com",
    //     "password": "newtestUser685"
    //   }
    //   }
    const newUser = await I.sendPostRequest('/api/session', myUser);
    I.seeResponseCodeIsSuccessful();
    I.seeResponseContainsKeys(['user']);
    //I.seeResponseContainsJson({ user: { login: "henyi.carvajal@gmail.com" } } );

  });;

Scenario('Vote for your favorite', async({ I }) => {

    //token
    //here should be the 'User-Token' but since we cannot generate, I use the key and it will not work.
    I.amBearerAuthenticated(secret('ff55ec16cc47633aa948bdad7a3d93e2'));

    //Get a list of quotes
    let list = await I.sendGetRequest('/quotes');
    I.say("Selecting a random quote as fav")
    
    //Select a random quote to vote for it later.
    let randomQuote = list.data.quotes[Math.floor(Math.random()*list.data.quotes.length)]
    console.log("Selecting one random quote: ", randomQuote)
    let quoteID = randomQuote.id
    console.log("ID of selected quote: ",quoteID)

    //mark the selected quote as a fav
    await I.sendPutRequest('/quotes/'+quoteID+'/fav');
    I.seeResponseCodeIsSuccessful();

    let favCountBefore = randomQuote.favorites_count
    console.log("How many fav has this quote: ",favCountBefore)

    //see "favorites_count" key new value after we select the quote as favorite
    let favQuote = await I.sendGetRequest('/quotes/'+quoteID)
    console.log("Selected quoted marked as fav:",favQuote.data)
    I.seeResponseCodeIsSuccessful();

    let favCountAfter = randomQuote.favorites_count
    console.log("How many fav has this quote after selected as a fav: "+favCountAfter)
   
    I.seeResponseValidByCallback(({ expect, data }) => {
        expect(favCountAfter > favCountBefore).to.eql(true);
      });
    if (favCountBefore ==favCountAfter ){
        I.say("We coud not select this quote as fav")
        console.log("We coud not select this quote as fav")

    }else if (favCountAfter > favCountBefore){
        I.say("Fav count is increased - quoted selected as fav")
        console.log("Fav count is increased - quoted selected as fav")
    }
    
    
});