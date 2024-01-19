import prisma from "../DB/db.config.js";
import { imageValidator, generateRandomNum } from "../utils/helper.js";

class ProfileController {
    static async index(req, res) {
        try {
            const user = req.user;
            return res.json({ status: 200, user });
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong with image index!" });
        }
    }

    static async store() {}

    static async show() {}

    static async update(req, res) {
        try {


            const { id } = req.params;
            const authUser = req.user;

            if (!req.files || Object.keys(req.files).length == 0) {
                return res.status(400).json({ status: 400, message: " Profile Image is required" })
            }

            const profile = req.files.profile;
            const message = imageValidator(profile?.size, profile.mimetype);
            if (message !== null) {
                return res.status(400).json({
                    errors: {
                        profile: message,
                    },
                });
            }

            const imgExt = profile?.name.split(".");
            const imageName = generateRandomNum() + "." + imgExt[1];
            const uploadPath = process.cwd() + "/public/images/" + imageName; //cwd is current directory

            profile.mv(uploadPath, (err) => { //mv is move
                if (err) throw err;
            });

            await prisma.users.update({
                data: {
                    profile: imageName,
                },
                where: {
                    id: Number(id),
                },
            });

            return res.json({
                status: 200,
                message: "Profile updated successfully!",
            });

        } catch (error) {
            console.log("The error is", error);
            return res
                .status(500)
                .json({ message: "Something went wrong with image update.please try again!" });
        }
    }

    static async destroy() {

    }
}

export default ProfileController