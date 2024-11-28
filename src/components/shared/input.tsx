import { TextField } from "@mui/material";

type Props = {
    name : string, 
    type : string,
    label : string,
    fullWidth?: boolean;
    placeholder?:string
};

const Input = (props: Props) =>{
    return (
        <TextField 
            margin='normal' 
            InputLabelProps={{style:{color:'white'}}} 
            name={props.name? props.name : props.placeholder? props.placeholder : ""} 
            label={props.label} 
            type={props.type} 
            fullWidth={props.fullWidth}
            InputProps={{
                style: {
                    borderRadius: 10,
                    fontSize: 20,
                    backgroundColor: '#132542',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                },
            }}>
        </TextField>
    );
};

export default Input;