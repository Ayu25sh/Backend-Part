const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async(req,res) => {
    try{
        //data fetch
        const {courseName,courseDescription,whatYouWillLearn,price,tag,category} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category){
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

        //check the category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category details Not found"
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
            tag:tag,
            thumbnail:thumbnailImage.secure_url,
            category:categoryDetails._id,
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        )
        

        //update tag schema
        await Category.findByIdAndUpdate(
            Category._id,
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

//getAllCourses handler
exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({},{courseName:true,
                                                courseDescription:true,
                                                price:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,})
                                                .populate("instructor")
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"cannot fetch course data",
            error:error.message
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try{ 
        //fetch id
        const {courseId} = req.body;
        //find course details 
        const courseDetails = await Course.find(
                                            {_id:courseId})
                                            .populate({
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            })
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            })
                                            .populate("category")
                                            // .populate("ratingAndReviews")
                                            .exec();
        console.log(courseDetails.courseContent);
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Couldn't find the course for given course id"
            })
        }              
        
        // return res
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            courseDetails,
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}