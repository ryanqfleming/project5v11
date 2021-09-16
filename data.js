let cartDoc = document.getElementById('cart');

let cartCounter = 0;


async function gatherBears() {
    let url = 'http://localhost:3000/api/teddies';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {console.log(error);}    
}

async function displayBears() {
    let bears = await gatherBears();
    let html ='';
    bears.forEach(bear => {
        let bearName = bear.name;
        let bearImg = bear.imageUrl;
        let bearId = bear._id;
        let dontAskItJustWorks = 'bearClick("' + bearId + '")';
        //without this let trying to put the above code into the line below would result it showing up in the DOM as onclick="bearClick("48758943')" with the apostrophe still chilling. 
        //If I just switched my quotation marks with the apostrophes it might work, but who got time for dat.
        
        html += "<div class='bearContain text-center h3' ><div>" + bearName + "</div> <a href='#' onclick='"+ dontAskItJustWorks +"' title='bearlink' class='bearLink'> <img class='bearImg img-fluid rounded shadow' src='" + bearImg + "' alt='bearIMG'></a></div>";
        
    });
    

    let mainContain = document.querySelector('.bearContainer');

    mainContain.innerHTML = html;
 
}

async function bearClick(bId) {
   
    location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/teddy.html?id=" +bId;;
    //grabs the current URL, snips off the end and replaces it with the data we want to pass
    //had to do this instead of using the URL object because I needed it to work offline and online
    // I could of used local storage to pass the data instead but since we will be using local storage for the cart in this project I decided to parse via URL
}
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

displayBears();
cartCheckOnLoad();








