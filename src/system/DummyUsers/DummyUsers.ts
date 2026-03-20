import User from "../../models/User";
import IUsersService from "../../services/IUsersService";
import users = require("./Users.json");

class DummyUsersService implements IUsersService
{
  private readonly allUsers: Array<User>;

  constructor()
  {
    this.allUsers = new Array<User>();

    for(let i = 0; i < users.length; i++){
      this.allUsers[i] = new User
      (
        users[i].id,
        users[i].firstName + " " + users[i].lastName,
        `https://randomuser.me/api/portraits/${users[i].gender === 1 ? "men" : "women"}/` + users[i].id + ".jpg");
    }
  }

  public GetAllUsers(): ReadonlyArray<User>
  {
    return this.allUsers;
  }
}

export default DummyUsersService;
