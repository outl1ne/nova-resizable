<template>
  <nova-resource-table
    class="resizable-resource-table"
    :authorized-to-relate="authorizedToRelate"
    :resource-name="resourceName"
    :resources="resources"
    :singular-name="singularName"
    :selected-resources="selectedResources"
    :selected-resource-ids="selectedResourceIds"
    :actions-are-available="actionsAreAvailable"
    :should-show-checkboxes="shouldShowCheckboxes"
    :via-resource="viaResource"
    :via-resource-id="viaResourceId"
    :via-relationship="viaRelationship"
    :relationship-type="relationshipType"
    :update-selection-status="updateSelectionStatus"
    @order="$emit('order', $event)"
    @reset-order-by="$emit('reset-order-by', $event)"
    @delete="$emit('delete', $event)"
    @restore="$emit('restore', $event)"
    @actionExecuted="$emit('actionExecuted', $event)"
    ref="resourceTable"
  />
</template>

<script>
import { InteractsWithResourceInformation } from 'laravel-nova';
import ResizableColumns from '../mixins/ResizableColumns';
import ResourceTable from '../mixins/ResourceTable';

export default {
  mixins: [InteractsWithResourceInformation, ResizableColumns, ResourceTable],
};
</script>
