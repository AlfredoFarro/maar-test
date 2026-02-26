<template>
  <!-- eslint-disable -->
  <div class="w-100">
    <b-overlay
      variant="white"
      :show="showLoading"
      spinner-variant="primary"
      blur="0"
      opacity=".75"
      rounded="sm"
    >
      <add-edit :is-add.sync="isAdd" ref="addEditRef" @saved="onSaved" />

      <!-- Filtros -->
      <b-card ref="filterContent" no-body class="sticky">
        <b-card-body>
          <b-row>
            <b-col md="4" lg="3">
              <div>
                <b-form-group label="Trabajador" class="mr-2">
                  <b-form-input
                    id="f-worker"
                    v-model="workerSearch"
                    placeholder="Nombre o DNI"
                    autocomplete="off"
                    @input="filter"
                  />
                </b-form-group>
              </div>
            </b-col>

            <!-- Acción disciplinaria -->
            <b-col md="4" lg="2">
              <b-form-group label="Acción disciplinaria">
                <b-form-select
                  v-model="actionFilter"
                  :options="actionOptions"
                  @change="filter"
                />
              </b-form-group>
            </b-col>

            <b-col md="4" lg="2">
              <b-form-group label="F. notificación (desde)">
                <b-form-input
                  type="date"
                  v-model="notifiedFrom"
                  @change="filter"
                />
              </b-form-group>
            </b-col>

            <b-col md="4" lg="2">
              <b-form-group label="F. notificación (hasta)">
                <b-form-input
                  type="date"
                  v-model="notifiedTo"
                  @change="filter"
                />
              </b-form-group>
            </b-col>

            <!-- Acciones -->
            <b-col md="6" lg="3" class="d-flex align-items-end mb-1">
              <b-button
                class="mr-2"
                variant="primary"
                :disabled="!rolesAllowed.includes(user_role)"
                @click="addItem"
              >
                <span class="text-nowrap"
                  ><feather-icon icon="PlusCircleIcon" /> Agregar</span
                >
              </b-button>

              <!-- NUEVO: Importar con modal -->
              <b-button
                variant="outline-secondary"
                :disabled="!rolesAllowed.includes(user_role)"
                @click="openImportModal"
              >
                <feather-icon icon="UploadCloudIcon" class="mr-25" /> Importar
                Excel
              </b-button>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <!-- Tabla -->
      <b-card no-body ref="tableCard">
        <div class="table-overflow">
          <b-table
            class="position-relative"
            empty-text="No existen"
            :fields="visibleFields"
            :hover="true"
            :items="records"
            no-border-collapse
            ref="selectableTable"
            show-empty
            @sort-changed="sortChanged"
          >
            <template #cell(actions)="data">
              <b-button
                size="sm"
                @click.prevent="editItem(data.item)"
                :disabled="!rolesAllowed.includes(user_role)"
                v-b-tooltip.noninteractive.hover.left="'Editar'"
                variant="flat-success"
              >
                <feather-icon size="20" icon="Edit2Icon" />
              </b-button>
              <b-button
                size="sm"
                :disabled="!rolesAllowed.includes(user_role)"
                v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                @click="deleteAction(data.item)"
                variant="flat-danger"
              >
                <feather-icon size="20" icon="XIcon" />
              </b-button>
              <b-button
                size="sm"
                v-b-tooltip.noninteractive.hover.left="'Descargar PDF'"
                variant="flat-primary"
                @click.prevent="downloadPdf(data.item)"
              >
                <feather-icon size="20" icon="DownloadIcon" />
              </b-button>
            </template>

            <template #cell(project)="data">
              <span>{{
                (data.item.project && data.item.project.name) || "-"
              }}</span>
            </template>

            <template #cell(worker)="data">
              <span>{{
                (data.item.directedUser && data.item.directedUser.fullname) ||
                "-"
              }}</span>
            </template>

            <template #cell(boss)="data">
              <span>{{
                (data.item.bossUser && data.item.bossUser.fullname) || "-"
              }}</span>
            </template>

            <template #cell(motivo)="data">
              <span>{{ data.item.motivo || "-" }}</span>
            </template>

            <template #cell(observacion)="data">
              <span>{{ data.item.observacion || "-" }}</span>
            </template>

            <template #cell(notified_at)="data">
              <span>{{ formatDate(data.item.notified_at) }}</span>
            </template>
          </b-table>
        </div>

        <!-- Footer -->
        <div class="mx-2 mb-2">
          <b-row>
            <b-col sm="3">
              <b-form-group
                label-cols="4"
                label-cols-md="4"
                label-size="md"
                label="Entradas"
              >
                <b-form-select
                  v-model="showEntrie"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="entries"
                  @change="changeSizePage"
                />
              </b-form-group>
            </b-col>
            <b-col sm="3" class="mt-75" style="font-size: 12px">
              <span>{{ totalElements }} Registros en total</span>
            </b-col>
            <b-col
              cols="12"
              sm="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-end"
            >
              <b-pagination
                v-model="currentPage"
                :total-rows="totalElements"
                :per-page="showEntrie"
                class="mb-0 mt-1 mt-sm-0"
                prev-class="prev-item"
                next-class="next-item"
                @change="cambioPagina"
                pills
              >
                <template #prev-text
                  ><feather-icon icon="ChevronLeftIcon" size="15"
                /></template>
                <template #next-text
                  ><feather-icon icon="ChevronRightIcon" size="15"
                /></template>
              </b-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card>

      <!-- ========================= -->
      <!-- MODAL: Importar desde Excel -->
      <!-- ========================= -->
      <b-modal
        id="import-excel-modal"
        v-model="showImportModal"
        title="Importar notificaciones desde Excel"
        centered
        hide-footer
        no-close-on-backdrop
      >
        <div>
          <b-alert show variant="light" class="mb-2">
            <div class="mb-1"><b>Pasos:</b></div>
            <ol class="mb-0 pl-1">
              <li>Descarga la plantilla para asegurar encabezados válidos.</li>
              <li>Adjunta el archivo Excel con tus registros.</li>
              <li>Presiona <b>Importar</b>.</li>
            </ol>
          </b-alert>

          <div class="d-flex mb-2">
            <b-button
              size="sm"
              variant="outline-primary"
              @click="downloadImportTemplate"
              :disabled="importBusy"
            >
              <feather-icon icon="DownloadCloudIcon" class="mr-25" /> Descargar
              plantilla
            </b-button>
          </div>

          <b-form-group label="Archivo Excel">
            <b-form-file
              v-model="importFile"
              accept=".xlsx,.xls"
              browse-text="Seleccionar"
              placeholder="Elige o arrastra un archivo..."
              drop-placeholder="Suelta el archivo aquí..."
              :disabled="importBusy"
            />
            <small class="text-muted d-block mt-1">
              Extensiones permitidas: .xlsx, .xls
            </small>
          </b-form-group>

          <div class="d-flex justify-content-end mt-2">
            <b-button
              variant="outline-secondary"
              class="mr-1"
              :disabled="importBusy"
              @click="closeImportModal"
            >
              Cancelar
            </b-button>
            <b-button
              variant="primary"
              :disabled="!importFile || importBusy"
              @click="doImportExcel"
            >
              <b-spinner small v-if="importBusy" class="mr-50" /> Importar
            </b-button>
          </div>
        </div>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from "bootstrap-vue";
import addEdit from "./add-edit.vue";
import NotificationService from "@/services/NotificationService";
import moment from "moment";
import Vue from "vue";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

export default {
  directives: { "b-tooltip": VBTooltip },
  components: { addEdit },
  data() {
    return {
      showLoading: false,
      isAdd: false,
      notifiedFrom: null,
      notifiedTo: null,
      fields: [
        { key: "project", label: "PROYECTO", sortable: false },
        { key: "worker", label: "TRABAJADOR", sortable: false },
        { key: "boss", label: "JEFE DIRECTO", sortable: false },
        {
          key: "accionDisciplinaria",
          label: "ACCIÓN DISCIPLINARIA",
          sortable: false,
        },
        //{ key: "motivo", label: "MOTIVO", sortable: false },
        //{ key: "observacion", label: "OBSERVACIÓN", sortable: false },
        { key: "notified_at", label: "Fecha Notificación", sortable: false },
        { key: "actions", label: "ACCIONES" },
      ],
      workerSearch: "",
      importResult: null,
      actionFilter: null,
      actionOptions: [
        { value: null, text: "Todas" },
        { value: "Amonestación escrita", text: "Amonestación escrita" },
        { value: "Suspensión", text: "Suspensión" },
        { value: "Falta Muy Grave RISST", text: "Falta Muy Grave RISST" },
      ],
      arrayFilters: [],
      records: [],
      allData: [],
      allDataSorted: [],
      totalElements: 0,
      currentPage: 1,
      entries: [10, 20, 50, 100],
      showEntrie: 10,
      sort: "id",
      order: "desc",
      project_id: JSON.parse(localStorage.getItem("project_id")),
      user_role: JSON.parse(localStorage.getItem("userData")).role.description,
      rolesAllowed: ["administrador", "gestor"],
      navbar: null,
      filterContent: null,
      tableCard: null,
      tableContainer: null,
      selectableTable: null,
      tableHead: null,
      ths: null,
      trs: null,
      _ro: null,
      _onHeadScroll: null,
      _onBodyScroll: null,

      showImportModal: false,
      importFile: null,
      importBusy: false,
    };
  },
  computed: {
    visibleFields() {
      return this.fields.filter((f) => f.visible !== false);
    },
    isProjectManager() {
      const role = (this.user_role || "").toLowerCase();
      return role === "jefe de proyecto" || role === "jefe de proyectos";
    },
  },
  watch: {
    records() {
      this.$nextTick(() => {
        if (!this.$refs.selectableTable) return;
        this.trs = this.selectableTable
          .querySelector("tbody")
          ?.querySelectorAll("tr");
        this.fixedElements();
      });
    },
    visibleFields() {
      this.$nextTick(() => {
        this.ths = this.selectableTable
          .querySelector("thead")
          ?.querySelectorAll("th");
        this.fixedElements();
      });
    },
  },
  mounted() {
    this.filter();
    this.$nextTick(() => this.initTableHelpers());
  },
  activated() {
    // si usas <keep-alive>
    this.$nextTick(() => this.initTableHelpers());
  },
  deactivated() {
    this.teardownTableHelpers();
  },
  beforeDestroy() {
    this.teardownTableHelpers();
  },
  methods: {
    openImportModal() {
      this.importFile = null;
      this.showImportModal = true;
    },
    closeImportModal() {
      if (this.importBusy) return;
      this.showImportModal = false;
      this.importFile = null;
    },
    async doImportExcel() {
      if (!this.importFile) return;
      try {
        this.importBusy = true;
        const resp = await NotificationService.importExcel(
          this.importFile,
          this.$store
        );
        const ok = resp?.status !== false;
        const payload = ok ? resp.data || resp : resp;

        this.$swal({
          icon: payload?.failed ? "warning" : "success",
          title: "Importación finalizada",
          html: `
            <div style="text-align:left">
              <p><b>${payload?.message || ""}</b></p>
              <p>Total filas: ${payload?.totalRows ?? "-"}</p>
              <p>Creadas: ${payload?.created ?? 0}</p>
              <p>Con error: ${payload?.failed ?? 0}</p>
              ${
                Array.isArray(payload?.errors) && payload.errors.length
                  ? `<hr/><div style="max-height:200px;overflow:auto;font-size:12px">
                       ${payload.errors
                         .slice(0, 100)
                         .map((e) => `Fila ${e.row}: ${e.message}`)
                         .join("<br/>")}
                     </div>`
                  : ""
              }
            </div>`,
        });

        this.closeImportModal();
        await this.getAllData();
      } catch (err) {
        this.$swal({
          icon: "error",
          title: "Error al importar",
          text: err?.message || "Revisa el archivo",
        });
      } finally {
        this.importBusy = false;
      }
    },
    async downloadImportTemplate() {
      try {
        const blob = await NotificationService.downloadTemplate(this.$store);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Plantilla_Notificaciones.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      } catch (e) {
        this.$swal({ icon: "error", title: "Error", text: e.message });
      }
    },
    formatDate(d) {
      if (!d) return "";
      return moment.utc(d).format("YYYY-MM-DD");
    },
    addItem() {
      this.isAdd = true;
      this.$refs.addEditRef.setData();
    },
    editItem(item) {
      const payload = {
        id: item.id,
        projectId: item.projectId || item.project?.id || null,
        directedUserId: item.directedUserId || item.directedUser?.id || null,
        bossUserId: item.bossUserId || item.bossUser?.id || null,
        cargo: item.cargo || "",
        accionDisciplinaria: item.accionDisciplinaria || null,
        motivo: item.motivo || "",
        observacion: item.observacion || "",
        notified_at: item.notified_at
          ? this.formatDate(item.notified_at)
          : null, // <<--- NUEVO
        fechaInicio: item.fechaInicio
          ? this.formatDate(item.fechaInicio)
          : null,
        fechaFin: item.fechaFin ? this.formatDate(item.fechaFin) : null,
        referenceLink: item.referenceLink || "",
        diasSuspension: item.diasSuspension ?? null,
        accionCorrectiva: item.accionCorrectiva || "",
        url_photos: Array.isArray(item.photos) ? item.photos.slice(0, 5) : [],
        isEdit: true,
      };
      this.isAdd = true;
      this.$nextTick(() => this.$refs.addEditRef.setData(payload));
    },
    deleteAction(item) {
      this.$swal({
        title: "¿Eliminar notificación?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          try {
            this.showLoading = true;
            const resp = await NotificationService.remove(item.id, this.$store);
            if (resp.status) {
              this.$swal({
                icon: "success",
                title: "Eliminado",
                text: "Registro eliminado correctamente",
              });
              this.getAllData();
            } else {
              this.$swal({
                icon: "error",
                title: "Error",
                text: resp.data?.message || "No se pudo eliminar",
              });
            }
          } finally {
            this.showLoading = false;
          }
        }
      });
    },

    toISOStart(d) {
      return d
        ? moment.utc(d, "YYYY-MM-DD").startOf("day").toISOString()
        : null;
    },
    toISOEnd(d) {
      return d ? moment.utc(d, "YYYY-MM-DD").endOf("day").toISOString() : null;
    },

    filter() {
      this.arrayFilters = [];
      if (this.isProjectManager) {
        this.arrayFilters.push({
          keyContains: "project.id",
          key: "equals",
          value: this.project_id || -1,
        });
      }
      if (this.actionFilter) {
        this.arrayFilters.push({
          keyContains: "accionDisciplinaria",
          key: "equals",
          value: this.actionFilter,
        });
      }
      if (this.workerSearch && this.workerSearch.trim()) {
        this.arrayFilters.push({
          keyContains: "directedUser.fullname",
          key: "contains",
          value: this.workerSearch.trim(),
        });
      }
      if (this.notifiedFrom) {
        this.arrayFilters.push({
          keyContains: "notified_at",
          key: "gte",
          value: this.toISOStart(this.notifiedFrom),
        });
      }
      if (this.notifiedTo) {
        this.arrayFilters.push({
          keyContains: "notified_at",
          key: "lte",
          value: this.toISOEnd(this.notifiedTo),
        });
      }

      if (
        this.notifiedFrom &&
        this.notifiedTo &&
        this.notifiedFrom > this.notifiedTo
      ) {
        const tmp = this.notifiedFrom;
        this.notifiedFrom = this.notifiedTo;
        this.notifiedTo = tmp;
      }
      this.getAllData();
    },
    async getAllData() {
      this.showLoading = true;
      try {
        const url = `?limit=10000&order=desc&sort=id&filter=${encodeURIComponent(
          JSON.stringify(this.arrayFilters)
        )}`;
        const resp = await NotificationService.getAll(url, this.$store);
        this.allData = resp.status ? resp.data.rows || [] : [];
        this.totalElements = resp.status
          ? resp.data.responseFilter?.total_rows || this.allData.length
          : 0;
        this.getSortedData("id", "desc");
        this.currentPage = 1;
        this.records = this.allDataSorted[0] || [];
        this.$nextTick(this.fixedElements);
      } finally {
        this.showLoading = false;
      }
    },
    cambioPagina(p) {
      this.currentPage = p;
      this.records = this.allDataSorted[p - 1] || [];
      this.$nextTick(this.fixedElements);
    },
    changeSizePage() {
      this.getSortedData(this.sort, this.order);
      this.currentPage = 1;
      this.records = this.allDataSorted[0] || [];
      this.$nextTick(this.fixedElements);
    },
    sortChanged(data) {
      this.sort = data.sortBy;
      this.order = data.sortDesc ? "desc" : "asc";
      this.getSortedData(this.sort, this.order);
      this.records = this.allDataSorted[0] || [];
      this.currentPage = 1;
      this.$nextTick(this.fixedElements);
    },
    getAttributeValue(obj, attr) {
      if (attr.includes(".")) {
        const parts = attr.split(".");
        let v = obj;
        for (const p of parts) {
          if (v && Object.prototype.hasOwnProperty.call(v, p)) v = v[p];
          else return null;
        }
        return v;
      }
      return obj[attr];
    },
    async onExcelSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        this.showLoading = true;
        const resp = await NotificationService.importExcel(file, this.$store);

        const ok = resp?.status !== false;
        const payload = ok ? resp.data || resp : resp;

        this.importResult = payload;

        this.$swal({
          icon: payload?.failed ? "warning" : "success",
          title: "Importación finalizada",
          html: `
        <div style="text-align:left">
          <p><b>${payload?.message || ""}</b></p>
          <p>Total filas: ${payload?.totalRows ?? "-"}</p>
          <p>Creadas: ${payload?.created ?? 0}</p>
          <p>Con error: ${payload?.failed ?? 0}</p>
          ${
            Array.isArray(payload?.errors) && payload.errors.length
              ? `<hr/><div style="max-height:200px;overflow:auto;font-size:12px">
                   ${payload.errors
                     .slice(0, 100)
                     .map((e) => `Fila ${e.row}: ${e.message}`)
                     .join("<br/>")}
                 </div>`
              : ""
          }
        </div>`,
        });

        await this.getAllData();
      } catch (err) {
        this.$swal({
          icon: "error",
          title: "Error al importar",
          text: err?.message || "Revisa el archivo",
        });
      } finally {
        this.showLoading = false;
        if (this.$refs.excelInput) this.$refs.excelInput.value = "";
      }
    },
    getSortedData(sortBy, sortOrder) {
      const sorted = [...this.allData].sort((a, b) => {
        const aVal = this.getAttributeValue(a, sortBy);
        const bVal = this.getAttributeValue(b, sortBy);
        if (sortOrder === "asc") return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      });
      this.allDataSorted = [];
      for (let i = 0; i < sorted.length; i += this.showEntrie) {
        this.allDataSorted.push(sorted.slice(i, i + this.showEntrie));
      }
    },
    onSaved() {
      this.isAdd = false;
      this.getAllData();
    },

    initTableHelpers() {
      this.navbar = document.querySelector(".navbar") || { offsetHeight: 0 };
      this.filterContent = this.$refs.filterContent;
      this.tableContainer = this.$el.querySelector(".table-overflow");
      this.tableCard = this.$refs.tableCard;
      this.selectableTable = this.$refs.selectableTable?.$el;
      if (!this.selectableTable) return;
      this.tableHead = this.selectableTable.querySelector("thead");
      this.ths = this.tableHead?.querySelectorAll("th") || [];

      if (this.tableHead && this.tableContainer) {
        this._onHeadScroll = () => {
          this.tableContainer.scrollLeft = this.tableHead.scrollLeft;
          this.tableHead.style.transform = `translateX(${this.tableHead.scrollLeft}px)`;
        };
        this._onBodyScroll = () => {
          this.tableHead.scrollLeft = this.tableContainer.scrollLeft;
          this.tableHead.style.transform = `translateX(${this.tableHead.scrollLeft}px)`;
        };
        this.tableHead.addEventListener("scroll", this._onHeadScroll);
        this.tableContainer.addEventListener("scroll", this._onBodyScroll);
      }

      window.addEventListener("scroll", this.handleWindowScroll);
      window.addEventListener("resize", this.fixedElements);

      this._ro = new ResizeObserver(this.fixedElements);
      this._ro.observe(this.tableCard);
      this.$nextTick(this.fixedElements);
    },

    teardownTableHelpers() {
      try {
        if (this.tableHead) {
          this.tableHead.classList.remove("fixed");
          this.tableHead.style.top = null;
          this.tableHead.style.transform = "translateX(0px)";
          if (this._onHeadScroll)
            this.tableHead.removeEventListener("scroll", this._onHeadScroll);
        }
        if (this.selectableTable) {
          this.selectableTable.style.paddingTop = null;
        }
        if (this.tableContainer && this._onBodyScroll) {
          this.tableContainer.removeEventListener("scroll", this._onBodyScroll);
        }
        window.removeEventListener("scroll", this.handleWindowScroll);
        window.removeEventListener("resize", this.fixedElements);
        if (this._ro) {
          this._ro.disconnect();
          this._ro = null;
        }
      } catch (e) {}
    },

    fixedElements() {
      if (!this.selectableTable || !this.tableHead) return;
      this.trs = this.selectableTable
        .querySelector("tbody")
        ?.querySelectorAll("tr");
      if (!this.trs || this.trs.length === 0) return;

      if (!this.trs[0].classList.contains("b-table-empty-row")) {
        const thsTotalWidth = [...this.ths].reduce(
          (acc, th) => acc + th.offsetWidth,
          0
        );
        if (thsTotalWidth > this.tableCard.offsetWidth) {
          this.ths.forEach((th) => {
            th.style.flex = "0 0 " + th.offsetWidth + "px";
          });
        } else {
          this.ths.forEach((th) => {
            th.style.flex = "1 1 " + th.offsetWidth + "px";
          });
        }
        this.trs.forEach((tr) => {
          const tds = tr.querySelectorAll("td");
          this.ths.forEach((th, idx) => {
            if (!tds[idx]) return;
            tds[idx].style.width = th.offsetWidth + "px";
            if (thsTotalWidth > this.tableCard.offsetWidth) {
              tds[idx].style.flex = "0 0 " + th.offsetWidth + "px";
            } else {
              tds[idx].style.flex = "1 1 " + th.offsetWidth + "px";
            }
          });
        });
      } else {
       const w = (this.tableCard?.offsetWidth || 0) - 1;
       if (w > 0) this.selectableTable.style.width = w + "px";
     
       this.ths.forEach((th) => {
         th.style.flex = "1 1 auto";
         th.style.width = null;
       });
      }
      this.tableHead.style.width = this.tableCard.offsetWidth - 1 + "px";
      this.selectableTable.style.paddingTop = this.tableHead.offsetHeight + "px";
    },

    async downloadPdf(item) {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token || "";
        const url = `${process.env.APIURL}notifications/${item.id}/pdf`;
        const resp = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("No se pudo descargar");
        const blob = await resp.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `Notificacion_${item.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      } catch (e) {
        this.$swal({
          icon: "error",
          title: "Error",
          text: e.message || "Ocurrió un error",
        });
      }
    },

    handleWindowScroll() {
      if (!this.navbar || !this.filterContent || !this.tableHead) return;
      this.filterContent.style.top = this.navbar.offsetHeight + "px";
      if (
        this.tableCard.offsetTop -
          this.navbar.offsetHeight -
          7 -
          window.scrollY <=
        0
      ) {
        this.tableHead.classList.add("fixed");
        this.tableHead.style.top =
          this.navbar.offsetHeight + this.filterContent.offsetHeight + "px";
      } else {
        this.tableHead.classList.remove("fixed");
        this.tableHead.style.top = null;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
