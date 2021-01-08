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
  import SelectOwnerPopup from "./SelectOwnerPopup";
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
  class OwnerInformation extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
    state = {
      rowsPerPage: 5,
      page: 0,
      data: [],
      totalElements: 0,
      roles: [],
      listRole: [],
      selectFor:0,
      shouldOpenSelectOwnerPopup:false
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
  
    handleClick = (event, item) => {
      //alert(item);
      if (item.id != null) {
        this.setState({ selectedValue: item.id, selectedItem: item });
      } else {
        this.setState({ selectedValue: item.id, selectedItem: null });
      }
    };
    handleChangeValue = (event, source) => {
      const name = event.target.name;
      const value = event.target.value;
      let {item} = this.state
      item[name]=value
      this.setState({item:item},()=>{
        this.state.item[name] = value
        // this.state.item['displayName']= fillName;
        console.log(this.state.item)
      });
    }
    componentWillMount() {
      let { item } = this.props;
     
      let {displayName,lastName} = this.state
      this.setState({ item: item,},()=>{
        this.state.item = item
      });
    }
  
    handleChange(event, source) {
        let {item} =this.state
      if(source ==="selectFor"){
        console.log(event.target.value)
        if(event.target.value/1 != 1){
          var value = event.target.value/1
          item["displayName"] =""
          item["firstName"] =""
          item["lastName"] =""
          item["fullAddress"] =""
          item["codeOwner"] = ""
          item["noteOwner"]=""
          item["phoneNumber"]=""
          this.setState({item:item,selectFor:value},()=>{
              
              
          })
        }
        if(event.target.value/1 === 1){
            item["selectFor"] = 1
          this.setState({item:item,shouldOpenSelectOwnerPopup:true,selectFor:1})
        }
        this.setState({item:item},()=>{
        })
      }
    }
  
    handleChangeName = (event) =>{
        var name = event.target.name;
        var value = event.target.value;
        let {item} = this.state
        var fullname = '';
        if(name === "firstName"){
          fullname =value +  ' ' +(this.state.item.lastName ? this.state.item.lastName : '') 
        }
        if(name === "lastName"){
          fullname = (this.state.item.firstName ? this.state.item.firstName : '')+ ' ' + value
        }
        item[name]=value
        item["displayName"] = fullname
        this.setState({item:item},()=>{
          this.state.item[name]= value;
          this.state.item['displayName']= fullname;
        });
      }
  
    // handleChangeValue = (event) => {
    //   this.setState({ [event.target.name]: event.target.value });
    // };
  
    openBuildingPopup = () => {
      this.setState({ shouldOpenSelectBuildingPopup: true });
    };
  
    // openSourcePopup = () => {
    //   this.setState({ shouldOpenSelectSourcePopup: true });
    // };
    handleSelectOwner =  (owner) => {
        let {item}= this.state
        item["owner"] = owner
        item["displayName"] = owner.displayName
        item["lastName"] = owner.lastName
        item["firstName"] = owner.firstName
        item["codeOwner"] = owner.code
        item["fullAddress"] = owner.fullAddress
        item["type"] = owner.type
        item["noteOwner"]=owner.noteOwner
          item["phoneNumber"]=owner.phoneNumber
        console.log(owner)
        this.setState({ shouldOpenSelectOwnerPopup: false,item:item },()=>{
      });
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
  
    selectOwnerType = (items)=>{
        let {item}= this.state
        // item.type =items
        item["type"]=items
      this.setState({item:item})
    }
    render() {
      const {
        t,
        i18n,
        handleClose,
        handleSelect,
        selectedItem,
        open,
        item,selectFor
      } = this.props;
      let searchOwnerType ={pageIndex:1,pageSize:1000000}
      let {
  
      } = this.state;
      const selectForValue = { select: 1, add: 2 };
      return (
        <React.Fragment>
              <Grid className="" container spacing={2}>
              <fieldset style={{ width: "100%" }}>
                  {this.state.item.owner ? <legend>{t("apartment.update")}</legend> : <legend>{t("apartment.add")}</legend>}
                  <Grid item container md={12} xs={12} className="mt-12">
                  <Grid item  md={4} xs={12} className="mt-12">
                    <label style={{ fontWeight: 'bold', paddingRight: 16 }} className="">{t('apartment.owner')}: </label>
                    <FormControl className="" component="fieldset">                   
                      <RadioGroup aria-label="selectFor" name="selectFor" value={this.state.selectFor} 
                        onClick={(selectFor) =>
                          this.handleChange(selectFor, 'selectFor')
                        }
                        style={{ display: 'inline' }}>
                        <FormControlLabel value={1} control={<Radio />} label={t('apartment.select')} />
                        <FormControlLabel value={2} control={<Radio />} label={t('apartment.add')} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item container md={8} xs={12}>
                  
                  <Grid item md={6} xs={12}>
                  <TextValidator
                    className=""
                    style={{width:"95%"}}
                    // InputLabelProps={{ shrink: true }}
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.firstName")}
                      </span>
                    }
                    onChange={this.handleChangeName}
                    type="text"
                    name="firstName"
                    value={item?.firstName}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                <TextValidator
                    // className="w-80 "
                    style={{width:"95%"}}
                    // InputLabelProps={{ shrink: true }}
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.lastName")}
                      </span>
                    }
                    onChange={this.handleChangeName}
                    type="text"
                    name="lastName"
                    value={item?.lastName}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                
                <TextValidator
                // InputLabelProps={{ shrink: true }}
                    className="w-100"
                    style={{width:"95%"}}
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.displayName")}
                      </span>
                    }
                    // onChange={this.handleChangeName}
                    type="text"
                    name="displayName"
                    value={item?.displayName}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                <TextValidator
                // InputLabelProps={{ shrink: true }}
                    className="w-100 "
                    style={{width:"95%"}}
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.phoneName")}
                      </span>
                    }
                    onChange={this.handleChangeValue}
                    type="text"
                    name="phoneNumber"
                    value={item?.phoneNumber}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                <TextValidator
                // InputLabelProps={{ shrink: true }}
                    className="w-100 "
                    style={{width:"95%"}}
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.code")}
                      </span>
                    }
                    onChange={this.handleChangeValue}
                    type="text"
                    name="codeOwner"
                    value={item?.codeOwner}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                
                <Grid item md={6} xs={12}>
                <AsynchronousAutocomplete
                  style={{width:"80%"}}
                  className =""
                  // InputLabelProps={{ shrink: true }}
                  label={
                        <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t('directory.ownertype')}
                      </span> 
                    }
                  searchFunction={searchByOwnerType}
                  // multiple={true}
                  searchObject={searchOwnerType}
                  defaultValue={item?.type}
                  displayLable={'name'}
                  value={item?.type}
                  onSelect={this.selectOwnerType}
                //   validators={["required"]}
                //   errorMessages={[t("general.required")]}
                />
                </Grid>
                <Grid item md={12} xs={12}>
                <TextValidator
                // InputLabelProps={{ shrink: true }}
                style={{width:"95%"}}
                    className="w-100 "
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.fullAddress")}
                      </span>
                    }
                    onChange={this.handleChangeValue}
                    type="text"
                    name="fullAddress"
                    value={item?.fullAddress}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                <TextValidator
                // InputLabelProps={{ shrink: true }}
                style={{width:"95%"}}
                    className="w-100 "
                    label={
                      <span>
                        <span style={{ color: "red" }}> *</span>
  
                        {t("RealEstateOwner.noteOwner")}
                      </span>
                    }
                    onChange={this.handleChangeValue}
                    type="text"
                    name="noteOwner"
                    value={item?.noteOwner}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                </Grid>
                </Grid>
                </fieldset>
                
                  {this.state.shouldOpenSelectOwnerPopup && (
                    <SelectOwnerPopup
                      open={this.state.shouldOpenSelectOwnerPopup}
                      handleSelect={this.handleSelectOwner}
                      selectedItem={
                        this.state.item != null && this.state.item.Owner != null
                          ? this.state.item.Owner
                          : {}
                      }
                      handleClose={this.handleDialogClose}
                      t={t}
                      i18n={i18n}
                    />
                  )}
              </Grid>
    </React.Fragment>
           
      );
    }
  }
  export default OwnerInformation;
  