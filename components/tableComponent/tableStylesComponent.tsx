// tableStyles.ts

export const tableCustomStyles = {
    header: {
        style: {
            color: 'white',
            backgroundColor: '#16202a',
        },
    },
    headRow: {
        style: {
            color:'orange',
            backgroundColor: '#16202a',
            borderBottomColor: 'white',
        },
    },
    rows: {
        style: {
            color: "white",
            backgroundColor: "#16202a",
            minHeight: '72px', // override the row height
            '&:hover': {
                cursor: 'pointer',
                backgroundColor: "#26313c",
            }
        },
        stripedStyle: {
            color: "NORMALCOLOR",
            backgroundColor: "NORMALCOLOR"
        }
    },
    pagination: {
        style: {
            color: "white",
            backgroundColor: "#16202a",
            borderTopColor: "white"
        },
        pageButtonsStyle: {
            color: "white",
            backgroundColor: "#8493A8"
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
  
    
}