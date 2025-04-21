import { User } from "../models/user.model.js";

export const callbackController = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        const user = User.findOne({ clerkId: id });

        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
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