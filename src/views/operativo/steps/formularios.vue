<template>
    <div class="w-100">
        <b-overlay
        variant="white"
        :show="showLoading"
        spinner-variant="primary"
        blur="0"
        opacity=".75"
        rounded="sm"
        >
        <validation-observer #default="{ invalid }" ref="refFormObserver">
            <b-card>
                <!-- DESPACHO -->
                <b-row class="mb-2">
                    <h3 class="mr-1 ml-1">Despacho</h3>
                    
                    <span class="text-nowrap" > 
                        <feather-icon class="addButton" style="width: 25px; height: 25px;" icon="PlusCircleIcon" @click="addDespacho()" />
                    </span>
                </b-row>
                <b-table :items="rowsDespacho" :fields="fields">
                    <template v-slot:cell(formId)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <v-select
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                :options="formularios"
                                label="name"
                                input-id="formDespacho"
                                :reduce="(formularios) => formularios.id"
                                placeholder="Formulario"
                                v-model="row.item.formId"
                                style="width: 700px;"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </v-select>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(order)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-form-input
                                v-model="row.item.order"
                                type="number"
                                id="order"
                                placeholder="Número de Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(mandatory)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(mandatory)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.mandatory"
                                name="mandatory"
                                class="select-obra"
                                :disabled="row.item.isPersonal"
                                :checked="row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(repeatable)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(repeatable)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.repeatable"
                                name="repeatable"
                                class="select-obra"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl1Id)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-button
                            v-if="row.item.groupLvl1Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl2Id)="row">
                        <validation-provider #default="{ errors }" rules="">
                            <b-button
                            v-if="row.item.groupLvl2Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'despacho')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-button
                            size="sm"
                            class=""               
                            @click.prevent="deleteDespacho(row.index)"
                            v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                            variant="flat-danger"               
                            >
                            <feather-icon icon="XCircleIcon" />
                        </b-button>
                        </template>
                </b-table>

                <!-- EMBARQUE -->
                <b-row class="mb-2 mt-2">
                    <h3 class="mr-1 ml-1">Embarque</h3>
                    
                    <span class="text-nowrap" > 
                        <feather-icon class="addButton" style="width: 25px; height: 25px;" icon="PlusCircleIcon" @click="addEmbarque()" />
                    </span>
                </b-row>
                <b-table :items="rowsEmbarque" :fields="fields">
                    <template v-slot:cell(formId)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <v-select
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                :options="formularios"
                                label="name"
                                input-id="formEmbarque"
                                :reduce="(formularios) => formularios.id"
                                placeholder="Formulario"
                                v-model="row.item.formId"
                                style="width: 700px;"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </v-select>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(order)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-form-input
                                v-model="row.item.order"
                                type="number"
                                id="order"
                                placeholder="Número de Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(mandatory)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(mandatory)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.mandatory"
                                name="mandatory"
                                class="select-obra"
                                :disabled="row.item.isPersonal"
                                :checked="row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(repeatable)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(repeatable)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.repeatable"
                                name="repeatable"
                                class="select-obra"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl1Id)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-button
                            v-if="row.item.groupLvl1Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'embarque')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'embarque')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl2Id)="row">
                        <validation-provider #default="{ errors }" rules="">
                            <b-button
                            v-if="row.item.groupLvl2Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'embarque')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'embarque')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-button
                            size="sm"
                            class=""               
                            @click.prevent="deleteEmbarque(row.index)"
                            v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                            variant="flat-danger"               
                            >
                            <feather-icon icon="XCircleIcon" />
                        </b-button>
                        </template>
                </b-table>
                <!-- Conducción -->
                <b-row class="mb-2 mt-2">
                    <h3 class="mr-1 ml-1">Conducción</h3>
                    
                    <span class="text-nowrap" > 
                        <feather-icon class="addButton" style="width: 25px; height: 25px;" icon="PlusCircleIcon" @click="addConduccion()" />
                    </span>
                </b-row>
                <b-table :items="rowsConduccion" :fields="fields">
                    <template v-slot:cell(formId)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <v-select
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                :options="formularios"
                                label="name"
                                input-id="formConduccion"
                                :reduce="(formularios) => formularios.id"
                                placeholder="Formulario"
                                v-model="row.item.formId"
                                style="width: 700px;"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </v-select>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(order)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-form-input
                                v-model="row.item.order"
                                type="number"
                                id="order"
                                placeholder="Número de Orden"
                                @input="editAddedRow(row.item, row.index)"
                                autocomplete="off"
                                class="select-obra">
                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(mandatory)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(mandatory)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.mandatory"
                                name="mandatory"
                                class="select-obra"
                                :disabled="row.item.isPersonal"
                                :checked="row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(repeatable)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(repeatable)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.repeatable"
                                name="repeatable"
                                class="select-obra"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl1Id)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-button
                            v-if="row.item.groupLvl1Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'conduccion')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'conduccion')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl2Id)="row">
                        <validation-provider #default="{ errors }" rules="">
                            <b-button
                            v-if="row.item.groupLvl2Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'conduccion')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'conduccion')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-button
                            size="sm"
                            class=""               
                            @click.prevent="deleteConduccion(row.index)"
                            v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                            variant="flat-danger"               
                            >
                            <feather-icon icon="XCircleIcon" />
                        </b-button>
                        </template>
                </b-table>
                <!-- Finalización -->
                <b-row class="mb-2 mt-2">
                    <h3 class="mr-1 ml-1">Finalización</h3>
                    
                    <span class="text-nowrap" > 
                        <feather-icon class="addButton" style="width: 25px; height: 25px;" icon="PlusCircleIcon" @click="addFinalizacion()" />
                    </span>
                </b-row>
                <b-table :items="rowsFinalizacion" :fields="fields">
                    <template v-slot:cell(formId)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <v-select
                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                :options="formularios"
                                label="name"
                                input-id="formFinalizacion"
                                :reduce="(formularios) => formularios.id"
                                placeholder="Formulario"
                                v-model="row.item.formId"
                                style="width: 700px;"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </v-select>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(order)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-form-input
                                v-model="row.item.order"
                                type="number"
                                id="order"
                                placeholder="Número de Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra">
                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(mandatory)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(mandatory)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.mandatory"
                                name="mandatory"
                                class="select-obra"
                                :disabled="row.item.isPersonal"
                                :checked="row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(repeatable)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(repeatable)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.repeatable"
                                name="repeatable"
                                class="select-obra"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl1Id)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE">
                            <b-button
                            v-if="row.item.groupLvl1Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'finalizacion')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl1Id"
                            @click="selectSups(row, 'groupLvl1Id', 'finalizacion')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                            <small class="text-danger">{{ errors[0] }}</small>

                        </validation-provider>
                    </template>
                    <template v-slot:cell(groupLvl2Id)="row">
                        <validation-provider #default="{ errors }" rules="">
                            <b-button
                            v-if="row.item.groupLvl2Id == null"
                            class="mr-2"
                            variant="primary"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'finalizacion')">
                                <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Agregar </span>
                            </b-button>
                            <b-button
                            v-else
                            class="mr-2"
                            variant="warning"
                            v-model="row.item.groupLvl2Id"
                            :disabled="row.item.groupLvl1Id == null"
                            @click="selectSups(row, 'groupLvl2Id', 'finalizacion')">
                                <span class="text-nowrap"> <feather-icon icon="EditIcon" /> Editar </span>
                            </b-button>
                        </validation-provider>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <b-button
                            size="sm"
                            class=""               
                            @click.prevent="deleteFinalizacion(row.index)"
                            v-b-tooltip.noninteractive.hover.left="'Eliminar'"
                            variant="flat-danger"               
                            >
                            <feather-icon icon="XCircleIcon" />
                        </b-button>
                        </template>
                </b-table>
            </b-card>
            <b-modal size="xl" v-model="modalOpen" @close="closeModal" centered  hide-footer>
                <div class="w-100">
                    <b-overlay
                    variant="white"
                    :show="showLoading2"
                    spinner-variant="primary"
                    blur="0"
                    opacity=".75"
                    rounded="sm"
                    >
                        <b-card no-body class="sticky">
                            <b-card-body>
                                <b-row>
                                    <b-col md="12" lg="7" class="d-flex flex-column flex-lg-row justify-content-start">
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Código de Grupo" label-for="code_group" class="mr-2">
                                            <v-select
                                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                                :options="groups_codes"
                                                input-id="code_group"
                                                placeholder="Código de Grupo"
                                                v-model="itemsModal.code_group"
                                                @input="searchGroup(itemsModal.code_group)"
                                                class="select-obra"
                                            />
                                            </b-form-group>
                                        </div>
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Grupo" label-for="group" class="mr-2">
                                            <b-form-input 
                                                id="group"
                                                v-model="itemsModal.group"
                                                :disabled="true"
                                                class="form-control"
                                                placeholder="Grupo"
                                            />
                                            </b-form-group>
                                        </div>
                                    </b-col>
                                    <b-col md="1" lg="1" class="d-flex">              
                                        <div
                                            class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                                        >
                                        
                                            <b-button
                                                class="mr-2"
                                                variant="primary"
                                                @click="searchUsers()"
                                                :disabled="itemsModal.group == ''"
                                                >
                                                <span class="text-nowrap"> <feather-icon icon="UsersIcon" /> Visualizar </span>
                                            </b-button>
                                        </div>
                                    </b-col>
                                    <b-col md="1" lg="2" class="d-flex">              
                                        <div
                                            class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                                        >
                                        
                                            <b-button
                                                class="mr-2"
                                                variant="primary"
                                                @click="saveModalSubmit()"
                                                :disabled="records.length == 0"
                                                >
                                                <span class="text-nowrap"> <feather-icon icon="CheckCircleIcon" /> Guardar </span>
                                            </b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                        <b-card>
                            <b-table :items="records" :fields="fieldsModal"/>
                        </b-card>
                    </b-overlay>
                </div>
            </b-modal>
        </validation-observer>
    </b-overlay>

    </div>
</template>

<script>
import TemplateService from '@/services/TemplateService'
import GroupService from '@/services/GroupService'
import SedeService from '@/services/SedeService'
import FormService from '@/services/FormService'
import EnterpriseService from '@/services/EnterpriseService'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import { required } from '@validations'
import { BootstrapVue, BootstrapVueIcons, VBTooltip } from 'bootstrap-vue'
import moment from 'moment'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import groupSelect from '../group-select.vue'

const APIURL = process.env.APIURLFILE
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
    directives: {
        'b-tooltip': VBTooltip,
        Ripple
    },
    props: {
        edit: {
            type: Boolean,
            default: false,
            required: true
        },
        projectId: {
            type: Number, 
            required: true 
        }
    },
    data() {
        return {
            showLoading: false,
            proyectos: [],
            sedes: [],
            servicios: ['Externo', 'Interno', 'PDP Externo', 'PDP Interno'],
            formularios: [],
            groups_codes: [],
            project_id: null,
            service: '',
            modalOpen: false,
            tempUsers: [],
            tempRow: null,
            rowsDespacho: [],
            rowsEmbarque: [],
            rowsConduccion: [],
            rowsFinalizacion: [],
            addedRowsDespacho: [],
            addedRowsEmbarque: [],
            addedRowsConduccion: [],
            addedRowsFinalizacion: [],
            deletedRows: [],
            editedRows: [],
            sedeId: null,
            fields: [
                { key: 'formId', label: 'Formulario', sortable: false },
                { key: 'order', label: 'Número de Orden', sortable: false },
                { key: 'mandatory', label: 'Obligatorio', sortable: false },
                
            ],
            
            items: {
                project_id: JSON.parse(localStorage.getItem('project_id')),
                service: null,
                sede: null
            },

            fieldsModal: [
                { key: 'document', label: 'DNI', sortable: true },
                { key: 'fullname', label: 'Nombre', sortable: true },
                { key: 'email', label: 'Email', sortable: true},
                { key: 'role.description', label: 'Perfil', sortable: true}
            ],
            records: [],
            keyField: 'dni',
            itemsModal: {
                temp_index: null,
                temp_type: null,
                temp_field: null,
                code_group: '',
                group: '',
                id_group: null
            },
            id: null,
            showLoading2: false,
        }
    },
    components: {
        vSelect,
        flatPickr,
        AppTimeline,
        ValidationProvider,
        ValidationObserver,
        AppTimelineItem,
        groupSelect
    },
    mounted(){
        if (!this.edit) {
            // Agregar el campo 'repeatable' al array solo si el modo de edición está desactivado
            this.fields.push({ key: 'repeatable', label: 'Repetible', sortable: false});
        }else{
            this.id = this.$route.params.id
        }
        this.fields.push({ key: 'groupLvl1Id', label: 'Aprobador NVL 1', sortable: false })
        this.fields.push({ key: 'groupLvl2Id', label: 'Aprobador NVL 2', sortable: false })
        this.fields.push({ key: 'actions', label: 'Acciones', sortable: false })
        this.getData()
        console.log("EDITAR", this.edit)
    },
    methods: {
        async getData(){
            this.getEnterprise()
            this.getFormularios()
            this.getEnterprise()
            this.getGroupsCodes()
        },
        async searchGroup(item){
            console.log('Buscando grupo', item)
            const respGroup = await GroupService.getUsersByCode(item, this.$store)
            console.log('RESP GROUP', respGroup)
            if(respGroup.status){
                this.itemsModal.group = respGroup.data.group.description
                console.log("RESP USERS", respGroup.data.data)
                this.tempUsers = respGroup.data.group.users
                console.log("TEMP USERS", this.tempUsers)
                this.itemsModal.id_group = respGroup.data.group.id
            }
            else{
                this.itemsModal.group = ''
            }
            //LLAMAR SERVICIO QUE BUSQUE GRUPO POR EL CODIGO
        },    
        async searchUsers(){
            console.log('Buscando usuarios')
            console.log("TEMP USERS", this.tempUsers)

            //LLAMAR SERVICIO QUE BUSQUE USUARIOS POR EL GRUPO
            this.records = this.tempUsers
        },
        async saveModalSubmit(){
            console.log('Guardando registros de modal')
            switch (this.itemsModal.temp_field) {
                case 'despacho':
                    this.rowsDespacho[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                case 'embarque':
                    this.rowsEmbarque[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                case 'conduccion':
                    this.rowsConduccion[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                case 'finalizacion':
                    this.rowsFinalizacion[this.itemsModal.temp_index][this.itemsModal.temp_type] = this.itemsModal.id_group
                    break;
                default:
                    break;
            }
            this.editAddedRow(this.tempRow.item, this.tempRow.index)

            this.closeModal()
            //LLAMAR SERVICIO QUE GUARDE LOS REGISTROS DEL MODAL

        },
        cleanModal(){
            this.itemsModal = {
                temp_index: null,
                temp_type: null,
                temp_field: null,
                code_group: '',
                group: '',
                id_group: null
            }
            this.records = []
        
        },
        closeModal() {
            this.modalOpen = false;
            this.cleanModal()
            console.log("CLOSE")
        },
        async selectSups(row, type, field){
            this.cleanModal()
            console.log("ABRIR MODAL")
            console.log("ROW",row)
            console.log("TYPE",type)
            console.log("FIELD",field)
            this.tempRow = row
            this.itemsModal.temp_index = row.index;
            this.itemsModal.temp_type = type;
            this.itemsModal.temp_field = field;
            this.getModalData()
            if(row.item[type] != null){
                console.log("LLAMAR FUNCIÓN PARA SETEAR DATOS EN MODAL")
                const resp = await GroupService.getUsersById(row.item[type], this.$store)
                console.log("RESP USER EDIT",resp)
                this.itemsModal.code_group = resp.data.group.code
                this.searchGroup(this.itemsModal.code_group)
                this.searchUsers()
            }
            this.modalOpen = true
            /* this.selectedRow = row;
            this.selectedField = field; */
        },
        async getModalData(){
            console.log("GET MODAL DATA")
        },
        addDespacho(){
            this.rowsDespacho.push({ formId: null, mandatory: false, repeatable: 0, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS DESPACHO",this.rowsDespacho)
        },
        deleteDespacho(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsDespacho[index])
            if(this.rowsDespacho[index].id){
                this.deletedRows.push(this.rowsDespacho[index].id)
            }
            this.rowsDespacho.splice(index,1)
        },

        
        addEmbarque(){
            this.rowsEmbarque.push({ formId: null, mandatory: false, repeatable: 0, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Embarque",this.rowsEmbarque)
        },
        deleteEmbarque(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsEmbarque[index])
            if(this.rowsEmbarque[index].id){
                this.deletedRows.push(this.rowsEmbarque[index].id)
            }
            this.rowsEmbarque.splice(index,1)
        },

        addConduccion(){
            this.rowsConduccion.push({ formId: null, mandatory: false, repeatable: 0, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Conduccion",this.rowsConduccion)
        },
        deleteConduccion(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsConduccion[index])
            if(this.rowsConduccion[index].id){
                this.deletedRows.push(this.rowsConduccion[index].id)
            }
            this.rowsConduccion.splice(index,1)
        },

        addFinalizacion(){
            this.rowsFinalizacion.push({ formId: null, mandatory: false, repeatable: 0, groupLvl1Id: null, groupLvl2Id: null })
            console.log("ROWS Finalizacion",this.rowsFinalizacion)
        },
        deleteFinalizacion(index){
            //SE DEBE BORRAR FILA SELECCIONADA
            console.log(this.rowsFinalizacion[index])
            if(this.rowsFinalizacion[index].id){
                this.deletedRows.push(this.rowsFinalizacion[index].id)
            }
            this.rowsFinalizacion.splice(index,1)
        },
        async editAddedRow(item, index, input="SELECT input type"){
            // Asegúrate de que `mandatory` sea true si `isDoublePhoto` o `isPersonal` son true
            if (item.isDoublePhoto || item.isPersonal) {
                if(input == 'doublePhoto'){
                    item.repeatable = false;
                }else{
                    item.repeatable = false;
                    item.mandatory = true;
                }
            }
            console.log("EDITAR FILA AÑADIDA")
            console.log("ITEM", item)
            console.log("INDEX", index)
            if(item.id){
                this.editedRows.push(item)
                console.log("EDITADO", this.editedRows)
            }
        },

        updateRow(data) {
            // Actualiza la fila seleccionada con los datos del modal
            this.selectedRow[this.selectedField] = data;
            this.modalOpen = false;
        },
        async getEnterprise(){
            const user = JSON.parse(localStorage.getItem('userData'))
            const respProyectos = await EnterpriseService.getEnterprise('', this.$store)
            if (respProyectos.status) {
                this.proyectos = respProyectos.data.rows
                console.log("PROYECTOS",this.proyectos)
            }
        },
        async getFormularios(){
            const url =
            `?limit=10000`
            const respFormularios = await FormService.getForms(url, this.$store)
            if (respFormularios.status) {
                this.formularios = respFormularios.data.rows
                console.log("FORMULARIOS",this.formularios)
            }
        },
        async getEnterprise(){
            const arrayFilters = []
            this.items.sede = null
            console.log("PROJECT ID PARAMETRO",this.projectId)
            if (this.projectId != null && this.projectId != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.projectId })
            }
            const url =
            `?limit=10000&filter=` +
            JSON.stringify(arrayFilters)
            const respSedes = await SedeService.getEnterprise(url, this.$store)
            if (respSedes.status) {
                this.sedes = respSedes.data.rows
                console.log("SEDES",this.sedes)
            }
        },
        async getGroupsCodes(){
            const arrayFilters = []
            if (this.projectId != null && this.projectId != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.projectId })
            }
            if(this.sedeId != null && this.sedeId != ''){
                arrayFilters.push({ keyContains: 'sede.id', key: 'equals', value: this.sedeId })
            }
            const url =
            `?limit=10000&filter=` +
            JSON.stringify(arrayFilters)
            console.log("URL DE FORMULARIOS GRUPOS",url)
            const respGroups = await GroupService.getGroups(url, this.$store)
            if (respGroups.status) {
                this.groups_codes = respGroups.data.rows
                this.groups_codes = this.groups_codes.map((item) => {
                    return item.code
                })
                console.log("GROUPS CODES FORMULARIOS",this.groups_codes)
            }
        },
        async changedRows(){
            this.rowsDespacho.forEach(element => {
                element.order = parseInt(element.order)
                if(!element.id){
                    this.addedRowsDespacho.push(element)
                }
            });
            this.rowsEmbarque.forEach(element => {
                element.order = parseInt(element.order)
                if(!element.id){
                    this.addedRowsEmbarque.push(element)
                }
            });
            this.rowsConduccion.forEach(element => {
                element.order = parseInt(element.order)
                if(!element.id){
                    this.addedRowsConduccion.push(element)
                }
            });
            this.rowsFinalizacion.forEach(element => {
                element.order = parseInt(element.order)
                if(!element.id){
                    this.addedRowsFinalizacion.push(element)
                }
            });
            console.log("ADDED DESPACHO",this.addedRowsDespacho)
            console.log("ADDED EMBARQUE",this.addedRowsEmbarque)
            console.log("ADDED CONDUCCION",this.addedRowsConduccion)
            console.log("ADDED FINALIZACION",this.addedRowsFinalizacion)

        },
        async saveSubmit(){
            console.log("GUARDAR EN FORM ARCHIVO")
            this.$refs.refFormObserver.validate().then(async (success) => {
                if (success && (this.rowsDespacho.length > 0 || this.rowsEmbarque.length > 0 || this.rowsConduccion.length > 0 || this.rowsFinalizacion.length > 0)) {     
                    this.rowsDespacho.forEach(element => {
                        element.order = parseInt(element.order)
                        if(!element.id){
                            this.addedRowsDespacho.push(element)
                        }
                    });
                    this.rowsEmbarque.forEach(element => {
                        element.order = parseInt(element.order)
                        if(!element.id){
                            this.addedRowsEmbarque.push(element)
                        }
                    });
                    this.rowsConduccion.forEach(element => {
                        element.order = parseInt(element.order)
                        if(!element.id){
                            this.addedRowsConduccion.push(element)
                        }
                    });
                    this.rowsFinalizacion.forEach(element => {
                        element.order = parseInt(element.order)
                        if(!element.id){
                            this.addedRowsFinalizacion.push(element)
                        }
                    });
                    const data = {
                        projectId: this.items.project_id,
                        type: this.items.service,
                        sedeId: this.items.sede,
                        userRegisterId: JSON.parse(localStorage.getItem('userData')).id,
                        despacho: this.addedRowsDespacho,
                        embarque: this.addedRowsEmbarque,
                        conduccion: this.addedRowsConduccion,
                        finalizacion: this.addedRowsFinalizacion
                    }
                    console.log("DATA",data)
                    //LLAMAR SERVICIO QUE GUARDE LOS DATOS
                    this.showLoading = true
                    if(this.edit){
                        data.deletedRows = this.deletedRows
                        data.editedRows = this.editedRows
                        const resp = await TemplateService.updateTemplate(this.id, data, this.$store)

                        console.log("ACTUALIZAREDITADO")

                    }else{
                        const resp = await TemplateService.saveTemplate(data, this.$store)
                        console.log("NUEVO GUARDAR")
                    }
                    console.log("RESP SAVE", resp)
                    console.log("SAVE DATA")     
                    if(resp.status){
                        this.showLoading = false
                        this.$swal({
                            title: 'Registrado',
                            text: 'Los datos han sido registrados.',
                            icon: 'success',
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                            })
                        this.$router.push('/plantilla')
                    }
                } else {
                    this.showLoading = false
                    this.$swal({
                        title: 'Error!',
                        text: 'Falta completar campos obligatorios.',
                        icon: 'error',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        },
                        buttonsStyling: false
                        })
                    console.log("ERROR asd")
                }
            })
        }
    }
}
</script>

<style>
.addButton{
    cursor: pointer;
    transition: all .1s ease-in-out;
}
.addButton:hover{
    width: 27px !important;
    height: 27px !important;
    transition: all .2s ease-in-out;
}
.select-obra ul{
    z-index: 1100;
}
</style>