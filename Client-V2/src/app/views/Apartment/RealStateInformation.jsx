import { Grid, TextField, IconButton, Icon, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { Breadcrumb, ConfirmationDialog, RichTextEditor } from "egret";
import { Editor } from '@tinymce/tinymce-react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ConstantList from "../../appConfig";
import { Helmet } from 'react-helmet';
import AsynchronousAutocomplete from '../utilities/AsynchronousAutocomplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getList as searchByType } from "../RealStateType/RealStateTypeService";
// import { EditorAttachMoney } from "material-ui/svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fab from "@material-ui/core/Fab";
import { MuiPickersUtilsProvider, DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Card from "@material-ui/core/Card";
import SelectBuildingPopup from "./SelectBuildingPopup";
import SelectSourcePopup from "./SelectSourcePopup";
import SelectRealStateTypePopup from "./SelectRealStateTypePopup";
import SelectAgentPopup from "./SelectAgentPopup";
import SelectAgencyPopup from "./SelectAgencyPopup";

class RealStateInformation extends React.Component {

  state = {
    shouldOpenSelectSourcePopup : false,
    shouldOpenSelectRealStateTypePopup:false,
    shouldOpenSelectAgencyPopup:false,
    shouldOpenSelectAgentPopup:false
  }
  constructor(props) {
    super(props);
    
  }
 
  handleChange = (event, source) => {
    const name = event.target.name;
    const value = event.target.value;
    let {item} = this.state
    item[name]=value
    this.setState({item:item},()=>{
      this.state.item[name] = value
    });
  }
  handleChangeDate =(date, name)=>{
    var item = this.state.item;
    item[name]= date;
    this.setState({item:item},()=>{
      console.log(this.state.item)
    });
  }
  componentWillMount() {
    var {item} = this.props;
    this.setState({
      item:item,
    },()=>{
        console.log(this.state.item)
    });
  }
  componentDidMount() {
    // var item = this.props;
    // if(item == null){
    //     this.setState({item:{}});
    // }
  }
  handleSelectBuilding = (building) => {
      let item = this.state.item
      item["building"] = building
    this.setState({ item: item });
    this.setState({ shouldOpenSelectBuildingPopup: false });
  };
  handleSelectSource = (source) => {
    let item = this.state.item
    item["source"] = source
    this.setState({},()=>{
      this.state.item["source"] = source
    });
    this.setState({ shouldOpenSelectSourcePopup: false,});
    
  };
  // handleDialogClose =()=>{
  //   this.setState({},()=>{
  //     this.state["shouldOpenSelectSourcePopup"] = false
  //   })
  // }
  openSelectSourcePopup = () => {
    let {item}=this.state
    this.setState({shouldOpenSelectSourcePopup: true });
  };
  openSelectBuildingPopup = () => {
    let {item}=this.state
    this.setState({shouldOpenSelectBuildingPopup: true });
  };
  handleDialogClose = () => {
    console.log(this.state);
    this.setState({
      shouldOpenNotificationPopup: false,
      shouldOpenSelectBuildingPopup: false,
      shouldOpenSelectSourcePopup: false,
      shouldOpenSelectOwnerPopup:false,
      shouldOpenSelectRealStateTypePopup:false,
      shouldOpenSelectAgencyPopup:false,
      shouldOpenSelectAgentPopup:false,
    });
  };
  openRealStateTypePopup = ()=>{
    this.setState({shouldOpenSelectRealStateTypePopup:true})
  }
  selectType = (realStateType)=>{
    let {item} = this.state
    item["realStateType"]= realStateType
    this.setState({item:item,shouldOpenSelectRealStateTypePopup:false})
  }
  openSelectAgencyPopup =()=>{
    this.setState({shouldOpenSelectAgencyPopup:true})
  }
  handleSelectAgency =(agency)=>{
    let {item} = this.state
    item["agency"]= agency
    this.setState({item:item,shouldOpenSelectAgencyPopup:false})
  }

  openSelectAgentPopup =()=>{
    this.setState({shouldOpenSelectAgentPopup:true})
  }
  handleSelectAgent =(agent)=>{
    let {item} = this.state
    item["agent"]= agent
    this.setState({item:item,shouldOpenSelectAgentPopup:false})
  }
  selectRequirementType =(e, type)=>{
    let {item} = this.state
    console.log(type)
    item["requirementType"]= type
    this.setState({item:item},()=>{
      this.state.item["requirementType"] = type
    })
  }
  render() {
    let { t, i18n,useStyles,item } = this.props;
    // this.state = this.props;
    // let { item} = this.state;
    let searchType ={pageIndex:1,pageSize:1000000}
    const classes = useStyles;
    return (
      <React.Fragment>
          <Grid container spacing={2}>
          <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>
                      {t("general.name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={item?.name}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
                
              {/* {this.state.selectFor === 2 && (<Grid item sm={4} xs={12}></Grid>)}
              {this.state.selectFor === 2 && (<Grid item sm={4} xs={12}></Grid>)} */}
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("general.code")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={item?.code}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
          <Grid item sm={4} xs={12}>
                <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-10"
                  variant="contained"
                  color="primary"
                  onClick={this.openSelectBuildingPopup}
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  size="small"
                  // InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>
                      {t("title.building")}
                    </span>
                  }
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                  // className="w-80"
                  style={{ width: "70%" }}
                  value={
                    this.state.item.building  ? this.state.item.building.name : ""
                  }
                />

                {this.state.shouldOpenSelectBuildingPopup && (
                  <SelectBuildingPopup
                    open={this.state.shouldOpenSelectBuildingPopup}
                    handleSelect={this.handleSelectBuilding}
                    selectedItem={
                      item != null && item.building != null
                        ? this.state.item.building
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-5"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.floorsCode")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="floorsCode"
                  value={item?.floorsCode}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-10"
                  variant="contained"
                  color="primary"
                  onClick={this.openSelectAgencyPopup}
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  size="small"
                  // InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>
                      {t("directory.agency")}
                    </span>
                  }
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                  className="mt-5"
                  style={{ width: "70%" }}
                  value={
                    this.state.item.agency  ? this.state.item.agency.name : ""
                  }
                />

                {this.state.shouldOpenSelectAgencyPopup && (
                  <SelectAgencyPopup
                    open={this.state.shouldOpenSelectAgencyPopup}
                    handleSelect={this.handleSelectAgency}
                    selectedItem={
                      item != null && item.agency != null
                        ? this.state.item.agency
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>

              <Grid item sm={4} xs={12}>
                <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-10"
                  variant="contained"
                  color="primary"
                  onClick={this.openSelectAgentPopup}
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  size="small"
                  // InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>
                      {t("directory.agent")}
                    </span>
                  }
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                  // className="w-80"
                  style={{ width: "70%" }}
                  value={
                    this.state.item.agent  ? this.state.item.agent.name : ""
                  }
                />

                {this.state.shouldOpenSelectAgentPopup && (
                  <SelectAgentPopup
                    open={this.state.shouldOpenSelectAgentPopup}
                    handleSelect={this.handleSelectAgent}
                    selectedItem={
                      item != null && item.agent != null
                        ? this.state.item.agent
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>

              

              <Grid item sm={4} xs={12}>
                <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-10"
                  variant="contained"
                  color="primary"
                  onClick={
                    this.openSelectSourcePopup
                  }
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  className=" "
                  size="small"
                  // InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>
                      {t("title.source")}
                    </span>
                  }
                  // className="w-80"
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                  style={{ width: "70%" }}
                  value={
                    this.state.item.source ? this.state.item.source.name : ""
                  }
                />

                {this.state.shouldOpenSelectSourcePopup && (
                  <SelectSourcePopup
                    open={this.state.shouldOpenSelectSourcePopup}
                    handleSelect={this.handleSelectSource}
                    selectedItem={
                      this.state.item != null && this.state.item.source != null
                        ? this.state.item.source
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-10"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.numberOfBedRoom")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="numberOfBedRoom"
                  value={item?.numberOfBedRoom}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-10"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.acreage")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="acreage"
                  value={item?.acreage}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item md={4} xs={12}>
              <Button
                  size="small"
                  style={{ float: "right" }}
                  className=" mt-28"
                  variant="contained"
                  color="primary"
                  onClick={this.openRealStateTypePopup}
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
                      {t("directory.stateType")}
                    </span>
                  }
                  className="w-80 mt-10"
                  style={{ width: "70%" }}
                  // style ={{width: "90%"}}
                  value={
                    this.state.item.realStateType != null ? this.state.item.realStateType.name : ""
                  }
                />

                {this.state.shouldOpenSelectRealStateTypePopup && (
                  <SelectRealStateTypePopup
                    open={this.state.shouldOpenSelectRealStateTypePopup}
                    handleSelect={this.selectType}
                    selectedItem={
                      this.state.parent != null && this.state.parent != null
                        ? this.state.parent
                        : {}
                    }
                    handleClose={this.handleDialogClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
                </Grid>
              <Grid item sm={4} xs={12}>
              <Autocomplete
              size="small"
              id="combo-box"
              options={this.props.listRequirementType}
              className="flex-end w-80 mt-16"
              getOptionLabel={option => option.name}
              onChange={this.selectRequirementType}
              value={item?.requirementType}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("directory.RequirementType")}
                  // variant="outlined"
                />
              )}
            />
                {/* <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.needDescription")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="needDescription"
                  value={item?.needDescription}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                /> */}
              </Grid>

              <Grid item sm={4} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-100 classes.textHeader"
                    disableToolbar
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={t("apartment.lastCheckingDate")}
                    name="lastCheckingDate"
                    value={item?.lastCheckingDate}
                    //onChange={(endDate) => this.handleChangeBirthDate()}
                    onChange={(date) =>
                      this.handleChangeDate(date, "lastCheckingDate")
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item sm={4} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-100 classes.textHeader"
                    disableToolbar
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={t("apartment.availableDate")}
                    name="availableDate"
                    value={item?.availableDate}
                    //onChange={(endDate) => this.handleChangeBirthDate()}
                    onChange={(date) =>
                      this.handleChangeDate(date, "availableDate")
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.price")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="price"
                  value={item?.price}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.furniture")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="furniture"
                  value={item?.furniture}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.numberOfToilet")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="numberOfToilet"
                  value={item?.numberOfToilet}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
                
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.doorDirection")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="doorDirection"
                  value={item?.doorDirection}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
                
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}> *</span>

                      {t("apartment.balconyDirection")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="balconyDirection"
                  value={item?.balconyDirection}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
                
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>

                      {t("general.description")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="description"
                  value={item?.description}
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 mt-16"
                  label={
                    <span>
                      <span style={{ color: "red" }}></span>

                      {t("apartment.note")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="note"
                  value={item?.note}
                  // validators={["required"]}
                  // errorMessages={[t("general.required")]}
                />
              </Grid>
          </Grid>
         
        </React.Fragment>
    )
  }
}
export default RealStateInformation;