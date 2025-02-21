import { compare, hash } from "bcrypt";
import { User } from "../models/user.model.js";
import { sanitizeUserForResponse, signToken } from "../utils/user.utils.js";

export class UserService {

    login = async (email, password) => {
        const user = await User.findOne({ email }).select("+password");
        if (!user || !await compare(password, user.password)) {
            return false;        
        }
        const accessToken = signToken(user);
        return accessToken;
    }

    signup = async (user) => {
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
        const createdUser = await User.create(user);
        const newUserDTO = sanitizeUserForResponse(createdUser);
        return newUserDTO;
    }

}
