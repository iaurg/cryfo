// Reacts to a button click by marking the selected button and saving
// the selection

/*
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}
*/

/*---- Target DOM Elements ----*/

let divCoins = document.getElementById('selected-coins')
let dropdown = document.getElementById('coins-dropdown');
const formSelectCoin = document.getElementById("select-coin");


/*---- Create and Fill Select Coin Options ----*/
dropdown.length = 0;
let defaultOption = document.createElement('option');
defaultOption.text = 'Choose Coin';

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const url = 'https://api.coingecko.com/api/v3/coins/list';

async function getCoinList(){
  return fetch(url)
  .then(response => {
    if (!response.ok) { throw response }
    return response.json()
  })
  .catch(error => console.log(error))
}

async function populateSelectCoin() {
  const data = await getCoinList();
  if(data){
    let option;
    for (let i = 0; i < data.length; i++) {
      option = document.createElement('option');
      option.text = data[i].name;
      option.value = data[i].id;
      dropdown.add(option);
    } 
  }
}

populateSelectCoin();

/*---- Change and update storage ----*/

function addCoinToStorage(coin){  
  chrome.storage.sync.get(['coins'], function(result) {
    //console.log('Value currently is ' + result.coins);    
    if(result.coins) {
      // console.log("tem coins", result.coins)      
      const newArray = [...result.coins, coin]

      chrome.storage.sync.set({'coins': newArray}, function() {
        console.log('Value is set to ' + coin);
      }); 
      
    } else {
      chrome.storage.sync.set({'coins': [ coin ]}, function() {
        console.log('Value is set to ' + coin);
      }); 
    }
  });
  location.reload()
}

function deleteCoinFromStorage(id) {
  chrome.storage.sync.get(['coins'], function(result) {
    //console.log('Value currently is ' + result.coins);    
    if(result.coins) {
      // console.log("tem coins", result.coins)   
      const filterResult = result.coins.filter(coin => coin.id !== id)
      console.log(filterResult)
            
      chrome.storage.sync.set({'coins': filterResult}, function() {
        console.log('Value is set to ' + coin);
      });      
    }
  });
  location.reload()
}

/*---- Listen to form submit ----*/

formSelectCoin.addEventListener("submit", function(evt) {
  evt.preventDefault();
  const { text:name, value:id } = dropdown.options[dropdown.selectedIndex]
  addCoinToStorage({ id, name })
});

/*
chrome.storage.onChanged.addListener(function(changes) {
  var storageChange = changes['coins'];
  console.log('New coind added ' +
              'Old value was "%s", new value is "%s".',
              storageChange.oldValue,
              storageChange.newValue); 
});
*/


/*---- Crate selected Coin List ----*/

function createCoinItem(id, name) {
  let itemCoin = document.createElement('div')
  let itemContent = document.createTextNode(name)
  let deleteButton = document.createElement('button')
  deleteButton.innerHTML = "x"
  deleteButton.id = id
  deleteButton.addEventListener('click', (e) => deleteCoinFromStorage(e.target.id))
  itemCoin.className = 'coin-item'
  itemCoin.appendChild(itemContent)
  itemCoin.appendChild(deleteButton)
  divCoins.appendChild(itemCoin)
}

function createCoinsList(coins) {
  coins.forEach((item) => {
    createCoinItem(item.id, item.name)
  });
} 

function populateSelecteds() {
  chrome.storage.sync.get(['coins'], function (obj) {  
    createCoinsList(obj.coins)
  })
}

/* Run on Start */
populateSelecteds();

/*---- Clear storage Functions ----*/

chrome.storage.local.clear(function() {
  var error = chrome.runtime.lastError;
  if (error) {
      console.error(error);
  }
});

// chrome.storage.local.clear()
// chrome.storage.sync.clear()

/*---- Clear storage Functions ----*/