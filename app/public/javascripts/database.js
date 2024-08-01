const musclesData = ["Ön delta kası", "Biseps brachii", "Biseps femoris", "Brachialis", "Gastroknemius", "Gluteus maximus", "Dış eğik karın kası", "Pektoralis major", "Quadriceps femoris", "Rectus abdominis", "Serratus anterior", "Soleus", "Trapezius", "Triseps brachii"];

const equipmentData = ["Halter", "Bench", "Dumbbell", "Spor matı", "Eğimli bench", "Kettlebell", "yok (vücut ağırlığı egzersizi)", "Barfiks", "İsviçre Topu", "SZ-Bar"];

const muscleTranslations = {
    "Front deltoid": "Ön delta kası",
    "Biceps brachii": "Biseps brachii",
    "Biceps femoris": "Biseps femoris",
    "Brachialis": "Brachialis",
    "Gastrocnemius": "Gastroknemius",
    "Gluteus maximus": "Gluteus maximus",
    "External oblique": "Dış eğik karın kası",
    "Pectoralis major": "Pektoralis major",
    "Quadriceps femoris": "Quadriceps femoris",
    "Rectus abdominis": "Rectus abdominis",
    "Serratus anterior": "Serratus anterior",
    "Soleus": "Soleus",
    "Trapezius": "Trapezius",
    "Triceps brachii": "Triseps brachii"
};

const equipmentTranslations = {
    "Barbell": "Halter",
    "Bench": "Bench",
    "Dumbbell": "Dumbbell",
    "Exercise mat": "Spor matı",
    "Incline bench": "Eğimli bench",
    "Kettlebell": "Kettlebell",
    "None": "yok (vücut ağırlığı egzersizi)",
    "Pull-up bar": "Barfiks",
    "Swiss ball": "İsviçre Topu",
    "EZ-Bar": "SZ-Bar"
};

function translateMuscle(muscle) {
    return muscleTranslations[muscle] || muscle;
}

function translateEquipment(equipment) {
    return equipmentTranslations[equipment] || equipment;
}

function elementsCreator(type, ...children){
    const node = document.createElement(type);

    if(children){
        for (let i = 0; i < children.length; i++){
            if (typeof children[i] !== "string"){
                node.appendChild(children[i]);
            } else{
                node.appendChild(document.createTextNode(children[i]));
            }
        }
    }

    return node;
}

function dataFiller(data, muscleFilter = null, equipmentFilter = null){
    const exercisesData = data["results"];

    const identifiersArray = [];
    const namesArray = [];
    const musclesArray = [];
    const equipmentArray = [];
    const descriptionArray = [];

    for(let i = 0; i < exercisesData.length; i++){
        const exerciseObject = exercisesData[i];

        identifiersArray.push(exerciseObject["id"]);
        namesArray.push(exerciseObject["name"]);
        musclesArray.push(exerciseObject["muscles"]);
        equipmentArray.push(exerciseObject["equipment"]);
        descriptionArray.push(exerciseObject["description"]);
    }

    let majorExercisesList = [];

    for(let i = 0; i < identifiersArray.length; i++){
        const name = namesArray[i];
        const description = descriptionArray[i];

        let equipment = equipmentArray[i].length > 0 
            ? equipmentArray[i].map(item => translateEquipment(item["name"]))
            : ["—"];

        let muscles = musclesArray[i].length > 0 
            ? musclesArray[i].map(item => translateMuscle(item["name"]))
            : ["—"];
        
        const exerciseObject = {
            "name": name,
            "description": description,
            "equipment": equipment,
            "muscles": muscles
        };

        majorExercisesList.push(exerciseObject);
    }

    if(muscleFilter){
        majorExercisesList = majorExercisesList.filter((item) => item["muscles"].findIndex((currentItem) => currentItem.toLowerCase() === muscleFilter.toLowerCase()) !== -1);
    }

    if(equipmentFilter){
        majorExercisesList = majorExercisesList.filter((item) => item["equipment"].findIndex((currentItem) => currentItem.toLowerCase() === equipmentFilter.toLowerCase()) !== -1);
    }

    const exercisesTable = document.querySelector(".exercisesTable");

    for(let i = 0; i < majorExercisesList.length; i++){
        const exerciseObject = majorExercisesList[i];

        const tableRow = exercisesTable.appendChild(document.createElement("tr"));

        tableRow.appendChild(elementsCreator("td", exerciseObject["name"]));

        const muscleCell = tableRow.appendChild(document.createElement("td"));
        for(let j = 0; j < exerciseObject["muscles"].length; j++){
            muscleCell.appendChild(elementsCreator("div", exerciseObject["muscles"][j]));
            if(j !== exerciseObject["muscles"].length - 1){
                muscleCell.appendChild(document.createElement("br"));
            }
        }

        const equipmentCell = tableRow.appendChild(document.createElement("td"));
        for(let j = 0; j < exerciseObject["equipment"].length; j++){
            equipmentCell.appendChild(elementsCreator("div", exerciseObject["equipment"][j]));
            if(j !== exerciseObject["equipment"].length - 1){
                equipmentCell.appendChild(document.createElement("br"));
            }
        }

        const specialDescription = tableRow.appendChild(document.createElement("td"));
        specialDescription.innerHTML = exerciseObject["description"].trim();
    }
}

async function tableFiller(muscleFilter = null, equipmentFilter = null){
    const databaseContainer = document.querySelector(".databaseContainer");
    const relevantTable = databaseContainer.appendChild(document.createElement("table"));
    relevantTable.classList.add("exercisesTable");

    await fetch("https://wger.de/api/v2/exerciseinfo.json/?language=2&limit=226")
        .then(res => res.json())
        .then(data => dataFiller(data, muscleFilter, equipmentFilter));

    const headerRow = relevantTable.insertBefore(document.createElement("tr"), relevantTable.firstChild);
    headerRow.appendChild(elementsCreator("th", "EGZERSİZ ADI"));
    headerRow.appendChild(elementsCreator("th", "KAS GRUBU(ŞU)"));
    headerRow.appendChild(elementsCreator("th", "EKİPMAN"));
    headerRow.appendChild(elementsCreator("th", "AÇIKLAMA"));

    const loadingDisclaimer = document.querySelector(".temporaryExercisesDisplay");
    loadingDisclaimer.style["display"] = "none";

    const selectionContainer = document.querySelector(".selectionContainer");
    selectionContainer.style["display"] = "block";

    const exercisesDisclaimer = document.querySelector(".exercisesDisclaimer");
    exercisesDisclaimer.style["display"] = "block";
}

function listsFiller(){
    const musclesDropList = document.querySelector("#musclesList");

    for(let i = 0; i < musclesData.length; i++){
        musclesDropList.appendChild(elementsCreator("option", musclesData[i]));
    }

    const equipmentDropList = document.querySelector("#equipmentList");

    for(let i = 0; i < equipmentData.length; i++){
        equipmentDropList.appendChild(elementsCreator("option", equipmentData[i]));
    }
}

function filterEvent(){
    const muscleFilter = document.querySelector("#muscleFilter");
    const equipmentFilter = document.querySelector("#equipmentFilter");
    
    let muscleValue = muscleFilter["value"];
    let equipmentValue = equipmentFilter["value"];

    if(muscleValue === ""){
        muscleValue = null;
    }

    if(equipmentValue === ""){
        equipmentValue = null;
    } else if(equipmentValue === "NONE"){
        equipmentValue = "yok (vücut ağırlığı egzersizi)";
    }

    const databaseContainer = document.querySelector(".databaseContainer");
    databaseContainer["innerHTML"] = "";

    const loadingDisclaimer = document.querySelector(".temporaryExercisesDisplay");
    loadingDisclaimer.style["display"] = "block";

    const selectionContainer = document.querySelector(".selectionContainer");
    selectionContainer.style["display"] = "none";

    const exercisesDisclaimer = document.querySelector(".exercisesDisclaimer");
    exercisesDisclaimer.style["display"] = "none";

    tableFiller(muscleValue, equipmentValue);
}

async function main(){
    await listsFiller();
    await tableFiller();
    const filterButton = document.querySelector(".filterButton");
    filterButton.addEventListener("click", filterEvent);
}

document.addEventListener("DOMContentLoaded", main);
