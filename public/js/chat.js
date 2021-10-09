const socket = io();

//element
const $messagess = document.querySelector("#messages");

//template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
//options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  //new message element
  const $newMessage = $messagess.lastElementChild;
  //hight of new message
  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visisble height
  const visibleHeight = $messagess.offsetHeight;
  const containerHeight = $messagess.scrollHeight;
  const scrollOffset = $messagess.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messagess.scrollTop = $messagess.scrollHeight;
  }
};
socket.on("message", (message) => {
  //console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm:a"),
    username: message.username,
  });
  $messagess.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

function sendBtn() {
  const message = document.querySelector(".msg").value;
  if (message === "") {
    return;
  }
  socket.emit("sendMessage", message, (err) => {
    if (err) {
      return console.log(err);
    }
  });

  document.querySelector(".msg").value = "";
}
socket.on("LocationMessage", (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url: url.text,
    createdAt: moment(url.createdAt).format("h:mm:a"),
    username: url.username,
  });
  $messagess.insertAdjacentHTML("beforeend", html);
  autoScroll();
});
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});
function sendLocationBtn() {
  if (!navigator.geolocation) {
    return alert("Geolocation Not Supporetd....");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("location", latitude, longitude, (err) => {
      console.log(err);
    });
  });
}
socket.emit("join", { username, room }, (err) => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});
