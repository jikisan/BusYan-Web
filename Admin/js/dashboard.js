import firebaseConfig from '/CONFIG.js';
import { DBPaths } from '/Admin/js/DB.js';

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let busOrgArray = [];

document.addEventListener('DOMContentLoaded', generateBusOrganizations);

function generateBusOrganizations() {
    const busOrgContainer = document.querySelector('.bus-org-content');

    busOrgContainer.innerHTML = "";
    busOrgArray = [];

    const coopRef = database.ref(`${DBPaths.BUS_COOP}`);

    coopRef.once('value',
        (snapshot) => {
            snapshot.forEach((coop) => {

                const coopKey = coop.key;
                const coopData = coop.val();
                coopData["key"] = coopKey;
                busOrgArray.push(coopData);


                createBusOrgCard(coopData);
            });

            generateChart(snapshot);

        }
    )
    
}

function createBusOrgCard(coopData) {
    const parentDiv = document.querySelector('.bus-org-content');
    const busOrg = coopData.companyName;

    // Create the elements
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('dashboard-items');

    cardDiv.textContent = busOrg;

    // cardDiv.addEventListener('click', showCoopModal.bind(null, key));

    // Append the cardDiv to the parent div with class bus-coop-container
    parentDiv.appendChild(cardDiv);
}

function generateChart(snapshot) {

    const ctx = document.getElementById('myChart');
    const totalAlertFontSize = 40;

    const count = snapshot.numChildren(); // Get the count of children directly from the snapshot

    const data = {
        labels: ['Bus Cooperative'],
        datasets: [{
            data: [count]
        }]
    };

    const noDataTextDisplayPlugin = {
        afterDraw: (chart) => {

            const { ctx,  data } = chart;
            const currentDataLength = data.datasets[0].data.length;
            const currentDataValue = data.datasets[0].data[0];

            //Check if dataset is empty
            if(currentDataLength === 0 || currentDataValue === 0){
                const {
                    chartArea: { left, top, right, bottom },
                    ctx,
                    scales: { x },
                } = chart;

                //Locate and get the center axis of Canvas
                const centerX = (left + right) / 2;
                const centerY = (top + bottom) / 2;
                ctx.save();

                //Message Property
                ctx.textAlign = 'center';
                ctx.font = '50px Arial';
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'middle';
                ctx.fillText('No Data', centerX, centerY);
                ctx.restore();
            }
        },
    };

    const centerTotalAlertText = {
        beforeDatasetsDraw: (chart) => {

            const { ctx, data } = chart;

            const currentDataValue = data.datasets[0].data[0];

            //Check if dataset is empty
            if(currentDataValue !== 0){
                //Get the total of Alert data
                const alertData = data.datasets[0].data;
                const sum = alertData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

                ctx.save;
                
                //Locate and get the center axis of Canvas
                const xCoor = chart.getDatasetMeta(0).data[0].x;
                const yCoor = chart.getDatasetMeta(0).data[0].y;

                // Display the total alert data
                ctx.fillStyle = 'black';
                ctx.font = `bold ${totalAlertFontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(sum, xCoor, yCoor);
            }
        }
    }

    //Config block
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            cutout: '65%',
            borderWidth: 0,
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {                     
                    position: 'bottom'
                },
                colors: {
                    forceOverride: true
                }
            }
        },
        plugins: [
            noDataTextDisplayPlugin,
            centerTotalAlertText
        ]
    };

    new Chart(ctx, config);
}