<template>
  <div class="card">
    <div class="card-header pb-4 px-4">
      <h6 class="mb-0">Daftar Template</h6>
    </div>
    <div class="card-body pt-0 p-4" v-for="template in paginatedData" :key="template.id">
      <ul class="list-group">
        <li class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-300 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ template.title }}</h6>
            <div class="text-xs">
              <span class="text-dark font-weight-bold">Kategori :</span>
              <span class="ms-sm-2">{{ template.id_categori }}</span>
            </div>
            <div class="text-xs">
              <span class="text-dark font-weight-bold">Id pembuat :</span>
              <span class="ms-sm-2">{{ template.id_user }}</span>
            </div>
            <div class="text-xs">
              <span class="text-dark font-weight-bold">Dibuat pada :</span>
              <span class="ms-sm-2 font-weight-bold">{{ formatDate(template.createdAt) }}</span>
            </div>
            <div class="text-xs">
              <span class="text-dark font-weight-bold">Diupdate pada :</span>
              <span class="ms-sm-2 font-weight-bold">{{ formatDate(template.updatedAt) }}</span>
            </div>
          </div>
          <div class="ms-auto text-end">
            <div @click="showDeleteConfirmation(template.id)">
              <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
                <i class="far fa-trash-alt me-2" aria-hidden="true"></i>Hapus
              </a>
            </div>
            <button type="button" class="btn btn-link text-dark px-3 mb-0" data-bs-toggle="modal"
              data-bs-target="#editTemplateModal" @click="showEditTemplateModal(template)">
              <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>Edit
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class=" d-flex justify-content-end p-3">
      <button class="btn btn-secondary me-2" @click="previousPage" :disabled="currentPage === 1">Kembali</button>
      <button class="btn btn-success" @click="nextPage"
        :disabled="currentPage * itemsPerPage >= getTemplate.length">Lanjut</button>
    </div>
    <!-- Modal -->
    <div v-for="template in paginatedData" :key="template.id" class="modal fade" id="editTemplateModal" tabindex="-1"
      aria-labelledby="editTemplateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editTemplateModalLabel">Edit Template</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Form edit donasi -->
            <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="addon-wrapping">
                <img src="https://cdn-icons-png.flaticon.com/128/3406/3406828.png" alt="User Icon" width="28" height="28">
              </span>
              <select v-model="editedTemplate.id_categori" class="form-select" id="inputGroupSelect03" aria-label="Example select with button addon">
                <option  v-for="kat in getCat" :key="kat.id" :value="kat.title">{{ kat.title }}
                </option>
              </select>
            </div>
            <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="addon-wrapping">
                <img src="https://cdn-icons-png.flaticon.com/128/8089/8089953.png" alt="User Icon" width="28" height="28">
              </span>
              <input v-model="editedTemplate.title" type="text" class="form-control" placeholder="Judul Donasi"
                aria-label="Judul" aria-describedby="addon-wrapping">
            </div>
            <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="addon-wrapping">
                <img src="https://cdn-icons-png.flaticon.com/128/1375/1375106.png" alt="User Icon" width="28" height="28">
              </span>
              <input @change="handleImageUpload" type="file" class="form-control" placeholder="Gambar"
                aria-label="Gambar" aria-describedby="addon-wrapping">
            </div>
            <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="addon-wrapping">
                <img src="https://cdn-icons-png.flaticon.com/128/9948/9948547.png" alt="User Icon" width="28" height="28">
              </span>
              <textarea v-model="editedTemplate.des" class="form-control" placeholder="Deskripsi"
                aria-label="With textarea"></textarea>
            </div>
            <div class="input-group flex-nowrap mb-3">
              <span class="input-group-text" id="addon-wrapping">
                <img src="https://cdn-icons-png.flaticon.com/128/9948/9948547.png" alt="User Icon" width="28" height="28">
              </span>
              <textarea v-model="editedTemplate.source" class="form-control" placeholder="Source"
                aria-label="With textarea"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" @click="updateTemplate(template)">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of Modal -->
    <!-- Modal -->
    <div v-for="template in paginatedData" :key="template.id" class="modal fade" id="hapusTemplateModal" tabindex="-1"
      aria-labelledby="hapusTemplateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editTemplateModalLabel">Hapus Template</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Image Section -->
            <div class="text-center mb-4">
              <img
                src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?w=740&t=st=1699954033~exp=1699954633~hmac=37b5f51f290552cfbc30860e0f9d1db9b045c22cf978db1fa06996ab74761b92"
                alt="Donasi Image" class="img-fluid" style="max-height: 200px;">
            </div>
            <h5>Apakah Anda Yakin Ingin Menghapus Data Template?</h5>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-danger" @click="showDeleteConfirmation(template.id)">Hapus</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of Modal -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Swal from 'sweetalert2';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  name: "billing-card",
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 2,
      editedTemplate: {
        id: '',
        id_categori: '',
        title: '',
        image: null,
        des: '',
        source: ''
      },
    };
  },
  computed: {
    ...mapGetters('categori', ['getCat']),
    ...mapGetters('template', ['getTemplate']),
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.getTemplate.slice(startIndex, endIndex);
    },
  },
  methods: {
    ...mapActions('categori', ['fetchCat']),
    ...mapActions('template', ['fetchTemplate', 'hapusTemplate', 'editTemplate']),
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.editedTemplate.image = file;
    },
    showEditTemplateModal(template) {
      console.log(template.id);
      if (template && template.id) {
        this.editedTemplate = {
          id: template.id,
          id_categori: template.id_categori,
          title: template.title,
          image: template.image,
          des: template.des,
          source: template.source,
        };
        new bootstrap.Modal(document.getElementById('editTemplateModal')).show();
      } else {
        console.error('Invalid donation object:', template);
      }
    },

    showDeleteConfirmation(templateId) {
      Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Anda tidak dapat mengembalikan ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya, Hapus Data!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeItem(templateId);

          Swal.fire(
            'Terhapus!',
            'Donasi berhasil dihapus.',
            'success'
          );
        }
      });
    },
    async updateTemplate() {
      try {
        const templateId = this.editedTemplate.id;
        const formData = new FormData();
        
        formData.append('id_categori', this.editedTemplate.id_categori);
        formData.append('title', this.editedTemplate.title);
        formData.append('des', this.editedTemplate.des);
        formData.append('source', this.editedTemplate.source);

        if (this.editedTemplate.image instanceof File) {
          formData.append('image', this.editedTemplate.image);
        }

        const updatedTemplate = await this.$store.dispatch('template/editTemplate', {
          templateId,
          userInput: { ...this.editedTemplate },
        });


        if (updatedTemplate.success) {
          console.log('Template diupdate:', updatedTemplate);
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Data Berhasil Di Perbarui!',
            showConfirmButton: false,
            timer: 3000
          })

          console.log('Template diupdate:', updatedTemplate);
          this.$router.go(0);
        } else {
          console.error('Gagal memperbarui template:', updatedTemplate.error);
        }
      } catch (error) {
        console.error('Error update template:', error);
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.getTemplate.length) {
        this.currentPage++;
      }
    },
    removeItem(templateId) {
      this.hapusTemplate(templateId);
    },
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      });
      const formattedValue = formatter.format(value).replace(/(\.00|,00)$/, '');
      return formattedValue;
    },
  },
  mounted() {
    this.fetchTemplate();
    this.fetchCat();
  },
};
</script>