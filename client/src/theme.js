import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const defaultTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const defaultCell = {
  backgroundColor: "white",
  borderLeft: null,
  borderRight: null,
  margin: 2,
  borderSpacing: defaultTheme.spacing.unit * 3,
  paddingLeft: defaultTheme.spacing.unit * 3
};

export default createMuiTheme({
  palette: {
    primary: { main: "#00857B" },
    background: { default: "#f4f4f4", paper: "#ffffff" }
  },
  typography: {
    useNextVariants: true,
    allVariants: {
      color: "#404040"
    },
    body2: { fontSize: 18 },
    caption: { fontSize: 10, textTransform: "uppercase" }
  },
  overrides: {
    MuiTable: {
      root: {
        backgroundColor: "white"
      }
    },
    MuiTableCell: {
      body: {
        ...defaultCell
      },
      head: {
        ...defaultCell,
        textTransform: "uppercase"
      }
    },
    MuiTableRow: {
      head: {
        height: defaultTheme.spacing.unit * 4
      }
    }
  }
});
