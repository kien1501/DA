import { Grid, MuiThemeProvider,InputAdornment, Input, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination, Radio, Dialog, DialogActions } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
// import {searchByPage} from "./ApartmentService";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import {searchByPage as getUrbanArea} from "../UrbanArea/UrbanAreaService";
import {searchByPage as getProject} from "../Project/ProjectService";
import {searchByPage} from '../Building/BuildingService'
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {searchByPage as getListAdministrativeUnit} from '../AdministrativeUnit/AdministrativeUnitService'
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class SelectParentPopup extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
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
    keyword: '',
    shouldOpenProductDialog: false,
    item: null,
    projectId:"",
    urbanArea:null,
    project:null
  };

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    })
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.keyword = this.state.keyword;
    searchObject.urbanAreaId = this.state.urbanAreaId ? this.state.urbanAreaId :"";
     searchObject.projectId = this.state.projectId ? this.state.projectId :"";
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    });
  }

  componentDidMount() {
    this.updatePageData();
  }

  handleClick = (event, item) => {
    //alert(item);
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: null, selectedItem: null });
    }
  }

  componentWillMount() {
    let { open, handleClose, selectedItem } = this.props;
    //this.setState(item);
    this.setState({ selectedValue: selectedItem.id });
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
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  search() {
    this.setPage(0, function () {
      var searchObject = {};
      searchObject.urbanAreaId = this.state.urbanAreaId ? this.state.urbanAreaId :"";
      searchObject.projectId = this.state.projectId ? this.state.projectId :"";
      searchObject.keyword = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({ itemList: [...data.content], totalElements: data.totalElements })
      });
    });
  };

  handleChange = (event, source) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    },function(){
      this.search();
    });
  };

  handleOpenProductDialog = () => {
    this.setState({
      shouldOpenProductDialog: true
    })
  }

  handleDialogProductClose = () => {
    this.setState({
      shouldOpenProductDialog: false
    })
  }

  handleOKEditClose = () => {
    this.setState({
      shouldOpenProductDialog: false
    });
    this.updatePageData();
  };

  handleAddItem = () => {

  }

  onClickRow = (selectedRow) => {
    document.querySelector(`#radio${selectedRow.id}`).click();
  }

  selectProject =(item)=>{
    this.setState({projectId:item ? item.id :"",project:item ? item :null},()=>{
    })
  }
  selectUrbanArea =(item)=>{
    this.setState({urbanAreaId:item ? item.id :"",urbanArea:item ? item :null},()=>{
    })
  }
  selectAdminUnit =(e,item)=>{
    this.setState({adminUnit:item ? item : null , adminUnitId:item ? item.id :null,
      projectId:null,project:null},()=>{
        console.log(this.state.project)
      })
  }
  render() {
    const { t, i18n, handleClose, handleSelect, selectedItem, open } = this.props;
    let { keyword, shouldOpenProductDialog, itemList,project,urbanArea,adminUnit,administrativeList
       } = this.state;
    let searchUrbanArea ={pageIndex :1,pageSize:100000}
    let searchAdminUnit ={pageIndex :1,pageSize:100000}
    let searchProject = {pageIndex :1,pageSize:100000,
      urbanAreaId: this.state.urbanAreaId ? this.state.urbanAreaId:"",
    adminUnitId: this.state.adminUnitId ? this.state.adminUnitId :""}
    let columns = [
      {
        title: t("general.select"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <Radio id={`radio${rowData.id}`} name="radSelected" value={rowData.id} checked={this.state.selectedValue === rowData.id} onClick={(event) => this.handleClick(event, rowData)}
        />
      },
      { title: t("general.name"), field: "name", width: "150" },
      { title: t("general.code"), field: "code", align: "left", width: "150" },
      { title: t("title.project"), field: "project.name", width: "150" },
      { title: t("title.urbanArea"), field: "project.urbanArea.name", width: "150" },
      
    ];
    return (
      <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20">{t("title.building")}</span>
        </DialogTitle>
        <DialogContent>
        <Grid item container md = {12} xs={12}>
          <Grid item md={3} xs={12}>
            <Input
              label={t('general.enterSearch')}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              onKeyUp={this.handleKeyUp}
              className="mt-12"
              style={{width:"90%"}}
              // className="mb-16 mr-12"
              id="search_box"
              placeholder={t('general.enterKeyword')}
              startAdornment={
                <InputAdornment >
                  <Link to="#"> <SearchIcon
                    onClick={() => this.search(keyword)}
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0"
                    }} /></Link>
                </InputAdornment>
              }
            />
              
          </Grid>
          <Grid item md={3} xs={12}>
          <Autocomplete
              size="small"
              id="combo-box"
              options={administrativeList}
              className="flex-end w-80 "
              getOptionLabel={option => option.name}
              onChange={this.selectAdminUnit}
              value={adminUnit ? adminUnit :null}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("apartment.adminUnit")}
                  // variant="outlined"
                />
              )}
            />
            </Grid>
          <Grid item md={3} xs={12}>
              <AsynchronousAutocomplete
                className="w-80"
                // variant="outlined"
                label={t('title.project')}
                searchFunction={getProject}
                searchObject={searchProject}
                // defaultValue={project}
                displayLable={'name'}
                value={project}
                onSelect={this.selectProject}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <AsynchronousAutocomplete
                className="w-80"
                // variant="outlined"
                label={t('title.urbanArea')}
                searchFunction={getUrbanArea}
                searchObject={searchUrbanArea}
                defaultValue={urbanArea}
                displayLable={'name'}
                value={urbanArea}
                onSelect={this.selectUrbanArea}
              />
            </Grid>
            </Grid>
          <Grid item xs={12} className ="mt-40">

            <MaterialTable
              data={itemList}
              columns={columns}
              onRowClick={((evt, selectedRow) => this.onClickRow(selectedRow))}

              parentChildData={(row, rows) => {
                var list = rows.find(a => a.id === row.parentId);
                return list;
              }}
              options={{
                toolbar: false,
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false
              }}
              components={{
                Toolbar: props => (
                  <div style={{ witdth: "100%" }}>
                    <MTableToolbar {...props} />
                  </div>
                ),
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
              }}
            />
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
              component="div"
              count={this.state.totalElements}
              rowsPerPage={this.state.rowsPerPage}
              labelRowsPerPage={t('general.rows_per_page')}
              labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
              page={this.state.page}
              backIconButtonProps={{
                "aria-label": "Previous Page"
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page"
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.setRowsPerPage}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-16 mr-36 align-bottom"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}>{t('general.cancel')}</Button>
          <Button className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={() => handleSelect(this.state.selectedItem)}>
            {t('general.select')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default SelectParentPopup;