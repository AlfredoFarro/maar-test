

import { Manager } from 'socket.io-client'
import Vue from 'vue'

export async function bubbleToast(projectId,userId,userRole) {
  let data = {
    project_id : parseInt(projectId),
    user_id: parseInt(userId),
    user_role: userRole
  }
  console.log("DATA BUBBLE",data)
  const url =
        `?project_id=` + data.project_id + `&user_id=` + data.user_id

  const resp = ''
  const arrayFilters = pushArrayFilters();
  const urlLesson =`?order=desc&sort=id` + `&user_id=` + data.user_id.toString() + `&filter=` + JSON.stringify(arrayFilters)
  const respInbox = ''
  console.log(arrayFilters)
  console.log({respInbox})

  const elements = document.querySelectorAll('.d-flex.align-items-center');
  const API_URL = process.env.APIURL


  var spanBubbleProv = document.createElement('p');
  var spanBubbleLib = document.createElement('p');
  var spanBubbleLib2 = document.createElement('p');
  var spanBubbleRest = document.createElement('p');
  var spanBubbleInbox = document.createElement('p');
  elements.forEach(async (elemento) => {
      const href = elemento.getAttribute('href');

    if (href === '/cronograma' || href === '/usuarios' || href === '/importar' || href === '/registros' || href === '/aprobaciones') {
      const existeBubble = elemento.querySelector('p.bubble');
      let textContent;

      if (!existeBubble) {
        if (href === '/cronograma') {
          if(data.user_role == 'user'){
            textContent = resp.data.countPendienteUser;
          }
          else if(data.user_role == 'admin' || data.user_role == 'planner'){
            textContent = resp.data.countPendienteAdminPlanner;
          }
        } else if (href === '/usuarios') {
          textContent = resp.data.countLiberado;

        } else if (href === '/importar') {
          textContent = resp.data.countAssigned;

        } else if (href === '/registros') {
          textContent = resp.data.countOpen;

        } else if (href === '/aprobaciones') {
         
          textContent = respInbox.data.responseFilter.total_rows;
        }

        if(textContent==0){
         
          return;
        }

        if (href === '/cronograma') {
        
          spanBubbleProv.classList.add('bubble');
          spanBubbleProv.textContent = textContent; // Asigna el texto específico a cada elemento
          elemento.appendChild(spanBubbleProv);
        } else if (href === '/usuarios') {
        
          spanBubbleLib.classList.add('bubble');
          spanBubbleLib.textContent = textContent; // Asigna el texto específico a cada elemento
          elemento.appendChild(spanBubbleLib);

        } else if (href === '/importar') {
       
          spanBubbleLib2.classList.add('bubble');
          spanBubbleLib2.textContent = textContent; // Asigna el texto específico a cada elemento
          elemento.appendChild(spanBubbleLib2);

        } else if (href === '/registros') {
         
          spanBubbleRest.classList.add('bubble');
          spanBubbleRest.textContent = textContent; // Asigna el texto específico a cada elemento
          elemento.appendChild(spanBubbleRest);


        } else if (href === '/aprobaciones') {
        
          spanBubbleInbox.classList.add('bubble');
          spanBubbleInbox.textContent = textContent; // Asigna el texto específico a cada elemento
          elemento.appendChild(spanBubbleInbox);
        }
        
        

        // const manager = new Manager(API_URL+'socket.io/socket.io.js')
        // const socket = manager.socket('/')
        // socket.on('update-bubble', (data) => {
         
        //   // Verifica si el evento de socket contiene información sobre el cambio
        //   // Actualiza el textContent de la burbuja si es necesario
         
        //   if (href === '/provisionales') {
        //     textContent = data.countBubble.data.countPendiente;
        //   } else if (href === '/restricciones-por-liberar') {
        //     textContent = data.countBubble.data.countLiberado;
  
        //   } else if (href === '/restricciones-por-liberar-2') {
        //     textContent = resp.data.countAssigned;
  
        //   } else if (href === '/restricciones') {
        //     textContent = data.countBubble.data.countOficializado;
  
        //   }
         
        //   spanBubble.textContent = textContent
        // });
        
      }
    }
  });
  
  elements.forEach(async (elemento) => {
    const href = elemento.getAttribute('href');
    if (href === '/cronograma' || href === '/usuarios' || href === '/importar' || href === '/registros' || href === '/aprobaciones') {
      
      const existeBubbleSocket = elemento.querySelector('p.bubble');
      let textContent;
      const manager = new Manager(API_URL+'socket.io/socket.io.js')
      const socket = manager.socket('/')

      // Joining a room
      socket.emit('join_room', data.user_id);

      socket.on('update-bubble', (data_socket) => {
      console.log('socket 227', data.user_role, data_socket)
        // Verifica si el evento de socket contiene información sobre el cambio
        // Actualiza el textContent de la burbuja si es necesario
      
        if (href === '/cronograma') {
          if(data.user_role == 'user'){
            textContent = data_socket.data.countPendienteUser;
          }
          else if(data.user_role == 'admin' || data.user_role == 'planner'){
            textContent = data_socket.data.countPendienteAdminPlanner;
          }
        } else if (href === '/usuarios') {
        
          textContent = data_socket.data.countLiberado;

        } else if (href === '/importar') {
         
          textContent = data_socket.data.countAssigned;

        } else if (href === '/registros') {
         
          textContent = data_socket.data.countOpen;

        } else if (href === '/aprobaciones') {
         
          textContent = data_socket.data.countOpen;

        }
       
        if (href === '/aprobaciones') {
          spanBubbleProv.textContent = textContent
          Vue.bus.emit('executeGetDataProvisionales');
          if (textContent == 0) {
            
            spanBubbleProv.style.display = 'none'; // Oculta la burbuja
          }
          
          if (!existeBubbleSocket && textContent != 0) {
            
            spanBubbleProv.classList.add('bubble');
            spanBubbleProv.textContent = textContent; 
            elemento.appendChild(spanBubbleProv);
          }// Asigna el texto específico a cada elemento
          if (spanBubbleProv.style.display == 'none' && textContent != 0) {
            
            spanBubbleProv.style.display = 'block'
          }// Asigna el texto específico a cada elemento
        
        }
        if (href === '/registros') {
          spanBubbleLib.textContent = textContent
          Vue.bus.emit('executeGetDataRestrictionxLiberar');
          if (textContent == 0) {
            
            spanBubbleLib.style.display = 'none'; // Oculta la burbuja
          }
          
          if (!existeBubbleSocket && textContent != 0) {
            
            spanBubbleLib.classList.add('bubble');
            spanBubbleLib.textContent = textContent; 
            elemento.appendChild(spanBubbleLib);

          }// Asigna el texto específico a cada elemento
          if (spanBubbleLib.style.display == 'none' && textContent != 0) {
            
            spanBubbleLib.style.display = 'block'
          }// Asigna el texto específico a cada elemento
        }
        if (href === '/importar') {
          spanBubbleLib2.textContent = textContent
          Vue.bus.emit('executeGetDataRestrictionxLiberarAsignadas');
          if (textContent == 0) {
            
            spanBubbleLib2.style.display = 'none'; // Oculta la burbuja
          }
          
          if (!existeBubbleSocket && textContent != 0) {
            
            spanBubbleLib2.classList.add('bubble');
            spanBubbleLib2.textContent = textContent; 
            elemento.appendChild(spanBubbleLib2);
          }// Asigna el texto específico a cada elemento
          if (spanBubbleLib2.style.display == 'none' && textContent != 0) {
            
            spanBubbleLib2.style.display = 'block'
          }// Asigna el texto específico a cada elemento
        }
        if (href === '/usuarios') {
          spanBubbleRest.textContent = textContent
          Vue.bus.emit('executeGetDataRestriction');
          if (textContent == 0) {
            
            spanBubbleRest.style.display = 'none'; // Oculta la burbuja
          }
          
          if (!existeBubbleSocket && textContent != 0) {
            
            spanBubbleRest.classList.add('bubble');
            spanBubbleRest.textContent = textContent; 

          }// Asigna el texto específico a cada elemento
          if (spanBubbleRest.style.display == 'none' && textContent != 0) {
            
            spanBubbleRest.style.display = 'block'
          }// Asigna el texto específico a cada elemento
        }
        if (href === '/cronograma') {
          spanBubbleRest.textContent = textContent
          Vue.bus.emit('executeGetDataRestriction');
          if (textContent == 0) {
            
            spanBubbleRest.style.display = 'none'; // Oculta la burbuja
          }
          
          if (!existeBubbleSocket && textContent != 0) {
            
            spanBubbleRest.classList.add('bubble');
            spanBubbleRest.textContent = textContent; 

          }// Asigna el texto específico a cada elemento
          if (spanBubbleRest.style.display == 'none' && textContent != 0) {
            
            spanBubbleRest.style.display = 'block'
          }// Asigna el texto específico a cada elemento
        }
        

      });
    }
  });
    
}

function pushArrayFilters(){
  
  const arrayFilters = []
  
  const type_ambito = JSON.parse(localStorage.getItem('userData')).role_user[0].area_name!='' && JSON.parse(localStorage.getItem('userData')).role_user[0].area_name!=null ? 'area':'proyecto'
  const area_name = JSON.parse(localStorage.getItem('userData')).role_user[0].area_name
  const project_id = JSON.parse(localStorage.getItem('userData')).role_user[0].project_id
  const user_id = JSON.parse(localStorage.getItem('userData')).role_user[0].user_id
  const user_role = JSON.parse(localStorage.getItem('userData')).role_user[0].role_lesson
  const isAdminSsomac = (JSON.parse(localStorage.getItem('userData')).role_user[0].role_lesson == 'admin-lesson' && JSON.parse(localStorage.getItem('userData')).role_user[0].is_security)? true : false

  if(type_ambito == 'area'){
  
    if(area_name){
      arrayFilters.push({ keyContains: 'area_name', key: 'equals', value: area_name })
    }else {
      arrayFilters.push({ keyContains: 'ambit', key: 'equals', value: 'oficina'})
    }
  }else {
    if(project_id){
      arrayFilters.push({ keyContains: 'project_id', key: 'equals', value: project_id })
    }else {
      arrayFilters.push({ keyContains: 'ambit', key: 'equals', value: 'proyecto'})
    }
  }

  if(isAdminSsomac){
    console.log("ES ADMIN Y SSOMAC LECCIONES BUBBLE")
    arrayFilters.push({ keyContains: 'is_security', key: 'equals', value: isAdminSsomac })
  }
  
  if(user_role == 'user-lesson'){
    arrayFilters.push({ keyContains: 'status', key: 'in', value: JSON.stringify(["Registrado","Observado","Documentado"]) })
  }else if(user_role == 'admin-lesson'){
    arrayFilters.push({ keyContains: 'status', key: 'equals', value:'Aprobado' })
  }else if(user_role == 'reviewer-lesson'){
    arrayFilters.push({ keyContains: 'status', key: 'equals', value: 'Por-documentar' })
    arrayFilters.push({ keyContains: 'reviewer_id', key: 'equals', value: user_id })
  }

  return arrayFilters;
  
}
