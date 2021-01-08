import React, { Component } from "react";
import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  TablePagination,
  TableContainer,
  Button,
  TextField,
  Card
} from "@material-ui/core";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { getByPage, getById, deleteAdministrativeUnit } from "./AdministrativeUnitService";
import AdministrativeUnitEditorDialog from "./AdministrativeUnitEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import shortid from "shortid";
import { saveAs } from 'file-saver';
import { Helmet } from 'react-helmet';
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    marginLeft: "-1.5em",
  },
}))(Tooltip);
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div className="none_wrap">
  <LightTooltip
    title={t("general.editIcon")}
    placement="right-end"
    enterDelay={300}
    leaveDelay={200}
    PopperProps={{
      popperOptions: {
        modifiers: { offset: { enabled: true, offset: "10px, 0px" } },
      },
    }}
  >
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">
        edit
      </Icon>
    </IconButton>
  </LightTooltip>
  <LightTooltip
    title={t("general.deleteIcon")}
    placement="right-end"
    enterDelay={300}
    leaveDelay={200}
    PopperProps={{
      popperOptions: {
        modifiers: { offset: { enabled: true, offset: "10px, 0px" } },
      },
    }}
  >
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">
        deleteItem
      </Icon>
    </IconButton>
  </LightTooltip>
</div>
  )
  
}
class AdministrativeUnitTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    administrativeList: [],
    item: {},
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false
  };

  setPage = page => {
    this.setState({ page });
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };
  handleDownload = () => {
    var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "hello world.txt");
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.updatePageData();
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleDeleteAdministrativeUnit = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleEditAdministrativeUnit = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };

  handleConfirmationResponse = () => {
    deleteAdministrativeUnit(this.state.id).then(() => {
      this.handleDialogClose();

    });
  };

  componentDidMount() {
    this.updatePageData();
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    getByPage(searchObject).then(({ data }) => {
      this.setState({
        administrativeList: [...data.content], totalElements: data.totalElements
      });
    }
    );
  };

  render() {
    const { t, i18n } = this.props;
    let {
      rowsPerPage,
      page,
      administrativeList,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog
    } = this.state;

    let columns = [
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <MaterialButton item={rowData}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getById(rowData.id).then(({ data }) => {
                console.log(data)
                // if (typeof data.parent ==="undefined"  || data.parent === null) {
                //     data.parent = {};
                //   }
                this.setState({
                  item: data,
                  shouldOpenEditorDialog: true
                });
              })
            } else if (method === 1) {
              this.handleDelete(rowData.id);
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      { title: t('AdministrativeUnit.name'), field: "name" , align: "left", width:"150"},
      { title: t("AdministrativeUnit.code"), field: "code", width: "150" },
      // { title: t("Status"), field: "Status", width: "150" },
      
    ]
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
        <Helmet>
          <title>{t("AdministrativeUnit.title")} | {t("web_site")}</title>
        </Helmet>
          <Breadcrumb routeSegments={[{ name: t('AdministrativeUnit.title') }]} />
        </div>

        <Button
          className="mb-16 mr-16"
          variant="contained"
          color="primary"
          onClick={() => this.setState({ shouldOpenEditorDialog: true, item: {} })}
        >
          {t('Add')}
        </Button>

        <MaterialTable
          title = {t('List')}
          data = {this.state.administrativeList}
          columns = {columns}

          parentChildData = {(row, rows) => {
            var list = rows.find(a => a.id === row.parentId);
            return list;
          }}
          options={{
                selection: true,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData) => ({
                  backgroundColor:
                    rowData.tableData.id % 2 === 1 ? "#EEE" : "#FFF",
                }),
                maxBodyHeight: "450px",
                minBodyHeight: "370px",
                headerStyle: {
                  backgroundColor: "#358600",
                  color: "#fff",
                },
                padding: "dense",
                toolbar: false,
              }}
          localization={{
                body: {
                  emptyDataSourceMessage: `${t(
                    "general.emptyDataMessageTable"
                  )}`,
                },
                toolbar: {
                  // nRowsSelected: '${t('general.selects')}',
                  nRowsSelected: `${t("general.selects")}`,
                },
              }}
          onSelectionChange={(rows) => {
                this.data = rows;
              }}
              
        />
          <TablePagination
            className="px-16"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            labelRowsPerPage={t('general.rows_per_page')}
            labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
            count={administrativeList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.setRowsPerPage}
          />

          {shouldOpenEditorDialog && (
            <AdministrativeUnitEditorDialog
              handleClose={this.handleDialogClose}
              open={shouldOpenEditorDialog}
              item={this.state.item}
              t={t} i18n={i18n}
            />
          )}
          {shouldOpenConfirmationDialog && (
            <ConfirmationDialog
              title={t("confirm")}
              open={shouldOpenConfirmationDialog}
              onConfirmDialogClose={this.handleDialogClose}
              onYesClick={this.handleConfirmationResponse}
              text={t('DeleteConfirm')}
              Yes={t('general.Yes')}
              No={t('general.No')}
            />
          )}
          
      </div>
    );
  }
}

export default AdministrativeUnitTable;
