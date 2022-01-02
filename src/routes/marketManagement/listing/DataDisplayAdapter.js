import ListData from "./ListData";
import GridData from "./GridData";

const DataDisplayAdapter = (props) => {
    switch (props.displayMode) {
        case "grid":
            return <GridData {...props}/>;
        case "list":
            return <ListData {...props}/>
        default:
            return <ListData {...props}/>;
    }
}

export default DataDisplayAdapter;