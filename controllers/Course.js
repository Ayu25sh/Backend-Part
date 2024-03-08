const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async(req,res) => {
    try{
        //data fetch
        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnailImage){
            return res.status(400).json({
                success:true,
                message:"All fields are required"
            })

        }

        //get instructor id
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details", instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:true,
                message:"Instructor Not found"
            })
        }

        //check the tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"tag details Not found"
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);


        //db entry create
        const newCourse = await Course.create({
            courseName:courseName,
            courseDescription:courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price:price,
            thumbnail:thumbnailImage.secure_url,
            tag:tagDetails._id,
        })

        //add the new course to the user schema of instrucytor
        await User.findByIdAndUpdate(
            {id:instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        )
        

        //update tag schema
        await Tag.findByIdAndUpdate(
            {id:tagDetails._id},
            {
                $push:{
                    course: newCourse._id,
                }
            }
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse,
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course"
        })
    }
}
