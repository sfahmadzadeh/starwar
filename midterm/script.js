var movieURLs = ["https://swapi.dev/api/films/4", "https://swapi.dev/api/films/5", "https://swapi.dev/api/films/6", "https://swapi.dev/api/films/1", "https://swapi.dev/api/films/2", "https://swapi.dev/api/films/3"];

showMoviesList();

/*This function is called at start and every time 'back to movies' button is clicked*/
async function showMoviesList(){
    let content = document.getElementById("content");
    content.innerHTML = "";

    /*Create and show the title of the movies page*/
    const title = document.createElement("div");
    title.innerHTML = "Movies";
    title.style.fontSize = "50px";
    content.appendChild(title);

    /*List will contain all blocks of movies*/
    const list = document.createElement("div");

    /*Get information of movies from links*/
    var movies = await getMovieInfo();
    console.log(movies.length);
    /*create html blocks for each movie*/
    for(let i = 0; i < movieURLs.length; i++){
        const movieDiv = createMovieDiv(movies[i]);
        list.appendChild(movieDiv);
    }

    /*The list of movies will be repsented by a left magin*/
    list.style.marginLeft = "50px";

    content.appendChild(list);
}

/*This functin is called in 'showMoviesList' function*/
async function getMovieInfo(){
    var movies = [];

    /*Send request to each link.
    Wait for getting response from each request.
    Parse json and save needed information in an object*/
    for(let i = 0; i < movieURLs.length; i++){
        let response = await fetch(movieURLs[i]);
        let json = await response.json();
        console.log(json.title);
        var movie = {
            title : json.title,
            episodeID : json.episode_id,
            releaseDate : json.release_date,
            starships : json.starships,
        };
        movies.push(movie);
        console.log(movie.name);
    }

    /*Returns an array of objects that contain movies information*/
    return movies;
}       

/*Creates and retuns the main div block of one movie.
This function is called in 'showMoviesList' function*/
const createMovieDiv=(movie) =>{
    const left = createMovieLeftSideDiv(movie);
    const right = createMovieRightSide(movie);
    left.style.marginLeft = "50px";
    const main = document.createElement("div");
    main.style.display = "flex";
    main.style.justifyItems = "space-between";
    main.appendChild(left);
    main.appendChild(right);

    return main;
}

/*Creates and returns a div that is at right side of each movies list line.
This function is called in 'createMovieDiv' function*/
const createMovieLeftSideDiv=(movie) =>{
    const movieInfo = createMovieInfoDiv(movie);
    movieInfo.style.width = "600px";

    const circle = document.createElement("div");
    circle.style.height = "10px";
    circle.style.width = "10px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "tomato"
    circle.style.float = "left";
    circle.style.marginTop = "5px";
    
    const right = document.createElement("span");
    right.appendChild(circle);
    right.appendChild(movieInfo);

    return right;
}

/*Creates and retuns div block that contains information of one movie
This function is called in 'createMovieLeftSideDiv' function*/
const createMovieInfoDiv=(movie) =>{
    const title = document.createElement("div");
    title.setAttribute("class", "movieTitle");
    title.innerHTML = "<a>" + movie.title + "</a>";
    title.style.marginRight = "20px";

    const id = document.createElement("div");
    id.setAttribute("class", "episodeID");
    id.innerHTML = "<a>" + movie.episodeID + "</a>";
    id.style.marginRight = "20px";

    const releaseDate = document.createElement("div");
    releaseDate.setAttribute("class", "releaseDate");
    releaseDate.innerHTML = "<a>" + movie.releaseDate + "</a>";

    const movieInfo = document.createElement("div");
    movieInfo.setAttribute("class", "movieInfo");
    movieInfo.style.width = "600px";
    movieInfo.style.display = "flex";
    movieInfo.style.justifyItems = "space-between";
    movieInfo.appendChild(title);
    movieInfo.appendChild(id);
    movieInfo.appendChild(releaseDate);

    return movieInfo;
}

/*Creates and returns a div that is at right side of each movies list line.
This function is called in 'createMovieDiv' function*/
const createMovieRightSide=(movie) =>{
    const left = document.createElement("div");

    /*Create and set attributes of starships button*/
    const btn = document.createElement("button");
    btn.style.backgroundColor = "rgba(255, 255, 255, .15)";
    btn.style.backdropFilter = "blur(5px)";
    btn.style.border = "none";
    btn.style.color = "tomato";
    btn.innerHTML = "starships";

    /*Add event listener to the button
    If this button is clicked list of movie's starships will be represented in a new page*/
    btn.addEventListener("click", () =>{
        showFirstStarshipsPage(movie.starships);
    });

    left.appendChild(btn);

    return left;
}

/*This function is called in 'createMovieLeftSide' function when the 'starships' buttom of a movie is clicked*/
async function showFirstStarshipsPage(starships){
    /*Get information of starships from links*/
    var starshipsInfo = await getStarshipsInfo(starships);

    var numberOfPages = parseInt(starships.length / 6);
    if(parseInt(starships.length % 6) > 0){
        numberOfPages++;
    }

    const container = createStarshipsPage(numberOfPages, 1, starshipsInfo);
    
    const content = document.getElementById("content");
    content.innerHTML = "";

    content.appendChild(container);
}

/*This function is called in 'showFirstStarshipsPage' function*/
async function getStarshipsInfo(starships){
    var strashipsInfo = [];

    /*Send request to each link.
    Wait for getting response from each request.
    Parse json and save needed information in an object*/
    for(let i = 0; i < starships.length; i++){
        let response = await fetch(starships[i]);
        let json = await response.json();
        var starship = {
            name : json.name,
            model : json.model,
            manufacturer : json.manufacturer,
            crew : json.crew,
            passengers : json.passengers,
        };
        strashipsInfo.push(starship);
    }

    /*Returns an array of objects that contain starships information*/
    return strashipsInfo;
}

/*This function is callled in 'showFirstStarshipsPage' function.
Creates and returns the main div block that contains the content of starships list page*/
const createStarshipsPage=(numOfPages, currentPage, starshipsInfo) =>{
    let start = (currentPage - 1) * 6;
    let end;
    if(currentPage == numOfPages){
        end = starshipsInfo.length - 1;
    }
    else{
        end = start + 5;
    }
    const currentStarships = starshipsInfo.slice(start, end + 1);
    const starshipName = createStarshipNamesSection(currentStarships);
    const btns = createBottomButtonsSection(currentPage, numOfPages, starshipsInfo);
    
    const container = document.createElement("div");

    const main = document.createElement("span");

    /*Dislay is set to flex and flexDirecion is set to row so the child blocks of 'main' ('starshipName' And 'details') will be represented in one row*/
    main.style.display = "flex";
    main.style.flexDirection = "row";

    main.appendChild(starshipName);
    const details = document.createElement("div");
    details.setAttribute("id", "details");
    main.appendChild(details);

    container.appendChild(main);
    container.appendChild(btns);

    return container;
}

/*This function is called in 'createStarshipsPage' 
Creates and returns the div block that contains the list of starships names*/
const createStarshipNamesSection=(currentStarships) =>{
    const starships = document.createElement("div");
    for (let i = 0; i < currentStarships.length; i++){
        starships.appendChild(createStarshipSpan(currentStarships[i]));
    }
    starships.style.marginLeft = "50px";

    const title = document.createElement("div");
    title.innerHTML = "Starships";
    title.style.fontSize = "50px";

    const starshipNames = document.createElement("div");
    starshipNames.appendChild(title);
    starshipNames.appendChild(starships);

    return starshipNames;
}

/*This function is called in 'createStarshipNamesSection' function 
Creates and returns a span block that contain name of one starship*/
const createStarshipSpan=(starship) =>{
    const circle = document.createElement("div");
    circle.style.height = "10px";
    circle.style.width = "10px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "tomato"
    circle.style.float = "left";
    circle.style.marginTop = "5px";

    const starshipName = document.createElement("div");
    starshipName.style.width = "300px";

    /*Create and set attributes of starship name button*/
    const btn = document.createElement("button");
    btn.innerHTML = starship.name;
    btn.style.backgroundColor = "rgba(255, 255, 255, .15)";
    btn.style.backdropFilter = "blur(5px)";
    btn.style.border = "none";
    btn.style.color = "tomato";

    /*Add event listener to the button
    If this button is clicked the information of the starship will be repsented at the right side of page*/
    btn.addEventListener("click", () =>{
        showDetialsOfStarship(starship);
    })
    starshipName.appendChild(btn);

    const starshipSpan = document.createElement("span");
    starshipSpan.appendChild(circle);
    starshipSpan.appendChild(starshipName);

    return starshipSpan;
}

/*This function is called in 'createStarshipsPage' function.
Creates and retuns the div block which contains the bottom buttons ('next', 'prev' and 'back to movies')*/
const createBottomButtonsSection=(currentPage, numOfPages, starshipsInfo) =>{
    const pages = document.createElement("span");

    /*Creats 'prev' button and adds it to 'pages' block if the the current page is not the first page*/
    if(currentPage != 1){
        const prev = document.createElement("div");
        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = "prev";
        prevBtn.style.backgroundColor = "rgba(255, 255, 255, .15)";
        prevBtn.style.backdropFilter = "blur(5px)";
        prevBtn.style.border = "none";
        prevBtn.style.color = "tomato";

        /*If the button is clicked, the previous page of starship list will be represented*/
        prevBtn.addEventListener("click", () =>{
            const container = createStarshipsPage(numOfPages, currentPage - 1, starshipsInfo);
            const content = document.getElementById("content");
            content.innerHTML = "";
            content.appendChild(container);
        });
        prev.appendChild(prevBtn);
        pages.appendChild(prev);
    }

    /*Creats 'next' button and adds it to 'pages' block if the the current page is not the last page*/
    if(currentPage < numOfPages){
        const next = document.createElement("div");
        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = "next";
        nextBtn.style.backgroundColor = "rgba(255, 255, 255, .15)";
        nextBtn.style.backdropFilter = "blur(5px)";
        nextBtn.style.border = "none";
        nextBtn.style.color = "tomato";

        /*If the button is clicked, the next page of starship list will be represented*/
        nextBtn.addEventListener("click", () =>{
            const container = createStarshipsPage(numOfPages, currentPage + 1, starshipsInfo);
            const content = document.getElementById("content");
            content.innerHTML = "";
            content.appendChild(container);
        });
        next.appendChild(nextBtn);
        pages.appendChild(next);
    }

    const back = document.createElement("div");
    const backBtn = document.createElement("button");
    backBtn.innerHTML = "back to movies";
    backBtn.style.backgroundColor = "rgba(255, 255, 255, .15)";
    backBtn.style.backdropFilter = "blur(5px)";
    backBtn.style.border = "none";
    backBtn.style.color = "tomato";

    /*If the button is clicked, the list of movies information will be represented again*/
    backBtn.addEventListener("click", showMoviesList);

    back.appendChild(backBtn);

    const btns = document.createElement("div");
    btns.style.marginTop = "30px";
    btns.appendChild(pages);
    btns.appendChild(back);

    return btns;
}

/*This function is called in 'createStarshipSpan' function in the event listener of a starship name button.
Reresents the detail information of a starship at the right side of the page*/
const showDetialsOfStarship=(starship) =>{
    const details = document.getElementById("details");
    const title = document.createElement("div");
    title.innerHTML = starship.name;
    title.style.fontSize = "40px";
    details.innerHTML = "";
    details.appendChild(title);
    details.appendChild(createStarshipDetailsDiv(starship));
}

/*This function is called in 'showDetialsOfStarship' function
Creates and returns the div block that contains detail information of a starship*/
const createStarshipDetailsDiv=(starship) =>{
    const container = document.createElement("div");
    container.style.width = "300px";
    container.style.marginLeft = "50px";

    const circle = document.createElement("div");
    circle.style.height = "10px";
    circle.style.width = "10px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "tomato"
    circle.style.float = "left";
    circle.style.marginTop = "5px";

    const model = document.createElement("span");
    model.appendChild(circle);
    const modelInfo = document.createElement("div");
    modelInfo.innerHTML = starship.model;
    model.appendChild(modelInfo);
    container.appendChild(model);

    const manufacturer = document.createElement("span");
    manufacturer.appendChild(circle.cloneNode(true));
    const manufacturerInfo = document.createElement("div");
    manufacturerInfo.innerHTML = starship.manufacturer;
    manufacturer.appendChild(manufacturerInfo);
    container.appendChild(manufacturer);

    const crew = document.createElement("span");
    crew.appendChild(circle.cloneNode(true));
    const crewInfo = document.createElement("div");
    crewInfo.innerHTML = starship.crew;
    crew.appendChild(crewInfo);
    container.appendChild(crew);

    const passengers = document.createElement("span");
    passengers.appendChild(circle.cloneNode(true));
    const passengersInfo = document.createElement("div");
    passengersInfo.innerHTML = starship.passengers;
    passengers.appendChild(passengersInfo);
    container.appendChild(passengers);

    return container;
}