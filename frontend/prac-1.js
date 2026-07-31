


function add(a , b){
    return a + b;
}




function verifier(age) {
    if (age >= 18) {
        return "Yes, you are eligible to drive!";
    } else {
        return "No, you are not eligible to drive!";
    }
}
module.exports = { 
    add , 
    verifier,
    looping

};




function looping(loop){

    for (let i = 0; i < 10; i++){

        if(i === 5){

            console.log(i, "this is element 5");    

        }else{

            console.log(i,"this is not element 5");

        }
    }
}



function getuser(){
    return  {
        id:1 ,
        Name:"Roshan",
        Age:21 ,
        product: "tecnical"
    };
}

function getproduct(){
    return [
        {
          id : 101,
          product : "Mouse",
          price : 200  
        },
        {
            id: 102,
            product : "laptop",
            price : "30000" 
        }
    ];
}


module.exports = { 
    add , 
    verifier,
    looping,
    getuser,
    getproduct

};
