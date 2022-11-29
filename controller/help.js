const User = require('../models/User');


module.exports = {
    getPicDataFollowing: async function(foundUser){
        const arr = [];
        for(let following of foundUser.following){
            await User.findOne({username: following}).then((foundPic) => {
                const pic = foundPic.picture.data.toString('base64');
                arr.push(pic);
            });
           
        }
        return arr;
    },
    getPicDataFollower: async function(foundUser){
        const arr = [];
        for(let follower of foundUser.follower){
            await User.findOne({username: follower}).then((foundPic) => {
                const pic = foundPic.picture.data.toString('base64');
                arr.push(pic);
            });
           
        }
        return arr;
    }
}