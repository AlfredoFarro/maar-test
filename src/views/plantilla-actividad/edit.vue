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

            <b-card  no-body class="sticky">
                <b-card-body>
                   
                    <b-row>
                        <b-col md="12" lg="7" class="d-flex flex-column flex-lg-row justify-content-start">
                            <div class="w-100 mb-1 mb-lg-0 mt-02">
                                <b-form-group label="Proyecto" label-for="project" class="mr-2">
                                    <validation-provider #default="{ errors }" rules="requeridoE">
                                        <v-select
                                            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                            :options="proyectos"
                                            label="code"
                                            input-id="project"
                                            :reduce="(proyectos) => proyectos.id"
                                            placeholder="Proyecto"
                                            v-model="items.project_id"
                                            @input="getEmpresas(), getGroupsCodes()"
                                            class="select-obra"
                                        >
                                            <template v-slot:selected-option="option">
                                            {{ option.code }} - {{ option.description }}
                                            </template>
                                            <template slot="option" slot-scope="option">
                                            {{ option.code }} - {{ option.description }}
                                            </template>
                                        </v-select>
                                        <small class="text-danger">{{ errors[0] }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </div>
                            <div class="w-100">
                                <b-form-group label="Sede" label-for="sede" class="mr-2">
                                    <validation-provider #default="{ errors }" rules="requeridoE">
                                        <v-select
                                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                        :options="sedes"
                                        label="description"
                                        input-id="sede"
                                        :reduce="(sedes) => sedes.id"
                                        placeholder="Sede"
                                        @input="getGroupsCodes()"
                                        v-model="items.sede"
                                        class="select-obra"/>
                                        <small class="text-danger">{{ errors[0] }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </div>    
                            <div class="w-100">
                                <b-form-group label="Tipo de Actividad" label-for="service" class="mr-2">
                                    <validation-provider #default="{ errors }" rules="requeridoE">
                                        <v-select
                                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                        :options="servicios"
                                        input-id="service"
                                        placeholder="Tipo de Actividad"
                                        v-model="items.service"
                                        class="select-obra"/>
                                        <small class="text-danger">{{ errors[0] }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </div>    
                        </b-col>
                        <b-col md="6" lg="5" class="d-flex">              
                            <div
                                class="d-flex align-items-center h-100 justify-content-center justify-content-lg-start justify-content-xl-center mb-1 mb-lg-0 mt-02"
                            >
                            
                                <b-button
                                    class="mr-2"
                                    variant="primary"
                                    @click="saveSubmit()"
                                    >
                                    <span class="text-nowrap"> <feather-icon icon="PlusCircleIcon" /> Actualizar </span>
                                </b-button>
                                <b-button
                                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                                variant="primary"
                                
                                @click="goBack">
                                    <feather-icon style="width: 15px; height: 15px;" icon="ArrowLeftIcon"/> Volver
                                </b-button>
                            </div>
                        </b-col>
                    </b-row>
                </b-card-body>
            </b-card>
            <b-card>
                <!-- DESPACHO -->
                <b-row class="mb-2">
                    <h3 class="mr-1 ml-1">Despacho</h3>
                    
                    <span class="text-nowrap" > 
                        <feather-icon class="addButton" style="width: 25px; height: 25px;" icon="PlusCircleIcon" @click="addDespacho()" />
                    </span>
                </b-row>
                <b-table :class="{'table-responsive': rowsDespacho.length > 0}" :items="rowsDespacho" :fields="fields">
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
                                style="width: 650px;"
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
                                placeholder="Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra"
                                style="width: 70px;">                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isDoublePhoto)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isDoublePhoto)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isDoublePhoto"
                                name="isDoublePhoto"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index, 'doublePhoto')"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isPersonal)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isPersonal)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isPersonal"
                                name="isPersonal"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
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
                                @change="editAddedRow(row.item, row.index)"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
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
                <b-table :class="{'table-responsive': rowsEmbarque.length > 0}" :items="rowsEmbarque" :fields="fields">
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
                                style="width: 650px;"
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
                                placeholder="Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra"
                                style="width: 70px;">                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isDoublePhoto)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isDoublePhoto)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isDoublePhoto"
                                name="isDoublePhoto"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index, 'doublePhoto')"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isPersonal)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isPersonal)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isPersonal"
                                name="isPersonal"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index)"

                            ></b-form-checkbox>
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
                                @change="editAddedRow(row.item, row.index)"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
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
                <b-table :class="{'table-responsive': rowsConduccion.length > 0}" :items="rowsConduccion" :fields="fields">
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
                                style="width: 650px;"
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
                                placeholder="Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra"
                                style="width: 70px;">                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isDoublePhoto)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isDoublePhoto)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isDoublePhoto"
                                name="isDoublePhoto"
                                @change="editAddedRow(row.item, row.index, 'doublePhoto')"

                                class="select-obra"
                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isPersonal)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isPersonal)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isPersonal"
                                name="isPersonal"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index)"
                            ></b-form-checkbox>
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
                                @change="editAddedRow(row.item, row.index)"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"
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
                <b-table :class="{'table-responsive': rowsFinalizacion.length > 0}" :items="rowsFinalizacion" :fields="fields">
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
                                style="width: 650px;"
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
                                placeholder="Orden"
                                autocomplete="off"
                                @input="editAddedRow(row.item, row.index)"
                                class="select-obra"
                                style="width: 70px;">                            </b-form-input>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isDoublePhoto)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isDoublePhoto)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isDoublePhoto"
                                name="isDoublePhoto"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index, 'doublePhoto')"

                            ></b-form-checkbox>
                            <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                    </template>
                    <template #head(isPersonal)="data">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <span>{{ data.label }}</span>
                        </div>
                    </template>
                    <template v-slot:cell(isPersonal)="row">
                        <validation-provider #default="{ errors }" rules="requeridoE" style="display: flex; align-items: center; justify-content: center;">
                            <b-form-checkbox
                                v-model="row.item.isPersonal"
                                name="isPersonal"
                                class="select-obra"
                                @change="editAddedRow(row.item, row.index)"
                            ></b-form-checkbox>
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
                                @change="editAddedRow(row.item, row.index)"
                                :disabled="row.item.isDoublePhoto || row.item.isPersonal"
                                :checked="row.item.isDoublePhoto || row.item.isPersonal"

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
                                            <b-form-group label="Sede" label-for="sede" class="mr-2">
                                            <v-select
                                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                                :options="sedes"
                                                label="description"
                                                :reduce="(sedes) => sedes.id"
                                                input-id="sede"
                                                disabled
                                                placeholder="Sede"
                                                @input="getGroupsCodes()"
                                                v-model="items.sede"
                                                class="select-obra"
                                            />
                                            </b-form-group>
                                        </div>
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Grupo" label-for="code_group" class="mr-2">
                                                <v-select
                                                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                                :options="groups_codes"
                                                label="description"
                                                input-id="code_group"
                                                placeholder="Grupo"
                                                v-model="itemsModal.code_group"
                                                @input="searchGroup(itemsModal.code_group)"
                                                class="select-obra"
                                            />
                                            </b-form-group>
                                        </div>
                                        <div class="w-100 mb-1 mb-lg-0 mt-02">
                                            <b-form-group label="Código de Grupo" label-for="group" class="mr-2">
                                            <b-form-input 
                                                id="group"
                                                v-model="itemsModal.group"
                                                :disabled="true"
                                                class="form-control"
                                                placeholder="Código de Grupo"
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
import ProjectsService from '@/services/ProjectsService'
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
import groupSelect from './group-select.vue'

const APIURL = process.env.APIURLFILE
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
    directives: {
        'b-tooltip': VBTooltip,
        Ripple
    },
    data() {
        return {
            showLoading: false,
            id: null,
            tempData: [],
            proyectos: [],
            servicios: ['Abastecimiento de combustible', 'Mantenimiento de la unidad', 'Prueba en ruta', 'Viaje en vacío'],            formularios: [],
            groups_codes: [],
            project_id: null,
            service: '',
            modalOpen: false,
            tempUsers: [],
            tempRow: [],
            rowsDespacho: [],
            rowsEmbarque: [],
            rowsConduccion: [],
            rowsFinalizacion: [],
            addedRowsDespacho: [],
            addedRowsEmbarque: [],
            addedRowsConduccion: [],
            addedRowsFinalizacion: [],
            editedRows: [],
            deletedRows: [],
            fields: [
                { key: 'formId', label: 'Formulario', sortable: false },
                { key: 'order', label: 'Orden', sortable: false, thStyle: { width: '380px' } },
                { key: 'isDoublePhoto', label: 'Doble Foto', sortable: false },
                { key: 'isPersonal', label: 'Personal', sortable: false },
                { key: 'mandatory', label: 'Obligatorio', sortable: false },
                { key: 'repeatable', label: 'Repetible', sortable: false },
                { key: 'groupLvl1Id', label: 'Aprobador NVL 1', sortable: false },
                { key: 'groupLvl2Id', label: 'Aprobador NVL 2', sortable: false },
                { key: 'actions', label: 'Acciones', sortable: false },
            ],
            items: {
                project_id: JSON.parse(localStorage.getItem('project_id')),
                service: null,
                sede: null
            },
            sedes: [],
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
    async mounted(){
        this.getData()
        await this.getData()
        await this.getGroupsCodes()
        this.searchGroup(this.itemsModal.code_group, true)
    },
    methods: {
        async getData(){
            this.getEmpresas()
            this.getFormularios()
            this.getEmpresas()
            await this.setData()
            await this.getGroupsCodes()
        },
        async setData(){
            this.id = this.$route.params.id;
            const resp = await TemplateService.getTemplateByID(this.id, this.$store)
            console.log("RESP EDIT TEMPLATE", resp)
            this.rowsDespacho = resp.data.despacho
            this.rowsEmbarque = resp.data.embarque
            this.rowsConduccion = resp.data.conduccion
            this.rowsFinalizacion = resp.data.finalizacion
            this.items.project_id = resp.data.projectId
            this.items.sede = resp.data.sedeId
            this.items.service = resp.data.type
            console.log("SETEADO", this.items, this.rowsDespacho, this.rowsEmbarque, this.rowsConduccion, this.rowsFinalizacion)
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
        async searchGroup(item, first = false){
            console.log('Buscando grupo', item)
            let respGroup
            if(first){
                respGroup = await GroupService.getUsersById(item, this.$store)
                console.log("FIRST")
            }else{
                respGroup = await GroupService.getUsersById(item.id, this.$store)
                console.log("SECOND")
            }
            console.log('RESP SEARCH GROUP', respGroup)
            if(respGroup.status){
                this.itemsModal.group = respGroup.data.group.code
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
            this.tempRow = null
            this.records = []
        
        },
        goBack(){
            this.$router.push('/plantilla-actividad')
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
                this.itemsModal.code_group = resp.data.group.description
                await this.searchGroup(resp.data.group.id, true)
                await this.searchUsers()
            }
            this.modalOpen = true
            /* this.selectedRow = row;
            this.selectedField = field; */
        },
        async getModalData(){
            console.log("GET MODAL DATA")
        },
        addDespacho(){
            this.rowsDespacho.push({ formId: null, isDoublePhoto: false, isPersonal: false, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
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
            this.rowsEmbarque.push({ formId: null, isDoublePhoto: false, isPersonal: false, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
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
            this.rowsConduccion.push({ formId: null, isDoublePhoto: false, isPersonal: false, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
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
            this.rowsFinalizacion.push({ formId: null, isDoublePhoto: false, isPersonal: false, mandatory: false, repeatable: false, groupLvl1Id: null, groupLvl2Id: null })
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


        updateRow(data) {
            // Actualiza la fila seleccionada con los datos del modal
            this.selectedRow[this.selectedField] = data;
            this.modalOpen = false;
        },
        async getEmpresas(){
            const user = JSON.parse(localStorage.getItem('userData'))
            const url2 = `?limit=100000&order=asc&sort=code`
            const respProyectos = await ProjectsService.getEmpresas(url2, this.$store)
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
        async getEmpresas(){
            const arrayFilters = []
            if (this.items.project_id != null && this.items.project_id != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.project_id })
            }
            const url =
            `?limit=10000&order=asc&sort=description&filter=` +
            JSON.stringify(arrayFilters)
            const respSedes = await SedeService.getEmpresas(url, this.$store)
            if (respSedes.status) {
                this.sedes = respSedes.data.rows
                console.log("SEDES",this.sedes)
            }
        },
        async getGroupsCodes(){
            console.log("GET GROUP CODE")
            const arrayFilters = []
            this.itemsModal.code_group = null
            this.itemsModal.group = ''
            if (this.items.project_id != null && this.items.project_id != '') {
                arrayFilters.push({ keyContains: 'project.id', key: 'equals', value: this.items.project_id })
            }
            console.log("SEDE ID",this.items.sede)
            arrayFilters.push({ keyContains: 'sede.id', key: 'equals', value: this.items.sede })
            
            const url =
            `?limit=10000&filter=` +
            JSON.stringify(arrayFilters)
            const respGroups = await GroupService.getGroups(url, this.$store)
            console.log("RESP GROUPS",respGroups)
            if (respGroups.status) {
                this.groups_codes = respGroups.data.rows
                console.log("GROUPS CODES",this.groups_codes)
            }
        },
        async saveSubmit(){
            console.log("GUARDAR")
            this.$refs.refFormObserver.validate().then(async (success) => {
                if (success && (this.rowsDespacho.length > 0 || this.rowsEmbarque.length > 0 || this.rowsConduccion.length > 0 || this.rowsFinalizacion.length > 0)) {     
                    this.rowsDespacho.forEach(element => {
                        element.order = parseInt(element.order)
                        if(element.isDoublePhoto || element.isPersonal){
                            element.repeatable = false
                        }
                        if(!element.id){
                            this.addedRowsDespacho.push(element)
                        }
                    });
                    this.rowsEmbarque.forEach(element => {
                        element.order = parseInt(element.order)
                        if(element.isDoublePhoto || element.isPersonal){
                            element.repeatable = false
                        }
                        if(!element.id){
                            this.addedRowsEmbarque.push(element)
                        }
                    });
                    this.rowsConduccion.forEach(element => {
                        element.order = parseInt(element.order)
                        if(element.isDoublePhoto || element.isPersonal){
                            element.repeatable = false
                        }
                        if(!element.id){
                            this.addedRowsConduccion.push(element)
                        }
                    });
                    this.rowsFinalizacion.forEach(element => {
                        element.order = parseInt(element.order)
                        if(element.isDoublePhoto || element.isPersonal){
                            element.repeatable = false
                        }
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
                        finalizacion: this.addedRowsFinalizacion,
                        deletedRows: this.deletedRows,
                        editedRows: this.editedRows
                    }
                    console.log("DATA",data)
                    //LLAMAR SERVICIO QUE GUARDE LOS DATOS
                    this.showLoading = true
                    const resp = await TemplateService.updateTemplate(this.id, data, this.$store)
                    console.log("RESP SAVE", resp)
                    console.log("SAVE DATA")     
                    if(resp.status){
                        this.showLoading = false
                        this.$swal({
                            title: 'Actualizado',
                            text: 'Los datos han sido actualizados.',
                            icon: 'success',
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                            })
                        this.$router.push('/plantilla-actividad')
                    }else{
                        this.showLoading = false
                        this.$swal({
                            title: 'Error!',
                            text: resp.data.message,
                            icon: 'error',
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                            })
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