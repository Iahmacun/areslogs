function elementsCreator(type, ...children) {
    const node = document.createElement(type);

    children.forEach(child => {
        if (typeof child !== "string") {
            node.appendChild(child);
        } else {
            node.appendChild(document.createTextNode(child));
        }
    });

    return node;
}

function dataFiller(data) {
    const exercisesData = data["results"];
    const exercisesDropList = document.querySelector("#exercisesEntryList");

    exercisesData.forEach(exerciseObject => {
        exercisesDropList.appendChild(elementsCreator("option", exerciseObject["name"]));
    });
}

async function listFiller() {
    try {
        const response = await fetch("https://wger.de/api/v2/exerciseinfo.json/?language=2&limit=226");
        const data = await response.json();
        dataFiller(data);
    } catch (error) {
        console.error("Error fetching exercise data:", error);
    } finally {
        const loadingDisclaimer = document.querySelector(".temporaryFormDisplay");
        loadingDisclaimer.style.display = "none";

        const exerciseForm = document.querySelector(".exerciseForm");
        if (exerciseForm) {
            exerciseForm.style.display = "block";
        }
    }
}

function main() {
    listFiller();
}

document.addEventListener("DOMContentLoaded", main);
