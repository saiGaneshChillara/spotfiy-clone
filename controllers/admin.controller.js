import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';
import cloudinary from '../lib/cloudinary.js';

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
        });

        return result.secure_url;
    } catch (err) {
        console.log('Error in uploading to cloudinary');
        throw new Error('Error in uploading to cloudinary');
    }
};

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({
                message: 'Please upload all the files',
            });
        }

        const { title, artist, albumId, duration } = req.body;

        const audioFile = req.files.audioFile;
        const imagefile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imagefile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        });

        await song.save();

        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
               $push: { songs: song._id }, 
            });
        }

        return res.status(201).json(song);
    } catch (err) {
        console.log('Error in createSong Controller');
        next(err);
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);

        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            });
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Song deleted succesfully',
        });
    } catch (err) {
        console.log('Error in delete song controller', err);
        next(err);
    }
};

export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        });

        await album.save();

        res.status(201).json(album);
    } catch (err) {
        console.log('Error in createAlbum Controller', err);
        next(err);
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Song.updateMany({ albumId: id }, { $set: { albumId: null } });
        await Album.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Album deleted successfully',
        });
    } catch (err) {
        console.log('Error in deleteAlbum Controller', err);
        next(err);
    }
};

export const checkAdmin = (req, res, next) => {
    res.status(200).json({
        admin: true,
    });
};