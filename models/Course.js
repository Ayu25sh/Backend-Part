const mongoose = require(mongoose);

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent: [
        {
            type:mongoose.Schema.Types.ObjecId,
            ref:"Section",
        }
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjecId,
            ref:"RatingAndReview",
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String
    },
    tag:{
        type:mongoose.Schema.Types.ObjecId,
        ref:"Tag",
    },
    studentsEnrolled: [
        {
            type:mongoose.Schema.Types.ObjecId,
            ref:"User",
            required:true,
        }
    ],

});
module.exports = mongoose.model("Course",courseSchema);
