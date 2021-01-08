import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch,DialogActions
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getUserById, updateUser, addNewAdministrativeUnit,updateAdministrativeUnit } from "./AdministrativeUnitService";
import { generateRandomId } from "utils";
import SelectParentPopup from "./SelectParentPopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
class AdministrativeUnitEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    level:0,
    isActive: false,
    shouldOpenSelectParentPopup:false,
  };
  handleDialogClose = () => {
    this.setState({ shouldOpenSelectParentPopup: false });
  };
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    if (id) {
      updateAdministrativeUnit({
        ...this.state
      }).then(() => {
        this.props.handleClose();
      });
    } else {
      addNewAdministrativeUnit({
        ...this.state
      }).then(() => {
        this.props.handleClose();
      });
    }
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose,item } = this.props;
    this.setState({...item});
  }
  handleSelectParent = itemParent => {
    let {t} = this.props
    let { id } = this.state;
    let { code,parent } = this.state;
    let idClone = id;
    let {item} = this.state
    if(id){
        let isCheck = false;
        let parentClone = itemParent;
        let children = item;
        // if()
        if(children.parentId === null && children.id == parentClone.id ){
          isCheck = true;
        }
        while(parentClone != null){
          if(parentClone.id == children.id){
            isCheck = true;
            break;
          }else{
            parentClone = parentClone.parent
          }
        }
        if(isCheck){
          toast.warning(t("AdministrativeUnit.warning_parent"))
          return
        }
  }
    this.setState({ parent: itemParent });
    this.setState({ shouldOpenSelectParentPopup: false });
  };
  openParentPopup =()=>{
    this.setState({ shouldOpenSelectParentPopup: true });
  }
  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      name,
      code,
      level,
      isActive,
      shouldOpenSelectParentPopup
    } = this.state;
    return (
      <Dialog onClose={handleClose} open={open} width={"md"} fullWidth={true}>
        <div className="p-24">
          <h4 className="mb-20">{t('general.saveUpdate')}</h4>
          <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
            <Grid className="mb-16" container spacing={4}>
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
                      {t("AdministrativeUnit.title")}
                    </span>
                  }
                  className="w-80"
                  // style ={{width: "90%"}}
                  value={
                    this.state.parent != null ? this.state.parent.name : ""
                  }
                />

                {this.state.shouldOpenSelectParentPopup && (
                  <SelectParentPopup
                    open={this.state.shouldOpenSelectParentPopup}
                    handleSelect={this.handleSelectParent}
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
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={t('AdministrativeUnit.code')}
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label={t('AdministrativeUnit.name')}
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label={t('AdministrativeUnit.level')}
                  onChange={this.handleChange}
                  type="number"
                  name="level"
                  value={level}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
              </Grid>
              {/* <Grid>
                <FormControlLabel
                  className="my-20"
                  control={
                    <Switch
                      checked={isActive}
                      onChange={event => this.handleChange(event, "switch")}
                    />
                  }
                  label="Active Customer"
                />
              </Grid> */}
            </Grid>

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
        </div>
      </Dialog>
    );
  }
}

export default AdministrativeUnitEditorDialog;
