// Reacts to a button click by marking the selected button and saving
// the selection
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

// Initialize the page by constructing the color options


/* Select */
const formSelectCoin = document.getElementById("select-coin");
let dropdown = document.getElementById('coins-dropdown');
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

chrome.storage.local.clear(function() {
  var error = chrome.runtime.lastError;
  if (error) {
      console.error(error);
  }
});

function addCoinToStorage(coin){ 
  
  chrome.storage.sync.get(['coins'], function(result) {
    console.log('Value currently is ' + result.coins);
    
    if(result.coins) {
      console.log("tem coins", result.coins)      
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
  
}

chrome.storage.onChanged.addListener(function(changes) {
  var storageChange = changes['coins'];
  console.log('New coind added ' +
              'Old value was "%s", new value is "%s".',
              storageChange.oldValue,
              storageChange.newValue); 
});

formSelectCoin.addEventListener("submit", function(evt) {
  evt.preventDefault();
  console.log(evt.target[0].value)
  addCoinToStorage(evt.target[0].value)
});
/* Select */