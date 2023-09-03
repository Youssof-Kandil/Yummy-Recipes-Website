// Display loading screen till the initial page loads
$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

// ---------------------------------------------------------- Nav bar
let navWidth = $(".inner-nav-content").innerWidth();

// onclick event on the button to close or open the sidebar
$(".open-close-icon").click(function (e) {
  if ($("#sideNav").css("left") == "0px") {
    // if open, close
    closeSideBar(navWidth);
  } else {
    // if closed, open
    openSideBar();
  }
});

//Closes the Side bar
function closeSideBar(navWidth) {
  // remove the current button icon and replace with another
  $(".open-close-icon svg").removeClass("fa-x");
  $(".open-close-icon svg").addClass("fa-bars");
  // slide the nav bar to the left to close it
  $("#sideNav").animate({ left: -navWidth }, 500);
  $(".nav-items li").animate({ top: 300 }, 500);
}

//Opens the Side bar
function openSideBar() {
  // slides the nav bar to the right to open it
  $("#sideNav").animate({ left: 0 }, 500);
  //slide icons up
  for (let i = 0; i < 5; i++) {
    $(".nav-items li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
  // remove the current button icon and replace with another
  $(".open-close-icon svg").addClass("fa-x");
  $(".open-close-icon svg").removeClass("fa-bars");
}

// ----------------------------------------------------------

//SEARCH BY NAME
$("#nameSearch").keyup(function (e) {
  let entered = this.value;
  searchByName(entered);
});
// Async function to search by name using the name api.
async function searchByName(Name) {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${Name}`
  );
  mealsResponse = await mealsResponse.json();
  //display The meals on the html
  displayMeals(mealsResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

//SEARCH BY FIRSTLETTER
$("#letterSearch").keyup(function (e) {
  let entered = this.value;
  searchByFirstLetter(entered);
});
// Async function to search by name the first letter using the first letter api.
async function searchByFirstLetter(Letter) {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${Letter}`
  );
  mealsResponse = await mealsResponse.json();
  //display The meals on the html
  displayMeals(mealsResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

// Async function to get meal details.
async function getMealDetails(id) {
  $(".inner-loading-screen").fadeIn(300);
  closeSideBar(navWidth);
  let mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  mealsResponse = await mealsResponse.json();
  //display The meals on the html
  displayMealDetials(mealsResponse.meals[0]);
  $(".inner-loading-screen").fadeOut(300);
}
// Function to display meal Details
function displayMealDetials(mealsResponse) {
  //empty the data in the html
  $("#rowData").html("");
  $("#searchContainer").css("display", "none");

  //gather the ingredients in a single string
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (mealsResponse[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        mealsResponse[`strMeasure${i}`]
      } ${mealsResponse[`strIngredient${i}`]}</li>`;
    }
  }
  // Split the tags and put them in an array. and gather them in one string.
  let tags = mealsResponse.strTags?.split(",");
  if (!tags) tags = [];
  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  // fill the cartoona with the full strings to pass it to the html
  let cartoona = `<div class="col-md-4">
  <img class="w-100 rounded-3" src=${mealsResponse.strMealThumb}
      alt="ay kalam">
  <h2>${mealsResponse.strMeal}</h2>
</div>
<div class="col-md-8">
  <h2>Instructions</h2>
  <p>${mealsResponse.strInstructions}</p>
  <h3><span class="fw-bolder">Area : </span>${mealsResponse.strArea}</h3>
  <h3><span class="fw-bolder">Category : </span>${mealsResponse.strCategory}</h3>
  <h3>Recipes :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
     ${ingredients}
  </ul>

  <h3>Tags :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
                    
        ${tagsStr}
  </ul>

  <a target="_blank" href=${mealsResponse.strSource}
      class="btn btn-success">Source</a>
  <a target="_blank" href=${mealsResponse.strYoutube}
      class="btn btn-danger">Youtube</a>
</div>`;
  $("#rowData").html(cartoona);
}

//------------------------------------------CATEGORY---------------------------------------
// GET THE CATEGORIES
async function getCategories() {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let categResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  categResponse = await categResponse.json();
  //display The categ on the html
  displayCategories(categResponse.categories);
  $(".inner-loading-screen").fadeOut(300);
}

// DISPLAY CATEGORIES
function displayCategories(categResponse) {
  // empties the row data in the html
  $("#rowData").html("");
  let cartoona = ``;
  for (let counter = 0; counter < categResponse.length; counter++) {
    if (counter == 20) {
      break;
    }
    let descStrings = categResponse[counter].strCategoryDescription.split("[");
    cartoona += `<div class="col-md-3">
    <div onclick="getCategoryMeals('${
      categResponse[counter].strCategory
    }')" class="position-relative overflow-hidden rounded-2 meal">
        <img src=${
          categResponse[counter].strCategoryThumb
        } alt="image of recipe" class="w-100">
        <div class="meal-layer position-absolute text-black p-2 text-center">
            <h3>${categResponse[counter].strCategory}</h3>
            <p>${descStrings[0].split(" ").slice(0, 30).join(" ")}</p>
        </div>
    </div>
</div>`;
  }
  $("#rowData").html(cartoona);
}

// GET CATEGORY MEALS
async function getCategoryMeals(name) {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`
  );
  mealsResponse = await mealsResponse.json();
  //display The meals on the html
  displayMeals(mealsResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

//------------------------------------------AREA--------------------------------------------
// GET THE AREAS
async function getAreas() {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let areaResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  areaResponse = await areaResponse.json();
  //display The categ on the html
  displayAreas(areaResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

// DISPLAY AREAS
function displayAreas(areaResponse) {
  // empties the row data in the html
  $("#rowData").html("");
  let cartoona = ``;
  for (let counter = 0; counter < areaResponse.length; counter++) {
    if (counter == 20) {
      break;
    }
    cartoona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${areaResponse[counter].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${areaResponse[counter].strArea}</h3>
                </div>
        </div>
        `;
  }
  $("#rowData").html(cartoona);
}

// GET AREAS MEALS
async function getAreaMeals(name) {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`
  );
  mealsResponse = await mealsResponse.json();
  //display The meals on the html
  displayMeals(mealsResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

//------------------------------------------INGREDIENTS---------------------------------------
// GET THE INGREDIENTS
async function getIngredients() {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let ingredientResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  ingredientResponse = await ingredientResponse.json();
  //display The categ on the html
  displayIngredients(ingredientResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

// DISPLAY INGREDIENTS
function displayIngredients(ingredientResponse) {
  // empties the row data in the html
  $("#rowData").html("");
  let cartoona = ``;
  for (let counter = 0; counter < ingredientResponse.length; counter++) {
    if (counter == 20) {
      break;
    }
    cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${
                  ingredientResponse[counter].strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredientResponse[counter].strIngredient}</h3>
                        <p>${ingredientResponse[counter].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }
  $("#rowData").html(cartoona);
}

// GET INGREDIENTS MEALS
async function getIngredientsMeals(name) {
  closeSideBar();
  $(".inner-loading-screen").fadeIn(300);

  let mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`
  );
  mealsResponse = await mealsResponse.json();
  //display The meals on the html
  displayMeals(mealsResponse.meals);
  $(".inner-loading-screen").fadeOut(300);
}

//-------------------------------------------------------------------------------------------

// ------------------------------------------- Display the meals on the HTML
function displayMeals(mealsResponse) {
  // empties the row data in the html
  $("#rowData").html("");
  let cartoona = ``;
  for (let counter = 0; counter < mealsResponse.length; counter++) {
    if (counter == 20) {
      break;
    }
    cartoona += `<div class="col-md-3">
    <div onclick="getMealDetails(${mealsResponse[counter].idMeal})" class="position-relative overflow-hidden rounded-2 meal">
        <img src=${mealsResponse[counter].strMealThumb} alt="image of recipe" class="w-100">
        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${mealsResponse[counter].strMeal}</h3>
        </div>
    </div>
</div>`;
  }
  $("#rowData").html(cartoona);
}

// ---------------------------------------------Contact Page -------------------------------------
// DISPLAY THE HTML OF THE CONTENT PAGE ON SIDEBAR CLICK
function displayContact() {
  let cartoona = `<div class="contact d-flex min-vh-100 justify-content-center align-items-center">
  <div class="container text-center w-75">
      <div class="row g-4">
          <div class="col-md-6">
              <input type="text" class="form-control" id="nameInput" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input type="email" class="form-control" id="emailInput" placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input type="text" class="form-control" id="phoneInput" placeholder="Enter Your phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input type="number" class="form-control" id="ageInput" placeholder="Enter Your age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input type="password" class="form-control" id="passwordInput"
                  placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input type="password" class="form-control" id="rePassword" placeholder="Repassword">
              <div id="rePasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid repassword
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled="" class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div>`;
  $("#rowData").html(cartoona);

  // ON FOCUS ON AN INPUT IT SETS THE CORROSPONDING VAR TO TRUE
  $("#nameInput").focus(function (e) {
    nameInputTouched = true;
    console.log("trueeee");
  });

  $("#emailInput").focus(function (e) {
    emailInputTouched = true;
  });

  $("#phoneInput").focus(function (e) {
    phoneInputTouched = true;
  });

  $("#ageInput").focus(function (e) {
    ageInputTouched = true;
  });

  $("#passwordInput").focus(function (e) {
    passwordInputTouched = true;
  });

  $("#rePassword").focus(function (e) {
    repasswordInputTouched = true;
  });
  $(".contact .form-control").keyup(function (e) {
    inputsValidation();
  });
}

// VARS TO HELP DETERMINE WHICH INPUT WAS FOCUSED
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

// Regex Validations
function validateName() {
  return /^[a-zA-Z ]+$/.test($("#nameInput").val());
}
function validateEmail() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    $("#emailInput").val()
  );
}
function validatePhone() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    $("#phoneInput").val()
  );
}
function validateAge() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val());
}
function validatePassword() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val());
}
function validateRepassword() {
  return $("#rePassword").val() == $("#passwordInput").val();
}

// VALIDATION METHOD THAT VALIDATES ALL THE DATA IN THE FORUM
function inputsValidation() {
  if (nameInputTouched) {
    if (validateName()) {
      $("#nameAlert").removeClass("d-block");
      $("#nameAlert").addClass("d-none");
    } else {
      $("#nameAlert").removeClass("d-none");
      $("#nameAlert").addClass("d-block");
    }
  }
  if (emailInputTouched) {
    if (validateEmail()) {
      $("#emailAlert").removeClass("d-block");
      $("#emailAlert").addClass("d-none");
    } else {
      $("#emailAlert").removeClass("d-none");
      $("#emailAlert").addClass("d-block");
    }
  }

  if (phoneInputTouched) {
    if (validatePhone()) {
      $("#phoneAlert").removeClass("d-block");
      $("#phoneAlert").addClass("d-none");
    } else {
      $("#phoneAlert").removeClass("d-none");
      $("#phoneAlert").addClass("d-block");
    }
  }

  if (ageInputTouched) {
    if (validateAge()) {
      $("#ageAlert").removeClass("d-block");
      $("#ageAlert").addClass("d-none");
    } else {
      $("#ageAlert").removeClass("d-none");
      $("#ageAlert").addClass("d-block");
    }
  }

  if (passwordInputTouched) {
    if (validatePassword()) {
      $("#passwordAlert").removeClass("d-block");
      $("#passwordAlert").addClass("d-none");
    } else {
      $("#passwordAlert").removeClass("d-none");
      $("#passwordAlert").addClass("d-block");
    }
  }
  if (repasswordInputTouched) {
    if (validateRepassword()) {
      $("#rePasswordAlert").removeClass("d-block");
      $("#rePasswordAlert").addClass("d-none");
    } else {
      $("#rePasswordAlert").removeClass("d-none");
      $("#rePasswordAlert").addClass("d-block");
    }
  }

  if (
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAge() &&
    validatePassword() &&
    validateRepassword()
  ) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", true);
  }
}

// -----------------------------------------------------------------------------------------------
//SIDE NAV BUTTON CLICKS
$("#search").click(function (e) {
  closeSideBar(navWidth);
  $("#searchContainer").css("display", "block");
  $("#rowData").html("");
});
//SLIDES THE PAGE UP WHEN CLICKING SEARCH TO GET THE SEARCH SMOOTH
$("#search").click(function () {
  // Scroll to the top of the page with a smooth animation
  $("html, body").animate({ scrollTop: 0 });
});

$("#categ").click(function (e) {
  closeSideBar(navWidth);
  $("#searchContainer").css("display", "none");
  $("#rowData").html("");
  getCategories();
});
$("#area").click(function (e) {
  closeSideBar(navWidth);
  $("#searchContainer").css("display", "none");
  $("#rowData").html("");
  getAreas();
});
$("#ingr").click(function (e) {
  closeSideBar(navWidth);
  $("#searchContainer").css("display", "none");
  $("#rowData").html("");
  getIngredients();
});
$("#contact").click(function (e) {
  closeSideBar(navWidth);
  $("#searchContainer").css("display", "none");
  $("#rowData").html("");
  displayContact();
});
