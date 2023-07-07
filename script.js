
const ctx = document.getElementById('myChart');
const totalBtn = document.getElementById('totalBtn');
const gagnantCard = document.getElementById('gagnant');

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["this.names", "o", "hasard"],
        datasets: [{
            axis: 'y',
            label: "Who's the best",
            data: [1,2,3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

async function fetchUrl() {
    const url = `./data/data.json`;
    const response = await fetch(url);
    const fetchArray = await response.json();
    // console.log(fetchArray);
    return fetchArray;
}

fetchUrl().then(fetchArray => { 
    arrayDatas = fetchArray[0];
    let arrayFetch = Object.entries(fetchArray[1]);

    let arrayNames = [];
    let arrayScores = [];

    for (let item in arrayFetch) {
        arrayNames.push(arrayFetch[item][0]);
        arrayScores.push(arrayFetch[item][1]['score']);
    }

    totalBtn.innerHTML = "1 point égale à 1/" + arrayScores.reduce((partialSum, a) => partialSum + a, 0) + " de gagner";
    myChart.config.data.datasets[0].data = arrayScores;
    myChart.config.data.labels = arrayNames;
    myChart.update();
})

function randomize(tab) {
    var i, j, tmp;
    for (i = tab.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = tab[i];
        tab[i] = tab[j];
        tab[j] = tmp;
    }
    return tab;
}

function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

function tirageAuSort() {
    playerArray = [];
    fetchUrl().then(fetchArray => { 
        let arrayFetch = Object.entries(fetchArray[1]);

        for (let item in arrayFetch) {
            // console.log(arrayFetch[item][1]['score']);
            let n = 0;
            while (n < arrayFetch[item][1]['score']) {
                playerArray.push(arrayFetch[item][0]);
                n++;
            }
        }

        playerArrayShuffle = randomize(playerArray);
        const gagnant = getRandomItem(playerArrayShuffle);
        gagnantCard.innerText = gagnant
    })
}