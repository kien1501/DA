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
  Radio,RadioGroup,
  Dialog,FormControl,FormControlLabel
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
import { getAllByRoot, saveItem, updateItem,checkCode,checkCodeOwner } from "./ApartmentService";
import { searchByPage as searchByOwnerType } from "../RealEstateOwnerType/RealEstateOwnerTypeService";
import DateFnsUtils from "@date-io/date-fns";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { width } from "dom-helpers";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import SelectBuildingPopup from "./SelectBuildingPopup";
import SelectOwnerPopup from "./SelectOwnerPopup";
import SelectSourcePopup from "./SelectSourcePopup";
import {searchByPage as searchRequirementType} from "../RequirementType/RequirementTypeService";

import TabsRealState from "./Tabs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit:3
  //etc you get the idea
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
class apartmentDialog extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
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
    shouldOpenSelectBuildingPopup: false,
    shouldOpenSelectSourcePopup: false,
    roles: [],
    listRole: [],
    selectFor:2,
    displayName:"",
    lastName:"",
    firstName:"",
    fullAddress:"",
    codeOwner:"",
    owner:null,
    numberOfApartments:null,
    id:"",
    shouldOpenSelectOwnerPopup:false,
    listRequirementType:[]
  };
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
    this.updatePageData();
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  componentDidMount() {
    
  }

  componentWillMount() {
    let { item } = this.props;
    if(item == null){
          item ={}
          item["owner"] = null
          item["displayName"] =""
          item["firstName"] =""
          item["lastName"] =""
          item["fullAddress"] =""
          item["codeOwner"] = ""
          item["type"] = null
          item["noteOwner"]=""
          item["phoneNumber"]=""
          this.setState({ item: item,},()=>{
            // console.log(this.state.displayName)
          });
    }
    this.setState({ item: item,},()=>{
      // console.log(this.state.displayName)
    });
    
    this.setState({ ...item }, () => {
      let {displayName,firstName,lastName,codeOwner,fullAddress,selectFor,item} = this.state
      if(item != null && this.state.owner != null){
        // displayName =this.state.owner.displayName
        // lastName =this.state.owner.lastName
        // firstName =this.state.owner.firstName
        // codeOwner =this.state.owner.code
        // fullAddress =this.state.owner.fullAddress
        // type =this.state.owner.type
          item["owner"] = this.state.owner
          item["displayName"] =this.state.owner.displayName
          item["firstName"] =this.state.owner.firstName
          item["lastName"] =this.state.owner.lastName
          item["fullAddress"] =this.state.owner.fullAddress
          item["codeOwner"] = this.state.owner.code
          item["type"] = this.state.owner.type
          item["noteOwner"]=this.state.owner.noteOwner
          item["phoneNumber"]=this.state.owner.phoneNumber
          item["selectFor"] = 0
        // selectFor:0
        this.setState({item:item})
      }
      let { type } = this.state;
      if (type && type.id) {
        this.setState({ typeId: type.id });
      }
    });

    var searchObject = {};
      searchObject.keyword = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchRequirementType(searchObject).then(({ data }) => {
        this.setState({ listRequirementType: [...data.content], totalElements: data.totalElements })
      });

  }

  handleFormSubmit = () => {
    console.log(this.state.item)
    let { id } = this.state.item;
    let { code,lastName,codeOwner,fullAddress,firstName,name } = this.state.item;
    // this.state.item["source"] =this.state.source
    // this.state.item["building"] =this.state.building
    //let item = this.state;
      if(code == null || code =="" || name == null || name ==""){
        toast.warning("Chưa nhập đủ thông tin bất động sản")
        return
      }
      if(lastName == null || lastName =="" || codeOwner == null || codeOwner =="" || fullAddress == null || fullAddress =="" || firstName == null || firstName ==""){
        toast.warning("Chưa nhập đủ thông tin chủ sở hộ")
        return
      }
    
        checkCode(id,code).then(res =>{
          if(res.data){
            toast.warning("Mã căn hộ tồn tại")
            return
          }
          else{
                if(id){
                  updateItem({...this.state.item}).then(() => {
                    this.props.handleOKEditClose();
                  });
                }else{
                  saveItem({...this.state.item}).then(() => {
                    this.props.handleOKEditClose();
                  });
                }
              }
            // })
        })
  };
  handleDialogClose = () => {
    console.log(this.state);
    this.setState({
      shouldOpenNotificationPopup: false,
      shouldOpenSelectBuildingPopup: false,
      shouldOpenSelectSourcePopup: false,
      shouldOpenSelectOwnerPopup:false
    });
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
    let searchOwnerType ={pageIndex:1,pageSize:1000000}
    let {
      keyword,
      name,
      code,
      numberOfApartments,
      owner,
      numberOfBedRoom,
      acreage,
      needDescription,
      lastCheckingDate,
      availableDate,
      furniture,
      price,
      description,
      icon,
      path,
      viewIndex,
      shouldOpenNotificationPopup,
      listRole,
      roles,displayName,lastName,
      numberOfFloors,codeOwner,type,
      note,selectFor,firstName,fullAddress
    } = this.state;
    const selectForValue = { select: 1, add: 2 };
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth="md"
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
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} className="validator-form-scroll-dialog">
        <DialogContent>
            <Grid item  xs={12}>
            <TabsRealState 
                t={t} i18n={i18n} 
                item={this.state.item}
                listRequirementType = {this.state.listRequirementType} 
               />
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
export default apartmentDialog;
