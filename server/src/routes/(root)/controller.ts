import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
    res.send("Get all users");
};

export const createUser = (req: Request, res: Response) => {
    res.send("Create a new user");
};