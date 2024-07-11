   
   const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

   
   function onSignUpName(Name) {
        //deletData("/name");
        postData("User_ID", {"Name": Name});  
    }

    function onSignUpEmail(Email) {
        //deletData("/name");
        postData("User_ID", {"Email": Email});  
    }

    function onSignUpPasswort(Password) {
        //deletData("/name");
        postData("User_ID", {"Password": Password});  
    }

    function SignUpButtonOnClick() {
        const Name = document.getElementById('SignUp-Name').value;
        const Email = document.getElementById('SignUp-Email').value;
        const Password = document.getElementById('SignUp-Password').value;
        const confirmPassword = document.getElementById('SignUp-ConfirmPassword').value;

        checkPasswort(Password, confirmPassword, Name, Email,);
    }


    function checkPasswort(Password, confirmPassword, Name, Email) {
        if (Password === confirmPassword) { 
        onSignUpEmail(Email);
        onSignUpName(Name);
        onSignUpPasswort(Password);
        } else {
            alert("Password stimmt nicht überein!")

        }
    }

    async function postData(path="", data={}){ // funktion um daten zu pushen 
        let response = await fetch(Base_URL + path +".json",{
            method: "POST", // methode kann geändert werden in "PUT", "DELETE", "PATCH" ,"GET"
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return responsetoJson =  await response.json();
     }