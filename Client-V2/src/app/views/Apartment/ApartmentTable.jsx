import {
  Grid,
  TextField,
  IconButton,
  Icon,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
  TablePagination,
  Tooltip,
  FormControl,
  Input,
  InputAdornment,
  TableBody,
  TableContainer,
  Table,Paper
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { MuiPickersUtilsProvider, DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker, } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
import {
  searchByPage,
  handleDeleteList,
  getFlatRootChild,
  getAllByRoot,
  deleteItem,
  saveItem,
  getItemById,
  getAllItem,getChildAdminUnit,
  deleteCheckItem,searchByRealEstateOwner
} from "./ApartmentService";
import HomeWorkOutlinedIcon from '@material-ui/icons/HomeWorkOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ApartmentDialog from "./ApartmentDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Helmet } from "react-helmet";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import moment from "moment";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {searchByPage as getUrbanArea} from "../UrbanArea/UrbanAreaService";
import {searchByPage as getBuilding} from "../Building/BuildingService";
import {searchByPage as getProject} from "../Project/ProjectService";
import {searchByPage as getRequirementType} from "../RequirementType/RequirementTypeService";
import {getTree as getTreeView} from "../RealStateType/RealStateTypeService";
import {getChildrenByParentId,searchByPage as getListAdministrativeUnit} from '../AdministrativeUnit/AdministrativeUnitService'
import LocalConstants from "./Constants";
// tree
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import Display from "../utilities/Display";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#358600",
    color: theme.palette.common.white,
    width:"150px"
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    position: "absolute",
    top: "-15px",
    left: "-30px",
    width: "80px",
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
      >
        <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
          <Icon fontSize="small" color="error">
            delete
          </Icon>
        </IconButton>
      </LightTooltip>
    </div>
  );
}
class Apartment extends React.Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    keyword: "",
    shouldOpenNotificationPopup: false,
    Notification: "",
    showAll: false,
    realStateTypeTreeView:[],
    isView:false,
    checkOpenSearch:false,
    availableDate: null,
    lastCheckingDate:null,
    view:false
  };
  constructor(props) {
    super(props);
    getTreeView().then((result) => {
      let realStateTypeTreeView = {
        id: 'all',
        name: 'Toàn bộ',
        children: result.data,
      }
      this.setState({ realStateTypeTreeView: realStateTypeTreeView }, function () {
      })
    })
    //this.state = {keyword: ''};
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }

  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };
  componentDidMount() {
    this.updatePageData();
  }
  handleChangeRow =(event, source)=>{

    if(source === "realStateName"){
      this.setState({realStateName: event.target.value},()=>{
        // if(this.state.realStateName ===""){
        //   this.search()
        // }
      })
        
    }
    this.setState({[event.target.name]:event.target.value},()=>{
      // if(this.state.ownerName ===""){
      //   this.search()
      // }
      // if(this.state.floorsCode ===""){
      //   this.search()
      // }
      // if(this.state.realStateCode ===""){
      //   this.search()
      // }
      // if(this.state.doorDirection ===""){
      //   this.search()
      // }
      // if(this.state.balconyDirection ===""){
      //   this.search()
      // }
      // if(this.state.furniture ===""){
      //   this.search()
      // }
      // if(this.state.phoneNumber ===""){
      //   this.search()
      // }
    })
  }
  search() {
    this.setState({ page: 0 }, function () {
      var searchObject = {};
      searchObject.availableDate = this.state.availableDate;
      searchObject.adminUnitId = this.state.adminUnitId;
      searchObject.realStateTypeId = this.state.realStateTypeId;
      searchObject.requirementTypeId = this.state.requirementTypeId;
      searchObject.urbanAreaId = this.state.urbanAreaId;
      searchObject.buildingId = this.state.buildingId;
      searchObject.projectId = this.state.projectId;
      searchObject.ownerId = this.state.ownerId;
      searchObject.keyword = this.state.keyword;
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      //
      searchObject.realStateName = this.state.realStateName ? this.state.realStateName:""
      searchObject.ownerName = this.state.ownerName ? this.state.ownerName:""
      searchObject.floorsCode = this.state.floorsCode ? this.state.floorsCode:""
      searchObject.realStateCode = this.state.realStateCode ? this.state.realStateCode:""
      searchObject.numberOfBedRoom = this.state.numberOfBedRoom ? this.state.numberOfBedRoom:""
      searchObject.numberOfToilet = this.state.numberOfToilet ? this.state.numberOfToilet:""
      searchObject.doorDirection = this.state.doorDirection ? this.state.doorDirection:""
      searchObject.balconyDirection = this.state.balconyDirection ? this.state.balconyDirection:""
      searchObject.furniture = this.state.furniture ? this.state.furniture:""
      searchObject.fromToPrice = this.state.fromToPrice ? this.state.fromToPrice:null
      searchObject.fromPrice = this.state.fromPrice ? this.state.fromPrice:null
      searchObject.phoneNumber =this.state.phoneNumber ? this.state.phoneNumber:""
      console.log(this.state.keyword);
      searchByPage(searchObject)
        .then((res) => {
          this.setState({ itemList: [...res.data.content],
            totalElements: res.data.totalElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.keyword = "";
    searchObject.availableDate = this.state.availableDate;
    searchObject.adminUnitId = this.state.adminUnitId;
    searchObject.realStateTypeId = this.state.realStateTypeId;
    searchObject.requirementTypeId = this.state.requirementTypeId;
    searchObject.urbanAreaId = this.state.urbanAreaId;
      searchObject.buildingId = this.state.buildingId;
      searchObject.projectId = this.state.projectId;
      searchObject.ownerId = this.state.ownerId;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.realStateName = ""
    searchObject.ownerName = ""
      searchObject.floorsCode = ""
      searchObject.realStateCode = ""
      searchObject.numberOfBedRoom = null
      searchObject.numberOfToilet = null
      searchObject.doorDirection = ""
      searchObject.balconyDirection = ""
      searchObject.furniture = ""
      searchObject.phoneNumber = ""
      searchObject.fromToPrice = null
      searchObject.fromPrice = null
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data.content],
        totalElements: data.totalElements,
      });
    });
  };
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleOKEditClose = () => {
    this.setState(
      {
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
      },
      () => {
        this.updatePageData();
      }
    );
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };
  handleDialogClose = () => {
    this.setState(
      {
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
        shouldOpenConfirmationDeleteAllDialog: false,
        shouldOpenNotificationPopup: false,
        data: [],
      },
      () => {
        this.updatePageData();
      }
    );
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
    });
    this.setPage(0);
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };

  handleConfirmationResponse = () => {
    if (this.state.itemList.length === 1 && this.state.page === 1) {
      let count = this.state.page - 1;
      this.setState({
        page: count,
      });
    }
    deleteItem(this.state.id).then(() => {
      this.updatePageData();
      this.handleDialogClose();
    });
  };
  handleEditItem = (item) => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true,
    });
  };
  handleDeleteButtonClick = () => {
    if (typeof this.data === "undefined" || this.data.length === 0) {
      this.setState({
        shouldOpenNotificationPopup: true,
        Notification: "general.noti_check_data",
      });
      // alert('Chưa chọn dữ liệu')
    } else {
      this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
    }
  };
  handleDeleteAll = (event) => {
    for (var i = 0; i < this.data.length; i++) {
      // deleteItem(list[i].id)
      deleteItem(this.data[i].id).then((temp) => {
        this.updatePageData();
      });
    }
    
    this.handleDialogClose();
    // });
  };
   handleChangeSwitch = (event) => {
     console.log(event.target.checked)
    this.setState({[event.target.name]: event.target.checked});
  };
  componentWillMount() {
    let searchObject = {};
    searchObject.keyword = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    getListAdministrativeUnit(searchObject).then(({ data }) => {
      let list =[...data.content]
      let administrativeList =[]
      list.forEach(el =>{
        if(el.level === 0){
          administrativeList.push(el)
        }
      })
      this.setState({
        administrativeList: administrativeList
      });
    }
    );
    getProject(searchObject).then((res) => {
      this.setState({
        projectList: [...res.data.content],
        totalElements: res.data.totalElements,
      });
    })
  
    getRequirementType(searchObject).then((res) => {
      this.setState({
        RequirementTypeList: [...res.data.content],
        totalElements: res.data.totalElements,
      });
    })

    getUrbanArea(searchObject).then((res) => {
      this.setState({
        urbanAreaList: [...res.data.content],
        totalElements: res.data.totalElements,
      });
    })
    getBuilding(searchObject).then((res) => {
          this.setState({
            buildingList: [...res.data.content],
            totalElements: res.data.totalElements,
          });
        })
    searchByRealEstateOwner(searchObject).then((res) => {
      this.setState({
          ownerList: [...res.data.content],
          totalElements: res.data.totalElements,
        });
        })
  }
  selectUrbanArea = (event,item)=>{
    this.setState({urbanArea:item ? item : null ,urbanAreaId: item ? item.id : null},()=>{
      this.search()
    })
  }
  selectBuilding = (event,item)=>{
    this.setState({building:item ? item : null ,buildingId: item ? item.id : null},()=>{
      this.search()
    })
  }

  selectProject = (event,item)=>{
    this.setState({project:item ? item : null ,projectId: item ? item.id : null},()=>{
      this.search()
    })
  }
  
  selectOwner = (event,item)=>{
    this.setState({owner:item ? item : null ,ownerId: item ? item.id : null},()=>{
      this.search()
    })
  }

  getRealStateType =(event, typeId)=>{
    this.setState({realStateTypeId:typeId},()=>{
      this.search()
    })
  }
  selectNumberOfBedRoom = (event,item)=>{
    this.setState({numberOfBedRoom:item ? item.value : null,bedRoom:item ? item : null},()=>{
      this.search()
    })
  }
  selectNumberOfToilet = (event,item)=>{
    this.setState({numberOfToilet:item ? item.value : null,toilet:item ? item : null},()=>{
      this.search()
    })
  }
  selectPrice = (event,item)=>{
    this.setState({fromPrice:item ? item.fromPrice : null,price:item ? item : null,fromToPrice:item ? item.fromToPrice : null,},()=>{
      this.search()
    })
  }
  handleAdvancedSearchButtonClick = ()=>{
    let {checkOpenSearch} = this.state
    if(checkOpenSearch){
      this.setState({checkOpenSearch:false})
    }else{
      this.setState({checkOpenSearch:true})
    }
  }
  selectAdministrative =(event,item)=>{
    this.setState({administrative:item ? item: null,childAdminUnit:null,adminUnitId:null,adminUnitId:item ? item.id:null},()=>{
      this.search()
      if(item != null){
        getChildAdminUnit(item.id).then(({data}) =>{
          console.log(data)
          this.setState({listChildAdminUnit:[...data]})
        })
      }
      
    })
  }
  selectChildAdminUnit =(event,item)=>{
    this.setState({childAdminUnit:item ? item :null ,adminUnitId:item ? item.id :null},()=>{
      this.search()
    })
  }
  selectRequirementType = (event,item)=>{
    this.setState({requirementType:item ? item :null ,requirementTypeId:item ? item.id :null},()=>{
      this.search()
    })
  }
  handleChangeDate =(date, name)=>{
    this.setState({[name]:date},()=>{
    });
  }
  renderResultDetails(sample, index) {
    return (
      <React.Fragment>
        <StyledTableRow>
          {this.renderSample(sample, index)}
        </StyledTableRow>
      </React.Fragment>
    )
  }
  renderSample(item, index) {
    // console.log(item);
    let number = new Number(item?.price);
    let plainNumber = null
          if (number != null) {
            plainNumber = number.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          }

          let actionCell = <StyledTableCell className="px-0" align="left">
          <MaterialButton
            item={item}
            onSelect={(item, method) => {
              if (method === 0) {
                getItemById(item.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true,
                  });
                });
              } else if (method === 1) {
                this.handleDelete(item.id);
              } else {
                alert("Call Selected Here:" + item.id);
              }
            }}
          />
        </StyledTableCell>

          
    let sttCell = <StyledTableCell className="px-0" align="center">
      {index + 1}
    </StyledTableCell>
    let realStateNameCell =<StyledTableCell className="px-0" align="center">
    { item ? item.name : ''}
  </StyledTableCell>
    let ownerNameCell = <StyledTableCell className="px-0" align="center">
      { item ? item.owner.displayName : ''}
    </StyledTableCell>
    let phoneNumberCell = <StyledTableCell className="px-0" align="center">
    { item ? item.owner.phoneNumber : ''}
  </StyledTableCell>
  let buildingCell = <StyledTableCell className="px-0" align="center">
  { item ? item.building.name : ''}
</StyledTableCell>
let projectCell = <StyledTableCell className="px-0" align="center">
{ item ? item.building.project.name : ''}
</StyledTableCell>
let floorsCodeCell = <StyledTableCell className="px-0" align="center">
{ item ? item.floorsCode : ''}
</StyledTableCell>
let realStateCodeCell = <StyledTableCell className="px-0" align="center">
{ item ? item.code : ''}
</StyledTableCell>
let numberOfBedRoomCell = <StyledTableCell className="px-0" align="center">
{ item ? item.numberOfBedRoom : ''}
</StyledTableCell>
let numberOfToiletCell = <StyledTableCell className="px-0" align="center">
{ item ? item.numberOfToilet : ''}
</StyledTableCell>
let doorDirectionCell = <StyledTableCell className="px-0" align="center">
{ item ? item.doorDirection : ''}
</StyledTableCell>

let balconyDirectionCell = <StyledTableCell className="px-0" align="center">
{ item ? item.balconyDirection : ''}
</StyledTableCell>

let statusCell = <StyledTableCell className="px-0" align="center">
{ (item && item.requirementType) ? item.requirementType.name : ''}
</StyledTableCell>

let furnitureCell = <StyledTableCell className="px-0" align="center">
{ item ? item.furniture : ''}
</StyledTableCell>

let priceCell = <StyledTableCell className="px-0" align="center">
{ item ? plainNumber.substr(0, plainNumber.length - 2) : ''}
</StyledTableCell>

let date = moment(item?.availableDate).format('DD/MM/YYYY')
let availableDateCell = <StyledTableCell className="px-0" align="center">
{ date ? date : ''}
</StyledTableCell>

    return (
      <React.Fragment>
        {actionCell}
        {realStateNameCell}
        {ownerNameCell}
        {phoneNumberCell}
        {buildingCell}
        {projectCell}
        {floorsCodeCell}
        {realStateCodeCell}
        {numberOfBedRoomCell}
        {numberOfToiletCell}
        {doorDirectionCell}
        {balconyDirectionCell}
        {statusCell}
        {priceCell}
        {furnitureCell}
        {availableDateCell}
        
      </React.Fragment>
    )
  }
  render() {
    console.log(this.state);
    const { t, i18n } = this.props;
    let { keyword,lastCheckingDate,availableDate, shouldOpenNotificationPopup,buildingList,isView,checkOpenSearch,administrativeList,administrative,
      RequirementTypeList,requirementType, building,projectList,project,urbanAreaList,urbanArea,ownerList,owner,realStateTypeTreeView } = this.state;
    let TitlePage = t("directory.real_state");
    const renderTree = (nodes) =>
    nodes.id ? (
      <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    ) : null
    let columns = [
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "120px",
        filtering: false ,
        headerStyle: {
          padding: "0px",
        },
        cellStyle: {
          padding: "0px",
        },
        render: (rowData) =>  (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true,
                  });
                });
              } else if (method === 1) {
                this.handleDelete(rowData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      {
        title:t("apartment.name") , field: "name", align: "left",width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title:t("title.owner") , field: "owner.displayName", align: "left",width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title:t("RealEstateOwner.phoneNumber") , field: "owner.phoneNumber", align: "left",width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      // {
      //   title:t("title.stateType") , field: "realStateType.name", align: "left",width: "150",
      //   headerStyle: {
      //     minWidth:"150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //   },
      //   cellStyle: {
      //     minWidth:"150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //     textAlign: "left",
      //   },
      // },
      // {
      //   title:t("title.urbanArea") , field: "building.project.urbanArea.name", align: "left",width: "150",
      //   headerStyle: {
      //     minWidth:"150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //   },
      //   cellStyle: {
      //     minWidth:"150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //     textAlign: "left",
      //   },
      // },
      {
        title:t("title.building") , field: "building.name", align: "left",width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title:t("title.project") , field: "building.project.name", align: "left",width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      
      
    ];
    return (
      <div className="m-sm-30">
        <Helmet>
          <title>
            {TitlePage} | {t("web_site")}
          </title>
        </Helmet>
        <div className="mb-sm-30">
          <Breadcrumb
            routeSegments={[
              { name: t("Dashboard.category"), path: "/directory/apartment" },
              { name: TitlePage },
            ]}
          />
        </div>
        <Grid container spacing ={1}  justify="space-between">
          <Grid item md={6} xs={12}>
            <Button
              className="align-bottom mr-16 mb-16"
              variant="contained"
              color="primary"
              onClick={() => this.handleEditItem(null)}
            >
              {t("general.add")}
            </Button>
            <Button
              className="align-bottom mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={this.handleDeleteButtonClick}
            >
              {t("general.delete")}
            </Button>
            <Button
              className="align-bottom mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={this.handleAdvancedSearchButtonClick}
            >
              {t("apartment.advanced_search")}
              <ArrowDropDownOutlinedIcon></ArrowDropDownOutlinedIcon>
            </Button>
            <Button
              className="align-bottom mb-16"
              variant="contained"
              color="primary"
              onClick={()=> {
                if(!this.state.view){
                  this.setState({view:true})}
                if(this.state.view){
                  this.setState({view:false})}
                }
                }
            >
              {!this.state.view ? t("filter.open") :t("filter.close") }
              
            </Button>

            {this.state.shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                open={this.state.shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                text={t("general.deleteAllConfirm")}
                cancel={t("general.cancel")}
                agree={t("general.agree")}
              />
            )}
            
          </Grid>
          <Grid item md={5} sm={12} xs={12} >
            <FormControl fullWidth variant = "outlined">
              <Input
                // className="search_box w-100"
                onChange={this.handleTextChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                placeholder={t("general.enterKeyword")}
                id="search_box"
                startAdornment={
                  <InputAdornment>
                    <Link>
                      {" "}
                      <SearchIcon
                        onClick={() => this.search(keyword)}
                        style={{ position: "absolute", top: "0", right: "0" }}
                      />
                    </Link>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          {checkOpenSearch && (<Grid item container md={12} sm={12} xs={12}>
            <Grid item  md={3} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={administrativeList}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.name}
              onChange={this.selectAdministrative}
              value={administrative ? administrative :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("apartment.adminUnit")}
                  variant="outlined"
                />
              )}
            />
           </Grid>
           {this.state.listChildAdminUnit && this.state.listChildAdminUnit.length >0 
           &&
           (<Grid item  md={3} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={this.state.listChildAdminUnit}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.name}
              onChange={this.selectChildAdminUnit}
              value={this.state.childAdminUnit ? this.state.childAdminUnit :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("apartment.adminUnit_child")}
                  variant="outlined"
                />
              )}
            />
           </Grid>)}
          <Grid item  md={3} sm={12} xs={12}>
          <Autocomplete
              size="small"
              id="combo-box"
              options={urbanAreaList}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.name}
              onChange={this.selectUrbanArea}
              value={urbanArea ? urbanArea :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("title.urbanArea")}
                  variant="outlined"
                />
              )}
            />
           </Grid>
           <Grid item  md={3} sm={12} xs={12}>
          <Autocomplete
              size="small"
              id="combo-box"
              options={RequirementTypeList}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.name}
              onChange={this.selectRequirementType}
              value={requirementType ? requirementType :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("directory.RequirementType")}
                  variant="outlined"
                />
              )}
            />
           </Grid>
           <Grid item md={3} sm={12} xs={12}>
          <Autocomplete
              size="small"
              id="combo-box"
              options={buildingList}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.name}
              onChange={this.selectBuilding}
              value={building ? building :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("title.building")}
                  variant="outlined"
                />
              )}
            />
           </Grid>
           <Grid item md={3} sm={12} xs={12}>
          <Autocomplete
              size="small"
              id="combo-box"
              options={projectList}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.name}
              onChange={this.selectProject}
              value={project ? project :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("title.project")}
                  variant="outlined"
                />
              )}
            />
           </Grid>
           <Grid item md={3} sm={12} xs={12}>
          <Autocomplete
              size="small"
              id="combo-box"
              options={ownerList}
              className="flex-end w-80 mb-10"
              getOptionLabel={option => option.displayName}
              onChange={this.selectOwner}
              value={owner ? owner :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("title.owner")}
                  variant="outlined"
                />
              )}
            />
           </Grid>
           <Grid item  md={3} sm={12} xs={12}></Grid>
           {/* <Grid item md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-80 classes.textHeader"
                    disableToolbar
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={t("apartment.lastCheckingDate")}
                    name="lastCheckingDate"
                    value={lastCheckingDate}
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
              <Grid item md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-80 classes.textHeader"
                    disableToolbar
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={t("apartment.availableDate")}
                    name="availableDate"
                    value={availableDate}
                    //onChange={(endDate) => this.handleChangeBirthDate()}
                    onChange={(date) =>
                      this.handleChangeDate(date, "availableDate")
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid> */}
           </Grid>)}
           <Grid item md={2} sm={12} xs={12}>
              <h5>
                <HomeWorkOutlinedIcon fontSize={'small'} /> {t('title.stateType')}
              </h5>
              {realStateTypeTreeView && (
                   <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={['all']}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeSelect={this.getRealStateType}
                        >
                  {renderTree(realStateTypeTreeView)}
                  </TreeView>
                    )}
           </Grid>
          <Grid item md={10} sm={12} xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <ApartmentDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                />
              )}

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

              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("general.confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  text={t("general.deleteConfirm")}
                  agree={t("general.agree")}
                  cancel={t("general.cancel")}
                />
              )}
            </div>
            {(<Paper>
                  <TableContainer style={{ maxHeight: 1000 }} >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <StyledTableRow>
                          {/* <TableCell width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell> */}
                          <StyledTableCell >{t("general.action")}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.name')}</StyledTableCell>
                          <StyledTableCell align="center">{t('title.owner')}</StyledTableCell>
                          <StyledTableCell align="center">{t('RealEstateOwner.phoneNumber')}</StyledTableCell>
                          <StyledTableCell align="center">{t('title.building')}</StyledTableCell>
                          <StyledTableCell align="center">{t('title.project')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.floorsCode')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.code')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.numberOfBedRoom')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.numberOfToilet')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.doorDirection')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.balconyDirection')}</StyledTableCell>
                          <StyledTableCell align="center">{t('general.status')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.price')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.furniture')}</StyledTableCell>
                          <StyledTableCell align="center">{t('apartment.availableDate')}</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                      {this.state.view && (<TableRow>
                      <StyledTableCell ></StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.realStateName")}
                            </span>
                          }
                          onChange={(realStateName)=>
                            this.handleChangeRow(realStateName,"realStateName")}
                          onKeyDown={this.handleKeyDownEnterSearch}
                          type="text"
                          name="realStateName"
                          variant = "outlined"
                          size="small"
                          // style ={{padding:"0"}}
                          value={this.state.realStateName}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100 "
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.ownerName")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          onKeyDown={this.handleKeyDownEnterSearch}
                          type="text"
                          name="ownerName"
                          variant = "outlined"
                          size="small"
                          // style ={{padding:"0"}}
                          value={this.state.ownerName}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.phoneNumber")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          type="text"
                          name="phoneNumber"
                          variant = "outlined"
                          size="small"
                          onKeyDown={this.handleKeyDownEnterSearch}
                          // style ={{padding:"0"}}
                          value={this.state.phoneNumber}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <Autocomplete
                          size="small"
                          id="combo-box"
                          options={buildingList}
                          className="flex-end w-100"
                          getOptionLabel={option => option.name}
                          onChange={this.selectBuilding}
                          value={building ? building :null}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label={<span style ={{fontSize:"12px"}}>
                              {t("filter.building")}
                            </span>}
                              variant="outlined"
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <Autocomplete
                        size="small"
                        id="combo-box"
                        options={projectList}
                        className="flex-end w-100"
                        getOptionLabel={option => option.name}
                        onChange={this.selectProject}
                        value={project ? project :null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={<span style ={{fontSize:"12px"}}>
                              {t("filter.project")}
                            </span>}
                            variant="outlined"
                          />
                        )}
                      />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.floorsCode")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          type="text"
                          name="floorsCode"
                          variant = "outlined"
                          size="small"
                          onKeyDown={this.handleKeyDownEnterSearch}
                          // style ={{padding:"0"}}
                          value={this.state.floorsCode}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.realStateCode")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          type="text"
                          name="realStateCode"
                          variant = "outlined"
                          size="small"
                          onKeyDown={this.handleKeyDownEnterSearch}
                          // style ={{padding:"0"}}
                          value={this.state.realStateCode}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <Autocomplete
                        size="small"
                        id="combo-box"
                        options={LocalConstants.listNumberOfRoom}
                        className="flex-end w-100"
                        getOptionLabel={option => option.name}
                        onChange={this.selectNumberOfBedRoom}
                        value={this.state.bedRoom ? this.state.bedRoom :null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={<span style ={{fontSize:"12px"}}>
                              {t("filter.numberOfBedRoom")}
                            </span>}
                            variant="outlined"
                          />
                        )}
                      />
                      </StyledTableCell>
                      <StyledTableCell >
                      <Autocomplete
                        size="small"
                        id="combo-box"
                        options={LocalConstants.listNumberOfRoom}
                        className="flex-end w-100"
                        getOptionLabel={option => option.name}
                        onChange={this.selectNumberOfToilet}
                        value={this.state.toilet ? this.state.toilet :null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={<span style ={{fontSize:"12px"}}>
                              {t("filter.numberOfToilet")}
                            </span>}
                            variant="outlined"
                          />
                        )}
                      />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.doorDirection")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          type="text"
                          name="doorDirection"
                          variant = "outlined"
                          size="small"
                          onKeyDown={this.handleKeyDownEnterSearch}
                          // style ={{padding:"0"}}
                          value={this.state.doorDirection}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.balconyDirection")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          type="text"
                          name="balconyDirection"
                          variant = "outlined"
                          size="small"
                          onKeyDown={this.handleKeyDownEnterSearch}
                          // style ={{padding:"0"}}
                          value={this.state.balconyDirection}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <Autocomplete
                        size="small"
                        id="combo-box"
                        options={RequirementTypeList}
                        className="flex-end w-100"
                        getOptionLabel={option => option.name}
                        onChange={this.selectRequirementType}
                        value={requirementType ? requirementType :null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            
                            label={<span style ={{fontSize:"12px"}}>
                              {t("filter.status")}
                            </span>}
                            variant="outlined"
                          />
                        )}
                      />
                      </StyledTableCell>
                      <StyledTableCell >
                        <Autocomplete
                        size="small"
                        id="combo-box"
                        options={LocalConstants.listPrice}
                        className="flex-end w-100"
                        getOptionLabel={option => option.name}
                        onChange={this.selectPrice}
                        value={this.state.price ? this.state.price :null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={<span style ={{fontSize:"12px"}}>
                              {t("filter.price")}
                            </span>}
                            variant="outlined"
                          />
                        )}
                      />
                      </StyledTableCell>
                      <StyledTableCell >
                      <TextField
                          className="w-100"
                          label={
                            <span style ={{fontSize:"12px"}}>
                              {t("filter.furniture")}
                            </span>
                          }
                          onChange={this.handleChangeRow}
                          type="text"
                          name="furniture"
                          variant = "outlined"
                          size="small"
                          onKeyDown={this.handleKeyDownEnterSearch}
                          // style ={{padding:"0"}}
                          value={this.state.furniture}
                        />
                      </StyledTableCell>
                      <StyledTableCell >
                      <MuiPickersUtilsProvider utils={DateFnsUtils} className ="mb-32" style ={{padding:"0"}}>
                        <KeyboardDatePicker
                          className="w-100 mb-32"
                          style ={{padding:"0"}}
                          disableToolbar
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label={t("apartment.availableDate")}
                          name="availableDate"
                          value={availableDate}
                          //onChange={(endDate) => this.handleChangeBirthDate()}
                          onChange={(date) =>
                            this.handleChangeDate(date, "availableDate")
                          }
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                      </StyledTableCell>
                      </TableRow>)}
                        {
                          (this.state.itemList && this.state.itemList.map((item, index) => this.renderResultDetails(item, index)))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>)}
            {/* <MaterialTable
              title={t("general.list")}
              data={this.state.itemList}
              columns={columns}
              //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
              parentChildData={(row, rows) => {
                var list = rows.find((a) => a.id === row.parentId);
                return list;
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: `${t(
                    "general.emptyDataMessageTable"
                  )}`,
                },
                toolbar: {
                  // nRowsSelected: `${t('general.selects')}`,
                  nRowsSelected: `${t("general.selects")}`,
                },
              }}
              options={{
                filtering: true,
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
              components={{
                Toolbar: (props) => <MTableToolbar {...props} />,
              }}
              icons={{
                Filter:()=>"",
                ViewColumn:()=><Icon fontSize="small" color="primary">edit</Icon>
              }}
              onSelectionChange={(rows) => {
                this.data = rows;

                // this.setState({ data: rows })
                console.log(this.data);
              }}
              
              
            /> */}
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25,100,200]}
              component="div"
              labelRowsPerPage={t("general.rows_per_page")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("general.of")} ${
                  count !== -1 ? count : `more than ${to}`
                }`
              }
              count={this.state.totalElements}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                "aria-label": "Previous Page",
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page",
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.setRowsPerPage}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default Apartment;
