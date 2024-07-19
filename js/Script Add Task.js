const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

function PostUserTasks() {
    postData("User/UserID_1", {
        title: document.getElementById('Task-Title-id').value,
        description: document.getElementById('Task-Describtion-id').value,
        contact: document.getElementById('Task-choose-contact-id').value,
        date: document.getElementById('Task-Date-Id').value,
        category: document.getElementById('Task-choose-Category-id').value,
        subtask: document.getElementById('Task-Subtask-Id').value
    }); 
}

async function postData(path="", data={}){
    let response = await fetch(Base_URL + path +".json",{
        method: "POST", 
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responsetoJson =  await response.json();
 }


 async function fetchUserData() {
    let response = await fetch(Base_URL + "User/UserID_1" + ".json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    let data = await response.json();
    console.log("User Data:", data); 
    return data;
}

function CreatTaskbuttonOnclick() {
    PostUserTasks();
}
