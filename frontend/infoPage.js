
//BEHOLD.... MY STUFF!!
//if I can't read this code in the morning I will have nobody but myself to blame
let grabArray = localStorage.getItem('bearCartArray');
let ticker =0;
let checker = new Boolean(false);

console.log(grabArray)
let storArray = new Array ();
let scroller = document.getElementById('scrollOut');
let bearImage = document.getElementById('bearMainImage');



let cartCounter = 0;

function cartCheckOnLoad(){
    let cartDoc = document.getElementById('cart');
   let cartChecker = localStorage.getItem('cartCountStor');
   let grabArray5 = localStorage.getItem('bearCartArray');
   console.log(cartChecker);
   if (grabArray5 !== null) {
    let totalCart=0;
    let grabber = JSON.parse(grabArray5);
    console.log(grabber,'grabber')
    grabber.forEach(function(item, x){
        totalCart = totalCart + JSON.parse(item[2]);
    });
    cartDoc.innerHTML = "Cart(" + totalCart + ")";
    } 

}
async function gatherBears() {
    let url = 'http://localhost:3000/api/teddies';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {console.log(error);}    
}

//returns the index number of the matching ID
function getBear(bears) {
    const myURL = new URL(window.location.href); 
    for (let bearIndex = 0; bearIndex < bears.length; bearIndex++) {
        if (bears[bearIndex]._id == myURL.searchParams.get("id")){
           return bearIndex;
        } 
    }  
}
//noice
function fadeOutOnScroll(element, elementOp) {
	if (!element) {
		return;
	}
	
	var distanceToTop = window.pageYOffset + element.getBoundingClientRect().top;
	var elementHeight = element.offsetHeight;
	var scrollTop = document.documentElement.scrollTop;
	
	var opacity = 1;
	
	if (scrollTop > distanceToTop) {
		opacity = 1 - (scrollTop - distanceToTop) / elementHeight;

	}
	
	if (opacity >= 0) {
		elementOp.style.opacity = opacity;
	}
}
function scrollHandler() {
    //yeah yeah... i copy and pasted this code lol
    //but considering it is not part of the assigment who cares
    //I would not write such redundent functions with the only purpose to call other functions... right....

	fadeOutOnScroll(bearImage, scroller);
}

async function displayBear() {  
    let bears = await gatherBears();
    let bearIndex = null;
    bearIndex = getBear(bears);
    //this if statment sends the user to back to the homepage if any data sent is incorrent or missing
    if( typeof bearIndex === 'undefined' || bearIndex === null ){
        location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/index.html";
    }
    document.getElementById("meetHeader").innerHTML = "Meet <em>" + bears[bearIndex].name + "</em>" ;
    document.getElementById("bearMainImage").src = bears[bearIndex].imageUrl;
    document.getElementById("bearSecImage").src = bears[bearIndex].imageUrl;
    document.getElementById("meetContainer").innerHTML = "<p>"+ bears[bearIndex].description +"</p>";
    //by golly that is a lot of elements
    bears[bearIndex].colors.forEach(element => {
        document.getElementById("colorSelect2").innerHTML += "<option>"+ element +"</option>"
    });
    
  //purdy background
    let boxOne = document.body.style.backgroundImage = "url(" + bears[bearIndex].imageUrl+ ")";
    console.log(boxOne)

    //insert price
    let priceData = bears[bearIndex].price;
    //got to insert the period lol
    //to do this i just converted to string and then used the length - 2(the decimal place) for the slice
    priceData = priceData.toString();
    priceData = priceData.slice(0,priceData.length - 2) + "." + priceData.slice(priceData.length - 2)
    document.getElementById("price").innerHTML = "Price: $" + priceData;

  
}

function addToCart() {
    //setting the trip checker to true on start of function
    checker = true;
    let grabArray4 = localStorage.getItem('bearCartArray');
    const datURL =  new URL(window.location.href);
    let duoURL = datURL.searchParams.get("id");
    let selectColor3 = document.getElementById('colorSelect2').value;
    if(grabArray4 === null){ 
        console.log('item was null, creating Array and adding item at 0');
        grabArray4 = new Array();
        grabArray4[0] = new Array (duoURL, selectColor3, 1);
        localStorage.setItem("bearCartArray", JSON.stringify(grabArray4));
        checker = false;
    } else {
        console.log('Item was valid checking for matches with current URL')
        let grabber = JSON.parse(grabArray4);
        //our checker loop
        grabber.forEach(function(item, x){
           if(grabber[x][0] == duoURL && grabber[x][1] == selectColor3){
            console.log('we have a match, increasing count at ', x);
               ticker = grabber[x][2]
               ticker = ticker + 1;
               grabber[x][2] = ticker; 
               console.log(grabber);
               let grabStrng = JSON.stringify(grabber)
               localStorage.setItem("bearCartArray", grabStrng);
               //checker is tripped to false preventing the if below from adding another line item
               checker = false;
           }
        });
        if(checker == true) {
            grabber[grabber.length]= new Array(duoURL, selectColor3, 1)
            console.log('grabber array', grabber)
            let grabStrng = JSON.stringify(grabber)
            localStorage.setItem("bearCartArray", grabStrng);
        }
    }
    //lets update the cart count by adding together the amount and setting it to cart
    cartCheckOnLoad()

}


cartCheckOnLoad()
displayBear();
window.addEventListener('scroll', scrollHandler);
