import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) =>{
    try {
        const albums = await Album.find();
        res.status(200).json(albums);
    } catch (err) {
        console.log('Error in getAllAlbums controller');
        next(err);
    }
};

export const getAlbumById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const album = await Album.findById(id).populate('songs');

        if (!album) {
            return res.status(404).json({
                message: 'Album not found',
            });
        }

        return res.status(200).json(album);

    } catch (err) {
        console.log('Error in getALbumById controller');
        next(err);
    }
};