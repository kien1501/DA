import React, { Component, Fragment } from "react";
import {
  Grid,
  Card,
  Icon,
  IconButton,
  Button,
  Checkbox,
  Fab,
  Avatar,
  Hidden,TextField,
  TablePagination
} from "@material-ui/core";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import { Breadcrumb, SimpleCard, EgretProgressBar } from "egret";
import DashboardWelcomeCard from "../cards/DashboardWelcomeCard";
import AreaChart from "../charts/echarts/AreaChart";
import {searchByPage,getDashboardAnalytics} from "./DashboardService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {searchByPage as getUrbanArea} from "../UrbanArea/UrbanAreaService";
import {searchByPage as getBuilding} from "../Building/BuildingService";
import {searchByPage as getProject} from "../Project/ProjectService";
import {searchByRealEstateOwner as searchByRealEstateOwner} from "../Apartment/ApartmentService";

import { format } from "date-fns";
import ModifiedAreaChart from "./ModifiedAreaChart";
import { withStyles } from "@material-ui/styles";

class Dashboard1 extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
  };
  handleTextChange = (event) => {
    this.setState({ keyword: event.target.value }, function () {});
  };

  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
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
  search() {
    this.setState({ page: 0 }, function () {
      var searchObject = {};
      searchObject.keyword = this.state.keyword;
      searchObject.urbanAreaId = this.state.urbanAreaId;
      searchObject.buildingId = this.state.buildingId;
      searchObject.projectId = this.state.projectId;
      searchObject.ownerId = this.state.ownerId;
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject)
        .then((res) => {
          this.setState({
            itemList: [...res.data.content],
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
    searchObject.keyword = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;

    searchByPage(searchObject).then((res) => {
      this.setState({
        itemList: [...res.data.content],
        totalElements: res.data.totalElements,
      });
    });
  };
  componentDidMount() {
    this.updatePageData();
  }
  componentWillMount() {
    getDashboardAnalytics().then(({ data }) => {
      this.setState({
        analytics: data,
        realStateCountByDate: data.realStateCountByDate,
      },()=>{
        console.log(this.state.realStateCountByDate)
      })
    });

    let searchObject = {};
    searchObject.keyword = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;

    getProject(searchObject).then((res) => {
      this.setState({
        projectList: [...res.data.content],
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
  
  render() {
    let { theme } = this.props;
    const { t, i18n } = this.props;
    let {
      rowsPerPage,
      page,
      totalElements,
      itemList,urbanAreaList,
      urbanArea,buildingList,
      realStateCountByDate,
      analytics
    } = this.state;
    let columns = [
      {
        title:t("title.apartment") , field: "apartmentName", align: "left",width: "150",
      },
      {
        title:t("title.urbanArea") , field: "urbanAreaName", align: "left",width: "150",
      },
      {
        title:t("title.project") , field: "projectName", align: "left",width: "150",
      },
      {
        title:t("title.owner") , field: "ownerName", align: "left",width: "150",
      },
      {
        title:t("title.building") , field: "buildingName", align: "left",width: "150",
      },
    ];
    return (
      <div className="analytics m-sm-30">
        <div className="mb-sm-30">
          <Breadcrumb
            routeSegments={[
              { name: t("Dashboard.dashboard"), path: "/dashboard/analytics" },
              // { name: t("Dashboard.dashboard") }
            ]}
          />
        </div>
        <Grid container spacing={1}>
          <Grid item container md={12} sm={12} xs={12}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <DashboardWelcomeCard t={t} analytics={analytics} />
          </Grid>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SimpleCard title={t("directory.real_state")}>
              <ModifiedAreaChart
                height="280px"
                option={{
                  xAxis: {
                    data: realStateCountByDate?.map(function (item) {
                      return new Date(item["date"]).toLocaleDateString();
                    })
                  },
                  series: [
                    {
                      data:realStateCountByDate ? realStateCountByDate.map(function (item) {
                        return item["count"];
                      }): 1,
                      type: "bar",
                      areaStyle: {},
                      smooth: true,
                      lineStyle: {
                        width: 3,
                        color: theme.palette.primary.main
                      },
                      markLine: {
                        silent: true,
                        data: [{
                          yAxis: 50
                        }, {
                          yAxis: 100
                        }, {
                          yAxis: 150
                        }, {
                          yAxis: 200
                        }, {
                          yAxis: 300
                        }]
                      }
                    }
                  ],
                  yAxis: {
                    axisLabel: {
                      color: theme.palette.text.secondary
                    }
                  },
                  color: [
                    {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: theme.palette.primary.light // color at 0% position
                        },
                        {
                          offset: 1,
                          color: "rgba(255,255,255,0)" // color at 100% position
                        }
                      ],
                      global: false // false by default
                    }
                  ]
                }}
              ></ModifiedAreaChart>
            </SimpleCard>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles({}, { withTheme: true })(Dashboard1);
