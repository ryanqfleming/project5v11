const grabCart = localStorage.getItem("bearCartArray");
const grabCustInfo = localStorage.getItem("userData");
let custCart = JSON.parse(grabCart);


//do the fetch post
async function postInfo() {
  const custData = JSON.parse(grabCustInfo);
  let carryArray = new Array();
  console.log(custCart, "custCart");
  const url = "http://localhost:3000/api/teddies/order";
  //reroute to index if no customer info is submitted
  if(grabCustInfo === null){
    window.location.href = "index.html";
  }
  //loop through the cart and its count and create the array that is needed for the post
  for (i = 0; i < custCart.length; i++) {

      for (x = 0; x < custCart[i][2]; x++) {
        // loops through the count each item
        carryArray.push(custCart[i][0]); // pushes the item id to the carry
      }
  }
  //creat object to push via fetch
  let container = {
    contact: custData,
    products: carryArray,
  };
  console.log(container, "body");
  // pushing it
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(container),
      headers: {
        "content-Type": "application/json",
      },
    });
    const json = await response.json();
    //pass the response to the display order function
    displayOrder(json);
    //throw error for any exception
  } catch (err) {
    console.log(err);
  }
}
//displays the stuff
function displayOrder(item) {
  holdr = new Array();
  //returns an array with how many items we have
  const keys = Object.keys(item.products);
  //build an array of just the ids so we can recount
  keys.forEach((key, index) => {
    holdr.push(item.products[key]._id);
  });
  //checking for duplicates and returning a count of each
  let productCounts = arrayCounter(holdr);
  //putting everything into an easy to use array
  productCounts.forEach((y, index) => {
    keys.forEach((key, index2) => {
      if (item.products[key]._id == productCounts[index][0]) {
        productCounts[index][2] = item.products[key].name;
        productCounts[index][3] = item.products[key].imageUrl;
        productCounts[index][4] = item.products[key].price;
      }
    });
  });
  console.log(productCounts, "full list");
  //lets loop through and add each item to the #orderSumList div
  productCounts.forEach((item, x) => {
    document.getElementById("orderSumList").innerHTML +=
      "<div class='d-flex justify-content-between align-items-center item'><div class='h4'><img src='" +
      productCounts[x][3] +
      "'alt='bearIcon' class='bearIcon'></div><div class='h3'>  " +
      productCounts[x][2] +
      "</div><div>Amount: " +
      productCounts[x][1] +
      "</div></div>";
  });
  //display order ID
  console.log(item, 'returned item')
  document.getElementById('orderId').innerHTML = 'Order ID: ' + item.orderId;
  //display the name under the thank you
  document.getElementById('usrName').innerHTML = item.contact.firstName +' '+ item.contact.lastName
  //display customer information block
  document.getElementById('custName').innerHTML= 'Name: ' + item.contact.firstName +' '+ item.contact.lastName
  document.getElementById('custEmail').innerHTML= 'Email: '+item.contact.email
  document.getElementById('custAddress').innerHTML= 'Address: '+ item.contact.address + ' City: ' + item.contact.city

  //lets display the cost too
  document.getElementById('priceSum').innerHTML = priceDisplayer(productCounts);
  //clear the local storage
  localStorage.clear();

}
function arrayCounter(item) {
  //count how many duplicates we have and place them in the array entries which gets returned
  let holr = {};
  item.forEach(function (x) {
    holr[x] = (holr[x] || 0) + 1;
  });
  const entries = Object.entries(holr);
  console.log(entries, "da holder");
  return entries;
}
function priceDisplayer(item) {
  console.log(item, 'passed array')
  let priceHldr = 0;
  item.forEach(function (item1, p) {
    for(i = 0; i< item1[1]; i++){
      priceHldr = priceHldr + item1[4];
    }
    
  });
  let bPrice2 = priceHldr.toString();
  bPrice2 =
   bPrice2.slice(0, bPrice2.length - 2) +
   "." +
    bPrice2.slice(bPrice2.length - 2);
  bPrice2 = "Price Total: $" + bPrice2;
  return bPrice2;
}
postInfo();
