/**
 * 
 * 
 */

const oneSetHtml = `
        <div class="row" data-id="${workoutLog.id}>
        <div class="col s12">
        <div class="card">
            <div class="col s12" >
                <img src="img/chest.png"  class="workout-icon" alt="Workout Icon">
            </div>
            <div class="col s12" >
                <span class="card-title workout-title">${workoutLog.title}</span>
                <div class="workout-description">${workworkoutLogout.description}</div> 
                <p class="workout-date">11/13/2024</p>
            </div>
            <div class="card-content">
            <div class="workout-sets">                        
                <table>
                    <thead>
                    <tr>
                        <th>Set</th>
                        <th>Repetitions</th>
                        <th>Weight</th>
                        <th>Difficulty</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="first-set">1</td>
                        <td class="first-rep-amount">${workoutLog.first-rep-amount}</td>
                        <td class="first-weight-amount">${workoutLog.first-weight-amount}</td>
                        <td class="first-difficulty">${workoutLog.first-difficulty}</td>
                    </tr>
                    </tbody>
                </table>
            </div>                      
            </div>
            <div class="card-action">
                <button class="task-delete btn-flat" aria-label="Delete Task">
                    <i class="material-icons red-text large">delete</i>
                </button>
                <button class="task-delete btn-flat" aria-label="Delete Task">
                    <i class="material-icons light-blue-text text-darken-4 large">edit</i>
                </button>
            </div>
        </div>
        </div>
        </div>`


const twoSetHtml = `
        <div class="row" data-id="${workoutLog.id}>
        <div class="col s12">
        <div class="card">
            <div class="col s12" >
                <img src="img/chest.png"  class="workout-icon" alt="Workout Icon">
            </div>
            <div class="col s12" >
                <span class="card-title workout-title">${workoutLog.title}</span>
                <div class="workout-description">${workworkoutLogout.description}</div> 
                <p class="workout-date">11/13/2024</p>
            </div>
            <div class="card-content">
            <div class="workout-sets">                        
                <table>
                    <thead>
                    <tr>
                        <th>Set</th>
                        <th>Repetitions</th>
                        <th>Weight</th>
                        <th>Difficulty</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="first-set">1</td>
                        <td class="first-rep-amount">${workoutLog.first-rep-amount}</td>
                        <td class="first-weight-amount">${workoutLog.first-weight-amount}</td>
                        <td class="first-difficulty">${workoutLog.first-difficulty}</td>
                    </tr>
                    <tr>
                        <td class="second-set">2</td>
                        <td class="second-rep-amount">${workoutLog.second-rep-amount}</td>
                        <td class="second-weight-amount">${workoutLog.second-weight-amount}</td>
                        <td class="second-difficulty">${workoutLog.second-difficulty}</td>
                    </tr>
                    </tbody>
                </table>
            </div>                      
            </div>
            <div class="card-action">
                <button class="task-delete btn-flat" aria-label="Delete Task">
                    <i class="material-icons red-text large">delete</i>
                </button>
                <button class="task-delete btn-flat" aria-label="Delete Task">
                    <i class="material-icons light-blue-text text-darken-4 large">edit</i>
                </button>
            </div>
        </div>
        </div>
        </div>`


const threeSetHtml = `
        <div class="row" data-id="${workoutLog.id}>
        <div class="col s12">
        <div class="card">
            <div class="col s12" >
                <img src="img/chest.png"  class="workout-icon" alt="Workout Icon">
            </div>
            <div class="col s12" >
                <span class="card-title workout-title">${workoutLog.title}</span>
                <div class="workout-description">${workworkoutLogout.description}</div> 
                <p class="workout-date">11/13/2024</p>
            </div>
            <div class="card-content">
            <div class="workout-sets">                        
                <table>
                    <thead>
                    <tr>
                        <th>Set</th>
                        <th>Repetitions</th>
                        <th>Weight</th>
                        <th>Difficulty</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="first-set">1</td>
                            <td class="first-rep-amount">${workoutLog.first-rep-amount}</td>
                            <td class="first-weight-amount">${workoutLog.first-weight-amount}</td>
                            <td class="first-difficulty">${workoutLog.first-difficulty}</td>
                        </tr>
                        <tr>
                            <td class="second-set">2</td>
                            <td class="second-rep-amount">${workoutLog.second-rep-amount}</td>
                            <td class="second-weight-amount">${workoutLog.second-weight-amount}</td>
                            <td class="second-difficulty">${workoutLog.second-difficulty}</td>
                        </tr>
                        <tr>
                        <td class="third-set">3</td>
                        <td class="third-rep-amount">${workoutLog.third-rep-amount}</td>
                        <td class="third-weight-amount">${workoutLog.third-weight-amount}</td>
                        <td class="third-difficulty">${workoutLog.third-difficulty}</td>
                        </tr>
                    </tbody>
                </table>
            </div>                      
            </div>
            <div class="card-action">
                <button class="task-delete btn-flat" aria-label="Delete Task">
                    <i class="material-icons red-text large">delete</i>
                </button>
                <button class="task-delete btn-flat" aria-label="Delete Task">
                    <i class="material-icons light-blue-text text-darken-4 large">edit</i>
                </button>
            </div>
        </div>
        </div>
        </div>`