import React, { Component } from "react";
import Schema from "validate";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import { createPosition } from "../../store/actions/positionActions";
import { connect } from "react-redux";

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    marginTop: 10,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: 20,
  },
};

const initialState = {
  category: "",
  item: "",
  amount: "",
  location: "",
  errors: null,
};

const positionSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
    length: { min: 2, max: 8 },
  },
  amount: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

class CreatePosition extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  handleExited = () => {
    this.setState(initialState);
  };

  handleItemChange = (event) => {
    const item = event.target.value;

    this.setState({ item });
  };

  handleCategoryChange = (event) => {
    const category = event.target.value;

    this.setState({ category });
  };

  handleAmountChange = (event) => {
    const amount = event.target.value;

    this.setState({ amount });
  };

  handleLocationChange = (event) => {
    const location = event.target.value;

    this.setState({ location });
  };

  handleCreateClick = (event) => {
    event.preventDefault();
    const { item, amount, category, location } = this.state;
    let position = {
      category: category,
      item: item,
      amount: parseFloat(amount),
      location: location,
    };

    const valErrors = positionSchema.validate(position);

    if (valErrors.length > 0) {
      let errors = {};
      valErrors.forEach((err) => {
        errors[err.path] = err.message;
      });
      this.setState({ errors });
    } else {
      this.setState({
        errors: null,
      });
      this.props.onClose();
      this.props.createPosition(position);
    }
  };

  render() {
    // Properties
    const { fullScreen, open } = this.props;
    // Position attributes
    const { category, item, amount, location, errors } = this.state;

    // Events
    const { onClose } = this.props;

    //styles
    const { classes } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        onExited={this.handleExited}
        onKeyPress={this.handleKeyPress}
      >
        <DialogTitle>Create a new position</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Add category, ticker or currency, amount and location.
          </DialogContentText>

          <form className={classes.root}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel htmlFor="outlined-age-simple" required focused>
                Category
              </InputLabel>
              <Select
                value={category}
                onChange={this.handleCategoryChange}
                input={
                  <OutlinedInput
                    labelWidth={75}
                    name="category"
                    htmlFor="outlined-age-simple"
                  />
                }
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Stock Long">Stock Long</MenuItem>
                <MenuItem value="Stock Short">Stock Short</MenuItem>
                <MenuItem value="Precious Metals">Precious Metals</MenuItem>
                <MenuItem value="Cryptocurrency">Cryptocurrency</MenuItem>
              </Select>
            </FormControl>

            <TextField
              error={!!(errors && errors.item)}
              fullWidth
              variant="outlined"
              helperText={errors && errors.item ? errors.item : ""}
              label="Ticker/Currency"
              margin="normal"
              onChange={this.handleItemChange}
              required
              type="text"
              value={item}
            />

            <TextField
              error={!!(errors && errors.amount)}
              fullWidth
              helperText={errors && errors.amount ? errors.amount : ""}
              label="Amount"
              margin="normal"
              onChange={this.handleAmountChange}
              required
              type="number"
              value={amount}
              variant="outlined"
            />

            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel htmlFor="location" required>
                Location
              </InputLabel>
              <Select
                value={location}
                onChange={this.handleLocationChange}
                input={
                  <OutlinedInput
                    labelWidth={75}
                    name="locatiom"
                    htmlFor="location"
                  />
                }
              >
                <MenuItem value="CBA">CBA</MenuItem>
                <MenuItem value="DKB">DKB</MenuItem>
                <MenuItem value="TD Bank">TD Bank</MenuItem>
                <MenuItem value="Interactive Brokers">
                  Interactive Brokers
                </MenuItem>
                <MenuItem value="Kraken">Kraken</MenuItem>
                <MenuItem value="Binance">Binance</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
                <MenuItem value="BullionVault">BullionVault</MenuItem>
                <MenuItem value="Kinesis">Kinesis</MenuItem>
                <MenuItem value="Local">Local</MenuItem>
                <MenuItem value="Nexo">Nexo</MenuItem>
                <MenuItem value="Ledn">Ledn</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!category || !item || !amount || !location}
            variant="contained"
            onClick={this.handleCreateClick}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createPosition: (position) => dispatch(createPosition(position)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(CreatePosition));
