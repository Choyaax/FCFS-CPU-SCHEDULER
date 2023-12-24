    class Process {
        constructor(pid, arrivalTime, burstTime) {
            this.pid = pid;  //number of processes na gi add as a user 
            this.arrivalTime = arrivalTime;  ///user setted 
            this.burstTime = burstTime;   //kani pod
            this.completionTime = 0 ;
            this.turnAroundTime = 0 ; 
            this.waitingTime = 0; 
            this.responseTime = 0;  

            
           
        }
    }


    function fcfsScheduling(processes) {
   
      

        processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

        let currentTime = 0;  //set the variables kay gamit siya like oh yeah 
        let totalWaitingTime = 0;
        let totalCompletionTime = 0; 
        let totalTurnAroundTime = 0; 
         let totalResponseTime = 0; 
        let ganttChartHTML = '';
        processes.forEach(process => {
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }
            process.completionTime = currentTime + process.burstTime;
            process.turnAroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = currentTime - process.arrivalTime; 


            if (process.responseTime === 0) {
                process.responseTime = process.turnAroundTime - process.burstTime; 
                totalResponseTime += process.responseTime;
            }
    
      

            ganttChartHTML += `
            <tr>
            <td>P${process.pid}</td>
            <td>${currentTime}</td>
            <td>${process.burstTime}</td>
            </tr>
            `;
            currentTime += process.burstTime;
            totalWaitingTime += process.waitingTime;
            totalTurnAroundTime += process.turnAroundTime; 
            totalCompletionTime += process.completionTime;  
          
        }); 

        const averageWaitingTime = totalWaitingTime / processes.length;
        const turnAroundTime = totalTurnAroundTime / processes.length; 
        const completionTime = totalCompletionTime / processes.length;
        const averageResponseTime = totalResponseTime / processes.length;
        document.getElementById('requiredTime').value = currentTime;
        
        const tableBody = document.querySelector('#processTable');
        tableBody.innerHTML = `
        <thead>
        <tr>
        <th> Process Time </th>
        <th>Arrival Time</th>
        <th>Burst Time</th>
        <th>Completion Time</th>
        <th>Turn Around Time</th>
        <th>Waiting Time</th>
        <th>Response Time<th>
    </tr>
    </thead>
    <tbody>
    ${processes.map(process =>`
    <tr>
    <td>P${process.pid}</td>
    <td>${process.arrivalTime}</td>
    <td>${process.burstTime}</td>
    <td>${process.completionTime}</td>
    <td>${process.turnAroundTime}</td>
    <td>${process.waitingTime}</td>
    <td>${process.responseTime}</td> 
    </tr>
    `).join('')}

    </tbody> 

    <tfoot>  <tr>
    <div class = "row align-items-start"> 
    <td colspan ="3" style ="text-align:left;"> Average Completion Time:${completionTime.toFixed(2)}</td>
  <td colspan = "3">Average Turn Around Time: ${turnAroundTime.toFixed(2)}</td> 
    <td colspan = "3" style ="text-align:right;">Average Waiting Time: ${averageWaitingTime.toFixed(2)}</td>  
    <td colspan="3" style="text-align:right;">Average Response Time: ${averageResponseTime.toFixed(2)}</td>
  </div>
     </tr>
     </tfoot>
        `;    //ako na balikon 
    
    }

  function generateTable() {
        const numProcesses = parseInt(document.getElementById('numProcesses').value);
        const tableBody = document.querySelector('#processTable tbody');
        tableBody.innerHTML = '';

        for (let i = 1; i <= numProcesses; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>P${i}</td>
                <td><input type="number" id="arrivalTime${i}" value=""></td>
                <td><input type="number" id="burstTime${i}" value=""></td>
                <td></td>
                <td></td>
                <td></td>
            `;
            tableBody.appendChild(row);
        }
    }   
   


    function performScheduling() {
        const numProcesses = parseInt(document.getElementById('numProcesses').value);
        const processes = []; 

        for (let i = 1; i <= numProcesses; i++) {
            const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
            const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
            processes.push(new Process(i, arrivalTime, burstTime));
        }

        fcfsScheduling(processes);
        updateGanttChart(processes);  
   

        const readyQueue = createReadyQueue(processes);
         displayReadyQueue(readyQueue); 
       
    } 

    // Update Gantt chart
    document.getElementById('ganttChart').innerHTML = ganttChartHTML; //to be continued 

    function requiredTime(){
 
    if(newrequiredTime !== null){
    document.getElementById('requiredTimeInput'); 
    }
    }     //mogawas after performing FCFS scheduling 


 function updateGanttChart(processes) {  //ganttchart 
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let ganttChartHTML = '<div class="gantt-chart">';

    processes.forEach(process => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
            const  idleTime = process.arriveTime - currentTime; 
            const idleBox = `
            <div class = "idle-box">
            <div class = "idle-time">Idle: ${currentTime} - ${process.arrivalTime}</div>
            </div>
            `;
            ganttChartHTML += idleBox; 
            currentTime = process.arrivalTime;
        }
        const endTime = currentTime + process.burstTime;

        const processBox = `
            <div class="process-box">
                <div class="process-id">P${process.pid}</div>
                <div class="process-time">${currentTime} - ${endTime}</div>
            </div>
        `;
        ganttChartHTML += processBox;
        currentTime = endTime;
    });

    ganttChartHTML += '</div>'; // Moved this line inside the chart HTML

    const ganttChartBox = document.querySelector('.gantt-chart-box');
    ganttChartBox.innerHTML = ganttChartHTML;
    
    
    
    
    
    
    
    
    
    
    
    
    
  


}



  

    function createReadyQueue(processes) {
        // return processes.map(process => process.pid);
         return processes.map(process => `P${process.pid}`).join(', '); 
        
         }   
    function displayReadyQueue(readyQueue) {
    

    

        const readyQueueCard = document.getElementById('readyQueueCard');
        readyQueueCard.innerHTML = '';
    
        // Create a heading element for the Ready Queue
        const heading = document.createElement('h5');
        heading.classList.add('card-title');
        heading.textContent = 'Ready Queue:';
        readyQueueCard.appendChild(heading);
    
        // Create a paragraph element for the ready queue display
        const queueDisplay = document.createElement('p');
        queueDisplay.textContent =   ` ${readyQueue}`;
        readyQueueCard.appendChild(queueDisplay);
    }
    