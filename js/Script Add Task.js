const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

function UserTasks() {
    postData("tasks", {
        title: document.getElementById('Task-Title-id').value,
        description: document.getElementById('Task-Describtion-id').value,
        contact: document.getElementById('Task-choose-contact-id').value,
        date: document.getElementById('Task-Date-Id').value,
        category: document.getElementById('Task-choose-Category-id').value,
        subtask: document.getElementById('Task-Subtask-Id').value
    });
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


 async function fetchUserData(userId) {
    let response = await fetch(Base_URL + "User/" + userId + ".json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    let data = await response.json();
    console.log("User Data:", data); 
    return data;
}
