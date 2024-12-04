import UserRepository from "../repositories/UserRepository";
import { Request, Response } from "express";
import { successResponse, failedResponse, handleError} from "../middlewares/responseHandler";

class UserController {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    };

    async getProfile(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            const response = await this.userRepository.findById(userID);
            if(response != null)
                return successResponse(res, 200, "Profile Details Fetched.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            console.log(error);
            handleError(error, res);
        }
    };

    async updateProfile(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;            
            const response = await this.userRepository.updateUser(userID, req.body);
            if(response != null)
                return successResponse(res, 200, "Profile Updated.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteProfile(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            await this.userRepository.deleteUser(userID);
            return successResponse(res, 200, "Profile Deleted.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async changeAvatar(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            if(!req.file){
                failedResponse(res, 400, "Please upload an image file.");
            }
            const response = await this.userRepository.changeAvatar(userID, req.file?.path || '');
            if(response != null)
                return successResponse(res, 200, "Avatar Changed.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAvatar(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            const response = await this.userRepository.deleteAvatar(userID);
            if(response != null)
                return successResponse(res, 200, "Avatar Deleted.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    /**
     * Only Admins can access this route
     */
    async getAllUsers(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.userRepository.findAll();
            return successResponse(res, 200, "All Users Fetched.",  response);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async enableUser(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.params;
            const response = await this.userRepository.enableUser(userID);
            if(response != null)
                return successResponse(res, 200, "User Enabled.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async disableUser(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.params;
            const response = await this.userRepository.disableUser(userID);
            if(response != null)
                return successResponse(res, 200, "User Disabled.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAllUsers(req: Request, res: Response): Promise<void>{
        try{
            await this.userRepository.deleteAll();
            return successResponse(res, 200, "All Users Deleted.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

};

export default  UserController;