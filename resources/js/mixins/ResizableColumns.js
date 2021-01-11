export default {
  data: {
    table: null,
    row: null,
    columns: null,
    columnWidth: null,
    isResizing: false,
    currentColumn: null,
    nextColumn: null,
    cursorStart: null,
    currentColumnWidth: null,
    nextColumnWidth: null,
    tableWidth: null,
  },

  mounted() {
    this.initializeResizableTable();
  },

  methods: {
    initializeResizableTable() {
      this.table = document.querySelector('table.resizable-resource-table');
      this.row = this.table.getElementsByTagName('tr')[0];

      this.columns = (this.row && this.row.children) || undefined;
      if (!this.columns) return;

      this.setColumnWidths();
      this.createResizableColumns();
    },

    setColumnWidths() {
      const tableBound = this.table.getBoundingClientRect();
      this.columnWidth = tableBound.width / this.columns.length;
    },

    createResizableColumns() {
      const tableHeight = this.table.offsetHeight;
      for (let i = 0; i < this.columns.length; i++) {
        const resizableBar = this.createResizableBar(tableHeight);

        this.columns[i].appendChild(resizableBar);
        this.columns[i].style.position = 'relative';
        this.columns[i].style.width = this.columnWidth;

        this.setListeners(resizableBar);
      }
    },

    createResizableBar(height) {
      const div = document.createElement('div');
      div.style.top = '0';
      div.style.right = '0';
      div.style.position = 'absolute';
      div.style.userSelect = 'none';
      div.style.width = '2px';
      div.style.cursor = 'col-resize';
      div.style.height = height + 'px';
      div.style.zIndex = '10';
      return div;
    },

    setListeners(resizableBar) {
      resizableBar.addEventListener(
        'mousedown',
        function (e) {
          this.currentColumn = e.target.parentElement;
          this.nextColumn = this.currentColumn.nextElementSibling;

          this.isResizing = true;
          this.cursorStart = e.pageX;
          this.tableWidth = this.table.offsetWidth;

          const currentColumnBound = this.currentColumn.getBoundingClientRect();
          this.currentColumnWidth = currentColumnBound.width;

          if (this.nextColumn) {
            const nextColumnBound = this.nextColumn.getBoundingClientRect();
            this.nextColumnWidth = nextColumnBound.width;
          }
        }.bind(this)
      );

      document.addEventListener(
        'mousemove',
        function (e) {
          if (!this.isResizing) return;
          const cursorPosition = e.pageX;
          const cursorMoved = cursorPosition - this.cursorStart;

          const newCurrentColumnWidth = this.currentColumnWidth + cursorMoved;
          const newNextColumnWidth = this.nextColumn ? this.nextColumnWidth - cursorMoved : null;

          if (newCurrentColumnWidth > 30) this.currentColumn.style.width = `${newCurrentColumnWidth}px`;
          if (newNextColumnWidth && newNextColumnWidth > 30) this.nextColumn.style.width = `${newNextColumnWidth}px`;
          else this.table.style.width = `${this.tableWidth + cursorMoved}px`;
        }.bind(this)
      );

      document.addEventListener(
        'mouseup',
        function (e) {
          this.isResizing = false;
        }.bind(this)
      );
    },
  },
};
