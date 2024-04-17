import axios from "axios";
const jwt = require('jsonwebtoken');

const template = {
  namespaced: true,
  state: {
    templateData: [],
    updateData: [],
  },
  getters: {
    getTemplate: (state) => state.templateData,
  },
  actions: {
    async fetchTemplate({ commit }) {
      try {
        const data = await axios.get(
          "http://localhost:8080/api/v1/template"
        );
        commit("SET_TEMPLATE", data.data['data']);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async addTemplate({ commit }, { userInput }) {
      try {
        const { id_categori, title, image, des, source } = userInput;
        const token = localStorage.getItem("token");
        const decodedToken = jwt.decode(token);
    
        if (decodedToken && decodedToken.id) {
          const formData = new FormData();
          formData.append('id_categori', id_categori);
          formData.append('title', title);
          formData.append('image', image);
          formData.append('des', des);
          formData.append('source', source);
          formData.append('id_user', decodedToken.id);
    
          const response = await axios.post('http://localhost:8080/api/v1/template', formData, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'multipart/form-data',
            }
          });
    
          if (response.data.success) {
            commit('SET_ADD', { addedTemplate: userInput });
          }
    
          return response.data;
        } else {
          console.error('Error: Unable to decode token or missing id_user');
        }
      } catch (error) {
        console.error('Error add template:', error);
        throw error;
      }
    },    
    async hapusTemplate({ dispatch }, templateId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:8080/api/v1/template/${templateId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, 
              id: templateId,
            }
          },
        );
        console.log(response.data.message);
        dispatch("fetchTemplate");
      } catch (error) {
        alert("Error removing item from template");
        console.log(error);
      }
    },
    async editTemplate({ commit }, { templateId, userInput }) {
      try {
        const token = localStorage.getItem("token");
        const { id_categori, title, image, des, source } = userInput;
    
        const dataToUpdate = new FormData();
        dataToUpdate.append('id_categori', id_categori);
        dataToUpdate.append('title', title);
        dataToUpdate.append('des', des);
        dataToUpdate.append('source', source);
    
        if (image instanceof File) {
          dataToUpdate.append('image', image);
        }
    
        const response = await axios.put(`http://localhost:8080/api/v1/template/${templateId}`, dataToUpdate, 
          {
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        if (response.data.success) {
          commit('SET_UPDATE', { templateId, updatedTemplate: dataToUpdate });
        }
    
        return response.data;
      } catch (error) {
        console.error('Error updating donation:', error);
        throw error;
      }
    },         
  },
  mutations: {
    SET_TEMPLATE(state, template) {
      state.templateData = template;
    },
    SET_ADD(state, template) {
      state.addData = template;
    },
    SET_UPDATE(state, template) {
      state.updateData = template;
    },
  },
};

export default template;