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
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    allVariants: {
      color: "#404040"
    },
    h3: { fontSize: 34, letterSpacing: 0.3 },
    h4: { fontSize: 24 },
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    caption: { fontSize: 10, textTransform: "uppercase" }
  },
  overrides: {
    MuiAppBar: {
      root: {
        boxShadow: "none",
        justifyContent: "space-between",
        marginTop: 1
      }
    },
    MuiButton: {
      root: {
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 0.8
      }
    },
    MuiChip: {
      root: {
        fontSize: 12,
        fontWeight: 600
      }
    },
    MuiPaper: {
      root: {
        boxShadow: "none"
      },
      elevation2: {
        // default elevation is 2
        boxShadow: "none"
      }
    },
    MuiTab: {
      root: {
        borderRight: "solid 1px #e5e5e5",
        borderBottom: "solid 1px #e5e5e5",
        paddingTop: defaultTheme.spacing.unit * 2,
        paddingBottom: defaultTheme.spacing.unit * 2,
        margin: 0
      },
      label: {
        fontSize: 14,
        fontWeight: 600
      }
    },
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
    },
    MuiToolbar: {
      root: {
        boxShadow: "none"
      }
    }
  }
});
