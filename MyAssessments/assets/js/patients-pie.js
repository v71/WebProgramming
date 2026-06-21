// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var initialCredits = 100;
var usedCredits    = 0;
var totalCredits   = initialCredits - usedCredits;
var elapsedPct   = Math.round((usedCredits / initialCredits) * 100);
var remainingPct = 100 - elapsedPct;

let myPieChartInstance = null; // Global variable to track the chart

const clincianCenterTextPlugin = {
  
  id: 'centerText',
  beforeDraw: function(chart) {
    const opts = chart.options.centerText;
    if (!opts || !opts.enabled) return;

    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;

    ctx.restore();
    //ctx.font = `600 ${(height/110).toFixed(2)}em Nunito`;
    // Replace your current ctx.font line with this:
    ctx.font = `700 ${(height/110).toFixed(2)}em "Nunito", -apple-system, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = opts.color || "#4e73df";

    const dataset = chart.data.datasets[0].data || [0,100];
    const elapsedPct = dataset[0] || 0;
    const remainingPct = 100 - elapsedPct;

    const text = remainingPct + "%";
    const textX = Math.round((width - ctx.measureText(text).width)/2);
    const textY = height/2-height/16;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
   
};

// Funzione principale per renderizzare la pie chart
function renderClinicianPieChart(initialCredits, usedCredits) {

  // 1. Destroy existing chart instance if it exists
    if (myPieChartInstance) {
        myPieChartInstance.destroy();
    }

  const elapsedPct = initialCredits > 0 ? Math.round((usedCredits / initialCredits) * 100) : 0;
  const remainingPct = 100 - elapsedPct;

  const ctx = document.getElementById("myPieChart");
  if (!ctx) return;

  myPieChartInstance=new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Utilizzati", "Rimanenti"],
      datasets: [{
        data: [elapsedPct, remainingPct],
        backgroundColor: ['rgba(255, 166, 0,1)', 'rgba(17, 25, 255,1)'],
        hoverBackgroundColor: ['rgba(255,201,0,1)', 'rgb(108, 113, 253)'],
        hoverBorderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 0,
        borderRadius: 10,
        spacing: 5
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive:true,
      cutoutPercentage: 85,
      legend: { display: true,
                position: 'bottom',      // Place it under the chart 
                labels: {
                padding: 20,             // Adds space between the chart and the legend
                usePointStyle: true,     // Changes the square boxes to circles for a modern look
                fontColor: '#858796',
                fontSize: 12,
                fontFamily: "'Nunito', sans-serif"
              }
      },
      centerText: { enabled: true, color: "#4e73df" },
      tooltips: {
        enabled: true,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, data) {
            return data.labels[tooltipItem.index] + ": " + data.datasets[0].data[tooltipItem.index] + "%";
          }
        }
      }
    },
    plugins: [clincianCenterTextPlugin]
  });

}