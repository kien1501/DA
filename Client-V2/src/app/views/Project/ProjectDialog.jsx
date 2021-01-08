import {
  Grid,
  DialogActions,
  MuiThemeProvider,
  TextField,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
  TablePagination,
  Radio,
  Dialog,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import DateFnsUtils from "@date-io/date-fns";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import SelectParentPopup from "./SelectParentPopup";
import SelectAdminUnitPopup from "./SelectAdminUnitPopup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { width } from "dom-helpers";
import {
  getAllByRoot,
  saveItem,
  searchByPage,
  checkCode,
} from "./ProjectService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
class SupplierDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    path: "",
    rowsPerPage: 5,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: "",
    shouldOpenNotificationPopup: false,
    shouldOpenSelectParentPopup: false,
    shouldOpenSelectAdminUnitPopup: false,
    roles: [],
    listRole: [],
  };
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };
  handleChangeCommonObjectType = (event, source) => {
    let { commonObjectTypes } = this.state;
    this.setState({
      type: commonObjectTypes.find((item) => item.id === event.target.value),
      typeId: event.target.value,
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
    this.updatePageData();
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };
  updatePageData = () => {
    var searchObject = {};
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage().then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements,
      });
    });
  };

  componentDidMount() {
    
  }

  handleClick = (event, item) => {
    //alert(item);
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: item.id, selectedItem: null });
    }
  };
  componentWillMount() {
    let { item } = this.props;
    this.setState({ item: item });
    this.setState({ ...item }, () => {
      let { type } = this.state;
      if (type && type.id) {
        this.setState({ typeId: type.id });
      }
    });
    
  }
  search = (keyword) => {
    var searchObject = {};
    searchObject.text = keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage().then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements,
      });
    });
  };

  handleChange(event) {
    this.setState({ keyword: event.target.value });
  }
  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };
  handleChangeCode = (event) => {
    this.setState({ code: event.target.value });
  };
  handleChangePath = (event) => {
    this.setState({ path: event.target.value });
  };

  handleChangeValue = (event) => {
    console.log(this.state);
    this.setState({ [event.target.name]: event.target.value });
  };

  openParentPopup = (event) => {
    this.setState({ shouldOpenSelectParentPopup: true });
  };
  openAdminUnitPopup = (event) => {
    this.setState({ shouldOpenSelectAdminUnitPopup: true });
  };
  handleSelectParent = (urbanArea) => {
    //alert(parent.name);
    this.setState({ urbanArea: urbanArea });
    this.setState({ shouldOpenSelectParentPopup: false });
  };
  handleSelectAdminUnit = (adminUnit) => {
    //alert(parent.name);
    this.setState({ adminUnit: adminUnit });
    this.setState({ shouldOpenSelectAdminUnitPopup: false });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    let { code } = this.state;
    let {t} = this.props
    //let item = this.state;
    let item = {};
    let urbanArea = this.state.urbanArea;
    item.id = this.state.id;
    item.name = this.state.name;
    item.code = this.state.code;
    item.viewIndex = this.state.viewIndex;
    item.icon = this.state.icon;
    item.path = this.state.path;
    item.urbanArea = urbanArea;
    item.roles = this.state.roles;
    item.description = this.state.description;
    item.adminUnit = this.state.adminUnit;
    checkCode(id, code).then((result) => {
      //Nếu trả về true là code đã được sử dụng
      if (result.data) {
        toast.warning(t("general.dupli_code"));
        // alert("Code đã được sử dụng");
      } else {
        saveItem(item).then(() => {
          this.props.handleOKEditClose();
        });
      }
    });
  };
  handleDialogClose = () => {
    console.log(this.state);
    this.setState({
      shouldOpenNotificationPopup: false,
      shouldOpenSelectParentPopup: false,
      shouldOpenSelectAdminUnitPopup: false,
    });
  };

  selectRoles = (rolesSelected) => {
    this.setState({ roles: rolesSelected }, function () {});
  };

  render() {
    const {
      t,
      i18n,
      handleClose,
      handleSelect,
      selectedItem,
      open,
      item,
    } = this.props;
    let {
      keyword,
      name,
      code,
      icon,
      path,
      viewIndex,
      shouldOpenNotificationPopup,
      listRole,
      roles,
      description,shouldOpenSelectAdminUnitPopup
    } = this.state;
    let columns = [
      { title: t("general.name"), field: "name", width: "150" },
      { title: t("general.code"), field: "code", align: "left", width: "150" },
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "250",
        render: (rowData) => (
          <Radio
            name="radSelected"
            value={rowData.id}
            checked={this.state.selectedValue === rowData.id}
            onClick={(event) => this.handleClick(event, rowData)}
          />
        ),
      },
    ];
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth={true}
      >
        {shouldOpenNotificationPopup && (
          <NotificationPopup
            title={t("general.noti")}
            open={shouldOpenNotificationPopup}
            // onConfirmDialogClose={this.handleDialogClose}
            onYesClick={this.handleDialogClose}
            text={t(this.state.Notification)}
            agree={t("general.agree")}
          />
        )}
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("general.saveUpdate")}
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent>
            <Grid className="" container spacing={2}>
            <Grid item sm={12} xs={12}>
                <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-10"
                  variant="contained"
                  color="primary"
                  onClick={this.openAdminUnitPopup}
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("AdministrativeUnit.title")}
                    </span>
                  }
                  // className="w-80"
                  style={{ width: "85%" }}
                  value={
                    this.state.adminUnit != null
                      ? this.state.adminUnit.name
                      : ""
                  }
                />

                {this.state.shouldOpenSelectAdminUnitPopup && (
                  <SelectAdminUnitPopup
                    open={this.state.shouldOpenSelectAdminUnitPopup}
                    handleSelect={this.handleSelectAdminUnit}
                    selectedItem={
                      this.state.item != null &&
                      this.state.adminUnit != null
                        ? this.state.adminUnit
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>
              <Grid item sm={12} xs={12}>
                <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-10"
                  variant="contained"
                  color="primary"
                  onClick={this.openParentPopup}
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>
                      {t("directory.urbanArea")}
                    </span>
                  }
                  // className="w-80"
                  style={{ width: "85%" }}
                  value={
                    this.state.urbanArea != null
                      ? this.state.urbanArea.name
                      : ""
                  }
                />

                {this.state.shouldOpenSelectParentPopup && (
                  <SelectParentPopup
                    open={this.state.shouldOpenSelectParentPopup}
                    handleSelect={this.handleSelectParent}
                    selectedItem={
                      this.state.item != null &&
                      this.state.item.urbanArea != null
                        ? this.state.item.urbanArea
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("general.code")}
                    </span>
                  }
                  onChange={this.handleChangeValue}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>
                      {t("general.name")}
                    </span>
                  }
                  onChange={this.handleChangeValue}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("general.description")}
                    </span>
                  }
                  onChange={this.handleChangeValue}
                  type="text"
                  name="description"
                  value={description}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <div className="flex flex-space-between flex-middle mt-10">
              <Button
                variant="contained"
                className="mr-12"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                {t("general.cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: "15px" }}
                type="submit"
              >
                {t("general.save")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default SupplierDialog;
