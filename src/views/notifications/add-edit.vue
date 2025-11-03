<template>
  <!-- eslint-disable -->
  <b-sidebar
    id="add-notif"
    :visible="isAdd"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    no-close-on-backdrop
    @change="(val) => $emit('update:is-add', val)"
  >
    <template #default="{ hide }">
      <div
        class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
      >
        <h5 class="mb-0">{{ isEdit ? "Editar" : "Agregar" }} notificación</h5>
        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="
            hide();
            resetForm();
          "
        />
      </div>

      <validation-observer ref="refFormObserver" #default="{ invalid }">
        <b-form class="p-2" @submit.prevent="handleSubmit">
          <!-- Obra -->
          <validation-provider
            name="Obra"
            rules="required"
            #default="{ errors }"
          >
            <b-form-group label="Obra">
              <v-select
                v-model="form.projectId"
                :options="projectOptions"
                :reduce="(p) => p.id"
                label="name"
                :clearable="true"
                :filterable="false"
                :loading="loading.projects"
                placeholder="Buscar obra..."
                @search="onSearchProjects"
                @input="onProjectSelected"
              />
              <b-form-invalid-feedback v-if="errors[0]">{{
                errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Empresa (readonly) -->
          <b-form-group label="Empresa">
            <b-form-input v-model="enterpriseName" readonly />
          </b-form-group>

          <!-- Fecha de notificación -->
          <validation-provider
            name="Fecha de notificación"
            rules="required"
            #default="{ errors }"
          >
            <b-form-group label="Fecha de notificación">
              <b-form-input type="date" v-model="form.notified_at" />
              <b-form-invalid-feedback v-if="errors[0]">{{
                errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Trabajador -->
          <validation-provider
            name="Trabajador"
            rules="required"
            #default="{ errors }"
          >
            <b-form-group label="Trabajador">
              <v-select
                v-model="form.directedUserId"
                :options="userOptionsDisplay"
                :reduce="(u) => u.id"
                label="fullname"
                :clearable="true"
                :filterable="false"
                :loading="loading.users"
                placeholder="Buscar por nombre o DNI..."
                @search="onSearchUsers"
              >
                <template #option="{ fullname, document }">
                  <div class="d-flex justify-content-between w-100">
                    <span>{{ fullname }}</span>
                    <small class="text-muted ml-2">{{ document }}</small>
                  </div>
                </template>
                <template #selected-option="{ fullname, document }">
                  <div class="d-flex justify-content-between w-100">
                    <span>{{ fullname }}</span>
                    <small class="text-muted ml-2">{{ document }}</small>
                  </div>
                </template>
              </v-select>
              <b-form-invalid-feedback v-if="errors[0]">{{
                errors[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Cargo y DNI (readonly) -->
          <b-row>
            <b-col md="6">
              <b-form-group label="Cargo">
                <b-form-input v-model="form.cargo" />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="DNI">
                <b-form-input v-model="form.dni" readonly />
              </b-form-group>
            </b-col>
          </b-row>

          <!-- Jefe directo -->
          <b-form-group label="Jefe directo">
            <v-select
              v-model="form.bossUserId"
              :options="bossOptionsDisplay"
              :reduce="(u) => u.id"
              label="fullname"
              :clearable="true"
              :filterable="false"
              :loading="loading.bosses"
              placeholder="Buscar jefe de proyecto..."
              @search="onSearchBosses"
            >
              <template #option="{ fullname, document }">
                <div class="d-flex justify-content-between w-100">
                  <span>{{ fullname }}</span>
                  <small class="text-muted ml-2">{{ document }}</small>
                </div>
              </template>
              <template #selected-option="{ fullname, document }">
                <div class="d-flex justify-content-between w-100">
                  <span>{{ fullname }}</span>
                  <small class="text-muted ml-2">{{ document }}</small>
                </div>
              </template>
            </v-select>
          </b-form-group>

          <!-- Acción disciplinaria -->
          <validation-provider
            name="Acción disciplinaria"
            rules="required"
            #default="{ errors }"
          >
            <b-form-group label="Acción disciplinaria">
              <b-form-select
                v-model="form.accionDisciplinaria"
                :options="[
                  {
                    value: 'Amonestación escrita',
                    text: 'Amonestación escrita',
                  },
                  { value: 'Suspensión', text: 'Suspensión' },
                  {
                    value: 'Falta Muy Grave RISST',
                    text: 'Falta Muy Grave RISST',
                  },
                ]"
              />
            </b-form-group>
          </validation-provider>

          <!-- Motivo / Observación -->
          <validation-provider
            name="Motivo"
            rules="required"
            #default="{ errors }"
          >
            <b-form-group label="Motivo">
              <b-form-textarea v-model="form.motivo" rows="2" />
            </b-form-group>
          </validation-provider>
          <validation-provider
            name="Observación"
            rules="required"
            #default="{ errors }"
          >
            <b-form-group label="Observación">
              <b-form-textarea v-model="form.observacion" rows="2" />
            </b-form-group>
          </validation-provider>

          <!-- Fechas / días de suspensión -->
          <div v-if="form.accionDisciplinaria === 'Suspensión'">
            <b-row>
              <b-col md="6">
                <b-form-group label="Fecha inicio">
                  <b-form-input type="date" v-model="form.fechaInicio" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Fecha fin">
                  <b-form-input type="date" v-model="form.fechaFin" />
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group label="Días de suspensión">
              <b-form-input
                type="number"
                min="0"
                v-model.number="form.diasSuspension"
                placeholder="0"
                readonly
              />
            </b-form-group>
          </div>

          <!-- Acción correctiva -->
          <b-form-group label="Acción correctiva">
            <b-form-textarea v-model="form.accionCorrectiva" rows="3" />
          </b-form-group>

          <b-form-group label="URL(s) de información adicional">
            <b-form-textarea
              v-model="form.referenceLink"
              rows="2"
              placeholder="Ej.: https://enlace1; https://enlace2"
            />
          </b-form-group>

          <!-- Foto -->
          <b-form-group label="Archivos (imágenes o PDF, máx. 5)">
  <b-form-file
    multiple
    accept="image/*,.pdf"
    @change="onFilesChange"
    browse-text="Seleccionar"
    placeholder="Adjuntar imágenes o PDF…"
  />
  <small class="text-muted d-block mt-25">
    Se permiten hasta 5 archivos combinados (imágenes o PDF). Los PDF se abrirán en una nueva pestaña.
  </small>

  <div class="d-flex flex-wrap mt-2">
    <div
      v-for="(src, i) in form.url_photos"
      :key="i"
      class="mr-1 mb-1 position-relative d-flex align-items-center justify-content-center"
      style="width:108px;height:108px;border:1px solid #e3e3e3;border-radius:6px;overflow:hidden"
    >
      <!-- Imagen -->
      <img v-if="isImage(src)" :src="toImg(src)"
           alt="preview" style="width:100%;height:100%;object-fit:cover" />

      <!-- PDF -->
      <div v-else-if="isPdf(src)" class="text-center p-1" style="width:100%">
        <feather-icon icon="FileTextIcon" size="32" class="mb-25" />
        <b-link :href="toImg(src)" target="_blank">Ver PDF</b-link>
      </div>

      <!-- Botón eliminar -->
      <b-button size="sm" variant="danger"
        class="position-absolute" style="top:4px;right:4px;padding:0 6px"
        @click.prevent="removePhoto(i)">×</b-button>
    </div>
  </div>
</b-form-group>

          <div class="d-flex mt-2 justify-content-end">
            <b-button
              :disabled="invalid || isSubmitting"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              <b-spinner v-if="isSubmitting" small />
              <span v-if="isSubmitting">Procesando...</span>
              <span v-else>{{ isEdit ? "Actualizar" : "Guardar" }}</span>
            </b-button>
            <b-button
              variant="outline-secondary"
              @click="
                hide();
                resetForm();
              "
              >Cancelar</b-button
            >
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
/* eslint-disable */
import { ValidationProvider, ValidationObserver } from "vee-validate";
import vSelect from "vue-select";
import NotificationService from "@/services/NotificationService";
import SedeService from "@/services/SedeService";
import UserService from "@/services/UserService";

export default {
  components: { ValidationProvider, ValidationObserver, vSelect },
  props: { isAdd: { type: Boolean, required: true } },
  data() {
    return {
      isEdit: false,
      isSubmitting: false,
      form: {
        id: null,
        projectId: null,
        directedUserId: null,
        bossUserId: null,
        accionDisciplinaria: null,
        motivo: '',
        observacion: '',
        notified_at: null,
        cargo: "",
        dni: "",
        url_photos: [],
        fechaInicio: null,
        fechaFin: null,
        diasSuspension: null,
        accionCorrectiva: "",
        referenceLink: '',
      },
      isHydrating: false,
      actionOptions: [
        { value: "Amonestación escrita", text: "Amonestación escrita" },
        { value: "Suspensión", text: "Suspensión" },
        { value: "Falta Muy Grave RISST", text: "Falta Muy Grave RISST" },
      ],
      projectOptions: [],

      userOptions: [],
      bossOptions: [],

      userCache: {}, 
      bossCache: {}, 

      reasonOptions: [],
      observationOptions: [],
      loading: { projects: false, users: false, bosses: false, items: false },
      enterpriseName: "",
      photoPreview: "",
      _tSearchProjects: null,
      _tSearchUsers: null,
      _tSearchBosses: null,
    };
  },

  computed: {
    // Siempre incluyen el seleccionado (si existe en el cache) aunque no esté en el último resultado
    userOptionsDisplay() {
      const arr = [...this.userOptions];
      const sel = this.form.directedUserId;
      if (sel && !arr.some((u) => u.id === sel) && this.userCache[sel])
        arr.unshift(this.userCache[sel]);
      return arr;
    },
    bossOptionsDisplay() {
      const arr = [...this.bossOptions];
      const sel = this.form.bossUserId;
      if (sel && !arr.some((u) => u.id === sel) && this.bossCache[sel])
        arr.unshift(this.bossCache[sel]);
      return arr;
    },
  },

  watch: {
    "form.projectId"(nv, ov) {
      if (this.isHydrating) return;
      this.form.bossUserId = null;
      this.bossOptions = [];
      this.onSearchBosses("");
    },

    'form.accionDisciplinaria'(v) {
      if (v !== 'Suspensión') {
        this.form.diasSuspension = null;
        this.form.fechaInicio = null;
        this.form.fechaFin = null;
      }
    },

    "form.fechaInicio"() {
      this.computeDiasSuspension();
    },
    "form.fechaFin"() {
      this.computeDiasSuspension();
    },
    isAdd(val) {
      if (val) this.preload();
    },
    "form.directedUserId": {
      async handler(id) {
        if (!id) {
          this.form.cargo = "";
          this.form.dni = "";
          return;
        }
        let u = this.userCache[id] || this.userOptions.find((x) => x.id === id);
        if (!u) {
          u = await this.fetchSingleUser(id);
          if (u) {
            this.userCache[id] = u;
            this.userOptions = [u, ...this.userOptions];
          }
        }
        this.fillWorkerDerived(u);
      },
      immediate: false,
    },
  },

  methods: {
    async fetchProjects(q) {
      const filters = [];
      if (q?.trim())
        filters.push({ keyContains: "name", key: "contains", value: q.trim() });
      const url = `?limit=100&order=asc&sort=name&filter=${encodeURIComponent(
        JSON.stringify(filters)
      )}`;
      const resp = await SedeService.getProyectos(url, this.$store);
      this.projectOptions = resp?.status ? resp.data.rows : [];
    },
    onSearchProjects(q) {
      clearTimeout(this._tSearchProjects);
      this._tSearchProjects = setTimeout(async () => {
        this.loading.projects = true;
        try {
          await this.fetchProjects(q || "");
        } finally {
          this.loading.projects = false;
        }
      }, 250);
    },
    async ensureProjectOptionById(id) {
      if (!id) return;
      if (this.projectOptions.some((p) => p.id === id)) return;
      const url = `?limit=1&filter=${encodeURIComponent(
        JSON.stringify([{ keyContains: "id", key: "equals", value: id }])
      )}`;
      const resp = await SedeService.getProyectos(url, this.$store);
      if (resp?.status && resp.data.rows?.length)
        this.projectOptions.push(resp.data.rows[0]);
    },
    onProjectSelected(projectId) {
      const p = this.projectOptions.find((x) => x.id === projectId);
      this.enterpriseName = p?.enterprise?.name || "";
    },

    toImg(u) {
      if (!u) return '';
      if (/^data:|^https?:\/\//i.test(u)) return u;
      const base = (process.env.APIURL || '').replace(/\/$/, '');
      return `${base}${u}`;
    },

    // ======= Usuarios
    async fetchUsersOR(q, extraFilters = []) {
      const base = (filters) => {
        const url = `?limit=100&order=asc&sort=fullname&filter=${encodeURIComponent(
          JSON.stringify([...filters, ...extraFilters])
        )}`;
        return UserService.getUsers(url, this.$store);
      };
      const byName = q?.trim()
        ? [{ keyContains: "fullname", key: "contains", value: q.trim() }]
        : [];
      const byDoc = q?.trim()
        ? [{ keyContains: "document", key: "contains", value: q.trim() }]
        : [];
      const [r1, r2] = await Promise.all([base(byName), base(byDoc)]);
      const rows = [
        ...(r1?.status ? r1.data.rows : []),
        ...(r2?.status ? r2.data.rows : []),
      ];
      // Actualiza cache
      rows.forEach((u) => {
        this.userCache[u.id] = u;
      });
      return Array.from(new Map(rows.map((u) => [u.id, u])).values());
    },
    async fetchSingleUser(id) {
      const url = `?limit=1&filter=${encodeURIComponent(
        JSON.stringify([{ keyContains: "id", key: "equals", value: id }])
      )}`;
      const resp = await UserService.getUsers(url, this.$store);
      return resp?.status && resp.data.rows?.length ? resp.data.rows[0] : null;
    },
    onSearchUsers(q) {
      clearTimeout(this._tSearchUsers);
      this._tSearchUsers = setTimeout(async () => {
        this.loading.users = true;
        try {
          this.userOptions = await this.fetchUsersOR(q || "");
        } finally {
          this.loading.users = false;
        }
      }, 300);
    },

    onSearchBosses(q) {
      clearTimeout(this._tSearchBosses);
        this._tSearchBosses = setTimeout(async () => {
          this.loading.bosses = true;
          try {
            // Solo JEFES DE PROYECTO (role.id = 2)
            const extra = [{ key: 'role.id', keyContains: 'equals', value: 2 }];

            // Si hay obra seleccionada, filtra por asignación a esa obra
            if (this.form.projectId) {
              extra.push({
                key: 'project_user',
                keyContains: 'any',
                value: { 'project.id': this.form.projectId }, // clave aplanada
              });
            }

            const rows = await this.fetchUsersOR(q || '', extra);
            rows.forEach(u => { this.bossCache[u.id] = u; });
            this.bossOptions = rows;
          } finally {
            this.loading.bosses = false;
          }
        }, 300);
      },

    // Rellena cargo (rol) y DNI a partir del objeto de usuario
    fillWorkerDerived(u) {
      if (!u) {
        this.form.dni = "";
        return;
      }
      this.form.dni = u.document || "";
    },

    // ======= Utilidades
    computeDiasSuspension() {
      if (!this.form.fechaInicio || !this.form.fechaFin) {
        this.form.diasSuspension = null;
        return;
      }
      const s = new Date(this.form.fechaInicio);
      const e = new Date(this.form.fechaFin);
      if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) {
        this.form.diasSuspension = null;
        return;
      }
      const ONE = 24 * 60 * 60 * 1000;
      this.form.diasSuspension = Math.floor((e - s) / ONE) + 1;
    },

    async preload() {
      await Promise.all([
        this.fetchProjects(""),
        this.onSearchUsers(""),
        this.onSearchBosses(""),
      ]);

      const stored = (() => {
        try {
          return JSON.parse(localStorage.getItem("project_id"));
        } catch {
          return null;
        }
      })();
      if (stored && !this.form.projectId) {
        await this.ensureProjectOptionById(stored);
        this.form.projectId = stored;
        this.onProjectSelected(stored);
      }

      // Asegura que los seleccionados estén en opciones/caches
      if (
        this.form.directedUserId &&
        !this.userCache[this.form.directedUserId]
      ) {
        const u = await this.fetchSingleUser(this.form.directedUserId);
        if (u) {
          this.userCache[u.id] = u;
          this.userOptions = [u, ...this.userOptions];
        }
      }
      if (this.form.bossUserId && !this.bossCache[this.form.bossUserId]) {
        const u = await this.fetchSingleUser(this.form.bossUserId);
        if (u) {
          this.bossCache[u.id] = u;
          this.bossOptions = [u, ...this.bossOptions];
        }
      }

      if (!this.form.notified_at) {
        const today = new Date();
        const m = (n) => String(n).padStart(2, "0");
        this.form.notified_at = `${today.getFullYear()}-${m(
          today.getMonth() + 1
        )}-${m(today.getDate())}`;
      }

      this.onProjectSelected(this.form.projectId);
      this.fillWorkerDerived(this.userCache[this.form.directedUserId]);
      this.computeDiasSuspension();
    },

    async setData(payload = null) {
      if (payload) {
        this.isEdit = !!payload.isEdit;
        this.isHydrating = true;
        this.form = {
          id: payload.id ?? null,
          projectId: payload.projectId ?? null,
          directedUserId: payload.directedUserId ?? null,
          bossUserId: payload.bossUserId ?? null,
          accionDisciplinaria: payload.accionDisciplinaria ?? null,
          motivo: payload.motivo ?? '',
          observacion: payload.observacion ?? '',
          notified_at: payload.notified_at ?? null,
          cargo: payload.cargo ?? "",
          dni: payload.dni ?? "",
          url_photos: Array.isArray(payload.url_photos) ? payload.url_photos.slice(0,5) : [],
          fechaInicio: payload.fechaInicio ?? null,
          fechaFin: payload.fechaFin ?? null,
          diasSuspension: payload.diasSuspension ?? null,
          accionCorrectiva: payload.accionCorrectiva ?? "",
          referenceLink: payload.referenceLink ?? '',
        };
        await this.ensureProjectOptionById(this.form.projectId);
         this.onProjectSelected(this.form.projectId);
         if (this.form.directedUserId && !this.userCache[this.form.directedUserId]) {
           const u = await this.fetchSingleUser(this.form.directedUserId);
           if (u) {
             this.userCache[u.id] = u;
             this.userOptions = [u, ...this.userOptions];
             this.fillWorkerDerived(u);
           }
         } else {
           this.fillWorkerDerived(this.userCache[this.form.directedUserId]);
         }
         if (this.form.bossUserId && !this.bossCache[this.form.bossUserId]) {
           const b = await this.fetchSingleUser(this.form.bossUserId);
           if (b) {
             this.bossCache[b.id] = b;
             this.bossOptions = [b, ...this.bossOptions];
           }
         }
         this.computeDiasSuspension();
        this.isHydrating = false;
      } else {
        this.resetForm();
      }
    },

    resetForm() {
      this.isEdit = false;
      this.enterpriseName = "";
      this.photoPreview = "";
      this.form = {
        id: null,
        projectId: null,
        directedUserId: null,
        bossUserId: null,
        accionDisciplinaria: null,
        motivo: '',
        observacion: '',
        notified_at: null,
        cargo: "",
        dni: "",
        url_photos: [],
        fechaInicio: null,
        fechaFin: null,
        diasSuspension: null,
        accionCorrectiva: "",
        referenceLink: '',
      };
      this.reasonOptions = [];
      this.observationOptions = [];
      this.$nextTick(() => this.$refs.refFormObserver?.reset());
    },

    onFilesChange(e) {
  const picked = Array.from(e?.target?.files || []);

  // Solo imágenes o PDF
  const allowed = picked.filter(f =>
    /^image\//i.test(f.type) || f.type === 'application/pdf'
  );

  const room = Math.max(0, 5 - this.form.url_photos.length);
  const chosen = allowed.slice(0, room);

  const readers = chosen.map(f => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);   // data URL (imagen o pdf)
    r.onerror = reject;
    r.readAsDataURL(f);
  }));

  Promise.all(readers).then(b64s => {
    this.form.url_photos = [...this.form.url_photos, ...b64s];
  });
},
isPdf(u) {
  const s = String(u || '');
  return /^data:application\/pdf/i.test(s) || /\.pdf($|\?)/i.test(s);
},
removePhoto(i) {
  if (Array.isArray(this.form.url_photos)) {
    this.form.url_photos.splice(i, 1);
  }
},
isImage(u) {
  const s = String(u || '');
  return /^data:image\//i.test(s) || /\.(png|jpe?g|gif|webp|bmp|svg)($|\?)/i.test(s);
},

    async handleSubmit() {
      try {
        this.isSubmitting = true;
        if (!this.form.projectId) throw new Error("Selecciona una obra");
        if (!this.form.directedUserId)
          throw new Error("Selecciona un trabajador");
        if (!this.form.accionDisciplinaria)
          throw new Error("Selecciona una acción disciplinaria");
        if (!this.form.notified_at)
          throw new Error("Selecciona la fecha de notificación");

        const { id, ...payload } = this.form;

        if (payload.accionDisciplinaria !== 'Suspensión') {
          payload.fechaInicio = null;
          payload.fechaFin = null;
          payload.diasSuspension = null;
        }

        // normaliza fotos (máx 5)
        payload.url_photos = Array.isArray(payload.url_photos)
          ? payload.url_photos.slice(0, 5)
          : [];


        const resp =
          this.isEdit && id
            ? await NotificationService.update(id, payload, this.$store)
            : await NotificationService.create(payload, this.$store);

        if (!resp?.status)
          throw new Error(resp?.data?.message || "No se pudo guardar");
        this.$emit("saved");
        this.resetForm();
      } catch (e) {
        this.$swal({
          icon: "error",
          title: "Error",
          text: e.message || "Ocurrió un error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
.content-sidebar-header {
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
}
.sidebar-lg {
  width: 720px;
}
</style>
