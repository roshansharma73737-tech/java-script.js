


//   This is multer   usuage is in upload the file in the webpage by the   user ,  as the  profile picture;

// import the mulet --->
const multer =  require('multer');
const path = require('path');


// create the  storage the configuration  of the  means where is  profile picture is saved  in server disk

const  storage = multer.diskStorage({
    destination :( req , file , cb) =>{
        cb(null, path.join(__dirname , '..', 'uploads'));
    },
    filename :(req, file, cb) => {
        const ext  = path.extname(file.originalname);   
        const unique =   ` user-${req.userID} - ${Date.now()}${ext }`;
        cb (null,unique);
    },
});

function fileFilter(req ,file ,cb){
    const allowed = ['image/png', 'image/jpeg','image/webp'];
    if (allowed.includes(file.mimetype)) 
    cb (null,true );
    else  cb(new Error ('only PNG ,JPEG or WEBP imagesare allowed'));

    }
const upload =  multer({storage ,fileFilter,limits: {fileSize: 5 *1024 *1024}
});

module.exports = upload; 