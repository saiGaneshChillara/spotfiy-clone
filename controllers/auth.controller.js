import { User } from "../models/user.model.js";

export const callbackController = async (req, res, next) => {
    console.log("Auth callback called");
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        const user = await User.findOne({ clerkId: id });

        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            });
        } else {
            console.log('user already exists');
            return res.status(200).json({
                message: 'user already exists',
            });
        }

        res.status(200).json({
            sucess: true,
        });
    } catch (err) {
        console.log('Error in auth callback', err);
        next(err);
    }
};