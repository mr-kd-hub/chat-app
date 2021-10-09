const users = [];

//adduser
const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      err: "Username and Room Required...",
    };
  }
  const existanceName = users.find((i) => {
    return i.room === room && i.username === username;
  });
  if (existanceName) {
    return {
      err: "This Username is Taken...",
    };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};
// addUser({ id: 245, username: "dhDtvc   ", room: "test" });
// addUser({ id: 1, username: "yd   ", room: "gfg" });
// addUser({ id: 2, username: "ggd   ", room: "tdgest" });

//removeuser
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//getuser
const getUser = (id) => {
  return users.find((user) => user.id === id);
};
//const i = getUser(2);

//getUSerInroom
const getUserInRoom = (room) => {
  return users.filter((user) => user.room === room);
};
//const j = getUserInRoom("test");

// console.log(i);
// console.log(j);
// console.log(users);
module.exports = {
  addUser,
  getUser,
  getUserInRoom,
  removeUser,
};
