import { compare, hash } from "bcrypt";
import User from "../models/user.model.js";
import { sanitizeUserForResponse, signToken } from "../utils/user.utils.js";
import { UserSignupData } from "../types/user.types.js";

class UserService {
    login = async (email: string, password: string) => {
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await compare(password, user.password))) {
            return false;
        }
        const accessToken = signToken(user);
        return accessToken;
    };

    signup = async (user: UserSignupData) => {
        const hashedPassword = await hash(user.password, 10);
        const userWithHashedPassword = {
            ...user,
            password: hashedPassword,
        };
        const createdUser = await User.create(userWithHashedPassword);
        const newUserDTO = sanitizeUserForResponse(createdUser);
        return newUserDTO;
    };

    findByEmail = async (email: string) => {
        const user = await User.findOne({ email });
        return user;
    };
}

export default UserService;
