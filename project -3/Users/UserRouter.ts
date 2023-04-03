import express, { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const userRouter: Router = Router();

/**
 * register a user
 * username, email, password
 */

userRouter.get("/", [], async (request: Request, response: Response) => {
    console.log("user register...");
       console.log (request.body) ;
})
userRouter.post("/register", [
    body('username').not().isEmpty().withMessage("Username is required"),
    body('password').isStrongPassword({ minLength: 6 }).withMessage("Strong Password is required"),
    body('username').isEmail().withMessage("Proper email is required"),
], async (request: Request, response: Response) => {
    console.log("user register...");
    console.log(request.body);
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password } = request.body;
        return response.status(200).json({
            msg: "Register a User",
            formData: {
                username: username,
                email: email,
                password: password,
            }
        });
    } catch (e: any) {
        response.status(500).json({
            error: e.message
        });
    }
});

export default userRouter;

