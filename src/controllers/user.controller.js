export class UserController {
   
    constructor(userService) {
        this.userService = userService;
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const accessToken = await this.userService.login(email, password);
            if (!accessToken) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }
            res.status(200).json({
                success: true,
                message: "You are logged!",
                accessToken
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "An error may have occurred" });
        }
    }
    
    signup = async(req, res) => {
        try {
            const user = req.body;
            const newUserDTO = await this.userService.signup(user)
            return res
                .status(201)
                .json({
                    success: true,
                    message: "User registered successfully",
                    user: newUserDTO
                });
        } catch (err) {
            console.error("server error: ", err);
            return res
                .status(500)
                .json({
                    message: "An error may have occured"
                });
        }
    }
    
}
