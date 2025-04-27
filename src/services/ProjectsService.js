/* eslint-disable*/
import VueStoreService from './VueStoreService';
const ProjectsService = {
    async getEmpresas(filter,store){        
        var resp = await VueStoreService.get("enterprise"+filter, store)      
        return resp;
    },
    async getProyectosByLessons(filter,store){        
        var resp = await VueStoreService.get("project/listByLesson"+filter, store)      
        return resp;
    },
    async getProyectosAll(filter,store){
        var resp = await VueStoreService.get("project/allUsers"+filter, store)
        return resp;
    },
    async saveProject(data,store){
        var resp = await VueStoreService.post("enterprise",data,store)
        return resp;
    },
    async getProjectById(project_id,store){
        var resp = await VueStoreService.get( "enterprise/"+project_id,store)
        return resp;
    },
    async updateProject(project_id,data,store){
        var resp = await VueStoreService.patch("enterprise/"+project_id,data,store)
        return resp;
    },
    async validateDeleteProject (project_id,store){
        var resp = await VueStoreService.get("project/canDeleteProject/" + project_id,store)
        return resp;
    },
    async deleteProject(project_id,store){
        var resp = await VueStoreService.delete("enterprise/"+project_id,store)
        return resp;
    },
}

export default ProjectsService;