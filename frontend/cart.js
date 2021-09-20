

let grabArray = localStorage.getItem("bearCartArray");
let itemList = new Array();
let displayCounter = 0;
let bears = "";
let totalPrice = 0;
let priceHolder;
console.log(grabArray);
//tells the user the cart is empty if it is empty
if (grabArray === null || grabArray.length < 10) {
  document.getElementById("firstWrapper").innerHTML =
    "<div class='display-3'>EMPTY</div>";
}
//hides the cart and shows the info form
async function nextForm() {
  document.getElementById("informationForm").style.display = "block";
  document.getElementById("firstWrapper").style.display = "none";
    await priceDisplayer();
}
//hides the form and shows the cart
function backForm() {
  document.getElementById("informationForm").style.display = "none";
  document.getElementById("firstWrapper").style.display = "block";
}
//displays the cart amount at the top right
function cartCheckOnLoad() {
  let totalCart = 0;
  let cartDoc = document.getElementById("cart");
  let cartChecker = localStorage.getItem("cartCountStor");
  console.log(typeof cartChecker, "cartchecker type", cartChecker);
  let grabArray5 = localStorage.getItem("bearCartArray");
  console.log(cartChecker);
  if (grabArray5 !== null) {
    let grabber = JSON.parse(grabArray5);
    console.log(grabber, "grabber");
    grabber.forEach(function (item, x) {
      totalCart = totalCart + JSON.parse(item[2]);
    });
    cartDoc.innerHTML = "Cart(" + totalCart + ")";
  } else {
    cartDoc.innerHTML = "Cart";
  }
}
//the server fetch to get the bear information
async function gatherBears() {
  let url = "http://localhost:3000/api/teddies";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
//displays the list of the bears
async function displayBear() {
  bears = await gatherBears();
  if (grabArray !== null) {
    let grabber = JSON.parse(grabArray);
    //matching the id in local storage with that on the server
    grabber.forEach(function (item, x) {
      bears.forEach(function (item2, p) {
        console.log(item[0], p);
        if (item2._id === item[0]) {
          console.log("we have a match");
          let bearImg = bears[p].imageUrl;
          let bearName = bears[p].name;
          let selectHTML = "";
          let selectTag = "";
          bAmount = grabber[x][2];
          console.log(bAmount, "bAmount");
          let bPrice = bears[p].price * bAmount;
        //this just displays the bears price for each line item
          let bPrice2 = bPrice.toString();
          bPrice2 =
            bPrice2.slice(0, bPrice2.length - 2) +
            "." +
            bPrice2.slice(bPrice2.length - 2);
          bPrice2 = "Price: $" + bPrice2;
          //makes sure the same color is selected from the drop down
          bears[p].colors.forEach(function (selection, q) {
            if (selection == grabber[x][1]) {
              selectTag = "selected";
            } else {
              selectTag = "";
            }
            selectHTML =
              selectHTML +
              "<option  " +
              selectTag +
              ">" +
              selection +
              "</option>";
          });
          //put the html part into its own function for reability 

          document.querySelector(".mainBear").innerHTML += htmlString(
            x,
            bearImg,
            bearName,
            selectHTML,
            bAmount,
            bPrice2
          );
        }
      });
    });
  }
  document.getElementById("totalPrice").innerHTML = await priceDisplayer();
}
//puts the information into the local storage then refreshed the page to reflect it
function updatePage() {
  let grabber = JSON.parse(grabArray);
  grabber.forEach(function (item, x) {
    let countId = "amount" + x;
    let count = document.getElementById(countId).value;
    let colorID = "selectHtml" + x;
    let color2 = document.getElementById(colorID).value;
    grabber[x][1] = color2;
    grabber[x][2] = count;
    localStorage.setItem("bearCartArray", JSON.stringify(grabber));
    location.reload();
  });
}
//deletes the line item and then refreshed the page after. 
//it has its own refresh which avoids having to validate the form again
function deleteItem(item) {
  console.log(item.id);
  let deleteCount = item.id;
  deleteCount = deleteCount.slice(9, 10);
  deleteCount = parseInt(deleteCount);
  console.log(deleteCount);
  let grabber = JSON.parse(grabArray);
  grabber.splice(deleteCount, 1);
  console.log(grabber);
  localStorage.setItem("bearCartArray", JSON.stringify(grabber));
  debugger;
  location.reload();
}
//gets the total price and returns it formatted 
async function priceDisplayer() {
  let priceHldr = 0;
  bearData = await gatherBears();
  let grabber = JSON.parse(grabArray);
  bearData.forEach(function (item1, p) {
    grabber.forEach(function (item2, x) {
      if (item1._id === item2[0]) {
        bAmount = grabber[x][2];
        let mult = bears[p].price * bAmount;
        priceHldr = priceHldr + mult;
      }
    });
  });
  let bPrice2 = priceHldr.toString();
  bPrice2 =
    bPrice2.slice(0, bPrice2.length - 2) +
    "." +
    bPrice2.slice(bPrice2.length - 2);
  bPrice2 = "Price: $" + bPrice2;
  return bPrice2;
}
//data validation for bear counts
function bearCountDataValidate() {
  let checker = new Boolean(true);
  let sample = /^[0-9]+$/;
  let grabber = JSON.parse(grabArray);

  console.log(grabber.length, "grabber length");
  for (x = 0; x < grabber.length; x++) {
    let holdMe = "amount" + x;
    console.log(holdMe, "the hold me");
    let currentCount = document.getElementById(holdMe);
    if (currentCount.value.match(sample)) {

      console.log(currentCount.value.match(sample), "match checker");
    }else if(currentCount < 1) {
      currentCount.style.border = "2px solid red";
      currentCount.value = "Enter A Value of 1 or greater";
      checker = false;
    } else {
      currentCount.style.border = "2px solid red";
      currentCount.value = "Numbers Only";
      checker = false;

    }
  }
  if (checker == true) {
    updatePage();
    console.log(checker, "checker");
  } else {
    console.log(checker, "checker");
  }
}
//data validation for user form
function formDataValidate() {
  console.log("validation called");
  let checker = true;
  let textOnly = /^[A-Za-z]+$/;
  let emailOnly = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let addressOnly = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
  let email = document.forms["userInformation"]["email"];
  let address = document.forms["userInformation"]["address"];
  let validate = new Array(
    document.forms["userInformation"]["firstName"],
    document.forms["userInformation"]["lastName"],
    document.forms["userInformation"]["lastName"],
    document.forms["userInformation"]["city"]
  );
  validate.forEach(function (item, x) {
    if (validate[x].value.match(textOnly) === null) {
      validate[x].style.border = "2px solid red";
      checker = false;
    } else {
      validate[x].style.border = "2px solid green";
    }
  });
  if (email.value.match(emailOnly) === null) {
    email.style.border = "2px solid red";
    checker = false;
  } else {
    email.style.border = "2px solid green";
  }
  if (address.value.match(addressOnly) || address.value === "") {
    address.style.border = "2px solid red";
    checker = false;
  } else {
    address.style.border = "2px solid green";
  }
  if (checker) {
    console.log("passed all checks");
    redirectToCart();
  } else {
    document.getElementById("errorForm").innerHTML =
      "<h2 class='p-2 text-center text-white'>Please Enter Valid Information in all Red Boxes</h2>";
  }
}
//just the html string for each bear line item
function htmlString(x, bearImg, bearName, selectHTML, bAmount, bPrice2) {
  let cartDiv =
    "<div class='d-flex displayBears'><div class='p-2'><img class='cartImg' src='" +
    bearImg +
    "' alt='Girl in a jacket' width='160' height='200'> </div><div class='p-2'><div class='d-flex flex-column'><div class=' bearName'>" +
    bearName +
    "</div><div class=' bearColor mb-2'><div class='form-group'><label for='color" +
    x +
    "'>Color:</label><br><select class='colorSelect' id='selectHtml" +
    x +
    "'>" +
    selectHTML +
    "</select></div><div class='form-group colorDiv'><label for='count" +
    x +
    "'>Amount:</label><br><input type='text' id='amount" +
    x +
    "' name='cName" +
    x +
    "' value='" +
    bAmount +
    "'><br> </div></div><button type='button' class='btn btn-dark btn-sm updateButton ' onclick='bearCountDataValidate()'>Update Amount/Color</button></div></div><div class='p-2 text-end priceDiv ml-auto'>" +
    bPrice2 +
    "<br><button type='button' class='btn btn-danger btn-sm updateButton' onclick='deleteItem(this)' id='deleteKey" +
    x +
    "'>Deleted Item</button></div></div>";
  return cartDiv;
}
//send us to cart after form is data validated, puts the form into local storage
function redirectToCart(){
  let userForm = document.forms.userInformation;
  
  const userInfo ={
    'firstName' : userForm.elements.firstName.value,
    'lastName' : userForm.elements.lastName.value,
    'email' : userForm.elements.email.value,
    'address' : userForm.elements.address.value,
    'city' : userForm.elements.city.value
  }
  localStorage.setItem('userData' ,JSON.stringify(userInfo))
  window.location.href ='orderconfirmed.html'
}


displayBear();
cartCheckOnLoad();
priceDisplayer();


