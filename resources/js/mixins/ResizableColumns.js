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
      if (!this.table) return;


      this.row = this.table.getElementsByTagName('tr')[0];
      this.columns = (this.row && this.row.children) || undefined;
      if (!this.columns) return;

        this.columnNames = [];
        this.resourceName = this.table.parentElement.parentElement.parentElement.__vue__.$route.params.resourceName;
        for (let i = 0; i < this.columns.length; i++) {
            this.columnNames[i] = this.asParamCase(this.resourceName + '-' + this.columns[i].innerText.trim())
        }
      this.setColumnWidths();
      this.createResizableColumns();
      this.table.style.tableLayout = 'fixed';
    },

    setColumnWidths() {
      const tableBound = this.table.getBoundingClientRect();
      this.columnWidth = tableBound.width / this.columns.length;
    },

    clampWidth(value, el, suffix) {
      let width = _.clamp(
        value,
        parseInt(el.dataset.minColumnWidth || 0),
        parseInt(el.dataset.maxColumnWidth || 9999)
      );
      return suffix ? width + 'px' : width;
    },

    asParamCase(s, j = '-') {
      let splitCaps = string => string
        .replace(/([a-z])([A-Z]+)/g, (m, s1, s2) => s1 + ' ' + s2)
        .replace(/([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/, (m, s1, s2, s3) => s1 + s2.toLowerCase() + s3)
        .replace(/([A-Z]+)([A-Z][a-z])/g, (m, s1, s2) => s1.toLowerCase() + ' ' + s2);
      let snakeCase = string =>
        splitCaps(string)
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join(j);
      return snakeCase(s);
    },

    createResizableColumns() {
      const tableHeight = this.table.offsetHeight;
      for (let i = 0; i < this.columns.length; i++) {
        const resizableBar = this.createResizableBar(tableHeight);

        this.columns[i].appendChild(resizableBar);
        this.columns[i].style.position = 'relative';
        this.columns[i].style.width =
          this.clampWidth(
            this.fromLocalStorage(this.columnNames[i], this.columns[i].clientWidth),
            this.columns[i],
            'px'
          );
        if (i == this.columns.length - 1) {
          this.columns[i].style.width = "auto";
        }

        this.setListeners(resizableBar);
      }
    },

    createResizableBar(height) {
      const div = document.createElement('div');
      div.style.top = '0';
      div.style.right = '-6px';
      div.style.position = 'absolute';
      div.style.userSelect = 'none';
      div.style.width = '12px';
      div.style.cursor = 'col-resize';
      div.style.height = height + 'px';
      div.style.zIndex = '10';
      return div;
    },


    toLocalStorage(key, value) {
      console.log('toLocalStorage', key, value);
      if (key && _.isString(key))
        window.localStorage.setItem('resizable-column-' + key, value);
    },

    fromLocalStorage(key, defaultValue) {
      if (!key || !_.isString(key))
        return defaultValue;
      var value = window.localStorage.getItem('resizable-column-' + key);
      if (!value) {
        value = defaultValue;
      }

      return value;
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
          this.startingWidth = currentColumnBound.width;

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

          const currentWidth = this.startingWidth + cursorMoved;

          if (currentWidth < 30)
            return;
          let w;
          this.currentColumn.style.width = (w = this.clampWidth(currentWidth, this.currentColumn)) + 'px';
          const currentColumnBound = this.currentColumn.getBoundingClientRect();
          const endingWidth = currentColumnBound.width;
          const newNextColumnWidth = this.nextColumn ? this.nextColumnWidth + this.startingWidth - w : null;
          if (newNextColumnWidth && endingWidth != this.startingWidth) { // && newNextColumnWidth > 30) {
            this.nextColumn.style.width = `${newNextColumnWidth}px`;
          }
          if (endingWidth != this.startingWidth) {
            this.toLocalStorage(
              this.asParamCase(this.resourceName + '-' + this.currentColumn.innerText.trim()),
              currentWidth
            );
            if (newNextColumnWidth) {
              this.toLocalStorage(
                this.asParamCase(this.resourceName + '-' + this.nextColumn.innerText.trim()),
                newNextColumnWidth
              );
            }
          }
          // else this.table.style.width = `${this.tableWidth + cursorMoved}px`;
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
// vim: set ts=2 sts=2 sw=2 et:
