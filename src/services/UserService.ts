import UserRepository from '../repositories/UserRepository';
import User           from '../models/user.model';
import Logger         from '../utils/Logger';
import CloudImage     from '../utils/CloudImage';
import UserType       from "../types/userType";

class UserService implements UserRepository{
    public async findById(id: string):  Promise<UserType | null>{
        try{
            const user = await User.findById(id);
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
            
            return null ;
        }
    };

    public async findByEmail(email: string): Promise<UserType | null>{
        try{
            const user = await User.findOne({email:email});
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');

            return null;
        }
    };

    public async findAll(): Promise<any[]> {
        try{
            const users = await User.find();
            return users || [];
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');

            return [];
        }
    };

    public async createUser(username: string, email: string, password: string): Promise<UserType | null>{
        try{
            const user = new User({
                username,
                email,
                password
            });
            await user.save();
            return user as UserType || null;
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');

            return null;
        }
    };

    public async updateUser(userID: string, data: object) {
        try{
            const user = await  User.findByIdAndUpdate(userID, { $set: data }, {new: true});            
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');

            return null;
        }
    };

    public async deleteUser(userID: string): Promise<void> {
        try{
            await User.findByIdAndDelete(userID);
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
    };

    public async deleteAll(): Promise<void> {
        try{
            await User.deleteMany();
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
    };

    public async changeAvatar(userID: string, avatar: string): Promise< UserType | null>{
        try{
            const user = await this.findById(userID);
            if(!user) return null;
            
            const img = await  new CloudImage().uploadImage(avatar);
            if( img == undefined) return null;

            await new CloudImage().deleteImage(user.avatar.public_id);
            const updatedUser = await this.updateUser(userID, {
                avatar: {
                    url       : img.secure_url,
                    public_id : img.public_id
                }
            });

            return updatedUser as UserType || null;
        }
        catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return null;
    };

    public async deleteAvatar(userID: string): Promise<UserType | null>{
        try{
            const user = await this.findById(userID);
            if(!user) return null;
            
            await new CloudImage().deleteImage(user.avatar.public_id);
            const updatedUser = await this.updateUser(userID, {
                avatar: {
                    url       : "https://res.cloudinary.com/dt6idcgyw/image/upload/v1725752451/default_j5ftby_jspjve.jpg",
                    public_id : "default_j5ftby_jspjve"
                }
            });

            return updatedUser as UserType || null;
        }
        catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return null;
    }

    // public async changeEmail(userID):


    public async isActiveUser(userID: string): Promise<boolean>{
        try{
            const user = await User.findById(userID);
            return user && user.active ? true : false;

        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return false;
    };

    public async enableUser(userID: string): Promise<UserType | null>{
        try{
            const user = await User.findByIdAndUpdate(userID, {active: true});
            return user as UserType || null;
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }  return null;
    };

    public async disableUser(userID: string): Promise<UserType | null>{
        try{
            const user = await User.findByIdAndUpdate(userID, {active: false});
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return null;
    };

};
export default UserService;