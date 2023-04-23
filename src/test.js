//this time, i will fetch data dynamically instead of saving the fetched data
const menu = document.getElementById("films");
let remainingTickets = document.getElementById("ticket-num");
const ticketsElement = document.getElementById("tickets");
const button = document.getElementById("buy-ticket");
const soldOutIcon = document.createElement("i");
const baseUrl = "http://localhost:3000/films";
let movieID = 1;
let ticketsSold;
let capacity;

// handling fetch errors
async function fetchMovies() {
  try {
    const response = await fetch(baseUrl);

    if (response.ok) {
      const data = await response.json();
      //   console.log(data);
      loadMovies(data);
    } else {
      throw new Error("Oops, Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
}

// load movies and attach click event listener
function loadMovies(data) {
  menu.innerHTML = "";
  for (const movie of data) {
    const movieItem = document.createElement("li");
    movieItem.innerText = movie.title;
    movieItem.className = "film item";
    movieItem.style.cursor = "pointer";
    // const deleteMovie=document.createElement("button")
    // deleteMovie.id="delete"
    // deleteMovie.textContent="delete"
    movieItem.id = movie.id;
    // movieItem.appendChild(deleteMovie)
    menu.appendChild(movieItem);
    // deleteMovie.onclick = function() {
    //     const parent = this.parentNode;
    //     parent.remove();
//   }
  menu.addEventListener("click", (e) => {
    movieID = e.target.id;
    // console.log(movieID);
    loadMovieData(movieID);
    revertTicketAvailability()
  });
  loadMovieData(movieID);
}
}
// load movie data by id
function loadMovieData(movieID) {
  async function fetchMovie() {
    try {
      const response = await fetch(`${baseUrl}/${movieID}`);
      if (response.ok) {
        const data = await response.json();
        const moviePoster = document.getElementById("poster");
        moviePoster.src = data.poster;
        const movieTitle = document.getElementById("title");
        movieTitle.textContent = data.title;
        const movieRuntime = document.getElementById("runtime");
        movieRuntime.textContent = formatRuntime(data.runtime);
        const movieDescription = document.getElementById("film-info");
        movieDescription.textContent = data.description;
        const movieShowTime = document.getElementById("showtime");
        movieShowTime.textContent = data.showtime;
        ticketsSold = data.tickets_sold;
        capacity = data.capacity;
        remainingTickets.textContent = capacity - ticketsSold;
      } else {
        throw new Error("Oops, Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  }
  fetchMovie();
}


function sellMovies() {
  const button = document.getElementById("buy-ticket");
  const soldOutIcon = document.createElement("i");
  soldOutIcon.classList.add("fa-solid", "fa-triangle-exclamation");
  button.addEventListener("click", () => {
    if (remainingTickets.textContent > 0) {
      ticketsSold += 1;
      let remainingCapacity = capacity - ticketsSold;
      remainingTickets.textContent = remainingCapacity;
      if (remainingTickets.textContent === "0") {
        const soldOutMovie = document.querySelector(
          ".film.item:nth-child(" + movieID + ")"
        );
        soldOutMovie.classList.add("sold-out");
        ticketsElement.textContent = "SOLD OUT ";
        ticketsElement.appendChild(soldOutIcon);
        button.textContent = "Sold Out";
      }
    }
  });
}
function revertTicketAvailability() {
    const soldOutMovie = document.querySelector(
      ".film.item:nth-child(" + movieID + ")"
    );
    if (remainingTickets.textContent > 0) {
      soldOutMovie.classList.remove("sold-out");
      ticketsElement.textContent = `Remaining Tickets`;
      button.disabled = false;
      button.textContent = "Buy Tickets";
    } else {
      soldOutMovie.classList.add("sold-out");
      ticketsElement.textContent = "SOLD OUT ";
      ticketsElement.appendChild(soldOutIcon);
      button.disabled = true;
      button.textContent = "Sold Out";
    }
  }

//Let's make the runtime readable by formatting it into hours and minutes
function formatRuntime(runtime) {
    let hours = Math.floor(runtime / 60);
    let minutes = runtime % 60;
    let result = "";
    if (hours > 0) {
      result += hours + " hr";
      if (hours > 1) {
        result += "s";
      }
      result += " ";
    }
    if (minutes > 0) {
      result += minutes + " min";
    }
    return result;
  }


sellMovies();

fetchMovies();
/* somehow, when fetching dynamically, the tickets sold out cannot persist if we navigate back to the movie, unless we change the server side. I managed to update the server but the page refreshes and loads slowly. Check test.js file */
//--------code 2------------------------
//this time, i will fetch data dynamically instead of saving the fetched data
/* const menu = document.getElementById("films");
let remainingTickets = document.getElementById("ticket-num");
const soldOutIcon = document.createElement("i");
const ticketsElement = document.getElementById("tickets");
const button = document.getElementById("buy-ticket");
const baseUrl = "http://localhost:3000/films";
let movieID = 1;
let ticketsSold;
let capacity;

// handling fetch errors
async function fetchMovies() {
  try {
    const response = await fetch(baseUrl);

    if (response.ok) {
      const data = await response.json();
      //   console.log(data);
      loadMovies(data);
    } else {
      throw new Error("Oops, Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
}

// load movies and attach an event listener to the menu
function loadMovies(data) {
  menu.innerHTML = "";
  for (const movie of data) {
    const movieItem = document.createElement("li");
    movieItem.innerText = movie.title;
    movieItem.className = "film item";
    movieItem.style.cursor = "pointer";
    movieItem.id = movie.id;
    menu.appendChild(movieItem);
  }
  menu.addEventListener("click", (e) => {
    movieID = e.target.id;
    // console.log(movieID);
    loadMovieData(movieID);
  });
  loadMovieData(movieID);
  
}
//lets format the runtime for the movies to make it easier to read
function formatRuntime(runtime) {
  let hours = Math.floor(runtime / 60);
  let minutes = runtime % 60;
  let result = "";
  if (hours > 0) {
    result += hours + " hr";
    if (hours > 1) {
      result += "s";
    }
    result += " ";
  }
  if (minutes > 0) {
    result += minutes + " min";
  }
  return result;
}
// load movie data by id
function loadMovieData(movieID) {
  async function fetchMovie() {
    try {
      const response = await fetch(`${baseUrl}/${movieID}`);
      if (response.ok) {
        const data = await response.json();
        const moviePoster = document.getElementById("poster");
        moviePoster.src = data.poster;
        const movieTitle = document.getElementById("title");
        movieTitle.textContent = data.title;
        const movieRuntime = document.getElementById("runtime");
        movieRuntime.textContent = formatRuntime(data.runtime);
        const movieDescription = document.getElementById("film-info");
        movieDescription.textContent = data.description;
        const movieShowTime = document.getElementById("showtime");
        movieShowTime.textContent = data.showtime;
        ticketsSold = data.tickets_sold;
        capacity = data.capacity;
        remainingTickets.textContent = capacity - ticketsSold;
        handleButtonClick();
        revertTicketAvailability();
      } else {
        throw new Error("Oops, Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  }
  fetchMovie();
}

function handleButtonClick() {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/${movieID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tickets_sold: ticketsSold + 1,
        }),
      });

      if (response.ok) {
        ticketsSold += 1;
        let remainingCapacity = capacity - ticketsSold;
        remainingTickets.textContent = remainingCapacity;

        if (remainingCapacity === 0) {
          const soldOutMovie = document.querySelector(
            `.film.item:nth-child(${movieID})`
          );
          soldOutMovie.classList.add("sold-out");
          ticketsElement.textContent = "SOLD OUT ";
          const soldOutIcon = document.createElement("i");
          soldOutIcon.classList.add("fa-solid", "fa-triangle-exclamation");
          ticketsElement.appendChild(soldOutIcon);
          button.textContent = "Sold Out";
          button.disabled = true;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  });
}

function revertTicketAvailability() {
  const soldOutMovie = document.querySelector(
    ".film.item:nth-child(" + movieID + ")"
  );
  if (remainingTickets.textContent > 0) {
    soldOutMovie.classList.remove("sold-out");
    ticketsElement.textContent = `Remaining Tickets`;
    button.disabled = false;
    button.textContent = "Buy Tickets";
  } else {
    soldOutMovie.classList.add("sold-out");
    ticketsElement.textContent = "SOLD OUT ";
    ticketsElement.appendChild(soldOutIcon);
    button.disabled = true;
    button.textContent = "Sold Out";
  }
}

fetchMovies();
// each time i patch, the page refreshes and makes the loading time slowes down. Everytime the page refreshes, it loads the first movie, since our movieID=1.
 */