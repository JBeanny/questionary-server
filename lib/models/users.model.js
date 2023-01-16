const fs = require("fs");

const path = `${__dirname}/../../data/users.json`;

class UserModel {
  getUsers() {
    const users = fs.readFileSync(path, "utf8");
    return JSON.parse(users);
  }

  createUser(users) {
    fs.writeFileSync(path, JSON.stringify(users), (err, data) => {
      if (err) {
        return err;
      }
      return data;
    });
  }
}

module.exports = new UserModel();
