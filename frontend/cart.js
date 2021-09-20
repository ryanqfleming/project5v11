

let grabArray = localStorage.getItem("bearCartArray");
let itemList = new Array();
let displayCounter = 0;
let bears = "";
let totalPrice = 0;
let priceHolder;
console.log(grabArray);

if (grabArray === null || grabArray.length < 10) {
  document.getElementById("firstWrapper").innerHTML =
    "<div class='display-3'>EMPTY</div>";
}
async function nextForm() {
  document.getElementById("informationForm").style.display = "block";
  document.getElementById("firstWrapper").style.display = "none";
  document.getElementById("totalPriceHolder").innerHTML =
    await priceDisplayer();
}
function backForm() {
  document.getElementById("informationForm").style.display = "none";
  document.getElementById("firstWrapper").style.display = "block";
}
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
async function gatherBears() {
  let url = "http://localhost:3000/api/teddies";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
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
          //got to insert the period lol
          //to do this i just converted to string and then used the length - 2(the decimal place) for the slice
          let bPrice2 = bPrice.toString();
          bPrice2 =
            bPrice2.slice(0, bPrice2.length - 2) +
            "." +
            bPrice2.slice(bPrice2.length - 2);
          bPrice2 = "Price: $" + bPrice2;

          bears[p].colors.forEach(function (selection, q) {
            if (selection == grabber[x][1]) {
              // console.log(itemList[x][1], 'itemList');
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
          console.log(x, "the pp");
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
function updatePage() {
  let grabber = JSON.parse(grabArray);
  grabber.forEach(function (item, x) {
    let countId = "amount" + x;
    //console.log(countId, "countid");
    let count = document.getElementById(countId).value;
    //console.log(count, "dacount");
    let colorID = "selectHtml" + x;
    let color2 = document.getElementById(colorID).value;
    grabber[x][1] = color2;
    grabber[x][2] = count;
    //console.log("update called", x, count);
    //console.log(itemList, "the item list");
    localStorage.setItem("bearCartArray", JSON.stringify(grabber));
    location.reload();
  });
}
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
  //grabber.forEach(function(item, x) {
  console.log(grabber.length, "grabber length");
  for (x = 0; x < grabber.length; x++) {
    let holdMe = "amount" + x;
    console.log(holdMe, "the hold me");
    let currentCount = document.getElementById(holdMe);
    if (currentCount.value.match(sample)) {
      //updatePage();
      console.log(currentCount.value.match(sample), "match checker");
    }else if(currentCount < 1) {
      currentCount.style.border = "2px solid red";
      currentCount.value = "Enter A Value of 1 or greater";
      checker = false;
    } else {
      currentCount.style.border = "2px solid red";
      currentCount.value = "Numbers Only";
      checker = false;
      //break;
    }
  }
  if (checker == true) {
    updatePage();
    console.log(checker, "checker");
  } else {
    console.log(checker, "checker");
  }
}
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

//document.getElementById('totalPriceHolder').innerHTML = priceHolder;
