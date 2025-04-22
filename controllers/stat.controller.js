import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getStats = async (req, res, next) => {
    try {
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),
            Song.aggregate([
                {
                    $unionWith: {
                        coll: 'albums',
                        pipeline: []
                    }
                },
                {
                    $group: {
                        _id: '$artist',
                    }
                },
                {
                    $count: 'count',
                }
            ]),
        ]);

        return res.status(200).json({
            totalSongs,
            totalAlbums,
            totalUsers,
            uniqueArtists: uniqueArtists[0]?.count || 0,
        })
    } catch (err) {
        
    }
};