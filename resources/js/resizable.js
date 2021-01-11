import ResourceTable from './components/ResourceTable.vue';

Nova.booting(Vue => {
  Vue.component('nova-resource-table', Vue.options.components['resource-table']);
  Vue.component('resource-table', ResourceTable);
});
