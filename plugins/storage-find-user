function FindUser(userId) {
  let tmpUserList = localStorage.getItem("userList");

  if (JSON.parse(tmpUserList)) {
    let res = JSON.parse(tmpUserList).find((element) => element.id === userId);

    if (res) {
      return `${res.firstName} ${res.lastName}`;
    } else {
      return "user not found";
    }
  } else {
    return "no users found";
  }
}

export default { FindUser };
