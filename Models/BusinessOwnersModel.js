import mongoose from "mongoose";

const BusinessOwnerSchema=mongoose.Schema(
    {   businessname:{
        type:String,
        required:true,
    },
    buildingname:{
        type:String,
        required:true,
    },
    logo:{
        type:String,
        
    },
    street:{
        type:String,
        required:true,
    },
    landmark:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
    ownername:{
        type:String,
        required:true,
    },
    mobileprimary:{
        type:Number,
        required:true,
    },
    mobilesecondary:{
        type:Number,
        required:true,
    },
    website:{
        type:String,
        required:true,
    },
    businesscategory:{
        type:String,
        required:true,
    },
    services:{
        type:Array,
        required:true,
    },
    workingdays:{
        type:Array,
        required:true,
    },
    openat:{
        type:String,
        required:true,
    },
    closeat:{
        type:String,
        required:true,
    },
    businessdescription:{
        type:String,
        required:true,
    },
    landingpagecolour:{
        type:String,
        required:true,
    },
    landingpagetitle:{
        type:String,
        required:true,
    },
    landingpagedescription:{
        type:String,
        required:true,
    },
    landingpagecoverimages:{
        type:Array,
        required:true,
    },
    landingpagewelcometitle:{
        type:String,
        required:true,
    },
    landingpagewelcomedescription:{
        type:String,
        required:true,
    },
    landingpagespecialdetails:{
        type:Array,
        required:true,
    },
    landingpageproductdetails:{
        type:Array,
        required:true,
    },
    landingpageservies:{
        type:Array,
        required:true,
    },
    landingpagegallery:{
        type:Array,
        required:true,
    },
  
    paymentstatus:{
        type:Boolean,
        default:false
    },
    subscriptionvaliditystartandend:{
        type:Object,
        required:true,
    },
  
    subscriptionplan:{
        type:String,
        required:true,
    },
 
    businessprofilecard:{
        type:Object,
       
    },
    

        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        isAdmin:{
            type:Boolean,
            default:false

        },
        auth:{
            type:Boolean,
            default:true
        },
      seotitle:{
        type:String,
        required:true,
      },
   
      metatags:{
        type:Array,
        required:true,
      },
      seokeywords:{
        type:Array,
        required:true,
      },
      seodescription:{
        type:String,
        required:true
       
      },
      
      

    },
    {timestamps:true}
)

const BusinessOwnerModel=mongoose.model("BusinessOwner",BusinessOwnerSchema);

export default BusinessOwnerModel;