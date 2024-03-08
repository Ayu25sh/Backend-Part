const Tag = require("../models/Tags");


//tag create krne ka handler function
exports.createTag = async(req,res) => {
    try{

        //fetch data
        const {name,description } =  req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in db
        const dbdetails = await Tag.create({
            name:name,
            description:description,
        });

        return res.status(200).json({
            success:true,
            message:"Tag is created successfully",
        })

         

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAlltag handler function

exports.showAllTags = async (req,res) => {
    try{


        const allTags = await Tag.find({},{name:true,description:true})

        res.status(200).json({
            success:true,
            message:"All Tags returned successfully",
            allTags,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}