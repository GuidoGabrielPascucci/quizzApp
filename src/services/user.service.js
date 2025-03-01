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
        const userWithHashedPassword = {
            ...user,
            password: hashedPassword
        }
        const createdUser = await User.create(userWithHashedPassword);
        const newUserDTO = sanitizeUserForResponse(createdUser);
        return newUserDTO;
    }

    findByEmail = async (email) => {
        const user = await User.findOne({email});
        return user;
    }
}
