import User from '../models/User';

interface IUsersService {

  GetAllUsers(): ReadonlyArray<User>;

}

export default IUsersService;
